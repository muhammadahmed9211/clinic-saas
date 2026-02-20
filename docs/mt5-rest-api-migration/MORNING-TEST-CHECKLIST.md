# Morning Testing Checklist

**Created:** October 23, 2025  
**Status:** Ready for Testing  
**Fixed:** API versioning added to all migrated controllers ✅

---

## 🔧 What Was Fixed (Oct 23, 2025 - Evening)

**Issue:** 404 errors on all endpoints  
**Root Cause:** Missing `version: '1'` in controller decorators  
**Solution:** Updated all 4 migrated controllers to include API versioning  
**Build Status:** ✅ Successful (0 errors)

---

## ⚡ Quick Morning Test (10 minutes)

### Step 1: Start the Server
```powershell
cd c:\10-Projects\gateso\rest-api
npm run start:dev
```

Wait for:
- ✅ "Nest application successfully started"
- ✅ "Kafka client connected"
- ✅ "Redis connected"
- ✅ "Running symbol update cron job" (every 20 seconds)

### Step 2: Test Core Endpoints

**Test 1: Symbols Endpoint**
```powershell
curl http://localhost:3001/api/v1/symbols
```
Expected: `200 OK` with JSON array of symbols

**Test 2: Price History**
```powershell
curl "http://localhost:3001/api/v1/price-history?symbol=EURUSD&timeframe=M1&from=2025-10-01&to=2025-10-23"
```
Expected: `200 OK` with historical price data

**Test 3: Market Info**
```powershell
curl "http://localhost:3001/api/v1/market/info/market-status/1"
```
Expected: `200 OK` with market status

**Test 4: Market Insights**
```powershell
curl "http://localhost:3001/api/v1/market/insights/currency/EURUSD"
```
Expected: `200 OK` with trading insights

### Step 3: Verify Cron Job

Watch console logs for ~1 minute. You should see every 20 seconds:
```
Running symbol update cron job
Updating symbols from MT5
Successfully updated X symbols
```

### Step 4: Quick Database Check

```sql
-- Check if symbols are being updated
SELECT TOP 5 symbolCode, bid, ask, updatedAt 
FROM symbol 
ORDER BY updatedAt DESC;
```

The `updatedAt` should be very recent (within last 20 seconds).

---

## ✅ Success Criteria

If all these pass, the migration is working:

- [ ] Server starts without errors
- [ ] Cron job runs every 20 seconds
- [ ] `/api/v1/symbols` returns 200
- [ ] `/api/v1/price-history` returns 200
- [ ] `/api/v1/market/info/*` returns 200
- [ ] `/api/v1/market/insights/*` returns 200
- [ ] Database `symbol` table is updating automatically
- [ ] No errors in console logs

---

## 📝 All Available Endpoints

### Symbols Module
```
GET  /api/v1/symbols
GET  /api/v1/symbols/path/:path
GET  /api/v1/symbols/top-movers
GET  /api/v1/symbols/popular
POST /api/v1/symbols/get-open-price       (🔒 Requires JWT)
POST /api/v1/symbols/update               (🔒 Requires JWT)
```

### Price History Module
```
GET  /api/v1/price-history
     Query params: symbol, timeframe, from, to, login (optional)
```

### Market Info Module
```
GET  /api/v1/market/info/market-status/:symbolId
GET  /api/v1/market/info/product-specification/:symbolId
GET  /api/v1/market/info/swap-rates/:symbolId
GET  /api/v1/market/info/session-quotes/:symbolId
GET  /api/v1/market/info/margin/:symbolId
GET  /api/v1/market/info/live-analytics/:symbolId
```

### Market Insights Module
```
GET  /api/v1/market/insights/currency/:symbol
GET  /api/v1/market/insights/sentiment/:symbol
GET  /api/v1/market/insights/pivot-points/:symbol
GET  /api/v1/market/insights/general/:symbol
GET  /api/v1/market/insights/symbols
```

---

## 🐛 If Something Fails

### Issue: Server won't start
**Check:**
1. Kafka is running (port 9092)
2. Redis is running (port 6379)
3. Database is accessible
4. Environment variables in `.env-development`

### Issue: 404 on endpoints
**Check:**
1. Using correct URL: `http://localhost:3001/api/v1/...`
2. Port 3001 is correct in `.env-development`
3. Server logs show no errors

### Issue: Cron job not running
**Check:**
1. Look for "Running symbol update cron job" in logs
2. Verify `ScheduleModule.forRoot()` is in `app.module.ts`
3. Check Kafka connection to mt5-manager-microservice

### Issue: Kafka errors
**Check:**
1. `mt5-manager-microservice` is running
2. Kafka broker is accessible
3. `KAFKA_BROKER` env var is correct

---

## 📊 Next Steps After Testing

### If All Tests Pass ✅
1. Run database migrations (if not done): `npm run migration:run`
2. Test with mobile app (update URL to point to rest-api)
3. Deploy to staging environment
4. Monitor for 24 hours
5. Shutdown old `mt5-rest-api` service

### If Tests Fail ❌
1. Check [Troubleshooting Guide](./03-TESTING-GUIDE.md#-troubleshooting)
2. Review error logs
3. Verify environment configuration
4. Check service dependencies (Kafka, Redis, Database, MT5 Manager)

---

## 📞 Documentation References

- **Quick Testing:** [TESTING-SUMMARY.md](./TESTING-SUMMARY.md)
- **Detailed Testing:** [03-TESTING-GUIDE.md](./03-TESTING-GUIDE.md)
- **Migration Overview:** [00-migration-overview.md](./00-migration-overview.md)
- **Troubleshooting:** [03-TESTING-GUIDE.md#-troubleshooting](./03-TESTING-GUIDE.md#-troubleshooting)

---

## 💡 Tips

1. **Keep terminal open** to watch cron job logs
2. **Use Postman/Insomnia** for easier endpoint testing
3. **Monitor Redis** with `redis-cli MONITOR` to see caching
4. **Check database** periodically to verify symbol updates
5. **Test one module at a time** - Symbols → Price → Info → Insights

---

**Last Updated:** October 23, 2025  
**Next Action:** Morning testing session  
**Expected Duration:** 10-30 minutes

Good luck with testing! 🚀

