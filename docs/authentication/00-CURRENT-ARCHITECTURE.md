# Current Authentication Architecture

**Project:** rest-api  
**Reviewed by:** Arshad Shaheen  
**Date:** October 23, 2025

---

## 🏗️ Architecture Overview

### Authentication Flow Diagram

```
┌─────────────────┐
│  Client Request │
│ (Email/Password)│
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│   Auth Controller                   │
│  POST /admin/auth/email/login       │
│  POST /client/auth/email/login      │
│  POST /auth/email/login             │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│   AuthService.validateLogin()       │
│  1. Find user by email              │
│  2. Verify password (bcrypt)        │
│  3. Check user status/role          │
│  4. Create session                  │
│  5. Generate JWT tokens             │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│   Session Created                   │
│  - Links user to session            │
│  - Stores FCM token                 │
│  - Soft delete on logout            │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│   JWT Tokens Generated              │
│  Access Token (15min-1hr)           │
│  Refresh Token (7-30 days)          │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│   Response to Client                │
│  { token, refreshToken,             │
│    tokenExpires, user }             │
└─────────────────────────────────────┘
```

---

## 🔐 Current Authentication Components

### 1. Auth Controllers (3 Controllers)

#### **AdminAuthController** (`/admin/auth`)
- **Purpose:** Operator/Admin login
- **Key Endpoints:**
  - `POST /email/login` - Operator login only
  - `POST /email/long-lived-token` - Long-term access
  - `POST /logout`
  - `GET /me`
  - `PATCH /me`
  - `PATCH /change/password`
- **Guards:** `AuthGuard('jwt')` + `RolesGuard` (OperatorRole)

#### **ClientAuthController** (`/client/auth`)
- **Purpose:** Client/Customer login
- **Key Endpoints:**
  - `POST /email/login` - Client login only
  - `POST /logout`
  - `GET /me`
  - `PATCH /me`
  - `PATCH /change/password`
  - `POST /refresh` - Refresh token
- **Guards:** `AuthGuard('jwt')` + `RolesGuard` (RoleEnum.client)

#### **AuthController** (`/auth`)
- **Purpose:** General auth + registration
- **Key Endpoints:**
  - `POST /email/login` - Generic login
  - `POST /email/register`
  - `POST /email/register/broker`
  - `POST /email/confirm`
  - `POST /forgot/password`
  - `POST /reset/password`
  - `POST /verify-2fa-token-by-email`
  - `POST /save-fcm-token`
  - `GET /me`

---

### 2. Auth Service (`auth.service.ts`)

#### **Key Methods:**

**validateLogin(loginDto, request, deviceId)**
```typescript
// Flow:
1. Check if user is operator or client (loginDto.isOperator)
2. Find user by email in database
3. Verify password using bcrypt.compareSync()
4. Validate user status (active, not deleted, etc.)
5. Create session via SessionService
6. Generate JWT tokens via getTokensData()
7. Emit active log event
8. Return: { token, refreshToken, tokenExpires, user }
```

**getTokensData(data)**
```typescript
// Generates JWT tokens
Payload: {
  id: user.id,
  role: user.role,
  languageIso: user.languageIso,
  sessionId: session.id,
  email: user.email,
  iat: timestamp,
  exp: expiration
}

Returns: {
  token: string (access token),
  refreshToken: string,
  tokenExpires: number
}
```

**sessionCheck(sessionId, userId)**
```typescript
// Validates session for JWT strategy
// Returns session if valid, null if invalid/deleted
```

---

### 3. JWT Strategies (Passport.js)

#### **JwtStrategy** (`jwt.strategy.ts`)
```typescript
Strategy Name: 'jwt'
Extraction: Bearer token from Authorization header
Secret: From config.auth.secret
Validation:
  1. Extract payload from token
  2. Call authService.sessionCheck(sessionId, userId)
  3. If session invalid → UnauthorizedException
  4. Return payload to request.user
```

#### **JwtRefreshStrategy** (`jwt-refresh.strategy.ts`)
```typescript
Strategy Name: 'jwt-refresh'
Purpose: Refresh expired access tokens
Secret: From config.auth.refreshSecret
```

#### **AnonymousStrategy** (`anonymous.strategy.ts`)
```typescript
Strategy Name: 'anonymous'
Purpose: Allow unauthenticated access to specific endpoints
```

---

### 4. JWT Payload Structure

**File:** `auth/strategies/types/jwt-payload.type.ts`

```typescript
export type JwtPayloadType = Pick<
  User,
  'id' | 'role' | 'languageIso' | 'email'
> & {
  sessionId: Session['id'];
  iat: number;
  exp: number;
};
```

**Fields:**
- `id` - User ID from database
- `role` - User role (RoleEnum)
- `languageIso` - User language preference
- `email` - User email
- `sessionId` - Session ID for validation
- `iat` - Issued at timestamp
- `exp` - Expiration timestamp

---

### 5. Session Management

**Entity:** `Session`
```typescript
{
  id: number (PK),
  user: User (ManyToOne, CASCADE),
  fcmToken: string (nullable),
  createdAt: Date,
  deletedAt: Date (soft delete)
}
```

**Purpose:**
- Tracks active user sessions
- Enables token revocation via logout
- Stores FCM tokens for push notifications
- Soft delete on logout

---

### 6. Guards & Decorators

#### **Guards Used:**
1. `AuthGuard('jwt')` - Standard JWT authentication
2. `AuthGuard('jwt-refresh')` - Refresh token validation
3. `RolesGuard` - Role-based authorization
4. Custom guards via decorators

#### **Decorators:**
- `@ApiBearerAuth()` - Swagger documentation
- `@Roles(RoleEnum.client)` - Role requirement
- `@OperatorRole()` - Operator-specific role
- `@GetUser()` - Extract user from request
- `@SkipMasking()` - Skip data masking
- `@CacheKeyWithUser()` - User-specific caching

---

## 🔄 Authentication Flow Details

### **Login Flow:**

```
1. Client sends: POST /auth/email/login
   Body: { email, password, isOperator }

2. AuthService.validateLogin():
   - Query user by email
   - Verify password with bcrypt
   - Check user active status
   - Validate role permissions

3. SessionService.create():
   - Create new session record
   - Link to user
   - Return session ID

4. JwtService.sign():
   - Create access token (15min-1hr)
   - Create refresh token (7-30 days)
   - Sign with secret from config

5. Response:
   {
     token: "eyJhbGc...",
     refreshToken: "eyJhbGc...",
     tokenExpires: 3600,
     user: { id, email, role, ... }
   }
```

### **Protected Endpoint Access:**

```
1. Client sends: GET /auth/me
   Headers: Authorization: Bearer eyJhbGc...

2. JwtStrategy.validate():
   - Extract token from Authorization header
   - Verify signature with secret
   - Decode payload
   - Call authService.sessionCheck(sessionId, userId)
   - If session deleted → 401 Unauthorized
   - If valid → attach payload to request.user

3. Controller receives request.user:
   - Access via @Request() request or @GetUser()
   - Contains: { id, role, languageIso, email, sessionId }

4. RolesGuard (if used):
   - Check request.user.role against @Roles() decorator
   - Allow/deny based on role match
```

---

## 🛡️ Security Features

### Password Security
- ✅ Bcrypt hashing with salt
- ✅ Password complexity requirements (implied)
- ✅ Password change tracking (previousPassword)

### Session Security
- ✅ Session-based token revocation (logout invalidates session)
- ✅ Soft delete (deletedAt column)
- ✅ Cascade delete with user

### JWT Security
- ✅ Secret from environment config
- ✅ Expiration times configurable
- ✅ Refresh token rotation
- ✅ Session validation on every request

### Role-Based Access Control (RBAC)
- ✅ Role enum (client, operator, broker, partner)
- ✅ RolesGuard enforces role requirements
- ✅ Separate controllers for admin vs client

### Additional Security
- ✅ Device ID tracking (x_device_id header)
- ✅ IP address logging
- ✅ OTP/2FA support
- ✅ Email verification
- ✅ Forgot password with OTP

---

## 📊 Authentication Types Supported

| Type | Login Method | Controller | Guard |
|------|-------------|-----------|-------|
| **Email/Password** | Email + bcrypt password | All 3 controllers | `AuthGuard('jwt')` |
| **Long-lived Token** | API token | AdminAuthController | `AuthGuard('jwt')` |
| **Refresh Token** | Refresh token | ClientAuthController | `AuthGuard('jwt-refresh')` |
| **Social (OAuth)** | Google/Facebook/Apple/Twitter | Separate modules | External strategies |

---

## 🔧 Configuration

### JWT Config (`auth.config.ts`)
```typescript
{
  secret: process.env.AUTH_JWT_SECRET,
  refreshSecret: process.env.AUTH_REFRESH_SECRET,
  expires: process.env.AUTH_JWT_TOKEN_EXPIRES_IN,
  refreshExpires: process.env.AUTH_REFRESH_TOKEN_EXPIRES_IN
}
```

### Environment Variables Required
- `AUTH_JWT_SECRET` - JWT signing secret
- `AUTH_REFRESH_SECRET` - Refresh token secret
- `AUTH_JWT_TOKEN_EXPIRES_IN` - Access token expiry (e.g., "15m", "1h")
- `AUTH_REFRESH_TOKEN_EXPIRES_IN` - Refresh token expiry (e.g., "7d", "30d")

---

## 📁 File Structure

```
rest-api/src/auth/
├── auth.controller.ts          (3 controllers in 1 file)
├── auth.service.ts             (3631 lines - core logic)
├── auth.module.ts              (Module configuration)
├── auth-providers.enum.ts      (Email, Google, Facebook, etc.)
├── config/
│   ├── auth.config.ts
│   └── auth-config.type.ts
├── decorator/
│   └── password.decorator.ts   (@GetUser decorator)
├── dto/
│   ├── auth-email-login.dto.ts
│   ├── auth-register-login.dto.ts
│   ├── auth-forgot-password.dto.ts
│   ├── auth-reset-password.dto.ts
│   └── ... (14 DTOs total)
├── strategies/
│   ├── jwt.strategy.ts         (Main JWT validation)
│   ├── jwt-refresh.strategy.ts (Refresh token)
│   ├── anonymous.strategy.ts   (Public access)
│   └── types/
│       ├── jwt-payload.type.ts
│       └── jwt-refresh-payload.type.ts
└── types/
    └── login-response.type.ts
```

---

## 🎯 Key Strengths

1. ✅ **Multi-tenant Support** - Separate controllers for admin/client
2. ✅ **Session Management** - Token revocation support
3. ✅ **Role-Based Access** - Fine-grained permissions
4. ✅ **Extensible** - Easy to add new auth providers
5. ✅ **Secure** - Bcrypt, JWT, session validation
6. ✅ **2FA Ready** - OTP/TOTP support integrated

---

## ⚠️ Current Limitations for MT5 Auth

1. **No MT5 Password Verification** - Only database passwords supported
2. **No MT5 Account Linking** - Can't authenticate directly with MT5 login
3. **No Multi-Auth-Provider JWT** - JWT only identifies User, not auth method
4. **No MT5-Specific Guards** - All guards assume email/password auth

---

## 🚀 Ready for Extension

The architecture is **well-designed** for adding MT5 authentication:
- ✅ Passport.js strategies are pluggable
- ✅ AuthService can be extended
- ✅ JWT payload is extensible
- ✅ Guards are composable
- ✅ Session system supports any auth type

**Next:** See `01-MT5-AUTH-DESIGN.md` for proposed implementation.

