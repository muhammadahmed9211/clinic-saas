# Import Path Changes Reference

Complete list of all import path transformations during migration.

---

## 🔄 Global Import Patterns

### Pattern 1: Config Types
**Before:**
```typescript
import { AllConfigType } from 'src/config/config.types';
```

**After:**
```typescript
import { AllConfigType } from 'src/config/config.type';
```

**Affected Files:** All service and module files

---

### Pattern 2: User Entity
**Before:**
```typescript
import { User } from './entities/user.entity';
import { User } from '../symbols/entities/user.entity';
```

**After:**
```typescript
import { User } from 'src/users/entities/user.entity';
```

**Affected Files:** symbols.service.ts, favourite-symbol.entity.ts

---

### Pattern 3: Symbol Entity
**Before:**
```typescript
import { Symbol } from './entities/symbol.entity';
import { Symbol } from '../symbols/entities/symbol.entity';
```

**After:**
```typescript
import { Symbol } from 'src/mt5/entities/mt5-symbol.entity';
```

**Affected Files:** All files using Symbol entity

---

### Pattern 4: Kafka Service
**Before:**
```typescript
import { KafkaService } from '../kafka/kafka.service';
import { KafkaService } from 'src/modules/kafka/kafka.service';
```

**After:**
```typescript
import { KafkaService } from 'src/kafka/kafka.service';
```

**Affected Files:** symbols.service.ts, price-history.service.ts, info.service.ts

---

### Pattern 5: Redis Service
**Before:**
```typescript
import { RedisCoreService } from '../redis/redis.service';
import { RedisCoreService } from 'src/modules/redis/redis.service';
```

**After:**
```typescript
import { RedisCoreService } from 'src/redis/redis.service';
```

**Affected Files:** symbols.service.ts, price-history.service.ts, info.service.ts

---

### Pattern 6: Helper Functions
**Before:**
```typescript
import { convertToTimestamp } from 'src/common/helper';
```

**After:**
```typescript
import { convertToTimestamp } from 'src/common/helper';
```

**Status:** ✅ No change needed (function should exist in rest-api)

---

### Pattern 7: Response Interfaces
**Before:**
```typescript
import { ResponseWrapper } from 'src/common/interfaces/base-response.interface';
```

**After:**
```typescript
import { ResponseWrapper } from 'src/common/interfaces/base-response.interface';
```

**Status:** ⚠️ Check if exists in rest-api, add if missing

---

### Pattern 8: Interceptors
**Before:**
```typescript
import { RouteCacheInterceptor } from 'src/common/interceptors/route-cache.interceptor';
import { MobileAppResponsesInterceptor } from 'src/common/interceptors/mobile-app-responses.interceptor';
```

**After:**
```typescript
import { RouteCacheInterceptor } from 'src/common/interceptors/route-cache.interceptor';
import { MobileAppResponsesInterceptor } from 'src/common/interceptors/mobile-app-responses.interceptor';
```

**Status:** ⚠️ Check if exists in rest-api, add if missing

---

## 📁 Module-Specific Changes

### Symbols Module

**symbols.controller.ts:**
```typescript
// ❌ Remove
import { KafkaService } from '../kafka/kafka.service';

// ✅ Add (if needed)
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
```

**symbols.service.ts:**
```typescript
// ❌ Remove
import { AllConfigType } from 'src/config/config.types';
import { User } from './entities/user.entity';
import { Symbol } from './entities/symbol.entity';
import { FavouriteSymbol } from './entities/favourite-symbol.entity';
import { PopularSymbol } from './entities/popular-symbol.entity';
import { KafkaService } from '../kafka/kafka.service';
import { RedisCoreService } from '../redis/redis.service';
import { PriceTopics } from '../price-history/price.topics.enum';

// ✅ Replace with
import { AllConfigType } from 'src/config/config.type';
import { User } from 'src/users/entities/user.entity';
import { Symbol } from 'src/mt5/entities/mt5-symbol.entity';
import { FavouriteSymbol } from 'src/mt5/entities/mt5-favourite-symbol.entity';
import { PopularSymbol } from 'src/mt5/entities/mt5-popular-symbol.entity';
import { KafkaService } from 'src/kafka/kafka.service';
import { RedisCoreService } from 'src/redis/redis.service';
import { PriceTopics } from 'src/mt5-manager/price-history/price.topics.enum';
```

**symbols.module.ts:**
```typescript
// ❌ Remove
import { KafkaModule } from '../kafka/kafka.module';
import { RedisCoreModule } from '../redis/redis.module';
import { Symbol } from './entities/symbol.entity';
import { FavouriteSymbol } from './entities/favourite-symbol.entity';
import { User } from './entities/user.entity';
import { PopularSymbol } from './entities/popular-symbol.entity';

// ✅ Replace with
import { KafkaModule } from 'src/kafka/kafka.module';
import { RedisCoreModule } from 'src/redis/redis.module';
import { Symbol } from 'src/mt5/entities/mt5-symbol.entity';
import { FavouriteSymbol } from 'src/mt5/entities/mt5-favourite-symbol.entity';
import { User } from 'src/users/entities/user.entity';
import { PopularSymbol } from 'src/mt5/entities/mt5-popular-symbol.entity';
```

---

### Price History Module

**price-history.controller.ts:**
```typescript
// ❌ Remove
import { AllConfigType } from 'src/config/config.types';

// ✅ Replace with
import { AllConfigType } from 'src/config/config.type';
```

**price-history.service.ts:**
```typescript
// ❌ Remove
import { AllConfigType } from 'src/config/config.types';
import { KafkaService } from '../kafka/kafka.service';
import { RedisCoreService } from '../redis/redis.service';

// ✅ Replace with
import { AllConfigType } from 'src/config/config.type';
import { KafkaService } from 'src/kafka/kafka.service';
import { RedisCoreService } from 'src/redis/redis.service';
```

**price-history.module.ts:**
```typescript
// ❌ Remove
import { KafkaModule } from '../kafka/kafka.module';
import { RedisCoreModule } from '../redis/redis.module';
import { Symbol } from '../symbols/entities/symbol.entity';

// ✅ Replace with
import { KafkaModule } from 'src/kafka/kafka.module';
import { RedisCoreModule } from 'src/redis/redis.module';
import { Symbol } from 'src/mt5/entities/mt5-symbol.entity';
```

---

### Market Info Module

**info.service.ts:**
```typescript
// ❌ Remove
import { KafkaService } from 'src/modules/kafka/kafka.service';
import { PriceTopics } from 'src/modules/price-history/price.topics.enum';
import { RedisCoreService } from 'src/modules/redis/redis.service';

// ✅ Replace with
import { KafkaService } from 'src/kafka/kafka.service';
import { PriceTopics } from 'src/mt5-manager/price-history/price.topics.enum';
import { RedisCoreService } from 'src/redis/redis.service';
```

---

### Market Insights Module

**insights.controller.ts:**
```typescript
// No import changes needed (pure service)
```

**insights.service.ts:**
```typescript
// No import changes needed (pure service with mock data)
```

---

## 🔧 Entity Import Updates

### favourite-symbol.entity.ts
**Before:**
```typescript
import { User } from './user.entity';
import { Symbol } from './symbol.entity';
```

**After:**
```typescript
import { User } from 'src/users/entities/user.entity';
import { Symbol } from './mt5-symbol.entity'; // Relative path in same folder
```

---

### popular-symbol.entity.ts
**Before:**
```typescript
import { Symbol } from './symbol.entity';
```

**After:**
```typescript
import { Symbol } from './mt5-symbol.entity'; // Relative path in same folder
```

---

## 📦 Module Registration (app.module.ts)

**Add these imports:**
```typescript
import { SymbolsModule as Mt5SymbolsModule } from './mt5-manager/symbols/symbols.module';
import { PriceHistoryModule } from './mt5-manager/price-history/price-history.module';
import { InfoModule as MarketInfoModule } from './mt5-manager/market/info/info.module';
import { InsightsModule as MarketInsightsModule } from './mt5-manager/market/insights/insights.module';
```

**Add to imports array:**
```typescript
@Module({
  imports: [
    // ... existing imports ...
    Mt5SymbolsModule,
    PriceHistoryModule,
    MarketInfoModule,
    MarketInsightsModule,
  ],
})
export class AppModule {}
```

---

## 🧪 Import Validation Checklist

After making changes, verify:

- [ ] All `config.types` changed to `config.type`
- [ ] All User imports point to `src/users/entities/user.entity`
- [ ] All Symbol imports point to `src/mt5/entities/mt5-symbol.entity`
- [ ] All Kafka imports point to `src/kafka/kafka.service`
- [ ] All Redis imports point to `src/redis/redis.service`
- [ ] No imports reference `../kafka/` or `../redis/`
- [ ] No imports reference `src/modules/kafka/` or `src/modules/redis/`
- [ ] PriceTopics imported from `src/mt5-manager/price-history/`
- [ ] All relative imports within mt5-manager use correct paths
- [ ] TypeScript compilation succeeds with no import errors

---

## 🔍 Quick Search & Replace

Use these patterns for IDE find & replace:

| Find | Replace |
|------|---------|
| `src/config/config.types` | `src/config/config.type` |
| `'../kafka/kafka.service'` | `'src/kafka/kafka.service'` |
| `'../redis/redis.service'` | `'src/redis/redis.service'` |
| `'./entities/user.entity'` | `'src/users/entities/user.entity'` |
| `'./entities/symbol.entity'` | `'src/mt5/entities/mt5-symbol.entity'` |
| `'src/modules/kafka/` | `'src/kafka/` |
| `'src/modules/redis/` | `'src/redis/` |

**⚠️ Warning:** Use these carefully - some files may have correct paths already!

