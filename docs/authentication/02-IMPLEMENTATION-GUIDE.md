# MT5 Authentication Implementation Guide

**For:** Arshad Shaheen  
**Date:** October 23, 2025  
**Complexity:** MODERATE (3-4 hours)

---

## 🎯 Implementation Steps

### Phase 1: MT5-Manager Microservice (1-1.5 hours)

#### Step 1.1: Create Password Verification Service

Create: `mt5-manager-microservice/src/modules/auth/password-verification.controller.ts`

```typescript
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class PasswordVerificationController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('verify-mt5-password')
  async verifyPassword(
    @Payload()
    data: {
      login: string;
      password: string;
      server: string;
    },
  ): Promise<{ valid: boolean; account?: any; error?: string }> {
    try {
      console.log(`Verifying MT5 password for login: ${data.login}`);

      // Get MT5 manager connection
      const mt5Manager = await this.authService.getAuth();

      // Get account from MT5
      const getAccountResult = await mt5Manager.sendRequest('get-user', {
        login: data.login,
      });

      if (getAccountResult.retcode !== '0') {
        return {
          valid: false,
          error: 'Account not found',
        };
      }

      const account = getAccountResult.answer;

      // Verify password using MT5 Manager API
      // Option 1: If MT5 has UserPasswordCheck()
      const passwordCheckResult = await mt5Manager.sendRequest(
        'user-password-check',
        {
          login: data.login,
          password: data.password,
        },
      );

      const isValid = passwordCheckResult.retcode === '0';

      if (!isValid) {
        return {
          valid: false,
          error: 'Invalid password',
        };
      }

      // Return account details
      return {
        valid: true,
        account: {
          Login: account.Login,
          Group: account.Group,
          Name: account.Name,
          Email: account.Email,
          Balance: account.Balance,
          Credit: account.Credit,
          Leverage: account.Leverage,
        },
      };
    } catch (error) {
      console.error('Error verifying MT5 password:', error);
      return {
        valid: false,
        error: error.message || 'Verification failed',
      };
    }
  }
}
```

#### Step 1.2: Register Controller

Update: `mt5-manager-microservice/src/modules/auth/auth.module.ts`

```typescript
@Module({
  controllers: [
    AuthController,
    PasswordVerificationController, // ADD THIS
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
```

#### Step 1.3: Test MT5 Password Verification

Create test script: `mt5-manager-microservice/test-password-verification.js`

```javascript
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'test-client',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer();

async function testPasswordVerification() {
  await producer.connect();

  const result = await producer.send({
    topic: 'dev.live.verify-mt5-password',
    messages: [
      {
        key: 'test',
        value: JSON.stringify({
          login: '12345',
          password: 'TestPassword123',
          server: 'live',
        }),
      },
    ],
  });

  console.log('Result:', result);
  await producer.disconnect();
}

testPasswordVerification();
```

---

### Phase 2: Database Schema (30 min)

#### Step 2.1: Update User Entity

Edit: `rest-api/src/users/entities/user.entity.ts`

Find the end of the User class and add:

```typescript
  // MT5 Account Integration - Added by Arshad Shaheen - Oct 23, 2025
  @Column({ type: String, unique: true, nullable: true })
  @Index()
  mt5Login: string | null;

  @Column({ type: String, nullable: true })
  mt5Server: string | null; // 'live' or 'demo'

  @Column({ type: Date, nullable: true })
  mt5LinkedAt: Date | null;
```

#### Step 2.2: Create Migration

Generate migration:

```bash
cd rest-api
npm run migration:generate src/database/migrations/AddMt5LoginToUser
```

Or create manually: `rest-api/src/database/migrations/XXXX-AddMt5LoginToUser.ts`

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

#### Step 2.3: Run Migration

```bash
npm run migration:run
```

---

### Phase 3: Auth Service Updates (1-1.5 hours)

#### Step 3.1: Extend JWT Payload Type

Edit: `rest-api/src/auth/strategies/types/jwt-payload.type.ts`

```typescript
import { Session } from 'src/session/entities/session.entity';
import { User } from '../../../users/entities/user.entity';

export type JwtPayloadType = Pick<
  User,
  'id' | 'role' | 'languageIso' | 'email'
> & {
  sessionId: Session['id'];
  iat: number;
  exp: number;
  // MT5 authentication fields - Added by Arshad Shaheen
  authProvider?: 'email' | 'mt5' | 'social';
  mt5Login?: string;
  mt5Server?: 'live' | 'demo';
};
```

#### Step 3.2: Create MT5 Login DTO

Create: `rest-api/src/auth/dto/auth-mt5-login.dto.ts`

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
```

#### Step 3.3: Add MT5 Login Method to AuthService

Edit: `rest-api/src/auth/auth.service.ts`

**Add to constructor:**

```typescript
constructor(
  // ... all existing dependencies ...
  
  // MT5 Authentication - Added by Arshad Shaheen
  @Inject('MT5_SERVICE') private readonly mt5Client: ClientKafka,
  private readonly kafkaService: KafkaService,
) {}
```

**Add method at end of class:**

```typescript
/**
 * Validate MT5 account login
 * Added by: Arshad Shaheen
 * Date: October 23, 2025
 */
async validateMt5Login(
  loginDto: AuthMt5LoginDto,
  request: any,
  deviceId?: string,
): Promise<LoginResponseType & { mt5Account: any }> {
  const { login, password, server = 'live' } = loginDto;
  const i18n = I18nContext.current();
  const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;

  console.log(`MT5 Login attempt: ${login} on ${server} server`);

  // Step 1: Verify MT5 password via Kafka
  let verificationResult;
  try {
    verificationResult = await this.kafkaService.SendMessage(
      this.mt5Client,
      'verify-mt5-password',
      { login, password, server },
      server,
    );
  } catch (error) {
    console.error('Kafka communication error:', error);
    throw new HttpException(
      {
        status: HttpStatus.SERVICE_UNAVAILABLE,
        error: {
          msg: 'Unable to verify MT5 credentials. Please try again.',
        },
      },
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }

  if (!verificationResult.valid) {
    const message = i18n?.t('errors.auth.invalidMt5Credentials') || 'Invalid MT5 credentials';
    throw new HttpException(
      {
        status: HttpStatus.UNAUTHORIZED,
        error: {
          msg: message,
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
    console.log(`Creating new user for MT5 account: ${login}`);
    user = await this.createUserFromMt5Account(mt5Account, server);
  } else {
    console.log(`Existing user found for MT5 account: ${login}`);
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
    authProvider: 'mt5',
    mt5Login: login,
    mt5Server: server,
  } as any); // Cast as any to avoid type conflicts

  // Step 6: Log activity
  this.eventEmitter.emit(EventTypes.ACTIVE_LOG, {
    userId: user.id,
    ipAddress: ip,
    deviceId,
    action: 'MT5 Login',
    details: `MT5 Account: ${login}, Server: ${server}, Group: ${mt5Account.Group}`,
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
      balance: mt5Account.Balance,
      credit: mt5Account.Credit,
    },
  };
}

/**
 * Create User from MT5 account data
 * Added by: Arshad Shaheen
 */
private async createUserFromMt5Account(
  mt5Account: any,
  server: string,
): Promise<User> {
  // Get client role
  const clientRole = await this.roleRepository.findOne({
    where: { id: RoleEnum.client },
  });

  if (!clientRole) {
    throw new Error('Client role not found in database');
  }

  // Get active status
  const activeStatus = await this.statusRepository.findOne({
    where: { id: StatusEnum.active },
  });

  // Create user with MT5 data
  const user = this.userRepository.create({
    email: mt5Account.Email || `${mt5Account.Login}@mt5.auto`,
    mt5Login: mt5Account.Login,
    mt5Server: server,
    mt5LinkedAt: new Date(),
    firstName: mt5Account.Name?.split(' ')[0] || 'MT5',
    lastName: mt5Account.Name?.split(' ').slice(1).join(' ') || 'User',
    role: clientRole,
    status: activeStatus,
    isClient: true,
    languageIso: 'EN',
    // No password - authentication only via MT5
  });

  await this.userRepository.save(user);

  console.log(`Created user ${user.id} for MT5 account ${mt5Account.Login}`);

  return user;
}

/**
 * Link MT5 account to existing user
 * Added by: Arshad Shaheen
 */
async linkMt5AccountToUser(
  userId: number,
  mt5Login: string,
  mt5Password: string,
  server: string,
): Promise<{ success: boolean; message: string }> {
  // Verify MT5 credentials first
  const verificationResult = await this.kafkaService.SendMessage(
    this.mt5Client,
    'verify-mt5-password',
    { login: mt5Login, password: mt5Password, server },
    server,
  );

  if (!verificationResult.valid) {
    throw new HttpException(
      {
        status: HttpStatus.UNAUTHORIZED,
        error: { msg: 'Invalid MT5 credentials' },
      },
      HttpStatus.UNAUTHORIZED,
    );
  }

  // Check if MT5 account already linked
  const existingUser = await this.userRepository.findOne({
    where: { mt5Login },
  });

  if (existingUser && existingUser.id !== userId) {
    throw new HttpException(
      {
        status: HttpStatus.CONFLICT,
        error: { msg: 'MT5 account already linked to another user' },
      },
      HttpStatus.CONFLICT,
    );
  }

  // Link MT5 account
  const user = await this.userRepository.findOne({ where: { id: userId } });
  if (!user) {
    throw new NotFoundException('User not found');
  }

  user.mt5Login = mt5Login;
  user.mt5Server = server;
  user.mt5LinkedAt = new Date();

  await this.userRepository.save(user);

  return {
    success: true,
    message: `MT5 account ${mt5Login} successfully linked`,
  };
}
```

#### Step 3.4: Add Kafka Imports to AuthModule

Edit: `rest-api/src/auth/auth.module.ts`

**Add imports:**

```typescript
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaModule } from 'src/kafka/kafka.module';
```

**Add to imports array:**

```typescript
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

### Phase 4: Controller Endpoints (30 min)

#### Step 4.1: Add MT5 Login Endpoint

Edit: `rest-api/src/auth/auth.controller.ts`

**Add import:**

```typescript
import { AuthMt5LoginDto } from './dto/auth-mt5-login.dto';
```

**Add endpoint in AuthController class (after existing login endpoints):**

```typescript
/**
 * MT5 Account Login
 * Added by: Arshad Shaheen
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
  description:
    'Authenticate using MT5 account ID and password. Password is verified directly with MT5 server.',
})
@ApiBody({
  type: AuthMt5LoginDto,
})
@ApiResponse({
  status: 200,
  description: 'Successfully authenticated with MT5 account',
  schema: {
    example: {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      tokenExpires: 3600,
      user: {
        id: 123,
        email: '12345@mt5.auto',
        role: { id: 2, name: 'client' },
      },
      mt5Account: {
        login: '12345',
        server: 'live',
        group: 'Live\\AA\\E',
        name: 'John Doe',
        balance: 10000.00,
        credit: 0.00,
      },
    },
  },
})
@ApiResponse({
  status: 401,
  description: 'Invalid MT5 credentials',
  schema: {
    example: {
      status: 401,
      error: {
        msg: 'Invalid MT5 credentials',
      },
    },
  },
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
 * Added by: Arshad Shaheen
 */
@ApiBearerAuth()
@Post('mt5/link')
@UseGuards(AuthGuard('jwt'))
@HttpCode(HttpStatus.OK)
@ApiOperation({
  summary: 'Link MT5 account to your existing account',
  description:
    'Links an MT5 trading account to your current user account. Requires valid MT5 credentials.',
})
async linkMt5Account(
  @Request() request,
  @Body()
  linkDto: {
    login: string;
    password: string;
    server?: string;
  },
): Promise<any> {
  return this.service.linkMt5AccountToUser(
    request.user.id,
    linkDto.login,
    linkDto.password,
    linkDto.server || 'live',
  );
}
```

---

### Phase 5: Testing (30-45 min)

#### Test 1: MT5 Password Verification (mt5-manager)

```bash
# In mt5-manager-microservice
npm run start:dev

# In another terminal, test Kafka message
node test-password-verification.js
```

#### Test 2: MT5 Login Endpoint (rest-api)

```bash
# In rest-api
npm run migration:run
npm run start:dev

# Test MT5 login
curl -X POST http://localhost:3000/v1/auth/mt5/login \
  -H "Content-Type: application/json" \
  -H "x_device_id: test-device-123" \
  -d '{
    "login": "12345",
    "password": "YourMt5Password",
    "server": "live"
  }'

# Expected response:
{
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "tokenExpires": 3600,
  "user": { ... },
  "mt5Account": {
    "login": "12345",
    "server": "live",
    "group": "Live\\AA\\E",
    ...
  }
}
```

#### Test 3: Use MT5 JWT

```bash
# Extract token from response
TOKEN="eyJhbGc..."

# Test authenticated endpoint
curl -X GET http://localhost:3000/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"

# Should return user with mt5Login field
```

#### Test 4: Link MT5 to Existing User

```bash
# Login with email first
EMAIL_TOKEN="email_jwt_token"

# Link MT5 account
curl -X POST http://localhost:3000/v1/auth/mt5/link \
  -H "Authorization: Bearer $EMAIL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "login": "12345",
    "password": "Mt5Password",
    "server": "live"
  }'
```

---

## 🔧 Configuration Updates

### Environment Variables

Add to `rest-api/.env`:

```bash
# MT5 Authentication - Added by Arshad Shaheen
SYMBOLS=EURUSD,GBPUSD,USDJPY,XAUUSD
SILICONFORT_MT5_MANAGER_URL=http://mt5-manager-url:port
ENABLE_DUMMY_DATA=false
```

---

## 🎯 Advanced: MT5-Specific Guard (Optional)

If you want endpoints that **ONLY** accept MT5 authentication:

Create: `rest-api/src/auth/guards/mt5-auth.guard.ts`

```typescript
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class Mt5AuthGuard extends AuthGuard('jwt') implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First, validate JWT normally
    const isValidJwt = await super.canActivate(context);
    if (!isValidJwt) {
      return false;
    }

    // Then check if it's MT5 authentication
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user.authProvider !== 'mt5') {
      throw new UnauthorizedException('This endpoint requires MT5 account authentication');
    }

    return true;
  }
}
```

**Usage:**

```typescript
@Controller('mt5-exclusive')
export class Mt5ExclusiveController {
  @Get('my-trades')
  @UseGuards(Mt5AuthGuard) // Only MT5-authenticated users
  @ApiBearerAuth()
  async getMyTrades(@Request() request) {
    const { mt5Login, mt5Server } = request.user;
    return this.mt5Service.getTradesByLogin(mt5Login, mt5Server);
  }
}
```

---

## 📊 Decision Matrix

### Option 1: Unified JWT (Recommended ✅)
**Approach:** Both email and MT5 auth use same JWT strategy

**Pros:**
- ✅ Simple implementation
- ✅ Reuse existing guards
- ✅ Easy to check `authProvider` in controllers

**Cons:**
- ⚠️ Need to check `authProvider` manually in some cases

**Use When:**
- Most endpoints accept both auth types
- Want simplicity

---

### Option 2: Separate JWT Strategies
**Approach:** Create `Mt5JwtStrategy` as separate strategy

**Pros:**
- ✅ Clear separation
- ✅ Can enforce MT5-only endpoints with `@UseGuards(AuthGuard('mt5-jwt'))`

**Cons:**
- ⚠️ More code duplication
- ⚠️ Need two strategies doing similar work

**Use When:**
- Have many MT5-exclusive endpoints
- Want strict type safety

---

### Option 3: Hybrid Approach (Best of Both)
**Approach:** Use unified JWT, create custom `Mt5AuthGuard` for exclusive endpoints

**Pros:**
- ✅ Flexibility for both scenarios
- ✅ Minimal code duplication
- ✅ Clear intent with Mt5AuthGuard

**Cons:**
- ⚠️ Slightly more complex

**Recommendation:** **Use Option 3** ✅

---

## 🚨 Security Considerations

### Password Handling
- ✅ Never store MT5 password in database
- ✅ Send password only to mt5-manager (internal Kafka)
- ✅ mt5-manager validates with MT5 server
- ✅ Password not logged or cached

### Account Linking
- ✅ Unique constraint on `mt5Login`
- ✅ One MT5 account = One user
- ✅ Prevent duplicate linking
- ✅ Require password re-verification for linking

### JWT Token
- ✅ Same secret/expiration as email auth
- ✅ Session validation enforced
- ✅ Logout invalidates session (works for both)

### Rate Limiting
- ⚠️ **Recommended:** Add rate limiting to `/auth/mt5/login`
- ⚠️ Prevent brute force on MT5 passwords
- ⚠️ Log failed attempts

---

## 📋 Implementation Checklist

### Backend (rest-api)
- [ ] Update User entity (add mt5Login, mt5Server, mt5LinkedAt)
- [ ] Create and run migration
- [ ] Extend JwtPayloadType
- [ ] Create AuthMt5LoginDto
- [ ] Add Kafka imports to AuthModule
- [ ] Implement `validateMt5Login()` in AuthService
- [ ] Implement `createUserFromMt5Account()` helper
- [ ] Implement `linkMt5AccountToUser()` method
- [ ] Add `POST /auth/mt5/login` endpoint
- [ ] Add `POST /auth/mt5/link` endpoint (optional)
- [ ] Create Mt5AuthGuard (optional)
- [ ] Add environment variables
- [ ] Test endpoints

### MT5-Manager Microservice
- [ ] Create PasswordVerificationController
- [ ] Implement `verify-mt5-password` handler
- [ ] Test with real MT5 accounts
- [ ] Handle edge cases (account locked, password expired, etc.)

### Mobile App
- [ ] Update login UI to support MT5 login
- [ ] Add MT5 login form (login ID + password)
- [ ] Handle MT5 response (token + mt5Account)
- [ ] Store MT5 account info for display
- [ ] Test login flow

---

## ⏱️ Time Estimate

| Phase | Task | Time |
|-------|------|------|
| 1 | MT5-Manager password service | 1-1.5 hours |
| 2 | Database schema updates | 30 min |
| 3 | Auth service implementation | 1-1.5 hours |
| 4 | Controller endpoints | 30 min |
| 5 | Testing & fixes | 30-45 min |
| **Total** | | **3.5-4.5 hours** |

**Complexity:** MODERATE ✅

---

## 🎯 Next Steps

1. **Read:** This document + `00-CURRENT-ARCHITECTURE.md`
2. **Decide:** Option 1, 2, or 3 for JWT strategy
3. **Implement:** Follow steps in order (mt5-manager first!)
4. **Test:** Verify MT5 password check works
5. **Deploy:** Staging first, then production

**Ready to implement?** Follow the steps above or ask me to code it for you!

---

**Designed By:** AI Assistant  
**For:** Arshad Shaheen  
**Date:** October 23, 2025

