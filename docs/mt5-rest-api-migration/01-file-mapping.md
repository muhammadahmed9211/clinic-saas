# File-by-File Migration Mapping

Complete mapping of all files migrated from `mt5-rest-api` to `rest-api`.

---

## 📋 Symbols Module

### Controllers
| Source | Destination | Changes |
|--------|-------------|---------|
| `mt5-rest-api/src/modules/symbols/symbols.controller.ts` | `rest-api/src/mt5-manager/symbols/symbols.controller.ts` | Added JWT guards to POST endpoints |

### Services
| Source | Destination | Changes |
|--------|-------------|---------|
| `mt5-rest-api/src/modules/symbols/symbols.service.ts` | `rest-api/src/mt5-manager/symbols/symbols.service.ts` | Updated imports, uses rest-api's Kafka/Redis |

### Modules
| Source | Destination | Changes |
|--------|-------------|---------|
| `mt5-rest-api/src/modules/symbols/symbols.module.ts` | `rest-api/src/mt5-manager/symbols/symbols.module.ts` | Removed Kafka module import, uses rest-api's Redis |

### Entities
| Source | Destination | Changes |
|--------|-------------|---------|
| `mt5-rest-api/src/modules/symbols/entities/symbol.entity.ts` | `rest-api/src/mt5/entities/mt5-symbol.entity.ts` | **MERGED** - Added 8 new columns |
| `mt5-rest-api/src/modules/symbols/entities/favourite-symbol.entity.ts` | `rest-api/src/mt5/entities/mt5-favourite-symbol.entity.ts` | **NO CHANGE** - Already identical |
| `mt5-rest-api/src/modules/symbols/entities/popular-symbol.entity.ts` | `rest-api/src/mt5/entities/mt5-popular-symbol.entity.ts` | **NEW** - Created new entity |
| `mt5-rest-api/src/modules/symbols/entities/user.entity.ts` | ❌ **REMOVED** | Uses rest-api's User entity |

### DTOs
| Source | Destination | Changes |
|--------|-------------|---------|
| `mt5-rest-api/src/modules/symbols/dtos/get-account-by-login-request.dto.ts` | `rest-api/src/mt5-manager/symbols/dtos/get-account-by-login-request.dto.ts` | Import paths updated |

---

## 📋 Price History Module

### Controllers
| Source | Destination | Changes |
|--------|-------------|---------|
| `mt5-rest-api/src/modules/price-history/price-history.controller.ts` | `rest-api/src/mt5-manager/price-history/price-history.controller.ts` | Import paths updated |

### Services
| Source | Destination | Changes |
|--------|-------------|---------|
| `mt5-rest-api/src/modules/price-history/price-history.service.ts` | `rest-api/src/mt5-manager/price-history/price-history.service.ts` | Uses rest-api's Kafka/Redis |

### Modules
| Source | Destination | Changes |
|--------|-------------|---------|
| `mt5-rest-api/src/modules/price-history/price-history.module.ts` | `rest-api/src/mt5-manager/price-history/price-history.module.ts` | Removed Kafka module import |

### Config
| Source | Destination | Changes |
|--------|-------------|---------|
| `mt5-rest-api/src/modules/price-history/config/price-history.config.ts` | `rest-api/src/mt5-manager/price-history/config/price-history.config.ts` | Config path updated |
| `mt5-rest-api/src/modules/price-history/config/price-history.config-type.ts` | `rest-api/src/mt5-manager/price-history/config/price-history.config-type.ts` | No changes |

### DTOs
| Source | Destination | Changes |
|--------|-------------|---------|
| `mt5-rest-api/src/modules/price-history/dto/get-price.dto.ts` | `rest-api/src/mt5-manager/price-history/dto/get-price.dto.ts` | No changes |

### Enums
| Source | Destination | Changes |
|--------|-------------|---------|
| `mt5-rest-api/src/modules/price-history/price.topics.enum.ts` | `rest-api/src/mt5-manager/price-history/price.topics.enum.ts` | No changes |

---

## 📋 Market Info Module

### Controllers
| Source | Destination | Changes |
|--------|-------------|---------|
| `mt5-rest-api/src/modules/market/info/info.controller.ts` | `rest-api/src/mt5-manager/market/info/info.controller.ts` | Import paths updated |

### Services
| Source | Destination | Changes |
|--------|-------------|---------|
| `mt5-rest-api/src/modules/market/info/info.service.ts` | `rest-api/src/mt5-manager/market/info/info.service.ts` | Uses rest-api's Kafka/Redis |

### Modules
| Source | Destination | Changes |
|--------|-------------|---------|
| `mt5-rest-api/src/modules/market/info/info.module.ts` | `rest-api/src/mt5-manager/market/info/info.module.ts` | Module imports updated |

---

## 📋 Market Insights Module

### Controllers
| Source | Destination | Changes |
|--------|-------------|---------|
| `mt5-rest-api/src/modules/market/insights/insights.controller.ts` | `rest-api/src/mt5-manager/market/insights/insights.controller.ts` | Import paths updated |

### Services
| Source | Destination | Changes |
|--------|-------------|---------|
| `mt5-rest-api/src/modules/market/insights/insights.service.ts` | `rest-api/src/mt5-manager/market/insights/insights.service.ts` | No changes (pure service) |

### Modules
| Source | Destination | Changes |
|--------|-------------|---------|
| `mt5-rest-api/src/modules/market/insights/insights.module.ts` | `rest-api/src/mt5-manager/market/insights/insights.module.ts` | No changes |

### DTOs
| Source | Destination | Changes |
|--------|-------------|---------|
| `mt5-rest-api/src/modules/market/insights/dtos/insights.dto.ts` | `rest-api/src/mt5-manager/market/insights/dtos/insights.dto.ts` | No changes |

---

## 📋 Shared Interfaces

| Source | Destination | Changes |
|--------|-------------|---------|
| `mt5-rest-api/src/modules/market/interfaces/symbol-info.interface.ts` | `rest-api/src/mt5-manager/market/interfaces/symbol-info.interface.ts` | No changes |

---

## 📋 Common Utilities

| Source | Destination | Changes |
|--------|-------------|---------|
| `mt5-rest-api/src/common/helper.ts` | `rest-api/src/common/helper.ts` | **MERGED** - `convertToTimestamp` function |
| `mt5-rest-api/src/common/interceptors/mobile-app-responses.interceptor.ts` | `rest-api/src/common/interceptors/mobile-app-responses.interceptor.ts` | **CHECK IF EXISTS** |
| `mt5-rest-api/src/common/interceptors/route-cache.interceptor.ts` | `rest-api/src/common/interceptors/route-cache.interceptor.ts` | **CHECK IF EXISTS** |
| `mt5-rest-api/src/common/interfaces/base-response.interface.ts` | `rest-api/src/common/interfaces/base-response.interface.ts` | **CHECK IF EXISTS** |
| `mt5-rest-api/src/common/utils.ts` | `rest-api/src/common/utils.ts` | **CHECK IF EXISTS** |
| `mt5-rest-api/src/utils/entity-helper.ts` | `rest-api/src/utils/entity-helper.ts` | **CHECK IF EXISTS** |

---

## ❌ Removed Modules (Not Migrated)

### Kafka Module
| File | Status |
|------|--------|
| `mt5-rest-api/src/modules/kafka/kafka.module.ts` | ❌ Removed - Use rest-api's Kafka |
| `mt5-rest-api/src/modules/kafka/kafka.service.ts` | ❌ Removed - Use rest-api's Kafka |
| `mt5-rest-api/src/modules/kafka/config/kafka.config.ts` | ❌ Removed - Use rest-api's Kafka config |
| `mt5-rest-api/src/modules/kafka/config/kafka-config.type.ts` | ❌ Removed - Use rest-api's Kafka config |

### Redis Module
| File | Status |
|------|--------|
| `mt5-rest-api/src/modules/redis/redis.module.ts` | ❌ Removed - Use rest-api's Redis |
| `mt5-rest-api/src/modules/redis/redis.service.ts` | ❌ Removed - Use rest-api's Redis |
| `mt5-rest-api/src/modules/redis/config/redis.config.ts` | ❌ Removed - Use rest-api's Redis config |
| `mt5-rest-api/src/modules/redis/config/redis-config.type.ts` | ❌ Removed - Use rest-api's Redis config |
| `mt5-rest-api/src/modules/redis/dtos/*.ts` | ❌ Removed - Use rest-api's Redis DTOs |

---

## 📊 Migration Statistics

| Category | Files Copied | Files Modified | Files Removed | Total Changes |
|----------|-------------|----------------|---------------|---------------|
| Controllers | 4 | 1 | 0 | 5 |
| Services | 4 | 4 | 0 | 8 |
| Modules | 4 | 4 | 2 | 10 |
| Entities | 1 | 1 | 1 | 3 |
| DTOs | 3 | 0 | 2 | 5 |
| Config | 2 | 0 | 4 | 6 |
| Interfaces | 2 | 0 | 0 | 2 |
| Enums | 1 | 0 | 0 | 1 |
| **TOTAL** | **21** | **10** | **9** | **40** |

---

## 🔍 Files Requiring Manual Review

These files may already exist in rest-api and need careful merging:

1. `rest-api/src/common/helper.ts`
   - Need to add `convertToTimestamp` function if missing

2. `rest-api/src/common/interceptors/mobile-app-responses.interceptor.ts`
   - Check if exists, add if needed

3. `rest-api/src/common/interceptors/route-cache.interceptor.ts`
   - Check if exists, add if needed

4. `rest-api/src/utils/entity-helper.ts`
   - Check if exists, compare implementations

---

## ✅ Verification Checklist

After migration, verify:

- [ ] All 21 files copied successfully
- [ ] Import paths updated in all copied files
- [ ] No duplicate entities created
- [ ] Common utilities merged without conflicts
- [ ] Modules registered in app.module.ts
- [ ] No broken imports or missing dependencies
- [ ] TypeScript compilation succeeds
- [ ] All tests pass

