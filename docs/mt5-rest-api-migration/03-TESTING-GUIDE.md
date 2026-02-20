# MT5-REST-API Migration Testing Guide

**Document Version:** 1.0  
**Created:** October 23, 2025  
**Migrated By:** Arshad Shaheen

---

## 📋 Table of Contents

1. [Pre-Testing Checklist](#pre-testing-checklist)
2. [Environment Setup](#environment-setup)
3. [Database Migration Testing](#database-migration-testing)
4. [Service Startup Testing](#service-startup-testing)
5. [Endpoint Testing](#endpoint-testing)
6. [Cron Job Testing](#cron-job-testing)
7. [Kafka Communication Testing](#kafka-communication-testing)
8. [Redis Caching Testing](#redis-caching-testing)
9. [Performance Testing](#performance-testing)
10. [Regression Testing](#regression-testing)
11. [Mobile App Compatibility Testing](#mobile-app-compatibility-testing)
12. [Troubleshooting](#troubleshooting)

---

## 🔍 Pre-Testing Checklist

Before starting testing, verify:

- [ ] All migrated code is compiled without errors (`npm run build`)
- [ ] All environment variables are configured in `.env-development`
- [ ] MT5 Manager microservice is running and accessible
- [ ] Kafka broker is running and accessible
- [ ] Redis is running and accessible
- [ ] Database connection is working
- [ ] Database migrations are ready to run

---

## ⚙️ Environment Setup

### 1. Install Dependencies

```bash
cd rest-api
npm install
```

### 2. Verify Critical Environment Variables

Check these variables in `.env-development`:

```bash
# App Configuration
SYMBOLS=EURUSD,GBPUSD,USDJPY,XAUUSD  # Add your symbols
SILICONFORT_MT5_MANAGER_URL=http://localhost:3002  # MT5 Manager URL
ENABLE_DUMMY_DATA=false

# Kafka Configuration
KAFKA_BROKER=localhost:9092
KAFKA_CONSUMER_GROUP_ID=rest-api-consumer
KAFKA_CLIENT_ID=rest-api-client

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

# Price History Configuration
PRICE_HISTORY_SERVICE_NAME=mt5-history-microservice
PRICE_HISTORY_SERVICE_PORT=3003
```

### 3. Verify Kafka Topics

Ensure these topics exist (they communicate with mt5-manager-microservice):

- `price.getPriceBySymbol`
- `price.getAllPrice`
- `price.getHistoricalPrices`
- `symbol.getAccountByLogin`

---

## 💾 Database Migration Testing

### Step 1: Check Migration Files

Verify these 6 new migrations exist:

```bash
ls rest-api/src/database/migrations/ | findstr 1729700000
```

Expected output:
```
1729700000001-AddContractSizeAndIsTopMoverToSymbol.ts
1729700000002-CreatePopularSymbolTable.ts
1729700000003-AddMultiplyColumnToSymbol.ts
1729700000004-AddOpeningPriceToSymbol.ts
1729700000005-AddMinVolumeToSymbol.ts
1729700000006-AddMaxAndStepVolumeToSymbol.ts
```

### Step 2: Run Migrations

```bash
cd rest-api
npm run migration:run
```

Expected output:
```
✅ 6 migrations have been executed successfully.
```

### Step 3: Verify Database Schema

Connect to your database and verify:

```sql
-- Check symbol table has new columns
SELECT TOP 1 
  contractSize, isTopMover, multiply, 
  openingPrice, openingPriceUpdatedAt,
  minVolume, maxVolume, stepVolume
FROM symbol;

-- Check popular_symbol table exists
SELECT COUNT(*) FROM popular_symbol;
```

---

## 🚀 Service Startup Testing

### Step 1: Start in Development Mode

```bash
cd rest-api
npm run start:dev
```

### Step 2: Watch for Startup Logs

Look for these key indicators:

✅ **Success Indicators:**
```
✔ Nest application successfully started
✔ Symbols Module initialized
✔ Price History Module initialized
✔ Market Info Module initialized
✔ Market Insights Module initialized
✔ Kafka client connected
✔ Redis connected
✔ Symbol update cron job registered
```

❌ **Error Indicators:**
```
✗ Kafka connection failed
✗ Redis connection failed
✗ Unable to connect to mt5-manager-microservice
✗ Database connection error
```

### Step 3: Check Cron Job Started

Within 20 seconds of startup, you should see:
```
Running symbol update cron job
Updating symbols from MT5
Fetching tick data for X symbols
Received tick data from MT5 for Y symbols
Successfully updated Y symbols
```

---

## 🔌 Endpoint Testing

### Test Strategy

1. **Read-only endpoints** - No authentication required
2. **Write endpoints** - JWT authentication required
3. **Compare responses** with old mt5-rest-api (if still running)

### 1. Symbols Module Endpoints

#### GET /mt5-manager/symbols (Read-Only)

**Test without authentication:**
```bash
curl -X GET http://localhost:3001/api/v1/mt5-manager/symbols
```

**Test with userId header:**
```bash
curl -X GET http://localhost:3001/api/v1/mt5-manager/symbols \
  -H "userId: 1"
```

**Test with login header:**
```bash
curl -X GET http://localhost:3001/api/v1/mt5-manager/symbols \
  -H "login: 1001"
```

**Expected Response:**
```json
{
  "status": "success",
  "statusCode": 200,
  "message": "OK",
  "result": [
    {
      "id": 1,
      "symbolCode": "EURUSD",
      "name": "Euro vs US Dollar",
      "bid": 1.08500,
      "ask": 1.08520,
      "isActive": true,
      "contractSize": 100000,
      "multiply": 1.0,
      ...
    }
  ]
}
```

#### GET /mt5-manager/symbols/top-movers (Read-Only)

```bash
curl -X GET http://localhost:3001/api/v1/mt5-manager/symbols/top-movers
```

**Expected Response:** Array of symbols with highest price changes

#### GET /mt5-manager/symbols/popular (Read-Only)

```bash
curl -X GET http://localhost:3001/api/v1/mt5-manager/symbols/popular
```

**Expected Response:** Array of popular symbols

#### POST /mt5-manager/symbols/get-open-price (🔒 Authenticated)

**Test WITHOUT JWT (should fail):**
```bash
curl -X POST http://localhost:3001/api/v1/mt5-manager/symbols/get-open-price \
  -H "Content-Type: application/json" \
  -d '{"symbol": "EURUSD"}'
```

**Expected Response:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**Test WITH JWT (should succeed):**

First, login to get a JWT token:
```bash
# Login
curl -X POST http://localhost:3001/api/v1/auth/email/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "secret"
  }'
```

Copy the token from response, then:
```bash
curl -X POST http://localhost:3001/api/v1/mt5-manager/symbols/get-open-price \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"symbol": "EURUSD"}'
```

**Expected Response:**
```json
{
  "status": "success",
  "statusCode": 200,
  "result": {
    "symbol": "EURUSD",
    "openingPrice": 1.08450,
    "openingPriceUpdatedAt": "2025-10-23T10:00:00.000Z"
  }
}
```

#### POST /mt5-manager/symbols/update (🔒 Authenticated)

**Test WITH JWT:**
```bash
curl -X POST http://localhost:3001/api/v1/mt5-manager/symbols/update \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "count": 50,
  "message": "Symbols updated successfully"
}
```

---

### 2. Price History Module Endpoints

#### GET /mt5-manager/price-history (Read-Only, Cached)

**Test basic request:**
```bash
curl -X GET "http://localhost:3001/api/v1/mt5-manager/price-history?symbol=EURUSD&timeframe=M1&from=2025-10-01&to=2025-10-23"
```

**Test with all parameters:**
```bash
curl -X GET "http://localhost:3001/api/v1/mt5-manager/price-history?symbol=EURUSD&timeframe=H1&from=2025-10-20&to=2025-10-23&login=1001"
```

**Expected Response:**
```json
{
  "status": "success",
  "statusCode": 200,
  "result": [
    {
      "time": 1729684800,
      "open": 1.08500,
      "high": 1.08650,
      "low": 1.08450,
      "close": 1.08600,
      "tick_volume": 1234,
      "spread": 2,
      "real_volume": 123456789
    }
  ]
}
```

**Test caching (run same request twice):**
```bash
# First request - should hit MT5 Manager
curl -X GET "http://localhost:3001/api/v1/mt5-manager/price-history?symbol=EURUSD&timeframe=M5&from=2025-10-23&to=2025-10-23" -w "\nTime: %{time_total}s\n"

# Second request - should be cached (faster)
curl -X GET "http://localhost:3001/api/v1/mt5-manager/price-history?symbol=EURUSD&timeframe=M5&from=2025-10-23&to=2025-10-23" -w "\nTime: %{time_total}s\n"
```

Second request should be significantly faster (< 50ms).

---

### 3. Market Info Module Endpoints

#### GET /mt5-manager/market/info (Read-Only)

**Test with symbol:**
```bash
curl -X GET "http://localhost:3001/api/v1/mt5-manager/market/info?symbol=EURUSD"
```

**Test without symbol (get all):**
```bash
curl -X GET "http://localhost:3001/api/v1/mt5-manager/market/info"
```

**Expected Response:**
```json
{
  "status": "success",
  "statusCode": 200,
  "result": {
    "symbol": "EURUSD",
    "bid": 1.08500,
    "ask": 1.08520,
    "last": 1.08510,
    "volume": 12345,
    "time": 1729684800
  }
}
```

---

### 4. Market Insights Module Endpoints

#### GET /mt5-manager/market/insights (Read-Only)

**Test market summary:**
```bash
curl -X GET "http://localhost:3001/api/v1/mt5-manager/market/insights?type=summary"
```

**Test top gainers:**
```bash
curl -X GET "http://localhost:3001/api/v1/mt5-manager/market/insights?type=gainers"
```

**Test top losers:**
```bash
curl -X GET "http://localhost:3001/api/v1/mt5-manager/market/insights?type=losers"
```

**Expected Response:**
```json
{
  "status": "success",
  "statusCode": 200,
  "result": {
    "type": "gainers",
    "data": [
      {
        "symbol": "GBPUSD",
        "change": 0.85,
        "changePercent": 0.65
      }
    ]
  }
}
```

---

## ⏰ Cron Job Testing

### Test 1: Verify Cron Job is Running

Watch the console logs. Every 20 seconds you should see:

```
Running symbol update cron job
Updating symbols from MT5
Fetching tick data for X symbols
Received tick data from MT5 for Y symbols
Successfully updated Y symbols
```

### Test 2: Verify Database Updates

```sql
-- Check symbol prices are updating
SELECT 
  symbolCode, 
  bid, 
  ask, 
  updatedAt
FROM symbol
WHERE isActive = 1
ORDER BY updatedAt DESC;
```

Run this query twice, 30 seconds apart. The `updatedAt` timestamps should change.

### Test 3: Monitor Cron Job Performance

Watch for these warning signs:
- ❌ Job taking > 10 seconds to complete
- ❌ Errors like "Failed to update symbols"
- ❌ Kafka timeout errors

### Test 4: Disable Cron Job (Optional)

If you need to disable the cron job for testing:

**Temporary (comment out in code):**
```typescript
// In symbols.service.ts
// @Cron('*/20 * * * * *')
async handleSymbolUpdateCron() {
  // ...
}
```

**Permanent (use feature flag):**
Add to `.env`:
```
ENABLE_SYMBOL_CRON=false
```

---

## 📨 Kafka Communication Testing

### Test 1: Verify Kafka Topics

Check that Kafka topics are being used:

```bash
# If you have Kafka CLI installed
kafka-topics.sh --list --bootstrap-server localhost:9092 | findstr price
kafka-topics.sh --list --bootstrap-server localhost:9092 | findstr symbol
```

### Test 2: Monitor Kafka Messages

Watch Kafka messages in real-time (if you have Kafka CLI):

```bash
# Monitor price topic
kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic price.getPriceBySymbol --from-beginning

# Monitor symbol topic
kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic symbol.getAccountByLogin --from-beginning
```

### Test 3: Check Service Logs

Look for Kafka messages in rest-api logs:
```
[Kafka] Sending message to topic: price.getPriceBySymbol
[Kafka] Received response from topic: price.getPriceBySymbol
```

And in mt5-manager-microservice logs:
```
[Kafka] Received message on topic: price.getPriceBySymbol
[Kafka] Sending response to topic: price.getPriceBySymbol
```

---

## 🗄️ Redis Caching Testing

### Test 1: Verify Redis Connection

Check logs for:
```
✔ Redis connected successfully
```

### Test 2: Test Cache Hit/Miss

Use Redis CLI to monitor cache:

```bash
redis-cli
> MONITOR
```

Then make a price history request twice. You should see:
1. First request: `SET price-history:...` (cache miss)
2. Second request: `GET price-history:...` (cache hit)

### Test 3: Verify Cache TTL

```bash
redis-cli
> TTL price-history:{...}
```

Should return a value between 0 and the configured TTL.

### Test 4: Clear Cache

```bash
redis-cli
> FLUSHDB
```

Then verify endpoints fetch fresh data.

---

## ⚡ Performance Testing

### Test 1: Response Time

Measure response times for each endpoint:

```bash
# Symbols endpoint
curl -w "Time: %{time_total}s\n" -o /dev/null -s http://localhost:3001/api/v1/mt5-manager/symbols

# Price history (first request - no cache)
curl -w "Time: %{time_total}s\n" -o /dev/null -s "http://localhost:3001/api/v1/mt5-manager/price-history?symbol=EURUSD&timeframe=M1&from=2025-10-01&to=2025-10-23"

# Price history (second request - cached)
curl -w "Time: %{time_total}s\n" -o /dev/null -s "http://localhost:3001/api/v1/mt5-manager/price-history?symbol=EURUSD&timeframe=M1&from=2025-10-01&to=2025-10-23"
```

**Performance Benchmarks:**
- Symbols endpoint: < 200ms
- Price history (no cache): < 1000ms
- Price history (cached): < 50ms
- Market info: < 300ms

### Test 2: Concurrent Requests

Use a tool like Apache Bench or k6:

```bash
# Install Apache Bench (comes with Apache)
ab -n 100 -c 10 http://localhost:3001/api/v1/mt5-manager/symbols
```

### Test 3: Memory Usage

Monitor Node.js memory:

```bash
# In PowerShell
Get-Process -Name node | Select-Object WorkingSet, VirtualMemorySize
```

---

## 🔄 Regression Testing

### Compare Old vs New API Responses

If `mt5-rest-api` is still running, compare responses:

**Old API:**
```bash
curl http://localhost:3002/api/v1/symbols > old-symbols.json
```

**New API:**
```bash
curl http://localhost:3001/api/v1/mt5-manager/symbols > new-symbols.json
```

**Compare:**
```bash
# Use a JSON diff tool or manual comparison
# Verify structure and data are identical
```

**Test all endpoints:**
- [ ] `/symbols` - identical
- [ ] `/symbols/top-movers` - identical
- [ ] `/symbols/popular` - identical
- [ ] `/price-history` - identical
- [ ] `/market/info` - identical
- [ ] `/market/insights` - identical

---

## 📱 Mobile App Compatibility Testing

### Test 1: Update Mobile App URL

Change mobile app configuration from:
```
MT5_API_BASE_URL=https://mt5-rest-api-qa.example.com/api/v1
```

To:
```
MT5_API_BASE_URL=https://restapi-v2-qa.example.com/api/v1/mt5-manager
```

### Test 2: Test All Mobile App Features

- [ ] Symbol list loads correctly
- [ ] Symbol search works
- [ ] Price updates in real-time
- [ ] Chart data loads (price history)
- [ ] Market insights display correctly
- [ ] Top movers/popular symbols work
- [ ] No authentication errors on read-only endpoints
- [ ] No breaking changes in response structure

### Test 3: Test with Different Accounts

Test with accounts of different tiers:
- [ ] Tier S account
- [ ] Tier A account
- [ ] Tier P account

Verify tier-based symbol filtering works correctly.

---

## 🐛 Troubleshooting

### Issue 1: "Cannot find module '@nestjs/schedule'"

**Solution:**
```bash
npm install @nestjs/schedule
```

### Issue 2: "priceHistory config not found"

**Solution:**
Verify `priceHistoryConfig` is in `app.module.ts`:
```typescript
ConfigModule.forRoot({
  load: [
    // ... other configs
    priceHistoryConfig,
  ],
}),
```

### Issue 3: Cron job not running

**Symptoms:**
- No "Running symbol update cron job" logs
- Symbols not updating

**Solution:**
1. Verify `ScheduleModule.forRoot()` in `app.module.ts`
2. Check `@Cron()` decorator is not commented out
3. Restart the service

### Issue 4: Kafka connection timeout

**Symptoms:**
- "Kafka broker not reachable"
- Price history requests timeout

**Solution:**
1. Verify Kafka is running: `netstat -an | findstr 9092`
2. Check `KAFKA_BROKER` in `.env`
3. Verify `mt5-manager-microservice` is running
4. Check firewall settings

### Issue 5: Database migration failed

**Symptoms:**
- "Migration already exists"
- "Column already exists"

**Solution:**
```bash
# Revert last migration
npm run migration:revert

# Re-run migrations
npm run migration:run
```

### Issue 6: Redis cache not working

**Symptoms:**
- Same response time on repeated requests
- No cache keys in Redis

**Solution:**
1. Verify Redis is running: `redis-cli ping`
2. Check `REDIS_HOST` and `REDIS_PORT` in `.env`
3. Verify `RouteCacheInterceptor` is applied
4. Check Redis logs for connection errors

### Issue 7: 401 Unauthorized on read-only endpoints

**Symptoms:**
- `/symbols` returns 401
- `/price-history` returns 401

**Solution:**
Verify these endpoints do NOT have `@UseGuards(AuthGuard('jwt'))`. Only these endpoints should require auth:
- `POST /symbols/get-open-price`
- `POST /symbols/update`

---

## ✅ Testing Checklist

### Pre-Deployment Checklist

- [ ] All 6 database migrations ran successfully
- [ ] Service starts without errors
- [ ] All 4 modules loaded (symbols, price-history, market/info, market/insights)
- [ ] Cron job runs every 20 seconds
- [ ] Kafka connection successful
- [ ] Redis connection successful
- [ ] All read-only endpoints return 200
- [ ] Write endpoints require JWT authentication
- [ ] Response structure matches old API
- [ ] Cache is working (faster second requests)
- [ ] Symbol prices update automatically
- [ ] No memory leaks after 1 hour
- [ ] Logs are clean (no errors)

### Post-Deployment Checklist

- [ ] Mobile app can connect to new endpoint
- [ ] All mobile app features work
- [ ] Old mt5-rest-api service can be shut down
- [ ] Monitor logs for 24 hours
- [ ] No performance degradation
- [ ] Kafka message rate is normal
- [ ] Database queries are optimized
- [ ] Redis cache hit rate > 70%

---

## 📊 Success Metrics

After migration is complete, monitor these metrics:

| Metric | Target | How to Check |
|--------|--------|--------------|
| API Response Time | < 200ms (avg) | Monitor logs |
| Cache Hit Rate | > 70% | Redis CLI: `INFO stats` |
| Cron Job Success Rate | > 99% | Check logs |
| Kafka Message Success | > 99% | Monitor Kafka |
| Database Connection Pool | < 80% used | Database monitoring |
| Error Rate | < 0.1% | Application logs |
| Memory Usage | Stable (no leaks) | Process monitor |

---

## 📝 Next Steps

1. ✅ Complete all testing steps above
2. ✅ Fix any issues found
3. ✅ Update mobile app configuration
4. ✅ Deploy to staging
5. ✅ Run full regression test suite
6. ✅ Deploy to production
7. ✅ Monitor for 24 hours
8. ✅ Shut down old mt5-rest-api service

---

**Document Maintained By:** Arshad Shaheen  
**Last Updated:** October 23, 2025

