# Authentication System Documentation

**Project:** rest-api  
**Reviewed & Designed By:** Arshad Shaheen  
**Date:** October 23, 2025

---

## 📚 Documentation Index

### Core Documents

1. **[00-CURRENT-ARCHITECTURE.md](./00-CURRENT-ARCHITECTURE.md)**  
   Complete review of existing authentication system
   - Email/Password authentication flow
   - JWT strategy & session management
   - Controllers, services, guards
   - Security features

2. **[01-MT5-AUTH-DESIGN.md](./01-MT5-AUTH-DESIGN.md)**  
   Design proposal for MT5 account authentication
   - Architecture diagrams
   - Authentication flow
   - JWT payload extensions
   - Kafka integration

3. **[02-IMPLEMENTATION-GUIDE.md](./02-IMPLEMENTATION-GUIDE.md)**  
   Step-by-step implementation guide
   - Code examples
   - Database migrations
   - Testing procedures
   - Time estimates (3.5-4.5 hours)

---

## 🎯 Quick Summary

### Current State ✅
- **Email/Password authentication** fully implemented
- **JWT-based** with refresh tokens
- **Session management** with revocation support
- **Role-based access control** (RBAC)
- **3 controllers:** Admin, Client, General Auth
- **Multiple strategies:** JWT, JWT-Refresh, Anonymous
- **Social auth:** Google, Facebook, Apple, Twitter

### Proposed Addition 🆕
- **MT5 Account authentication** via account ID + password
- **Password verification** through mt5-manager-microservice (Kafka)
- **Extended JWT payload** with MT5 metadata
- **Auto user creation** for MT5 accounts
- **Optional account linking** to existing users
- **MT5-specific guards** for exclusive endpoints

---

## 🏗️ Architecture Comparison

### Email Authentication (Current)
```
Client → REST API → Database (bcrypt) → JWT Token
```

### MT5 Authentication (Proposed)
```
Client → REST API → Kafka → MT5-Manager → MT5 Server → JWT Token
```

**Key Difference:** Password verification happens on MT5 server, not database!

---

## 🔐 Authentication Types

| Type | Credentials | Storage | Verification | JWT Payload |
|------|-------------|---------|--------------|-------------|
| **Email/Password** | email + password | Database (bcrypt) | bcrypt.compareSync() | Standard |
| **MT5 Account** 🆕 | mt5Login + password | MT5 Server | Kafka→MT5 Manager | + authProvider, mt5Login |
| **Social OAuth** | Google/FB token | Provider | OAuth validation | Social provider ID |
| **Long-lived Token** | API token | Database | Token lookup | Standard |

---

## 📊 JWT Payload Structure

### Standard JWT (Email Auth)
```typescript
{
  id: 123,                    // User ID
  role: { id: 2, name: 'client' },
  languageIso: 'EN',
  email: 'user@example.com',
  sessionId: 456,
  iat: 1729700000,
  exp: 1729703600,
}
```

### Extended JWT (MT5 Auth) 🆕
```typescript
{
  id: 123,
  role: { id: 2, name: 'client' },
  languageIso: 'EN',
  email: '12345@mt5.auto',
  sessionId: 456,
  iat: 1729700000,
  exp: 1729703600,
  // MT5-specific fields
  authProvider: 'mt5',        // ← Identifies auth method
  mt5Login: '12345',          // ← MT5 account ID
  mt5Server: 'live',          // ← Server type
}
```

---

## 🛡️ Security Model

### Password Security
| Method | Email Auth | MT5 Auth |
|--------|-----------|----------|
| **Storage** | Database (bcrypt) | MT5 server only |
| **Transmission** | HTTPS to API | HTTPS→API→Kafka(internal)→MT5 |
| **Verification** | bcrypt.compareSync | MT5 Manager API |
| **Reset** | Email OTP | MT5 platform |
| **Rotation** | Via API | Via MT5 platform |

### Token Security (Same for Both)
- ✅ JWT signed with secret
- ✅ Session validation
- ✅ Expiration enforced
- ✅ Revocation via logout

---

## 🚀 Implementation Complexity

### Effort Estimation

| Component | Complexity | Time | Priority |
|-----------|-----------|------|----------|
| MT5-Manager password service | Moderate | 1-1.5 hrs | **HIGH** |
| Database schema updates | Low | 30 min | HIGH |
| Auth service methods | Moderate | 1-1.5 hrs | HIGH |
| Controller endpoints | Low | 30 min | HIGH |
| Testing | Moderate | 30-45 min | HIGH |
| MT5-specific guards (optional) | Low | 30 min | LOW |
| **TOTAL** | **Moderate** | **3.5-4.5 hrs** | |

**Complexity Rating:** 🟡 **MODERATE**

---

## 🎯 Recommended Approach

### Option 3: Hybrid Approach (Recommended ✅)

**Strategy:**
1. Use **existing JwtStrategy** for both auth types
2. Extend JWT payload with optional MT5 fields
3. Create **Mt5AuthGuard** for MT5-exclusive endpoints
4. Controllers check `request.user.authProvider` when needed

**Benefits:**
- ✅ Minimal code changes
- ✅ Reuse existing infrastructure
- ✅ Flexibility for both scenarios
- ✅ Clear separation when needed

**Implementation Priority:**
1. ✅ **High:** MT5 password verification in mt5-manager
2. ✅ **High:** Database schema updates
3. ✅ **High:** Auth service MT5 login method
4. ✅ **High:** Controller endpoint
5. 🟡 **Medium:** Account linking feature
6. 🟢 **Low:** MT5-specific guard

---

## 📱 Mobile App Integration

### Login Screen Updates

```typescript
// Add MT5 login option
enum LoginMethod {
  EMAIL = 'email',
  MT5_ACCOUNT = 'mt5',
}

const [loginMethod, setLoginMethod] = useState(LoginMethod.EMAIL);

// Email login (existing)
if (loginMethod === LoginMethod.EMAIL) {
  return (
    <form>
      <input name="email" />
      <input name="password" type="password" />
      <button>Login</button>
    </form>
  );
}

// MT5 login (new)
if (loginMethod === LoginMethod.MT5_ACCOUNT) {
  return (
    <form>
      <input name="mt5Login" placeholder="MT5 Account ID" />
      <input name="password" type="password" />
      <select name="server">
        <option value="live">Live Server</option>
        <option value="demo">Demo Server</option>
      </select>
      <button>Login with MT5</button>
    </form>
  );
}
```

---

## 🔍 Use Cases

### Use Case 1: Mobile Trader App
**Scenario:** User has MT5 account, wants to login to mobile app

**Flow:**
1. User selects "Login with MT5 Account"
2. Enters MT5 login ID + password
3. App calls `POST /auth/mt5/login`
4. Receives JWT token
5. Uses token for all API calls
6. Can view charts, place trades, check balance

**Benefit:** No separate registration required!

---

### Use Case 2: Existing User Links MT5
**Scenario:** User has email account, wants to link MT5 account

**Flow:**
1. User logs in with email/password (gets JWT)
2. Goes to "Link MT5 Account" in settings
3. Enters MT5 login + password
4. App calls `POST /auth/mt5/link`
5. MT5 account linked to profile
6. Future logins: can use either email OR MT5

**Benefit:** Flexibility for power users!

---

### Use Case 3: MT5-Only Features
**Scenario:** Some features only available for MT5-authenticated users

**Flow:**
1. Endpoint uses `@UseGuards(Mt5AuthGuard)`
2. Only accepts JWT with `authProvider: 'mt5'`
3. Direct MT5 operations without user lookup

**Benefit:** Enhanced security for trading operations!

---

## ✅ Success Criteria

### Must Have
- [ ] MT5 password verified via mt5-manager
- [ ] JWT token generated with MT5 metadata
- [ ] User auto-created on first MT5 login
- [ ] Session management works same as email auth
- [ ] Logout invalidates MT5-based sessions

### Should Have
- [ ] Account linking feature
- [ ] Swagger documentation
- [ ] Error messages in multiple languages
- [ ] Activity logging

### Nice to Have
- [ ] Mt5AuthGuard for exclusive endpoints
- [ ] Rate limiting on MT5 login
- [ ] Failed login attempt tracking
- [ ] MT5 password change webhook

---

## 🚦 Implementation Status

- ✅ **Current Architecture:** Reviewed & Documented
- ✅ **MT5 Auth Design:** Complete & Documented  
- ✅ **Implementation Guide:** Step-by-step ready
- ⏳ **Code Implementation:** Ready to start
- ⏳ **Testing:** Pending implementation
- ⏳ **Deployment:** Pending testing

---

## 📞 Support & References

### Documentation
- **Current Auth:** `00-CURRENT-ARCHITECTURE.md`
- **MT5 Design:** `01-MT5-AUTH-DESIGN.md`
- **Implementation:** `02-IMPLEMENTATION-GUIDE.md`

### Code Examples
- All code examples in `02-IMPLEMENTATION-GUIDE.md`
- Ready to copy-paste
- Includes error handling
- Production-ready

### Questions?
- Review current architecture first
- Check implementation guide for code
- All decisions explained in design doc

---

## 🎉 Summary

**Current System:** Mature, secure email/password authentication with JWT  
**Proposed Addition:** MT5 account authentication via Kafka  
**Complexity:** Moderate (3.5-4.5 hours)  
**Impact:** Zero breaking changes  
**Benefits:** Seamless MT5 user onboarding  

**Ready to implement!** 🚀

---

**Documented By:** AI Assistant & Arshad Shaheen  
**Date:** October 23, 2025  
**Status:** Ready for Implementation

