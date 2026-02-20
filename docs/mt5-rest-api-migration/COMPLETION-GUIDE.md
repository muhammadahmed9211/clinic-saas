# Migration Completion Guide

**Migrated by:** Arshad Shaheen  
**Date:** October 23, 2025  
**Status:** 75% Complete - Final Steps Required

---

## ✅ Successfully Migrated (75% Complete)

### Completed Modules
1. ✅ **Market Insights Module** (100%)
   - All files migrated with attribution
   - Import paths updated
   - Location: `rest-api/src/mt5-manager/market/insights/`

2. ✅ **Market Info Module** (100%)
   - All files migrated with attribution
   - Import paths updated
   - Kafka/Redis imports corrected
   - Location: `rest-api/src/mt5-manager/market/info/`

3. ✅ **Market Interfaces** (100%)
   - symbol-info.interface.ts migrated
   - Location: `rest-api/src/mt5-manager/market/interfaces/`

4. 🟡 **Price History Module** (80%)
   - ✅ DTOs migrated
   - ✅ Config files migrated
   - ✅ Enum migrated
   - ✅ Module migrated
   - ⏳ Controller needs migration
   - ⏳ Service needs migration

---

## 🔄 Remaining Work (25%)

### Priority 1: Complete Price History Module

#### Step 1: Copy price-history.controller.ts
```bash
# Source: mt5-rest-api/src/modules/price-history/price-history.controller.ts
# Destination: rest-api/src/mt5-manager/price-history/price-history.controller.ts
```

**Required Changes:**
```typescript
// Add at top of file:
/**
 * Price History Controller
 * Migrated by: Arshad Shaheen
 * Date: October 23, 2025
 * 
 * Import Updates:
 * - AllConfigType: src/config/config.types → src/config/config.type
 */

// Update imports:
import { AllConfigType } from 'src/config/config.type';  // Changed from config.types
```

#### Step 2: Copy price-history.service.ts
```bash
# Source: mt5-rest-api/src/modules/price-history/price-history.service.ts
# Destination: rest-api/src/mt5-manager/price-history/price-history.service.ts
```

**Required Changes:**
```typescript
// Add at top of file:
/**
 * Price History Service
 * Migrated by: Arshad Shaheen
 * Date: October 23, 2025
 * 
 * Import Updates:
 * - AllConfigType: src/config/config.types → src/config/config.type
 * - KafkaService: ../kafka/kafka.service → src/kafka/kafka.service
 * - RedisCoreService: ../redis/redis.service → src/redis/redis.service
 * - Symbol: Remove local import (use TypeORM injection)
 */

// Update these imports:
import { AllConfigType } from 'src/config/config.type';
import { KafkaService } from 'src/kafka/kafka.service';
import { RedisCoreService } from 'src/redis/redis.service';
// Remove: import { Symbol } from ... (TypeORM handles this)
```

---

### Priority 2: Migrate Symbols Module (Largest)

This is the **most critical module** with write operations that need JWT security.

#### Files to Migrate:

**1. symbols.controller.ts** ⚠️ **CRITICAL - Needs JWT Guards**
```bash
# Source: mt5-rest-api/src/modules/symbols/symbols.controller.ts
# Destination: rest-api/src/mt5-manager/symbols/symbols.controller.ts
```

**Required Changes:**
```typescript
// Add at top:
/**
 * Symbols Controller
 * Migrated by: Arshad Shaheen
 * Date: October 23, 2025
 * 
 * SECURITY: Added JWT authentication to write endpoints
 */

// Add these imports:
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

// ADD JWT GUARDS to these endpoints:
@Post('get-open-price')
@UseGuards(AuthGuard('jwt'))  // ⚠️ ADD THIS
@ApiBearerAuth()              // ⚠️ ADD THIS
@HttpCode(HttpStatus.OK)
async updateSymbols(@Body() body: { symbolCode: string; path?: string }) {
  // ...existing code...
}

@Post('update')
@UseGuards(AuthGuard('jwt'))  // ⚠️ ADD THIS
@ApiBearerAuth()              // ⚠️ ADD THIS
@HttpCode(HttpStatus.OK)
async updateSymbolsCron() {
  // ...existing code...
}
```

**2. symbols.service.ts**
```bash
# Source: mt5-rest-api/src/modules/symbols/symbols.service.ts
# Destination: rest-api/src/mt5-manager/symbols/symbols.service.ts
```

**Required Changes:**
```typescript
// Add at top:
/**
 * Symbols Service
 * Migrated by: Arshad Shaheen
 * Date: October 23, 2025
 * 
 * Import Updates - ALL OF THESE ARE CRITICAL:
 * - AllConfigType: src/config/config.types → src/config/config.type
 * - User: ./entities/user.entity → src/users/entities/user.entity
 * - Symbol: ./entities/symbol.entity → src/mt5/entities/mt5-symbol.entity
 * - FavouriteSymbol: ./entities/favourite-symbol.entity → src/mt5/entities/mt5-favourite-symbol.entity
 * - PopularSymbol: ./entities/popular-symbol.entity → src/mt5/entities/mt5-popular-symbol.entity
 * - KafkaService: ../kafka/kafka.service → src/kafka/kafka.service
 * - RedisCoreService: ../redis/redis.service → src/redis/redis.service
 * - PriceTopics: ../price-history/price.topics.enum → src/mt5-manager/price-history/price.topics.enum
 * - convertToTimestamp: src/common/helper → src/common/helper (verify exists)
 */

// Update ALL imports according to the list above
```

**3. symbols.module.ts**
```bash
# Source: mt5-rest-api/src/modules/symbols/symbols.module.ts
# Destination: rest-api/src/mt5-manager/symbols/symbols.module.ts
```

**Required Changes:**
```typescript
// Add at top:
/**
 * Symbols Module
 * Migrated by: Arshad Shaheen
 * Date: October 23, 2025
 * 
 * Import Updates:
 * - KafkaModule: ../kafka → src/kafka
 * - RedisCoreModule: ../redis → src/redis
 * - Symbol: ./entities → src/mt5/entities/mt5-symbol.entity
 * - FavouriteSymbol: ./entities → src/mt5/entities/mt5-favourite-symbol.entity
 * - User: ./entities/user.entity → src/users/entities/user.entity
 * - PopularSymbol: ./entities → src/mt5/entities/mt5-popular-symbol.entity
 * - AllConfigType: src/config/config.types → src/config/config.type
 */

// Update all entity and module imports
```

**4. DTOs**
```bash
# Source: mt5-rest-api/src/modules/symbols/dtos/get-account-by-login-request.dto.ts
# Destination: rest-api/src/mt5-manager/symbols/dtos/get-account-by-login-request.dto.ts
```

**Add Migration Header:**
```typescript
/**
 * Symbols DTOs
 * Migrated by: Arshad Shaheen
 * Date: October 23, 2025
 */
```

---

### Priority 3: Update Entities

#### 1. Update Symbol Entity
**File:** `rest-api/src/mt5/entities/mt5-symbol.entity.ts`

**Add these columns:**
```typescript
  @Column({ nullable: true })
  contractSize: number;

  @Column({ default: false })
  isTopMover: boolean;

  @OneToMany(() => PopularSymbol, (popularSymbol) => popularSymbol.symbol)
  popularSymbols: PopularSymbol[];

  @Column({ nullable: true })
  multiply: number;

  @Column({ nullable: true, name: 'openingPrice' })
  opening: string;

  @Column({ type: 'timestamp', nullable: true })
  openingPriceUpdatedAt?: Date;

  @Column({ nullable: true })
  minVolume: number;

  @Column({ nullable: true })
  maxVolume: number;

  @Column({ nullable: true })
  stepVolume: number;
```

#### 2. Create PopularSymbol Entity
**File:** `rest-api/src/mt5/entities/mt5-popular-symbol.entity.ts`

**Copy from:** `mt5-rest-api/src/modules/symbols/entities/popular-symbol.entity.ts`

**Add header and update import:**
```typescript
/**
 * Popular Symbol Entity
 * Migrated by: Arshad Shaheen
 * Date: October 23, 2025
 */

import { Symbol } from './mt5-symbol.entity';  // Update this path
```

---

### Priority 4: Copy Database Migrations

#### Migrations to Copy:
```bash
# From: mt5-rest-api/src/database/migrations/
# To: rest-api/src/database/migrations/

1. 1741169875972-addedSymbolTable.ts
2. 1746691436129-mt5popular_symbol.ts
3. 1749643205053-addedMultiplyColumnInSymbolTable.ts
4. 1755768701393-addedOpeningPriceToSymbol.ts
5. 1758270649137-addedMinVolumeToSymbol.ts
6. 1760639223523-addedMaxVolumeAndStepVolumeInSymbol.ts
```

#### IMPORTANT: Rename with New Timestamps!

Generate new timestamps:
```bash
# Get current timestamp in milliseconds
node -e "console.log(Date.now())"
```

Example rename:
```
1741169875972-addedSymbolTable.ts 
→ 1729699200000-addedSymbolTable.ts (use your current timestamp)
```

**Add migration header to each:**
```typescript
/**
 * Migrated by: Arshad Shaheen
 * Date: October 23, 2025
 * Original timestamp: [original]
 */
```

#### Run Migrations:
```bash
cd rest-api
npm run migration:run
```

---

### Priority 5: Update app.module.ts

**File:** `rest-api/src/app.module.ts`

**Add these imports:**
```typescript
// MT5 Manager Modules - Migrated by Arshad Shaheen
import { InsightsModule as MarketInsightsModule } from './mt5-manager/market/insights/insights.module';
import { InfoModule as MarketInfoModule } from './mt5-manager/market/info/info.module';
import { PriceHistoryModule } from './mt5-manager/price-history/price-history.module';
import { SymbolsModule as Mt5SymbolsModule } from './mt5-manager/symbols/symbols.module';
```

**Add to imports array:**
```typescript
@Module({
  imports: [
    // ... existing imports ...
    
    // MT5 Manager Modules
    MarketInsightsModule,
    MarketInfoModule,
    PriceHistoryModule,
    Mt5SymbolsModule,
  ],
})
export class AppModule {}
```

---

### Priority 6: Helper Functions

#### Check if `convertToTimestamp` exists
**File:** `rest-api/src/common/helper.ts`

**If missing, add:**
```typescript
/**
 * Convert ISO string to Unix timestamp
 * Migrated by: Arshad Shaheen
 */
export function convertToTimestamp(isoString: string): string {
  const date = new Date(isoString);
  return Math.floor(date.getTime() / 1000).toString();
}
```

---

## 🧪 Testing Checklist

After completing all migrations:

```bash
# 1. Build the project
npm run build

# If build fails, check:
# - Import paths are correct
# - All entities are properly imported
# - Config types vs config.type naming
# - Kafka/Redis module imports

# 2. Run migrations
npm run migration:run

# 3. Start development server
npm run start:dev

# 4. Test endpoints (examples)
curl http://localhost:3000/insights/currency/EURUSD
curl http://localhost:3000/info/market-status/EURUSD
curl http://localhost:3000/history?symbol=EURUSD&from=1729000000&to=1729100000
curl http://localhost:3000/symbols/category/Forex

# 5. Test secured endpoints (need JWT token)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -X POST http://localhost:3000/symbols/update
```

---

## 📊 Progress Tracker

| Task | Status | Priority | Est. Time |
|------|--------|----------|-----------|
| Market Insights Module | ✅ Done | HIGH | - |
| Market Info Module | ✅ Done | HIGH | - |
| Price History Controller | ⏳ Pending | HIGH | 15 min |
| Price History Service | ⏳ Pending | HIGH | 15 min |
| Symbols Module (4 files) | ⏳ Pending | **CRITICAL** | 2 hours |
| Update Symbol Entity | ⏳ Pending | HIGH | 30 min |
| Create PopularSymbol Entity | ⏳ Pending | HIGH | 15 min |
| Copy & Rename Migrations | ⏳ Pending | HIGH | 30 min |
| Run Migrations | ⏳ Pending | HIGH | 5 min |
| Update app.module.ts | ⏳ Pending | MEDIUM | 15 min |
| Test Build | ⏳ Pending | HIGH | 30 min |
| Test Endpoints | ⏳ Pending | HIGH | 1 hour |
| **TOTAL REMAINING** | **25%** | | **~5-6 hours** |

---

## 🚨 Critical Warnings

1. **DO NOT skip JWT guards** on symbols POST endpoints - security vulnerability!
2. **DO NOT copy migrations without renaming** timestamps - will fail!
3. **DO NOT forget to update Symbol entity** - queries will fail!
4. **VERIFY `convertToTimestamp` exists** in rest-api before testing!
5. **TEST incrementally** - build after each module to catch import errors early!

---

## 📁 Quick Reference

### Files Completed (✅)
```
rest-api/src/mt5-manager/
├── market/
│   ├── insights/
│   │   ├── dtos/insights.dto.ts ✅
│   │   ├── insights.controller.ts ✅
│   │   ├── insights.service.ts ✅
│   │   └── insights.module.ts ✅
│   ├── info/
│   │   ├── info.controller.ts ✅
│   │   ├── info.service.ts ✅
│   │   └── info.module.ts ✅
│   └── interfaces/
│       └── symbol-info.interface.ts ✅
└── price-history/
    ├── config/
    │   ├── price-history.config.ts ✅
    │   └── price-history.config-type.ts ✅
    ├── dto/
    │   └── get-price.dto.ts ✅
    ├── price.topics.enum.ts ✅
    └── price-history.module.ts ✅
```

### Files Pending (⏳)
```
rest-api/src/mt5-manager/
├── price-history/
│   ├── price-history.controller.ts ⏳
│   └── price-history.service.ts ⏳
└── symbols/
    ├── dtos/
    │   └── get-account-by-login-request.dto.ts ⏳
    ├── symbols.controller.ts ⏳ (NEEDS JWT GUARDS!)
    ├── symbols.service.ts ⏳
    └── symbols.module.ts ⏳
```

---

## 🎯 Next Steps (Do This Now)

1. **Copy price-history.controller.ts** - 15 minutes
2. **Copy price-history.service.ts** - 15 minutes
3. **Copy symbols module (4 files)** - 2 hours
4. **Update entities** - 45 minutes
5. **Copy migrations with new timestamps** - 30 minutes
6. **Update app.module.ts** - 15 minutes
7. **Build and test** - 1.5 hours

**Total Time:** ~5-6 hours to complete

---

## ✅ Final Verification

Before marking complete:

- [ ] All files have "Migrated by: Arshad Shaheen" header
- [ ] All import paths updated (no `../kafka/`, `config.types`, etc.)
- [ ] JWT guards added to POST endpoints in symbols controller
- [ ] Symbol entity has 8 new columns
- [ ] PopularSymbol entity created
- [ ] 6 migrations copied with new timestamps
- [ ] Migrations ran successfully
- [ ] app.module.ts imports all 4 modules
- [ ] `npm run build` succeeds
- [ ] All endpoints tested
- [ ] Mobile app URL updated

---

**Migration Status:** 75% Complete  
**Started:** October 23, 2025  
**Last Updated:** October 23, 2025  
**Completed By:** _[To be filled upon completion]_

