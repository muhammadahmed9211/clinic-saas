# MT5 Public Routes Migration - Frontend Update Required

## Overview
All public routes in the MT5 and MT5-Manager controllers have been updated to include a `/public` prefix in their paths, following the same convention as `/admin` and `/client` routes. This change requires frontend developers to update their API endpoint calls.

## Changes Summary

### 1. MT5 Price Controller (`/v1/mt5/price` → `/v1/public/mt5/price`)

**All price-related public endpoints now use `/public/mt5/price` prefix:**

| Old Endpoint | New Endpoint | Method | Description |
|-------------|--------------|--------|-------------|
| `/v1/mt5/price` | `/v1/public/mt5/price` | GET | Get price for symbols |
| `/v1/mt5/price/quotes` | `/v1/public/mt5/price/quotes` | GET | Get quotes for a symbol |
| `/v1/mt5/price/group-quotes` | `/v1/public/mt5/price/group-quotes` | GET | Get quotes for a symbol group |
| `/v1/mt5/price/statistics` | `/v1/public/mt5/price/statistics` | GET | Get symbol statistics |
| `/v1/mt5/price/tick-history` | `/v1/public/mt5/price/tick-history` | GET | Get tick history for a symbol |
| `/v1/mt5/price/chart-history` | `/v1/public/mt5/price/chart-history` | GET | Get chart tick history |
| `/v1/mt5/price/market-depth` | `/v1/public/mt5/price/market-depth` | GET | Get market depth for a symbol |

**Note:** The endpoint `/v1/mt5/price/mark-unmark-favourite-symbol` remains unchanged as it requires authentication.

### 2. Price History Controller (`/v1/price-history` → `/v1/public/price-history`)

**All price history public endpoints now use `/public/price-history` prefix:**

| Old Endpoint | New Endpoint | Method | Description |
|-------------|--------------|--------|-------------|
| `/v1/price-history/history` | `/v1/public/price-history/history` | GET | Get price history for symbols |
| `/v1/price-history/symbol_info` | `/v1/public/price-history/symbol_info` | GET | Get graph data for symbols for groups |
| `/v1/price-history/config` | `/v1/public/price-history/config` | GET | Get price history configuration |
| `/v1/price-history/quotes` | `/v1/public/price-history/quotes` | GET | Get quotes for a symbol |
| `/v1/price-history/group-quotes` | `/v1/public/price-history/group-quotes` | GET | Get quotes for a symbol group |
| `/v1/price-history/statistics` | `/v1/public/price-history/statistics` | GET | Get symbol statistics |
| `/v1/price-history/tick-history` | `/v1/public/price-history/tick-history` | GET | Get tick history for a symbol |
| `/v1/price-history/market-depth` | `/v1/public/price-history/market-depth` | GET | Get market depth for a symbol |

### 3. Symbols Controller (`/v1/symbols` → `/v1/public/symbols`)

**All symbols public endpoints now use `/public/symbols` prefix:**

| Old Endpoint | New Endpoint | Method | Description |
|-------------|--------------|--------|-------------|
| `/v1/symbols` | `/v1/public/symbols` | GET | Get all symbols (with optional filters) |
| `/v1/symbols/category/:path` | `/v1/public/symbols/category/:path` | GET | Find symbols by exact path |
| `/v1/symbols/search` | `/v1/public/symbols/search` | GET | Find symbols by category |
| `/v1/symbols/categories` | `/v1/public/symbols/categories` | GET | Get all categories |
| `/v1/symbols/:id` | `/v1/public/symbols/:id` | GET | Find symbol by ID |
| `/v1/symbols/public/category/:path` | `/v1/public/symbols/category/:path` | GET | Find symbols by path, top movers, or popular (route path updated) |

**Note:** The following endpoints remain unchanged as they require authentication:
- `POST /v1/symbols/get-open-price` - Requires JWT token
- `POST /v1/symbols/update` - Requires JWT token

## Action Required

### For Frontend Developers:

1. **Update all API calls** to the affected endpoints listed above
2. **Search your codebase** for references to the old endpoints and replace them with the new paths
3. **Test all affected features** to ensure they work correctly with the new endpoints
4. **Update any API documentation** or API client configurations you maintain

### Example Code Changes

**Before:**
```typescript
// Old endpoints
const priceResponse = await fetch('/v1/mt5/price/quotes?symbol=EURUSD');
const historyResponse = await fetch('/v1/price-history/history?symbol=EURUSD&from=2024-01-01');
const symbolsResponse = await fetch('/v1/symbols?favourite=true');
```

**After:**
```typescript
// New endpoints following admin/client route convention
const priceResponse = await fetch('/v1/public/mt5/price/quotes?symbol=EURUSD');
const historyResponse = await fetch('/v1/public/price-history/history?symbol=EURUSD&from=2024-01-01');
const symbolsResponse = await fetch('/v1/public/symbols?favourite=true');
```

### Search Patterns

Use these search patterns to find all occurrences in your codebase:

**MT5 Price Routes:**
- `/v1/mt5/price` (without `/public` prefix)
- `mt5/price/quotes`
- `mt5/price/group-quotes`
- `mt5/price/statistics`
- `mt5/price/tick-history`
- `mt5/price/chart-history`
- `mt5/price/market-depth`

**Price History Routes:**
- `/v1/price-history` (without `/public` prefix)
- `price-history/history`
- `price-history/symbol_info`
- `price-history/config`
- `price-history/quotes`
- `price-history/group-quotes`
- `price-history/statistics`
- `price-history/tick-history`
- `price-history/market-depth`

**Symbols Routes:**
- `/v1/symbols` (without `/public` prefix, but keep POST endpoints unchanged)
- `symbols/category/`
- `symbols/search`
- `symbols/categories`
- `symbols/public/category/` (this route path has changed)

## Authentication

**Important:** These endpoints remain **public** (no authentication required). The `/public` prefix follows the same convention as `/admin` and `/client` routes in the API structure, making it clear these are public endpoints. No authentication tokens or headers are required for these endpoints.

**Protected Endpoints (No Changes):**
- `POST /v1/symbols/get-open-price` - Still requires JWT authentication
- `POST /v1/symbols/update` - Still requires JWT authentication
- `POST /v1/mt5/price/mark-unmark-favourite-symbol` - Still requires JWT authentication

## Migration Checklist

- [ ] Update all MT5 price endpoint calls
- [ ] Update all price history endpoint calls
- [ ] Update all symbols GET endpoint calls
- [ ] Verify symbols POST endpoints are not affected
- [ ] Update API client configurations
- [ ] Update API documentation
- [ ] Test all affected features
- [ ] Update any hardcoded endpoint URLs in configuration files

## Timeline

Please update your frontend code to use the new endpoints as soon as possible. The old endpoints will be deprecated and may be removed in a future release.

## Questions or Issues?

If you encounter any issues or have questions about these changes, please contact the backend team.

---

**Last Updated:** December 2024  
**API Version:** v1  
**Total Endpoints Changed:** 23 public endpoints
