# MT5 Account Authentication Design

**Designed for:** Arshad Shaheen  
**Date:** October 23, 2025  
**Status:** 📐 Architecture Proposal

---

## 🎯 Requirements

### Functional Requirements
1. Users can authenticate with **MT5 account ID + password**
2. Password verification via **mt5-manager-microservice** (Kafka)
3. Return **JWT token** identifying MT5 authentication
4. JWT works for endpoints accepting MT5 account auth
5. Optional: Link MT5 account to existing User account

### Non-Functional Requirements
- ✅ Secure password transmission
- ✅ Session management (logout support)
- ✅ Compatible with existing JWT infrastructure
- ✅ No breaking changes to current auth

---

## 🏗️ Proposed Architecture

### Authentication Flow

```
┌─────────────────────────┐
│  Mobile App / Client    │
│  (MT5 Login + Password) │
└───────────┬─────────────┘
            │
            ▼
┌────────────────────────────────────────────┐
│  POST /auth/mt5/login                      │
│  Body: { login: "12345", password: "***" } │
└───────────┬────────────────────────────────┘
            │
            ▼
┌────────────────────────────────────────────┐
│  AuthService.validateMt5Login()            │
│  1. Validate inputs                        │
│  2. Call mt5-manager via Kafka             │
│  3. Verify password with MT5               │
│  4. Find/create linked User                │
│  5. Create session                         │
│  6. Generate JWT with MT5 marker           │
└───────────┬────────────────────────────────┘
            │
            ▼
┌────────────────────────────────────────────┐
│  Kafka to mt5-manager-microservice         │
│  Topic: 'verify-mt5-password'              │
│  Payload: { login, password, server }      │
└───────────┬────────────────────────────────┘
            │
            ▼
┌────────────────────────────────────────────┐
│  mt5-manager-microservice (NEW SERVICE)    │
│  1. Connect to MT5 server                  │
│  2. Call MT5 API to verify password        │
│  3. Return: { valid: boolean, account }    │
└───────────┬────────────────────────────────┘
            │
            ▼
┌────────────────────────────────────────────┐
│  AuthService continues...                  │
│  If valid:                                 │
│    - Find or create User linked to MT5     │
│    - Create session                        │
│    - Generate JWT                          │
│  If invalid:                               │
│    - Throw UnauthorizedException           │
└───────────┬────────────────────────────────┘
            │
            ▼
┌────────────────────────────────────────────┐
│  JWT Token Generated                       │
│  Payload: {                                │
│    id: user.id,                            │
│    role: user.role,                        │
│    email: user.email,                      │
│    sessionId: session.id,                  │
│    authProvider: 'mt5',  ← NEW             │
│    mt5Login: '12345',    ← NEW             │
│    mt5Server: 'live'     ← NEW             │
│  }                                         │
└───────────┬────────────────────────────────┘
            │
            ▼
┌────────────────────────────────────────────┐
│  Response to Client                        │
│  { token, refreshToken, tokenExpires,      │
│    user, mt5Account }                      │
└────────────────────────────────────────────┘
```

---

## 📁 Implementation Structure

### New Files to Create

```
rest-api/src/auth/
├── strategies/
│   └── mt5-jwt.strategy.ts          ← NEW (validates MT5 JWT)
├── dto/
│   └── auth-mt5-login.dto.ts        ← NEW (MT5 login DTO)
├── guards/
│   └── mt5-auth.guard.ts            ← NEW (optional, composite guard)
└── auth.controller.ts                (add MT5 endpoint)

rest-api/src/users/entities/
└── user.entity.ts                    (add mt5Login field)

rest-api/src/database/migrations/
└── XXXX-AddMt5LoginToUser.ts        ← NEW (migration)
```

### New Kafka Topics

**In mt5-manager-microservice (to be created):**
```typescript
Topic: 'verify-mt5-password'
Request: { login: string, password: string, server: 'live' | 'demo' }
Response: {
  valid: boolean,
  account?: {
    Login: string,
    Group: string,
    Name: string,
    Email: string,
    // ... other MT5 account fields
  },
  error?: string
}
```

---

## 💻 Implementation Code

### 1. DTO for MT5 Login

**File:** `rest-api/src/auth/dto/auth-mt5-login.dto.ts`

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';

export class AuthMt5LoginDto {
  @ApiProperty({
    example: '12345',
    description: 'MT5 account login ID',
  })
  @IsNotEmpty()
  @IsString()
  login: string;

  @ApiProperty({
    example: 'MySecurePassword123',
    description: 'MT5 account password',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    example: 'live',
    description: 'MT5 server type',
    enum: ['live', 'demo'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['live', 'demo'])
  server?: 'live' | 'demo';
}

export class AuthMt5LoginResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  tokenExpires: number;

  @ApiProperty()
  user: any;

  @ApiProperty()
  mt5Account: {
    login: string;
    server: string;
    group: string;
  };
}
```

---

### 2. Extended JWT Payload Type

**File:** `rest-api/src/auth/strategies/types/jwt-payload.type.ts`

```typescript
import { Session } from 'src/session/entities/session.entity';
import { User } from '../../../users/entities/user.entity';

// Existing payload
export type JwtPayloadType = Pick<
  User,
  'id' | 'role' | 'languageIso' | 'email'
> & {
  sessionId: Session['id'];
  iat: number;
  exp: number;
};

// NEW: Extended payload for MT5 authentication
export type Mt5JwtPayloadType = JwtPayloadType & {
  authProvider: 'mt5';        // Identifies MT5 auth
  mt5Login: string;           // MT5 account ID
  mt5Server: 'live' | 'demo'; // Server type
};

// Union type for all auth methods
export type ExtendedJwtPayloadType = JwtPayloadType | Mt5JwtPayloadType;
```

---

### 3. MT5 JWT Strategy

**File:** `rest-api/src/auth/strategies/mt5-jwt.strategy.ts`

```typescript
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { Mt5JwtPayloadType } from './types/jwt-payload.type';
import { AuthService } from '../auth.service';

@Injectable()
export class Mt5JwtStrategy extends PassportStrategy(Strategy, 'mt5-jwt') {
  constructor(
    configService: ConfigService<AllConfigType>,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('auth.secret', { infer: true }),
    });
  }

  public async validate(
    payload: Mt5JwtPayloadType,
  ): Promise<Mt5JwtPayloadType> {
    // Verify it's an MT5 auth token
    if (payload.authProvider !== 'mt5') {
      throw new UnauthorizedException('Invalid MT5 authentication token');
    }

    // Validate session (same as regular JWT)
    const session = await this.authService.sessionCheck(
      payload.sessionId,
      payload.id,
    );
    if (!session) {
      throw new UnauthorizedException('Session expired or invalid');
    }

    // Optional: Verify MT5 account still exists
    // const mt5AccountValid = await this.verifyMt5AccountExists(payload.mt5Login);
    // if (!mt5AccountValid) throw new UnauthorizedException('MT5 account not found');

    return payload;
  }
}
```

---

### 4. Auth Service Extension

**File:** `rest-api/src/auth/auth.service.ts` (add method)

```typescript
/**
 * Validate MT5 account login
 * Migrated by: Arshad Shaheen
 * Date: October 23, 2025
 */
async validateMt5Login(
  loginDto: AuthMt5LoginDto,
  request: any,
  deviceId?: string,
): Promise<LoginResponseType & { mt5Account: any }> {
  const { login, password, server = 'live' } = loginDto;
  const i18n = I18nContext.current();

  // Step 1: Verify MT5 password via mt5-manager-microservice
  console.log(`Verifying MT5 account ${login} on ${server} server`);
  
  const verificationResult = await this.kafka.SendMessage(
    this.mt5Client,
    'verify-mt5-password',
    { login, password, server },
    server,
  );

  if (!verificationResult.valid) {
    const message = i18n?.t('errors.auth.invalidMt5Credentials');
    throw new HttpException(
      {
        status: HttpStatus.UNAUTHORIZED,
        error: {
          msg: message || 'Invalid MT5 credentials',
        },
      },
      HttpStatus.UNAUTHORIZED,
    );
  }

  const mt5Account = verificationResult.account;

  // Step 2: Find or create User linked to MT5 account
  let user = await this.userRepository.findOne({
    where: { mt5Login: login },
    relations: ['role'],
  });

  if (!user) {
    // Auto-create user for MT5 account
    user = await this.createUserFromMt5Account(mt5Account, server);
  }

  // Step 3: Validate user is active
  if (user.isDeleted) {
    throw new HttpException(
      {
        status: HttpStatus.FORBIDDEN,
        error: { msg: 'Account is disabled' },
      },
      HttpStatus.FORBIDDEN,
    );
  }

  // Step 4: Create session
  const session = await this.sessionService.create({
    user,
  });

  // Step 5: Generate JWT with MT5 metadata
  const { token, refreshToken, tokenExpires } = await this.getTokensData({
    id: user.id,
    role: user.role,
    languageIso: user.languageIso,
    sessionId: session.id,
    email: user.email,
    // MT5-specific fields
    authProvider: 'mt5',
    mt5Login: login,
    mt5Server: server,
  });

  // Step 6: Log activity
  this.eventEmitter.emit(EventTypes.ACTIVE_LOG, {
    userId: user.id,
    ipAddress: request.headers['x-forwarded-for'] || request.connection.remoteAddress,
    deviceId,
    action: 'MT5 Login',
    details: `MT5 Account: ${login}, Server: ${server}`,
  });

  return {
    token,
    refreshToken,
    tokenExpires,
    user,
    mt5Account: {
      login: mt5Account.Login,
      server,
      group: mt5Account.Group,
      name: mt5Account.Name,
    },
  };
}

/**
 * Create User from MT5 account data
 */
private async createUserFromMt5Account(
  mt5Account: any,
  server: string,
): Promise<User> {
  // Get client role
  const clientRole = await this.roleRepository.findOne({
    where: { id: RoleEnum.client },
  });

  // Create user
  const user = this.userRepository.create({
    email: mt5Account.Email || `${mt5Account.Login}@mt5.temp`,
    mt5Login: mt5Account.Login,
    firstName: mt5Account.Name?.split(' ')[0] || 'MT5',
    lastName: mt5Account.Name?.split(' ').slice(1).join(' ') || 'User',
    role: clientRole,
    isClient: true,
    languageIso: 'EN',
    // No password - auth via MT5 only
  });

  await this.userRepository.save(user);

  // Create wallet if needed
  await this.walletService.createMt5Wallet(user, server);

  return user;
}
```

---

### 5. Controller Endpoint

**File:** `rest-api/src/auth/auth.controller.ts` (add to AuthController class)

```typescript
@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  // ... existing endpoints ...

  /**
   * MT5 Account Login
   * Migrated by: Arshad Shaheen
   * Date: October 23, 2025
   */
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('mt5/login')
  @ApiHeaders([{ name: 'x_device_id', schema: { type: 'string' } }])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login with MT5 account credentials',
    description: 'Authenticate using MT5 account ID and password. Verifies credentials with MT5 server.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully authenticated',
    type: AuthMt5LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid MT5 credentials',
  })
  public async loginMt5(
    @Body() loginDto: AuthMt5LoginDto,
    @Request() request,
  ): Promise<LoginResponseType & { mt5Account: any }> {
    return this.service.validateMt5Login(
      loginDto,
      request,
      request.headers['x_device_id'],
    );
  }

  /**
   * Link MT5 account to existing user
   * Requires existing JWT authentication
   */
  @ApiBearerAuth()
  @Post('mt5/link')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Link MT5 account to current user',
    description: 'Links an MT5 account to your existing user account',
  })
  async linkMt5Account(
    @Request() request,
    @Body() linkDto: { login: string; password: string; server?: string },
  ): Promise<any> {
    return this.service.linkMt5AccountToUser(
      request.user.id,
      linkDto.login,
      linkDto.password,
      linkDto.server || 'live',
    );
  }
}
```

---

### 6. Database Schema Updates

#### User Entity Update
**File:** `rest-api/src/users/entities/user.entity.ts`

```typescript
@Entity()
export class User extends EntityHelper {
  // ... existing columns ...

  // MT5 Account Integration - Migrated by Arshad Shaheen
  @Column({ type: String, unique: true, nullable: true })
  @Index()
  mt5Login: string | null;

  @Column({ type: String, nullable: true })
  mt5Server: 'live' | 'demo' | null;

  @Column({ type: Date, nullable: true })
  mt5LinkedAt: Date | null;
}
```

#### Migration
**File:** `rest-api/src/database/migrations/XXXX-AddMt5LoginToUser.ts`

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMt5LoginToUser1729800000001 implements MigrationInterface {
  name = 'AddMt5LoginToUser1729800000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "mt5Login" nvarchar(255)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_user_mt5Login" ON "user" ("mt5Login") WHERE "mt5Login" IS NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "mt5Server" nvarchar(10)`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "mt5LinkedAt" datetime2`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_user_mt5Login" ON "user"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "mt5LinkedAt"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "mt5Server"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "mt5Login"`);
  }
}
```

---

### 7. Kafka Service Integration

**File:** `rest-api/src/auth/auth.service.ts` (add to constructor)

```typescript
constructor(
  // ... existing dependencies ...
  @Inject('MT5_SERVICE') private readonly mt5Client: ClientKafka,
  private readonly kafka: KafkaService,
) {}
```

**File:** `rest-api/src/auth/auth.module.ts` (add imports)

```typescript
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  imports: [
    // ... existing imports ...
    KafkaModule,
    ClientsModule.registerAsync([
      {
        name: 'MT5_SERVICE',
        useFactory: (configService: ConfigService<AllConfigType>) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.getOrThrow('kafka').mt5KafkaClientIdLive,
              brokers: configService.getOrThrow('kafka').kafkaBrokers,
            },
            consumer: {
              groupId: configService.getOrThrow('kafka').mt5KafkaGroupIdLive,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  // ... rest of module
})
```

---

### 8. MT5-Manager Microservice Implementation

**NEW FILE:** `mt5-manager-microservice/src/modules/auth/password-verification.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Injectable()
export class PasswordVerificationService {
  constructor(
    private readonly authService: AuthService, // Existing MT5 auth service
  ) {}

  @MessagePattern('verify-mt5-password')
  async verifyMt5Password(
    @Payload() data: { login: string; password: string; server: string },
  ): Promise<{ valid: boolean; account?: any; error?: string }> {
    try {
      const { login, password, server } = data;

      // Get MT5 manager connection
      const mt5Manager = await this.authService.getAuth();

      // Method 1: Try to authenticate with provided credentials
      // This requires creating a new MT5 connection with these credentials
      const isValid = await this.verifyPasswordWithMt5(login, password, mt5Manager);

      if (!isValid) {
        return {
          valid: false,
          error: 'Invalid login or password',
        };
      }

      // Get account details
      const account = await this.getAccountByLogin(login, mt5Manager);

      return {
        valid: true,
        account: {
          Login: account.Login,
          Group: account.Group,
          Name: account.Name,
          Email: account.Email,
          Balance: account.Balance,
          Credit: account.Credit,
          // ... other safe fields
        },
      };
    } catch (error) {
      console.error('Error verifying MT5 password:', error);
      return {
        valid: false,
        error: error.message,
      };
    }
  }

  private async verifyPasswordWithMt5(
    login: string,
    password: string,
    mt5Manager: any,
  ): Promise<boolean> {
    // Option 1: Use MT5 Manager API UserPasswordCheck()
    // This is the recommended method if available
    
    // Option 2: Hash and compare with stored hash
    // const account = await mt5Manager.UserGet(login);
    // const hashedPassword = this.hashMt5Password(password);
    // return account.PasswordHash === hashedPassword;

    // Option 3: Try to create a temporary connection
    // (less recommended, but works if UserPasswordCheck not available)

    // Placeholder - implement based on your MT5 Manager API
    return true; // Replace with actual implementation
  }

  private async getAccountByLogin(login: string, mt5Manager: any): Promise<any> {
    // Use existing get-account-by-login logic
    return await mt5Manager.UserGet(login);
  }
}
```

---

## 🎯 Usage Examples

### Mobile App - MT5 Login

```typescript
// Login with MT5 credentials
const response = await fetch('https://api.yourdomain.com/v1/auth/mt5/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x_device_id': deviceId,
  },
  body: JSON.stringify({
    login: '12345',
    password: 'MyMt5Password',
    server: 'live',
  }),
});

const { token, refreshToken, user, mt5Account } = await response.json();

// Save token for future requests
localStorage.setItem('jwt_token', token);

// Use token for authenticated requests
const symbolsResponse = await fetch('https://api.yourdomain.com/v1/symbols', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
```

### Backend - Protected Endpoint for MT5 Users

```typescript
@Controller('mt5-trading')
export class Mt5TradingController {
  // Accept BOTH regular JWT and MT5 JWT
  @Get('my-positions')
  @UseGuards(AuthGuard('jwt')) // Works for both!
  @ApiBearerAuth()
  async getMyPositions(@Request() request) {
    const user = request.user;

    // Check if MT5 auth
    if (user.authProvider === 'mt5') {
      // Get positions directly from MT5
      return this.mt5Service.getPositionsByLogin(user.mt5Login, user.mt5Server);
    } else {
      // Get positions from linked MT5 accounts
      return this.mt5Service.getPositionsByUserId(user.id);
    }
  }

  // MT5-only endpoint
  @Post('place-order')
  @UseGuards(Mt5AuthGuard) // Custom guard for MT5-only
  @ApiBearerAuth()
  async placeOrder(@Request() request, @Body() orderDto: PlaceOrderDto) {
    const { mt5Login, mt5Server } = request.user;
    
    return this.mt5Service.placeOrder(mt5Login, orderDto, mt5Server);
  }
}
```

---

## 🔒 Security Considerations

### Password Transmission
- ✅ HTTPS/TLS required for API calls
- ✅ Password sent only to backend, not stored
- ✅ Kafka communication internal (private network)
- ✅ MT5 password verified server-side

### Token Security
- ✅ Same JWT secret as email auth
- ✅ Same expiration policies
- ✅ Session validation on every request
- ✅ Logout invalidates session

### Account Linking
- ✅ Unique constraint on mt5Login
- ✅ One MT5 account → One User account
- ✅ Optional: Allow linking to existing user

### Brute Force Protection
- ⚠️ Consider rate limiting on `/auth/mt5/login`
- ⚠️ Log failed attempts
- ⚠️ Lock account after N failed attempts

---

## 📊 Comparison: Email Auth vs MT5 Auth

| Feature | Email Auth | MT5 Auth |
|---------|-----------|----------|
| **Credential Storage** | Database (bcrypt) | MT5 Server only |
| **Password Verification** | Bcrypt comparison | MT5 API call via Kafka |
| **User Creation** | Manual registration | Auto-create on first login |
| **JWT Payload** | Standard fields | + authProvider, mt5Login, mt5Server |
| **Session Management** | Same | Same |
| **Logout** | Soft delete session | Soft delete session |
| **Password Reset** | Email OTP flow | Via MT5 platform only |
| **2FA** | TOTP/Email/SMS | MT5 platform 2FA (if configured) |

---

## ✅ Benefits of This Approach

1. **Seamless Integration** - Uses existing JWT infrastructure
2. **Session Management** - Leverages current session system
3. **Role-Based Access** - Compatible with RolesGuard
4. **Flexible Guards** - Can use standard or MT5-specific guards
5. **Auto User Creation** - Frictionless for MT5 users
6. **Backward Compatible** - Zero impact on email auth
7. **Secure** - MT5 password never stored in database

---

## 📋 Implementation Checklist

### Phase 1: Database & Types
- [ ] Add `mt5Login`, `mt5Server`, `mt5LinkedAt` to User entity
- [ ] Create migration to add columns
- [ ] Extend `JwtPayloadType` to include MT5 fields
- [ ] Create `AuthMt5LoginDto`

### Phase 2: MT5-Manager Service
- [ ] Create `password-verification.service.ts` in mt5-manager-microservice
- [ ] Implement `verify-mt5-password` Kafka handler
- [ ] Test password verification with real MT5 accounts

### Phase 3: Auth Service
- [ ] Add `validateMt5Login()` method
- [ ] Add `createUserFromMt5Account()` helper
- [ ] Add `linkMt5AccountToUser()` method
- [ ] Update `getTokensData()` to accept MT5 fields

### Phase 4: Controller & Strategy
- [ ] Add `POST /auth/mt5/login` endpoint
- [ ] Add `POST /auth/mt5/link` endpoint (optional)
- [ ] Create `Mt5JwtStrategy` (optional - can reuse JwtStrategy)
- [ ] Update auth.module.ts with Kafka client

### Phase 5: Testing
- [ ] Unit tests for validateMt5Login
- [ ] Integration test with mt5-manager
- [ ] Test token generation
- [ ] Test session management
- [ ] Test logout flow
- [ ] Test invalid credentials

### Phase 6: Documentation
- [ ] Swagger documentation
- [ ] Mobile app integration guide
- [ ] Error handling guide

---

**See:** `02-IMPLEMENTATION-GUIDE.md` for step-by-step implementation

