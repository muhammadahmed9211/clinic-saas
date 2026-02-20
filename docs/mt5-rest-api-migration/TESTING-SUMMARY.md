# Testing Summary - Quick Reference

**For:** MT5-REST-API Migration  
**Created:** October 23, 2025  
**By:** Arshad Shaheen

> 💡 **Full Testing Guide:** See [03-TESTING-GUIDE.md](./03-TESTING-GUIDE.md) for detailed step-by-step instructions.

---

## ✅ Quick Testing Checklist

### Phase 1: Pre-Testing (5 minutes)
- [ ] ✅ Code compiles: `npm run build` (already done - SUCCESS!)
- [ ] Install dependencies: `npm install`
- [ ] Check environment variables in `.env-development`
- [ ] Verify MT5 Manager microservice is running
- [ ] Verify Kafka is running (port 9092)
- [ ] Verify Redis is running (port 6379)

### Phase 2: Database (10 minutes)
- [ ] Run migrations: `npm run migration:run`
- [ ] Verify 6 new migrations applied
- [ ] Check `symbol` table has new columns
- [ ] Check `popular_symbol` table exists

### Phase 3: Service Startup (5 minutes)
- [ ] Start service: `npm run start:dev`
- [ ] Watch logs for successful module initialization
- [ ] Verify cron job starts (logs every 20 seconds)
- [ ] Verify Kafka connection successful
- [ ] Verify Redis connection successful

### Phase 4: Endpoint Testing (30 minutes)

**Read-Only Endpoints (No Auth Required):**
- [ ] `GET /api/v1/symbols` - Returns symbol list
- [ ] `GET /api/v1/symbols/top-movers` - Returns top movers
- [ ] `GET /api/v1/symbols/popular` - Returns popular symbols
- [ ] `GET /api/v1/price-history?symbol=EURUSD&timeframe=M1&from=2025-10-01&to=2025-10-23`
- [ ] `GET /api/v1/market/info?symbol=EURUSD`
- [ ] `GET /api/v1/market/insights?type=summary`

**Write Endpoints (JWT Auth Required):**
- [ ] `POST /api/v1/symbols/get-open-price` - Returns 401 without JWT
- [ ] `POST /api/v1/symbols/get-open-price` - Returns 200 with JWT
- [ ] `POST /api/v1/symbols/update` - Returns 401 without JWT
- [ ] `POST /api/v1/symbols/update` - Returns 200 with JWT

### Phase 5: Background Jobs (10 minutes)
- [ ] Cron job runs every 20 seconds
- [ ] Logs show "Running symbol update cron job"
- [ ] Logs show "Successfully updated X symbols"
- [ ] Database `symbol` table updates confirmed
- [ ] No errors in cron job execution

### Phase 6: Integration Testing (20 minutes)
- [ ] **Kafka:** Messages sent to mt5-manager-microservice
- [ ] **Kafka:** Responses received from mt5-manager-microservice
- [ ] **Redis:** Cache working (second request faster)
- [ ] **Redis:** Cache keys visible in `redis-cli`

### Phase 7: Performance Testing (15 minutes)
- [ ] Response time < 200ms for `/symbols`
- [ ] Response time < 1000ms for `/price-history` (no cache)
- [ ] Response time < 50ms for `/price-history` (cached)
- [ ] Memory usage stable after 10 minutes
- [ ] No memory leaks

### Phase 8: Mobile App Testing (30 minutes)
- [ ] Update mobile app URL to new endpoint
- [ ] Symbol list loads
- [ ] Charts display correctly
- [ ] Real-time prices update
- [ ] No authentication errors
- [ ] Response structure unchanged

---

## 🚨 Critical Tests (Must Pass)

These are the most important tests - if any fail, do NOT deploy:

1. ✅ **Build Success** - Zero compilation errors (DONE ✓)
2. ⚠️ **Migration Success** - All 6 migrations apply cleanly
3. ⚠️ **Service Starts** - No errors on startup
4. ⚠️ **Endpoints Respond** - All endpoints return 200 (or 401 where expected)
5. ⚠️ **Cron Job Works** - Symbol updates run automatically
6. ⚠️ **Kafka Works** - Communication with mt5-manager-microservice successful
7. ⚠️ **Auth Works** - Write endpoints require JWT
8. ⚠️ **Mobile Compatible** - Mobile app can connect and function

---

## 🧪 Quick Test Commands

### Test All Read-Only Endpoints
```powershell
# Symbols
curl http://localhost:3001/api/v1/symbols

# Top Movers
curl http://localhost:3001/api/v1/symbols/top-movers

# Popular
curl http://localhost:3001/api/v1/symbols/popular

# Price History
curl "http://localhost:3001/api/v1/price-history?symbol=EURUSD&timeframe=M1&from=2025-10-01&to=2025-10-23"

# Market Info
curl "http://localhost:3001/api/v1/market/info?symbol=EURUSD"

# Market Insights
curl "http://localhost:3001/api/v1/market/insights?type=summary"
```

### Test Authentication (Get JWT Token)
```powershell
# Login to get JWT
$response = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/email/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"email":"admin@example.com","password":"secret"}'
$token = $response.token

# Test write endpoint with JWT
curl -X POST http://localhost:3001/api/v1/symbols/update -H "Authorization: Bearer $token"
```

### Monitor Cron Job
```powershell
# Watch logs for cron job
npm run start:dev
# Look for "Running symbol update cron job" every 20 seconds
```

### Check Redis Cache
```bash
redis-cli
> KEYS *price-history*
> TTL price-history:...
> MONITOR
```

### Check Database Updates
```sql
-- Check if symbols are being updated
SELECT TOP 10 symbolCode, bid, ask, updatedAt 
FROM symbol 
ORDER BY updatedAt DESC;

-- Check popular symbols
SELECT COUNT(*) FROM popular_symbol;
```

---

## 📊 Expected Results

### Successful Migration Indicators

✅ **Console Output:**
```
✔ Nest application successfully started
✔ Kafka client connected successfully
✔ Redis connected successfully
✔ Running symbol update cron job
✔ Successfully updated 50 symbols
```

✅ **API Responses (200 OK):**
```json
{
  "status": "success",
  "statusCode": 200,
  "message": "OK",
  "result": [...]
}
```

✅ **Database:**
- 6 new migrations in `migrations` table
- New columns in `symbol` table populated
- `popular_symbol` table has data

✅ **Performance:**
- API response time < 200ms (average)
- Cache hit rate > 70%
- Memory usage stable
- No errors in logs

---

## ❌ Common Issues & Quick Fixes

### Issue: "Cannot find module '@nestjs/schedule'"
**Fix:** `npm install`

### Issue: "priceHistory config not found"
**Fix:** Already resolved - config is registered in `app.module.ts`

### Issue: Cron job not running
**Fix:** Verify `ScheduleModule.forRoot()` in `app.module.ts` (already added)

### Issue: Kafka connection timeout
**Fix:** 
1. Check Kafka is running: `netstat -an | findstr 9092`
2. Verify MT5 Manager microservice is running
3. Check `KAFKA_BROKER` in `.env`

### Issue: 401 on read-only endpoints
**Fix:** Remove `@UseGuards(AuthGuard('jwt'))` from the endpoint (already done - only on write endpoints)

---

## 🎯 Testing Priorities

**Priority 1 (Must Test First):**
1. Database migrations
2. Service startup
3. Basic endpoint connectivity

**Priority 2 (Core Functionality):**
4. All read-only endpoints
5. Authentication on write endpoints
6. Cron job execution

**Priority 3 (Integration):**
7. Kafka communication
8. Redis caching
9. Performance benchmarks

**Priority 4 (Pre-Production):**
10. Mobile app compatibility
11. Regression testing
12. Load testing

---

## 📝 Next Steps After Testing

1. ✅ All tests pass? → Proceed to staging deployment
2. ❌ Any test fails? → Check [Troubleshooting Guide](./03-TESTING-GUIDE.md#-troubleshooting)
3. ✅ Staging validated? → Update mobile app URL
4. ✅ Mobile app works? → Deploy to production
5. ✅ Production stable for 24 hours? → Shutdown old `mt5-rest-api` service

---

## 📞 Get Help

**For detailed testing instructions:** [03-TESTING-GUIDE.md](./03-TESTING-GUIDE.md)

**For troubleshooting:** [03-TESTING-GUIDE.md#-troubleshooting](./03-TESTING-GUIDE.md#-troubleshooting)

**For deployment:** [00-migration-overview.md#-deployment-steps](./00-migration-overview.md#-deployment-steps)

---

**Total Estimated Testing Time:** ~2 hours  
**Minimum Required Testing Time:** ~30 minutes (Critical tests only)

---

**Created by:** Arshad Shaheen  
**Last Updated:** October 23, 2025

