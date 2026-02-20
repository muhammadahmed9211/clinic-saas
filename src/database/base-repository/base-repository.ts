import { BadRequestException, HttpException } from '@nestjs/common';
import {
  DeepPartial,
  EntityTarget,
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  DataSource,
  In,
  QueryBuilder,
} from 'typeorm';

import {
  AdvanceSearchDto,
  FilterItem,
  FilterOperation,
  SortItem,
  SortOrder,
} from './dto/advance-search.dto';
import {
  AdvanceSearch,
  listClientIdKeys,
  roleFiltersConfig,
} from './advance.search';
import { PaginationDto } from './dto/pagination.dto';
import { ListViewsFilter } from 'src/list-views-filter/entities/list-views-filter.entity';
import { ListNames } from 'src/list-item/dto/create-list-item.dto';
import { ListName } from 'src/list-item/entities/list-name.entity';
import { ListColumnsMeta } from 'src/list-columns-meta/entities/list-columns-meta.entity';
import { RoleFilterRel } from 'src/roles/entities/role_filter_rel.entity';
import { Client } from 'src/users/entities/client.entity';
import { LevelEnum } from 'src/roles/filter_level.enum';
import { User } from 'src/users/entities/user.entity';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { Lead } from 'src/admin/leads/entities/lead.entity';
import { RoleService } from 'src/roles/role.service';
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
import { FilterDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
export interface IAdvanceFilters<T> {
  listName: ListNames;
  userId: number;
  limit: number;
  page: number;
  defaultSortKey: null | string;
  defaultSortKeyOrder?: SortOrder;
  filters?: AdvanceSearchDto['filters'];
  relations?: string[];
  viewFilterId?: number;
  filterList?: {
    listColumnMeta: {
      name: string;
    };
    operator: FilterOperation;
    values: string[] | number[];
  }[];
  sortList?: {
    listColumnMeta: {
      name: string;
    };
    sortOrder: SortOrder;
  }[];
  orList?: {
    listColumnMeta: {
      name: string;
    };
    operator: FilterOperation;
    values: string[] | number[];
  }[];
  overrideFilters?: boolean;
  listViewId?: number;
  OR?: FindOptionsWhere<T>[];
  all?: boolean;
  countOnly?: boolean;
}

export interface GetViewAndFilter {
  listName: ListNames;
  userId: number;
  filters?: AdvanceSearchDto['filters'];
  filterList?: {
    listColumnMeta: {
      name: string;
    };
    operator: FilterOperation;
    values: string[] | number[];
  }[];
  overrideFilters?: boolean;
  listViewId?: number;
}
export enum WidgetType  {
  SALES_REP='SALES_REP',
  RETENTION_REP='RETENTION_REP'
}

export class BaseRepository<
  T extends DeepPartial<ObjectLiteral>,
> extends Repository<T> {
  public readonly listViewRepo: Repository<ListViewsFilter>;
  public readonly listColumnsMetaRepo: Repository<ListColumnsMeta>;

  public readonly dataSource: DataSource;
  private readonly listNameRepo: Repository<ListName>;
  private readonly roleFilterRelRepo: Repository<RoleFilterRel>;
  private readonly userRepo: Repository<User>;
  private readonly clientRepo: Repository<Client>;
  private readonly entity: EntityTarget<T>;
  private readonly listCacheService: ListCacheService;
  constructor(
    target: EntityTarget<T>,
    dataSource: DataSource,
    listCacheService: ListCacheService,
    private readonly roleService?: RoleService,
  ) {
    super(target, dataSource.manager);
    this.entity = target;
    this.listViewRepo = dataSource.manager.getRepository(ListViewsFilter);
    this.listNameRepo = dataSource.manager.getRepository(ListName);
    this.listColumnsMetaRepo =
      dataSource.manager.getRepository(ListColumnsMeta);
    this.roleFilterRelRepo = dataSource.manager.getRepository(RoleFilterRel);
    this.clientRepo = dataSource.manager.getRepository(Client);
    this.userRepo = dataSource.manager.getRepository(User);

    this.dataSource = dataSource;

    if (listCacheService) {
      this.listCacheService = listCacheService;
    }
  }

  private listingSelectParams = {};

  private getListingSelectParams(listName:ListNames){
      return this.listingSelectParams[listName] || null;
  }

  private setListingSelectParams(listName:ListNames, columns:ListColumnsMeta[]){
    const allowedList = [ListNames.TRANSACTIONS , ListNames.TASKS];
    const isAllowedList = allowedList.find((l)=>l===listName);
    if(!isAllowedList){
      return null;
    }
    const result: Record<string, any> = {};
    const queryColumns = columns.filter((c)=>c.isFilterAble && c.isSortable);

    for (const column of queryColumns) {
      const keys = column.name.split('.');
      let current = result;
  
      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          current[key] = true;
        } else {
          current[key] = current[key] || {};
          current = current[key];
        }
      });
    }
    this.listingSelectParams[listName] = result;
    return this.listingSelectParams[listName]
}

  public findMany(
    findManyOptions: FindManyOptions<T>,
    isAdvanceFiltersList: boolean = false,
  ) {
    if (findManyOptions.select && isAdvanceFiltersList) {
      findManyOptions.loadEagerRelations = false;
    }
    return this.find(findManyOptions);
  }

  get table() {
    return this.dataSource.manager.getRepository(this.entity);
  }

  public async updateOne(where: FindOptionsWhere<T>, payload: DeepPartial<T>) {
    const isExist = await this.findOne({ where });
    if (!isExist) {
      throw new HttpException('Entity not found', 400);
    }

    const entity = this.create({ ...isExist, ...payload });
    return await this.save(entity);
  }

  public insertOne(payload: DeepPartial<T>) {
    const entity = this.create(payload);
    return this.save(entity);
  }

  public async findWithPagination(
    findManyOptions: FindManyOptions<T>,
    dto: PaginationDto,
    isAdvanceFiltersList: boolean = false,
    countOnly: boolean = false,
  ) {
  try {
    const { limit = 10, page = 1 } = dto;
    const skip = limit * (page - 1);
    if (dto.all !== 'true') {
      findManyOptions.take = limit;
      findManyOptions.skip = skip;
    }
    let result: T[] = [];
    if (!countOnly) {
      result = await this.findMany(findManyOptions, isAdvanceFiltersList);
    }
    const total = await this.count(findManyOptions);
    const hasNextPage = total > limit * page;
    return { result, total, hasNextPage };
  } catch (error) {
    console.error(error, 'Error');
  }
  }

  public async getAllRolesFilters(
    userId: number,
    listName: ListNames,
  ): Promise<FindOptionsWhere<T>[]> {
    const getListFilters = roleFiltersConfig[listName];
    if (!getListFilters) {
      return [];
    }
    const { selfKeys, teamKeys, officeKeys, deskKeys } = getListFilters;
    const OR: FindOptionsWhere<T>[] = [];
    const operator = await this.userRepo.findOne({
      where: { id: userId },
      relations: { operator: { role: true, operator_rel: true } },
    });

    const roleId = operator?.operator?.role?.id
    if (!roleId && !operator?.operator?.id) {
      throw new BadRequestException('Role not found');
    }

    const roleFilterData = await this.roleService?.roleFilterData(
      roleId as number,
    );

    Object.entries(roleFilterData ?? {}).forEach(([filterName, filterData]) => {
      const { ids, condition } = filterData as FilterData;

      if (filterName === 'level') {
        const levelNames = ids.map(
          (id) => LevelEnum.find((level) => level.id === id)?.name,
        );

        if (levelNames.includes('self')) {
          selfKeys.forEach((key) => {
            const dbQuery = AdvanceSearch.stringToobject(
              key,
              operator.operator.id,
            );
            const orr = Object.assign(dbQuery);
            OR.push(orr);
          });
        } else if (levelNames.includes('team')) {
          teamKeys.forEach((key) => {
            const dbQuery = AdvanceSearch.stringToobject(
              key,
              operator.operator.id,
            );
            const orr = Object.assign(dbQuery);
            OR.push(orr);
          });
        }
      } else if (filterName === 'office') {
        officeKeys.forEach((key) => {
          const dbQuery = AdvanceSearch.stringToobject(key, In(ids));
          const officeFilter = Object.assign(dbQuery) as FindOptionsWhere<T>;
          if (condition === 'OR') {
            OR.push(officeFilter);
          } else if (condition === 'AND') {
            if (!OR || OR.length === 0) {
              OR.push(officeFilter);
            } else {
              const updatedOR = OR.map((item) => {
                return this.deepMerge(item, officeFilter);
              });
              OR.length = 0;
              OR.push(...updatedOR);
            }
          }
        });
      } else if (filterName === 'desk') {
        const deskIds = ids as number[];
        if (condition === 'OR') {
          deskKeys.forEach((key) => {
            const dbQuery = AdvanceSearch.stringToobject(key, In(deskIds));
            const orr = Object.assign(dbQuery);
            OR.push(orr);
          });
        } else if (condition === 'AND') {
          if (OR.length === 0) {
            // If OR is empty, create separate objects for each desk key
            deskKeys.forEach((key) => {
              const deskFilter = AdvanceSearch.stringToobject(key, In(deskIds));
              OR.push(deskFilter);
            });
          } else {
            // If OR has existing conditions, create new combinations for each desk key
            const existingConditions = [...OR];
            OR.length = 0; // Clear the existing OR array
            existingConditions.forEach((existingCondition) => {
              deskKeys.forEach((key) => {
                const deskFilter = AdvanceSearch.stringToobject(
                  key,
                  In(deskIds),
                );
                const combinedFilter = this.deepMerge(
                  existingCondition,
                  deskFilter,
                );
                OR.push(combinedFilter);
              });
            });
          }
          // if (OR.length === 0) {
          //   deskKeys.forEach((key) => {
          //     const dbQuery = AdvanceSearch.stringToobject(key, In(deskIds));
          //     const deskFilter = Object.assign(dbQuery);
          //     OR.push(deskFilter);
          //   });
          // } else {

          // const updatedOR = OR.flatMap((item) => {
          //   return deskKeys.map((desk) => ({
          //     ...Object.assign(item),
          //     ...AdvanceSearch.stringToobject(desk, In(deskIds)), // Spread the new properties
          //   }));
          // });
          // OR.length = 0;
          // OR.push(...updatedOR);
          // const updatedOR: FindOptionsWhere<T>[] = [];
          // Object.assign(OR).forEach((key) => {
          //   deskKeys.forEach((desk) => {
          //     const newItem = Object.assign(
          //       key,
          //       AdvanceSearch.stringToobject(desk, In(deskIds)),
          //     );
          //     updatedOR.push(newItem);
          //   });
          // });
          // OR.length = 0;
          // OR.push(...updatedOR);
          // }
        }
      }
    });
    return OR;
  }
  // public async getAllRolesFilters(
  //   userId: number,
  //   listName: ListNames,
  // ): Promise<FindOptionsWhere<T>[]> {
  //   const getListFilters = roleFiltersConfig[listName];
  //   if (!getListFilters) {
  //     return [];
  //   }
  //   const { selfKeys, teamKeys, officeKeys, deskKeys } = getListFilters;
  //   let OR: FindOptionsWhere<T>[] = [];
  //   const operator = await this.userRepo.findOne({
  //     where: { id: userId },
  //     relations: { operator: { role: true, operator_rel: true } },
  //   });

  //   const roleId = operator?.operator?.role?.id;
  //   if (!roleId && !operator?.operator?.id) {
  //     throw new BadRequestException('Role not found');
  //   }

  //   const roleFilterData = await this.roleService?.roleFilterData(
  //     roleId as number,
  //   );

  //   let levelFilters: FindOptionsWhere<T>[] = [];
  //   let officeFilters: FindOptionsWhere<T>[] = [];
  //   let deskFilters: FindOptionsWhere<T>[] = [];

  //   Object.entries(roleFilterData ?? {}).forEach(([filterName, filterData]) => {
  //     const { ids, condition } = filterData as FilterData;

  //     if (filterName === 'level') {
  //       const levelNames = ids.map(
  //         (id) => LevelEnum.find((level) => level.id === id)?.name,
  //       );

  //       if (levelNames.includes('self')) {
  //         selfKeys.forEach((key) => {
  //           const dbQuery = AdvanceSearch.stringToobject(
  //             key,
  //             operator.operator.id,
  //           );
  //           levelFilters.push(dbQuery);
  //         });
  //       } else if (levelNames.includes('team')) {
  //         teamKeys.forEach((key) => {
  //           const dbQuery = AdvanceSearch.stringToobject(
  //             key,
  //             operator.operator.manager_operator_id,
  //           );
  //           levelFilters.push(dbQuery);
  //         });
  //       }
  //     } else if (filterName === 'office') {
  //       officeKeys.forEach((key) => {
  //         const dbQuery = AdvanceSearch.stringToobject(key, In(ids));
  //         officeFilters.push(dbQuery);
  //       });
  //     } else if (filterName === 'desk') {
  //       const deskIds = ids as number[];
  //       deskKeys.forEach((key) => {
  //         const dbQuery = AdvanceSearch.stringToobject(key, In(deskIds));
  //         deskFilters.push(dbQuery);
  //       });
  //     }
  //   });

  //   // Combine level and office filters
  //   if (levelFilters.length > 0) {
  //     if (officeFilters.length > 0) {
  //       const officeCondition = roleFilterData?.office?.condition;
  //       if (officeCondition === 'OR') {
  //         OR = [...levelFilters, ...officeFilters];
  //       } else {
  //         OR = levelFilters.flatMap((levelFilter) =>
  //           officeFilters.map((officeFilter) => ({
  //             ...levelFilter,
  //             ...officeFilter,
  //           })),
  //         );
  //       }
  //     } else {
  //       OR = levelFilters;
  //     }
  //   } else if (officeFilters.length > 0) {
  //     OR = officeFilters;
  //   }

  //   // Combine with desk filters
  //   if (deskFilters.length > 0) {
  //     const deskCondition = roleFilterData?.desk?.condition;
  //     if (deskCondition === 'OR') {
  //       OR = [...OR, ...deskFilters];
  //     } else {
  //       OR = OR.flatMap((existingFilter) =>
  //         deskFilters.map((deskFilter) => ({
  //           ...existingFilter,
  //           ...deskFilter,
  //         })),
  //       );
  //     }
  //   }

  //   return OR;
  // }

  public async getLeadsRoleFilters(
    userId: number,
  ): Promise<FindOptionsWhere<Lead>[] | FilterItem | null> {
    const OR: FindOptionsWhere<Lead>[] = [];
    const operator = await this.userRepo.findOne({
      where: { id: userId },
      relations: { operator: { role: true, operator_rel: true } },
    });

    const roleId = operator?.operator?.role?.id;
    if (!roleId && !operator?.operator?.id) {
      throw new BadRequestException('Role not found');
    }

    const roleFilterData = await this.roleService?.roleFilterData(
      roleId as number,
    );

    Object.entries(roleFilterData ?? {}).forEach(([filterName, filterData]) => {
      const { ids, condition } = filterData as FilterData;

      if (filterName === 'level') {
        const levelNames = ids.map(
          (id) => LevelEnum.find((level) => level.id === id)?.name,
        );

        if (levelNames.includes('self')) {
          const representativeKeys = [
            'salesRepId',
            'retentionRepId',
            'financeRepId',
            'kycRepId',
            'supportRepId',
          ];
          representativeKeys.forEach((key) => {
            const orr = Object.assign({ [key]: operator.operator.id });
            OR.push(orr);
          });
        } else if (levelNames.includes('team')) {
          const representativeKeys = [
            'salesManagerId',
            'supportManagerId',
            'kycManagerId',
            'financeManagerId',
            'retentionManagerId',
          ];
          representativeKeys.forEach((key) => {
            const orr = Object.assign({
              [key]: operator.operator.manager_operator_id,
            });
            OR.push(orr);
          });
        }
      } else if (filterName === 'office') {
        const representativeKeys = ['officeId'];
        representativeKeys.forEach((key) => {
          const officeFilter = { [key]: In(ids) };
          if (condition === 'OR') {
            OR.push(officeFilter);
          } else if (condition === 'AND') {
            if (!OR || OR.length === 0) {
              OR.push(officeFilter);
            } else {
              const updatedOR = OR.map((item) => {
                return Object.assign(item, officeFilter);
              });
              OR.length = 0;
              OR.push(...updatedOR);
            }
          }
        });
      } else if (filterName === 'desk') {
        const deskIds = ids as number[];
        const deskKeys = [
          'salesDeskId',
          'retentionDeskId',
          'financeDeskId',
          'kycDeskId',
          'supportDeskId',
        ];
        if (condition === 'OR') {
          deskKeys.forEach((key) => {
            const orr = {
              [key]: In(deskIds),
            };
            OR.push(orr);
          });
        } else if (condition === 'AND') {
          if (OR.length === 0) {
            deskKeys.forEach((key) => {
              const deskFilter = {
                [key]: In(deskIds),
              };
              OR.push(deskFilter);
            });
          } else {
            const updatedOR = OR.flatMap((item) =>
              deskKeys.map((key) => ({
                ...item,
                [key]: In(deskIds),
              })),
            );
            OR.length = 0;
            OR.push(...updatedOR);
          }
        }
      }
    });
    return OR;
  }

  public async getClientsRoleFilters(
    userId: number,
  ): Promise<FindOptionsWhere<Lead>[] | FilterItem | null> {
    const OR: FindOptionsWhere<Lead>[] | undefined = [];
    const baseWhere: FindOptionsWhere<Lead> = {};
    let filter: null | FilterItem = null;
    const operator = await this.userRepo.findOne({
      where: { id: userId },
      relations: { operator: { role: true } },
    });

    const roleId = operator?.operator?.role?.id;
    if (!roleId && !operator?.operator?.id) {
      throw new BadRequestException('Role not found');
    }

    const roleFilters = await this.roleFilterRelRepo.find({
      where: {
        role: { id: roleId },
      },
      relations: ['roleFilter'],
    });

    let isFilterAssigned = false;

    for (let i = 0; i < roleFilters.length; i++) {
      const role = roleFilters[i];

      if (role.roleFilter.name === 'Office') {
        const value: number[] = JSON.parse(role.filterRefIds);
        if (Array.isArray(value)) {
          baseWhere.officeId = In(value);
          isFilterAssigned = true;
          filter = {
            operation: FilterOperation.IN,
            name: 'officeId',
            value: value,
          };
        }
      } else if (role.roleFilter.name === 'Level') {
        const selfInfo = LevelEnum.find((l) => l.name === 'self');
        const levels = JSON.parse(role.filterRefIds) as number[];
        if (Array.isArray(levels)) {
          const isSelf = levels.find((l) => l === selfInfo?.id);
          if (isSelf) {
            isFilterAssigned = true;
            const representativeKeys = [
              'salesRepId',
              'retentionRepId',
              'financeRepId',
              'kycRepId',
              'supportRepId',
            ];
            representativeKeys.forEach((key) => {
              OR.push({ [key]: operator.operator.id, ...baseWhere });
            });
          }
        }
      }
    }
    if (isFilterAssigned) {
      if (filter && !OR.length) {
        return filter;
      }
      return OR;
    }
    return null;
  }
  public async getListingRoleFilters(
    userId: number,
  ): Promise<FindOptionsWhere<Lead>[] | FilterItem | null> {
    const OR: FindOptionsWhere<Lead>[] | undefined = [];
    const baseWhere: FindOptionsWhere<Lead> = {};
    let filter: null | FilterItem = null;
    const operator = await this.userRepo.findOne({
      where: { id: userId },
      relations: { operator: { role: true } },
    });

    const roleId = operator?.operator?.role?.id;
    if (!roleId && !operator?.operator?.id) {
      throw new BadRequestException('Role not found');
    }

    const roleFilters = await this.roleFilterRelRepo.find({
      where: {
        role: { id: roleId },
      },
      relations: ['roleFilter'],
    });

    let isFilterAssigned = false;
    let listFilters: any[] = [];
    const officeValues: number[] = [];
    for (let i = 0; i < roleFilters.length; i++) {
      const role = roleFilters[i];

      if (role.roleFilter.name === 'Office') {
        const value: number[] = JSON.parse(role.filterRefIds);
        if (Array.isArray(value)) {
          value.forEach((v) => {
            officeValues.push(v);
          });
          baseWhere.officeId = In(value);
          isFilterAssigned = true;
          filter = {
            operation: FilterOperation.IN,
            name: 'user.client.officeId',
            value: value,
          };
        }
      } else if (role.roleFilter.name === 'Level') {
        const selfInfo = LevelEnum.find((l) => l.name === 'self');
        const levels = JSON.parse(role.filterRefIds) as number[];
        if (Array.isArray(levels)) {
          const isSelf = levels.find((l) => l === selfInfo?.id);
          if (isSelf) {
            isFilterAssigned = true;
            const operatorId = Number(operator.operator.id);
            listFilters = [
              {
                user: {
                  client: {
                    salesRepId: operatorId,
                  },
                },
              },
              {
                user: {
                  client: {
                    retentionRepId: operatorId,
                  },
                },
              },
              {
                user: {
                  client: {
                    financeRepId: operatorId,
                  },
                },
              },
              {
                user: {
                  client: {
                    kycRepId: operatorId,
                  },
                },
              },
              {
                user: {
                  client: {
                    supportRepId: operatorId,
                  },
                },
              },
            ];
          }
        }
      }
    }
    if (isFilterAssigned) {
      if (listFilters.length) {
        listFilters.forEach((l) => {
          if (l?.user?.client && officeValues.length) {
            l.user.client.officeId = In(officeValues);
          }
          OR.push(l);
        });
      } else {
        if (baseWhere.officeId && officeValues.length) {
          //@ts-expect-error type error
          OR.push({ user: { client: { officeId: In(officeValues) } } });
        }
      }
      return OR;
    }
    return null;
  }
  // TODO: to be remove later not in use
  public async getCombinedFilterForDashboardOld(userId: number): Promise<any> {
    let leadFilter = '';
    let clientFilter = '';

    const operator = await this.userRepo.findOne({
      where: { id: userId },
      relations: { operator: { role: true } },
    });

    const roleId = operator?.operator?.role?.id;
    if (!roleId && !operator?.operator?.id) {
      throw new BadRequestException('Role not found');
    }

    const roleFilters = await this.roleFilterRelRepo.find({
      where: {
        role: { id: roleId },
      },
      relations: ['roleFilter'],
      order: {
        roleFilter: {
          id: 'ASC',
        },
      },
    });

    // let filterLogic; // = await this.getFilterLogicForRole(roleId);
    let conditionJoiner = '';

    console.log('roleFilterArray: ', roleFilters);

    for (let i = 0; i < roleFilters.length; i++) {
      const role = roleFilters[i];
      /**
        level(self|team), office (1..n), desk(1..n)
        use AND before any first filter and use AND/OR from the database for remaining
      */
      if (role.roleFilter.name === 'Level') {
        const levels = JSON.parse(role.filterRefIds) as number[];

        console.log('roleIndividual: ', role);

        const selfInfo = LevelEnum.find((l) => l.name === 'self');
        const isSelf = levels.find((l) => l === selfInfo?.id);
        if (isSelf) {
          const selfLeadFilter = ` (l.salesRepId = ${operator.operator.id} OR l.retentionRepId = ${operator.operator.id}) `;
          const selfClientFilter = ` (c.salesRepId = ${operator.operator.id} OR c.retentionRepId = ${operator.operator.id} OR c.financeRepId = ${operator.operator.id} OR c.kycRepId = ${operator.operator.id} OR c.supportRepId = ${operator.operator.id}) `;

          conditionJoiner = role.condition ?? '';
          // leadFilter = leadFilter + selfLeadFilter + conditionJoiner
          // clientFilter = clientFilter + selfClientFilter + conditionJoiner
          leadFilter = leadFilter
            ? leadFilter + selfLeadFilter + conditionJoiner
            : selfLeadFilter + conditionJoiner;
          clientFilter = clientFilter
            ? clientFilter + selfClientFilter + conditionJoiner
            : selfClientFilter + conditionJoiner;
          console.log('leadFilter1: ', leadFilter);
          console.log('clientFilter1: ', clientFilter);
        }

        const teamInfo = LevelEnum.find((l) => l.name === 'team');
        const isTeam = levels.find((l) => l === teamInfo?.id);
        if (isTeam) {
          const teamLeadFilter = ` (l.salesRepId = ${operator.operator.id} OR l.retentionRepId = ${operator.operator.id} OR l.salesManagerId = ${operator.operator.id} OR l.retentionManagerId = ${operator.operator.id}) `;
          const teamClientFilter = ` (c.salesRepId = ${operator.operator.id} 
          OR c.retentionRepId = ${operator.operator.id} 
          OR c.financeRepId = ${operator.operator.id} 
          OR c.kycRepId = ${operator.operator.id} 
          OR c.supportRepId = ${operator.operator.id} 
          OR c.salesManagerId = ${operator.operator.id} 
          OR c.retentionManagerId = ${operator.operator.id} 
          OR c.financeManagerId = ${operator.operator.id} 
          OR c.kycManagerId = ${operator.operator.id} 
          OR c.supportManagerId = ${operator.operator.id}) `;
          conditionJoiner = role.condition ?? '';
          // leadFilter = leadFilter + teamLeadFilter +conditionJoiner
          // clientFilter = clientFilter + teamClientFilter +conditionJoiner
          leadFilter = leadFilter
            ? leadFilter + teamLeadFilter + conditionJoiner
            : teamLeadFilter + conditionJoiner;
          clientFilter = clientFilter
            ? clientFilter + teamClientFilter + conditionJoiner
            : teamClientFilter + conditionJoiner;

          console.log('leadFilter2: ', leadFilter);
          console.log('clientFilter2: ', clientFilter);
        }
      } else if (role.roleFilter.name === 'Office') {
        const value: number[] = JSON.parse(role.filterRefIds);
        if (Array.isArray(value)) {
          if (leadFilter.length < 1) {
            leadFilter += ' AND ';
            clientFilter += ' AND ';
          } else {
            conditionJoiner = role.condition ?? ' AND ';
          }

          const officeFilter = `officeId IN (${value}) `;
          console.log('conditionjoiner', conditionJoiner);
          // leadFilter = leadFilter + officeFilter + conditionJoiner
          // clientFilter = clientFilter + officeFilter + conditionJoiner
          leadFilter = leadFilter
            ? leadFilter + officeFilter + conditionJoiner
            : officeFilter + conditionJoiner;
          clientFilter = clientFilter
            ? clientFilter + officeFilter + conditionJoiner
            : officeFilter + conditionJoiner;

          console.log('leadFilter3: ', leadFilter);
          console.log('clientFilter3: ', clientFilter);
        }
      } else if (role.roleFilter.name === 'Desk') {
        const value: number[] = JSON.parse(role.filterRefIds);
        if (Array.isArray(value)) {
          const deskFilterLead = ` l.salesDeskId IN (${value}) or l.retentionDeskId IN (${value}) or l.kycDeskId IN (${value}) or l.supportDeskId IN (${value}) or l.financeDeskId IN (${value}) `;
          const deskFilterClient = ` c.salesDeskId IN (${value}) or c.retentionDeskId IN (${value}) or c.kycDeskId IN (${value}) or c.supportDeskId IN (${value}) or c.financeDeskId IN (${value}) `;
          conditionJoiner = role.condition ?? '';
          // leadFilter += leadFilter + deskFilterLead +conditionJoiner
          // clientFilter += clientFilter + deskFilterClient +conditionJoiner
          leadFilter = leadFilter
            ? leadFilter + deskFilterLead + conditionJoiner
            : deskFilterLead + conditionJoiner;
          clientFilter = clientFilter
            ? clientFilter + deskFilterClient + conditionJoiner
            : deskFilterClient + conditionJoiner;

          console.log('leadFilter4: ', leadFilter);
          console.log('clientFilter4: ', clientFilter);
        }
      }
    }
    return {
      leadFilter: leadFilter || '1 = 1',
      clientFilter: clientFilter || '1 = 1',
    };
  }
  // Helper function to append filters based on existing filter and condition joiner
  private appendFilter(
    existingFilter: string,
    newFilter: string,
    conditionJoiner: string,
  ): string {
    if (!existingFilter) {
      // For the first condition, start with 'AND (' and wrap the condition in parentheses
      return `AND ( ${newFilter}`;
    } else {
      // Append additional conditions with the condition joiner
      return `${existingFilter} ${conditionJoiner} ${newFilter}`;
    }
  }

  private appendOperatorFilter(
    existingFilter: string,
    newFilter: string,
    conditionJoiner: string,
  ): string {
    if (!existingFilter) {
      // For the first condition, start with 'AND (' and wrap the condition in parentheses
      return `${newFilter}`;
    } else {
      // Append additional conditions with the condition joiner
      return `${existingFilter} ${conditionJoiner} ${newFilter}`;
    }
  }
  // Helper function to safely parse JSON and handle errors
  private safeParseJSON(jsonString: string): any[] {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Failed to parse JSON', { jsonString, error });
      throw new BadRequestException('Invalid JSON format for filterRefIds');
    }
  }

  public async getCombinedFilterForOperatorDashboard(userId: number, widgetType:WidgetType): Promise<{leadFilter:string, clientFilter:string, transactionFilter:string}> {
    let leadFilter = '';
    let clientFilter = '';
    let transactionFilter = '';

    const isTransferToRetention = widgetType === WidgetType.RETENTION_REP ? 1 : 0;
    const isTransferToRetentionQuery = `AND t.isTransferToRetention = ${isTransferToRetention}`;

    const officeKey = 'officeId'

    const repKey = widgetType === WidgetType.SALES_REP ?  'salesRepId' : 'retentionRepId'
    const managerRepKey = widgetType === WidgetType.SALES_REP ?  'salesManagerId' : 'retentionManagerId'
    const deskKey = widgetType === WidgetType.SALES_REP ?  'salesDeskId' : 'retentionDeskId'

    const operator = await this.userRepo.findOne({
      where: { id: userId },
      relations: { operator: { role: true } },
    });

    const roleId = operator?.operator?.role?.id;
    const operatorId = operator?.operator?.id;
    const operatorUserId = operator?.id;

    if (!operatorUserId) {
      throw new BadRequestException('Operator not found');
    }

    if (!roleId) {
      throw new BadRequestException('Role not found');
    }

    if (!operatorId) {
      throw new BadRequestException('Operator not found');
    }

    const roleFilters = await this.roleFilterRelRepo.find({
      where: { role: { id: roleId } },
      relations: ['roleFilter'],
      order: { roleFilter: { id: 'ASC' } },
    });

    for (const role of roleFilters) {
      const conditionJoiner = role.condition ?? 'AND';

      switch (role.roleFilter.name) {
        case 'Level': {
          const levels = this.safeParseJSON(role.filterRefIds) as number[];
          const selfInfo = LevelEnum.find((l) => l.name === 'self');
          const teamInfo = LevelEnum.find((l) => l.name === 'team');

          const isSelf = selfInfo && levels.includes(selfInfo.id);
          const isTeam = teamInfo && levels.includes(teamInfo.id);

          if (isSelf || isTeam) {

            const combinedLeadFilter = ` (l.${repKey} = ${operatorId} ${
              isTeam
                ? `OR l.${managerRepKey} = ${operatorId}`
                : ''
            }) `;

            const combinedClientFilter = ` (c.${repKey} = ${operatorId} ${
              isTeam
                ? `OR c.${managerRepKey} = ${operatorId}`
                : ''
            }) `;

            const combinedTransactionFilter = ` (t.${repKey} = ${operatorUserId} ${
              isTeam
                ? `OR t.${managerRepKey} = ${operatorUserId}`
                : ''
            }) `;

            leadFilter = this.appendFilter(
              leadFilter,
              combinedLeadFilter,
              conditionJoiner,
            );
            
            clientFilter = this.appendFilter(
              clientFilter,
              combinedClientFilter,
              conditionJoiner,
            );

            transactionFilter = this.appendFilter(
              transactionFilter,
              combinedTransactionFilter,
              conditionJoiner,
            );
          }
          break;
        }
        case 'Office': {
          const officeIds = this.safeParseJSON(role.filterRefIds) as number[];
          if (officeIds.length > 0) {
            const officeIdArray = officeIds.join(', ');

            const leadOfficeFilter = `l.${officeKey} IN (${officeIdArray}) `;
            const clientOfficeFilter = `c.${officeKey} IN (${officeIdArray}) `;
            const transactionOfficeFilter = `t.${officeKey} IN (${officeIdArray}) `;

            leadFilter = this.appendFilter(
              leadFilter,
              leadOfficeFilter,
              conditionJoiner,
            );
            clientFilter = this.appendFilter(
              clientFilter,
              clientOfficeFilter,
              conditionJoiner,
            );
            transactionFilter = this.appendFilter(
              transactionFilter,
              transactionOfficeFilter,
              conditionJoiner,
            );
          }
          break;
        }
        case 'Desk': {
          const deskIds = this.safeParseJSON(role.filterRefIds) as number[];
          if (deskIds.length > 0) {

            const deskIdArray = deskIds.join(', ')

            const deskLeadFilter = ` (l.${deskKey} IN (${deskIdArray})) `;
            const deskClientFilter = ` (c.${deskKey} IN (${deskIdArray})) `;
            const deskTransactionFilter = ` (t.${deskKey} IN (${deskIdArray})) `;

            leadFilter = this.appendFilter(
              leadFilter,
              deskLeadFilter,
              conditionJoiner,
            );
            clientFilter = this.appendFilter(
              clientFilter,
              deskClientFilter,
              conditionJoiner,
            );
            transactionFilter = this.appendFilter(
              transactionFilter,
              deskTransactionFilter,
              conditionJoiner,
            );
           
          }
          break;
        }
        default:
          console.log(`Unhandled filter type: ${role.roleFilter.name}`);
      }
    }

    leadFilter = leadFilter ? `${leadFilter})` : leadFilter;
    clientFilter = clientFilter ? `${clientFilter})` : clientFilter;
    transactionFilter = transactionFilter ? `${transactionFilter}) ${isTransferToRetentionQuery}` : transactionFilter;

    return {
      leadFilter: leadFilter || 'AND 1 = 1',
      clientFilter: clientFilter || 'AND 1 = 1',
      transactionFilter: transactionFilter || isTransferToRetentionQuery
    };
  }
  // combined sales and retention and other areas filter
  public async getCombinedFilterForDashboard(userId: number): Promise<any> {
    let leadFilter = '';
    let clientFilter = '';
    //operatorFilter = ''; this filter will be populated only if level is team, if not team then return 1=0, incase of no filter then 1=1
    let operatorFilter = '';
    let transactionFilter = '';
    
    const operator = await this.userRepo.findOne({
      where: { id: userId },
      relations: { operator: { role: true } },
    });
    const roleId = operator?.operator?.role?.id;

    const operatorUserId = operator?.id;

    if (!roleId && !operator?.operator?.id) {
      throw new BadRequestException('Role not found');
    }
    const roleFilters = await this.roleFilterRelRepo.find({
      where: { role: { id: roleId } },
      relations: ['roleFilter'],
      order: { roleFilter: { id: 'ASC' } },
    });
    for (const role of roleFilters) {
      const conditionJoiner = role.condition ?? 'AND';
      switch (role.roleFilter.name) {
        case 'Level': {
          const levels = this.safeParseJSON(role.filterRefIds) as number[];
          const selfInfo = LevelEnum.find((l) => l.name === 'self');
          const teamInfo = LevelEnum.find((l) => l.name === 'team');
          // Check if "self" or "team" exists in the level array
          const isSelf = selfInfo && levels.includes(selfInfo.id);
          const isTeam = teamInfo && levels.includes(teamInfo.id);
          // Combine self and team filters into one condition
          if (isSelf || isTeam) {
            const combinedLeadFilter = ` (l.salesRepId = ${
              operator.operator.id
            } OR l.retentionRepId = ${operator.operator.id} ${
              isTeam
                ? `OR l.salesManagerId = ${operator.operator.id} OR l.retentionManagerId = ${operator.operator.id}`
                : ''
            }) `;
            const combinedClientFilter = ` (c.salesRepId = ${
              operator.operator.id
            } OR c.retentionRepId = ${
              operator.operator.id
            } OR c.financeRepId = ${operator.operator.id} OR c.kycRepId = ${
              operator.operator.id
            } OR c.supportRepId = ${operator.operator.id} ${
              isTeam
                ? `OR c.salesManagerId = ${operator.operator.id} OR c.retentionManagerId = ${operator.operator.id} OR c.financeManagerId = ${operator.operator.id} OR c.kycManagerId = ${operator.operator.id} OR c.supportManagerId = ${operator.operator.id}`
                : ''
            }) `;
            const combinedTransactionFilter = ` ((t.salesRepId = ${
                operatorUserId
              } AND t.isTransferToRetention = 0) OR (t.retentionRepId = ${
                operatorUserId
              } AND t.isTransferToRetention = 1)
             ${
              isTeam
                ? `OR (t.salesManagerId = ${operatorUserId} AND t.isTransferToRetention = 0) OR (t.retentionManagerId = ${operatorUserId} AND t.isTransferToRetention = 1)`
                : ''
    }
  )
`;
            const combinedOperatorFilter =  `(o.id = ${operator.operator.id} or o.manager_operator_id = ${operator.operator.id})`;
            leadFilter = this.appendFilter(
              leadFilter,
              combinedLeadFilter,
              conditionJoiner,
            );
            clientFilter = this.appendFilter(
              clientFilter,
              combinedClientFilter,
              conditionJoiner,
            );
            transactionFilter = this.appendFilter(
              transactionFilter,
              combinedTransactionFilter,
              conditionJoiner,
            );
            operatorFilter = this.appendOperatorFilter(
              operatorFilter,
              combinedOperatorFilter,
              conditionJoiner,
            );
          }
          break;
        }
        case 'Office': {
          const officeIds = this.safeParseJSON(role.filterRefIds) as number[];
          if (officeIds.length > 0) {
            const leadOfficeFilter = `l.officeId IN (${officeIds.join(', ')}) `;
            const clientOfficeFilter = `c.officeId IN (${officeIds.join(
              ', ',
            )}) `;
            const transactionOfficeFilter = `t.officeId IN (${officeIds.join(', ')}) `;
            const combinedOperatorFilter = `(1=0)`;
            leadFilter = this.appendFilter(
              leadFilter,
              leadOfficeFilter,
              conditionJoiner,
            );
            clientFilter = this.appendFilter(
              clientFilter,
              clientOfficeFilter,
              conditionJoiner,
            );
            operatorFilter = this.appendOperatorFilter(
              operatorFilter,
              combinedOperatorFilter,
              conditionJoiner,
            );
            transactionFilter = this.appendFilter(
              transactionFilter,
              transactionOfficeFilter,
              conditionJoiner,
            );
          }
          break;
        }
        case 'Desk': {
          const deskIds = this.safeParseJSON(role.filterRefIds) as number[];
          if (deskIds.length > 0) {
            // Combine all desk-related filters inside one set of parentheses
            const deskLeadFilter = ` (l.salesDeskId IN (${deskIds.join(
              ', ',
            )}) OR l.retentionDeskId IN (${deskIds.join(
              ', ',
            )}) OR l.kycDeskId IN (${deskIds.join(
              ', ',
            )}) OR l.supportDeskId IN (${deskIds.join(
              ', ',
            )}) OR l.financeDeskId IN (${deskIds.join(', ')})) `;
            const deskClientFilter = ` (c.salesDeskId IN (${deskIds.join(
              ', ',
            )}) OR c.retentionDeskId IN (${deskIds.join(
              ', ',
            )}) OR c.kycDeskId IN (${deskIds.join(
              ', ',
            )}) OR c.supportDeskId IN (${deskIds.join(
              ', ',
            )}) OR c.financeDeskId IN (${deskIds.join(', ')})) `;
           const transactionDeskFilter = ` (t.salesDeskId IN (${deskIds.join(', ')}) OR t.retentionDeskId IN (${deskIds.join(', ')})) `;
            const combinedOperatorFilter = `(1=0)`;
            leadFilter = this.appendFilter(
              leadFilter,
              deskLeadFilter,
              conditionJoiner,
            );
            clientFilter = this.appendFilter(
              clientFilter,
              deskClientFilter,
              conditionJoiner,
            );
            operatorFilter = this.appendOperatorFilter(
              operatorFilter,
              combinedOperatorFilter,
              conditionJoiner,
            );
            transactionFilter = this.appendOperatorFilter(
              transactionFilter,
              transactionDeskFilter,
              conditionJoiner,
            );
          }
          break;
        }
        default:
          console.log(`Unhandled filter type: ${role.roleFilter.name}`);
      }
    }
    leadFilter = leadFilter ? `${leadFilter})` : leadFilter;
    clientFilter = clientFilter ? `${clientFilter})` : clientFilter;
    operatorFilter = operatorFilter ? `${operatorFilter}` : operatorFilter;
    transactionFilter = transactionFilter ? `${transactionFilter})` : transactionFilter;

    return {
      leadFilter: leadFilter || 'AND 1 = 1',
      clientFilter: clientFilter || 'AND 1 = 1',
      transactionFilter: transactionFilter || 'AND 1 = 1',
      operatorFilter: operatorFilter || '1 = 1',
    };
  }

  // Main function to get updated lead filters for the dashboard
  public async getSalesFilterForDashboard(userId: number): Promise<any> {
    let leadFilter = '';
    let clientFilter = '';
    const operator = await this.userRepo.findOne({
      where: { id: userId },
      relations: { operator: { role: true } },
    });
    const roleId = operator?.operator?.role?.id;
    if (!roleId && !operator?.operator?.id) {
      throw new BadRequestException('Role not found');
    }
    const roleFilters = await this.roleFilterRelRepo.find({
      where: { role: { id: roleId } },
      relations: ['roleFilter'],
      order: { roleFilter: { id: 'ASC' } },
    });
    for (const role of roleFilters) {
      const conditionJoiner = role.condition ?? 'AND';
      switch (role.roleFilter.name) {
        case 'Level': {
          const levels = this.safeParseJSON(role.filterRefIds) as number[];
          const selfInfo = LevelEnum.find((l) => l.name === 'self');
          const teamInfo = LevelEnum.find((l) => l.name === 'team');
          // Check if "self" or "team" exists in the level array
          const isSelf = selfInfo && levels.includes(selfInfo.id);
          const isTeam = teamInfo && levels.includes(teamInfo.id);
          // Combine self and team filters into one condition
          if (isSelf || isTeam) {
            const combinedLeadFilter = ` (l.salesRepId = ${
              operator.operator.id
            } ${
              isTeam ? `OR l.salesManagerId = ${operator.operator.id} ` : ''
            }) `;
            const combinedClientFilter = ` (c.salesRepId = ${
              operator.operator.id
            }  ${
              isTeam ? `OR c.salesManagerId = ${operator.operator.id} ` : ''
            }) `;
            leadFilter = this.appendFilter(
              leadFilter,
              combinedLeadFilter,
              conditionJoiner,
            );
            clientFilter = this.appendFilter(
              clientFilter,
              combinedClientFilter,
              conditionJoiner,
            );
          }
          break;
        }
        case 'Office': {
          const officeIds = this.safeParseJSON(role.filterRefIds) as number[];
          if (officeIds.length > 0) {
            const leadOfficeFilter = `l.officeId IN (${officeIds.join(', ')}) `;
            const clientOfficeFilter = `c.officeId IN (${officeIds.join(
              ', ',
            )}) `;
            leadFilter = this.appendFilter(
              leadFilter,
              leadOfficeFilter,
              conditionJoiner,
            );
            clientFilter = this.appendFilter(
              clientFilter,
              clientOfficeFilter,
              conditionJoiner,
            );
          }
          break;
        }
        case 'Desk': {
          const deskIds = this.safeParseJSON(role.filterRefIds) as number[];
          if (deskIds.length > 0) {
            // Combine all desk-related filters inside one set of parentheses
            const deskLeadFilter = ` (l.salesDeskId IN (${deskIds.join(
              ', ',
            )}) OR l.retentionDeskId IN (${deskIds.join(
              ', ',
            )}) OR l.kycDeskId IN (${deskIds.join(
              ', ',
            )}) OR l.supportDeskId IN (${deskIds.join(
              ', ',
            )}) OR l.financeDeskId IN (${deskIds.join(', ')})) `;
            const deskClientFilter = ` (c.salesDeskId IN (${deskIds.join(
              ', ',
            )}) OR c.retentionDeskId IN (${deskIds.join(
              ', ',
            )}) OR c.kycDeskId IN (${deskIds.join(
              ', ',
            )}) OR c.supportDeskId IN (${deskIds.join(
              ', ',
            )}) OR c.financeDeskId IN (${deskIds.join(', ')})) `;
            leadFilter = this.appendFilter(
              leadFilter,
              deskLeadFilter,
              conditionJoiner,
            );
            clientFilter = this.appendFilter(
              clientFilter,
              deskClientFilter,
              conditionJoiner,
            );
          }
          break;
        }
        default:
          console.log(`Unhandled filter type: ${role.roleFilter.name}`);
      }
    }
    leadFilter = leadFilter ? `${leadFilter})` : leadFilter;
    clientFilter = clientFilter ? `${clientFilter})` : clientFilter;

    return {
      leadFilter: leadFilter || 'AND 1 = 1',
      clientFilter: clientFilter || 'AND 1 = 1',
    };
  }

  public async getRetentionFilterForDashboard(userId: number): Promise<any> {
    let leadFilter = '';
    let clientFilter = '';
    const operator = await this.userRepo.findOne({
      where: { id: userId },
      relations: { operator: { role: true } },
    });
    const roleId = operator?.operator?.role?.id;
    if (!roleId && !operator?.operator?.id) {
      throw new BadRequestException('Role not found');
    }
    const roleFilters = await this.roleFilterRelRepo.find({
      where: { role: { id: roleId } },
      relations: ['roleFilter'],
      order: { roleFilter: { id: 'ASC' } },
    });
    for (const role of roleFilters) {
      const conditionJoiner = role.condition ?? 'AND';
      switch (role.roleFilter.name) {
        case 'Level': {
          const levels = this.safeParseJSON(role.filterRefIds) as number[];
          const selfInfo = LevelEnum.find((l) => l.name === 'self');
          const teamInfo = LevelEnum.find((l) => l.name === 'team');
          // Check if "self" or "team" exists in the level array
          const isSelf = selfInfo && levels.includes(selfInfo.id);
          const isTeam = teamInfo && levels.includes(teamInfo.id);
          // Combine self and team filters into one condition
          if (isSelf || isTeam) {
            const combinedLeadFilter = ` ( l.retentionRepId = ${
              operator.operator.id
            } ${
              isTeam ? ` OR l.retentionManagerId = ${operator.operator.id}` : ''
            }) `;
            const combinedClientFilter = ` (c.retentionRepId = ${
              operator.operator.id
            } ${
              isTeam
                ? ` OR c.retentionManagerId = ${operator.operator.id} `
                : ''
            }) `;
            leadFilter = this.appendFilter(
              leadFilter,
              combinedLeadFilter,
              conditionJoiner,
            );
            clientFilter = this.appendFilter(
              clientFilter,
              combinedClientFilter,
              conditionJoiner,
            );
          }
          break;
        }
        case 'Office': {
          const officeIds = this.safeParseJSON(role.filterRefIds) as number[];
          if (officeIds.length > 0) {
            const leadOfficeFilter = `l.officeId IN (${officeIds.join(', ')}) `;
            const clientOfficeFilter = `c.officeId IN (${officeIds.join(
              ', ',
            )}) `;
            leadFilter = this.appendFilter(
              leadFilter,
              leadOfficeFilter,
              conditionJoiner,
            );
            clientFilter = this.appendFilter(
              clientFilter,
              clientOfficeFilter,
              conditionJoiner,
            );
          }
          break;
        }
        case 'Desk': {
          const deskIds = this.safeParseJSON(role.filterRefIds) as number[];
          if (deskIds.length > 0) {
            // Combine all desk-related filters inside one set of parentheses
            const deskLeadFilter = ` (l.salesDeskId IN (${deskIds.join(
              ', ',
            )}) OR l.retentionDeskId IN (${deskIds.join(
              ', ',
            )}) OR l.kycDeskId IN (${deskIds.join(
              ', ',
            )}) OR l.supportDeskId IN (${deskIds.join(
              ', ',
            )}) OR l.financeDeskId IN (${deskIds.join(', ')})) `;
            const deskClientFilter = ` (c.salesDeskId IN (${deskIds.join(
              ', ',
            )}) OR c.retentionDeskId IN (${deskIds.join(
              ', ',
            )}) OR c.kycDeskId IN (${deskIds.join(
              ', ',
            )}) OR c.supportDeskId IN (${deskIds.join(
              ', ',
            )}) OR c.financeDeskId IN (${deskIds.join(', ')})) `;
            leadFilter = this.appendFilter(
              leadFilter,
              deskLeadFilter,
              conditionJoiner,
            );
            clientFilter = this.appendFilter(
              clientFilter,
              deskClientFilter,
              conditionJoiner,
            );
          }
          break;
        }
        default:
          console.log(`Unhandled filter type: ${role.roleFilter.name}`);
      }
    }
    leadFilter = leadFilter ? `${leadFilter})` : leadFilter;
    clientFilter = clientFilter ? `${clientFilter})` : clientFilter;

    return {
      leadFilter: leadFilter || 'AND 1 = 1',
      clientFilter: clientFilter || 'AND 1 = 1',
    };
  }

  public async getCallLogsLeadsRoleFilters(
    userId: number,
  ): Promise<FindOptionsWhere<Lead>[] | FilterItem | null> {
    const OR: FindOptionsWhere<Lead>[] | undefined = [];
    const baseWhere: FindOptionsWhere<Lead> = {};
    const filter: null | FilterItem = null;
    const operator = await this.userRepo.findOne({
      where: { id: userId },
      relations: { operator: { role: true } },
    });

    const roleId = operator?.operator?.role?.id;
    if (!roleId && !operator?.operator?.id) {
      throw new BadRequestException('Role not found');
    }

    const roleFilters = await this.roleFilterRelRepo.find({
      where: {
        role: { id: roleId },
      },
      relations: ['roleFilter'],
    });

    let isFilterAssigned = false;

    for (let i = 0; i < roleFilters.length; i++) {
      const role = roleFilters[i];

      if (role.roleFilter.name === 'Level') {
        const selfInfo = LevelEnum.find((l) => l.name === 'self');
        const levels = JSON.parse(role.filterRefIds) as number[];
        if (Array.isArray(levels)) {
          const isSelf = levels.find((l) => l === selfInfo?.id);
          if (isSelf) {
            isFilterAssigned = true;
            const representativeKeys = ['callOwnerId'];
            representativeKeys.forEach((key) => {
              OR.push({ [key]: operator.id, ...baseWhere });
            });
          }
        }
      }
    }
    if (isFilterAssigned) {
      if (filter && !OR.length) {
        return filter;
      }
      return OR;
    }
    return null;
  }

  public async getLeadsNotesRoleFilters(
    userId: number,
  ): Promise<FindOptionsWhere<Lead>[] | FilterItem | null> {
    const OR: FindOptionsWhere<Lead>[] | undefined = [];
    const baseWhere: FindOptionsWhere<Lead> = {};
    const filter: null | FilterItem = null;
    const operator = await this.userRepo.findOne({
      where: { id: userId },
      relations: { operator: { role: true } },
    });

    const roleId = operator?.operator?.role?.id;
    if (!roleId && !operator?.operator?.id) {
      throw new BadRequestException('Role not found');
    }

    const roleFilters = await this.roleFilterRelRepo.find({
      where: {
        role: { id: roleId },
      },
      relations: ['roleFilter'],
    });

    let isFilterAssigned = false;

    for (let i = 0; i < roleFilters.length; i++) {
      const role = roleFilters[i];

      if (role.roleFilter.name === 'Level') {
        const selfInfo = LevelEnum.find((l) => l.name === 'self');
        const levels = JSON.parse(role.filterRefIds) as number[];
        if (Array.isArray(levels)) {
          const isSelf = levels.find((l) => l === selfInfo?.id);
          if (isSelf) {
            isFilterAssigned = true;
            const representativeKeys = ['created_by.id'];
            representativeKeys.forEach((key) => {
              OR.push({ [key]: operator.id, ...baseWhere });
            });
          }
        }
      }
    }
    if (isFilterAssigned) {
      if (filter && !OR.length) {
        return filter;
      }
      return OR;
    }
    return null;
  }

  public async getLeadsMeetingFilters(
    userId: number,
  ): Promise<FindOptionsWhere<Lead>[] | FilterItem | null> {
    const OR: FindOptionsWhere<Lead>[] | undefined = [];
    const baseWhere: FindOptionsWhere<Lead> = {};
    const filter: null | FilterItem = null;
    const operator = await this.userRepo.findOne({
      where: { id: userId },
      relations: { operator: { role: true } },
    });

    const roleId = operator?.operator?.role?.id;
    if (!roleId && !operator?.operator?.id) {
      throw new BadRequestException('Role not found');
    }

    const roleFilters = await this.roleFilterRelRepo.find({
      where: {
        role: { id: roleId },
      },
      relations: ['roleFilter'],
    });

    let isFilterAssigned = false;

    for (let i = 0; i < roleFilters.length; i++) {
      const role = roleFilters[i];

      if (role.roleFilter.name === 'Level') {
        const selfInfo = LevelEnum.find((l) => l.name === 'self');
        const levels = JSON.parse(role.filterRefIds) as number[];
        if (Array.isArray(levels)) {
          const isSelf = levels.find((l) => l === selfInfo?.id);
          if (isSelf) {
            isFilterAssigned = true;
            const representativeKeys = ['host.id'];
            representativeKeys.forEach((key) => {
              OR.push({ [key]: operator.operator.id, ...baseWhere });
            });
          }
        }
      }
    }
    if (isFilterAssigned) {
      if (filter && !OR.length) {
        return filter;
      }
      return OR;
    }
    return null;
  }

  public async getLeadsOpportunityFilters(
    userId: number,
  ): Promise<FindOptionsWhere<Lead>[] | FilterItem | null> {
    const OR: FindOptionsWhere<Lead>[] | undefined = [];
    const baseWhere: FindOptionsWhere<Lead> = {};
    const filter: null | FilterItem = null;
    const operator = await this.userRepo.findOne({
      where: { id: userId },
      relations: { operator: { role: true } },
    });

    const roleId = operator?.operator?.role?.id;
    if (!roleId && !operator?.operator?.id) {
      throw new BadRequestException('Role not found');
    }

    const roleFilters = await this.roleFilterRelRepo.find({
      where: {
        role: { id: roleId },
      },
      relations: ['roleFilter'],
    });

    let isFilterAssigned = false;

    for (let i = 0; i < roleFilters.length; i++) {
      const role = roleFilters[i];

      if (role.roleFilter.name === 'Level') {
        const selfInfo = LevelEnum.find((l) => l.name === 'self');
        const levels = JSON.parse(role.filterRefIds) as number[];
        if (Array.isArray(levels)) {
          const isSelf = levels.find((l) => l === selfInfo?.id);
          if (isSelf) {
            isFilterAssigned = true;
            const representativeKeys = ['dealOwner.id'];
            representativeKeys.forEach((key) => {
              OR.push({ [key]: operator.operator.id, ...baseWhere });
            });
          }
        }
      }
    }
    if (isFilterAssigned) {
      if (filter && !OR.length) {
        return filter;
      }
      return OR;
    }
    return null;
  }

  public async getCommunicationsFilters(
    userId: number,
  ): Promise<FindOptionsWhere<Lead>[] | FilterItem | null> {
    const OR: FindOptionsWhere<Lead>[] | undefined = [];
    const baseWhere: FindOptionsWhere<Lead> = {};
    const filter: null | FilterItem = null;
    const operator = await this.userRepo.findOne({
      where: { id: userId },
      relations: { operator: { role: true } },
    });

    const roleId = operator?.operator?.role?.id;
    if (!roleId && !operator?.operator?.id) {
      throw new BadRequestException('Role not found');
    }

    const roleFilters = await this.roleFilterRelRepo.find({
      where: {
        role: { id: roleId },
      },
      relations: ['roleFilter'],
    });

    let isFilterAssigned = false;

    for (let i = 0; i < roleFilters.length; i++) {
      const role = roleFilters[i];

      if (role.roleFilter.name === 'Level') {
        const selfInfo = LevelEnum.find((l) => l.name === 'self');
        const levels = JSON.parse(role.filterRefIds) as number[];
        if (Array.isArray(levels)) {
          const isSelf = levels.find((l) => l === selfInfo?.id);
          if (isSelf) {
            isFilterAssigned = true;
            OR.push({
              //@ts-expect-error type-error
              lead: { salesRepId: Number(operator.operator.id) },
              ...baseWhere,
            });
          }
        }
      }
    }
    if (isFilterAssigned) {
      if (filter && !OR.length) {
        return filter;
      }
      return OR;
    }
    return null;
  }

  public async getRoleFilters(
    listName: ListNames,
    userId: number,
    filters: FilterItem[],
  ): Promise<FilterItem | null> {
    const key = listClientIdKeys[listName];
    if (!key) {
      return null;
    }
    let isFilterAssigned = false;
    const OR: FindOptionsWhere<Client>[] | undefined = [];
    const baseWhere: FindOptionsWhere<Client> = {};

    const operator = await this.userRepo.findOne({
      where: { id: userId },
      relations: { operator: { role: true } },
    });

    console.log(operator, '============operator');
    let roleId;
    if (operator?.operator?.role) {
      roleId = operator.operator.role.id;
      // Use roleId here
    } else {
      throw new BadRequestException('Role not found');
    }
    // const roleId = operator?.operator?.role?.id;
    if (!roleId && !operator?.operator?.id) {
      throw new BadRequestException('Role not found');
    }

    const roleFilterData = await this.roleService?.roleFilterData(
      roleId as number,
    );
    console.log(roleFilterData);
    Object.entries(roleFilterData ?? {}).forEach(([filterName, filterData]) => {
      const { ids, condition } = filterData as FilterData;

      if (filterName === 'level') {
        isFilterAssigned = true;
        const levelNames = ids.map(
          (id) => LevelEnum.find((level) => level.id === id)?.name,
        );

        if (levelNames.includes('self')) {
          const representativeKeys = [
            'salesRepId',
            'retentionRepId',
            'financeRepId',
            'kycRepId',
            'supportRepId',
          ];
          representativeKeys.forEach((key) => {
            const orr = { [key]: operator.operator.id, ...baseWhere };
            OR.push(orr);
          });
          baseWhere.salesRepId = operator.operator.id;
        } else if (levelNames.includes('team')) {
          baseWhere.salesManagerId = operator.operator.manager_operator_id;
        }
      } else if (filterName === 'office') {
        isFilterAssigned = true;
        const officeFilter = { officeId: In(ids) };
        if (condition === 'OR') {
          OR.push(officeFilter);
        } else if (condition === 'AND') {
          if (!OR || OR.length === 0) {
            OR.push(officeFilter);
          } else {
            const updatedOR = OR.map((item) => ({ ...item, ...officeFilter }));
            OR.length = 0;
            OR.push(...updatedOR);
          }
        }
        console.log('Updated OR:', OR);
      } else if (filterName === 'desk') {
        isFilterAssigned = true;
        const deskIds = ids as number[];
        const deskKeys = [
          'salesDeskId',
          'retentionDeskId',
          'financeDeskId',
          'kycDeskId',
          'supportDeskId',
        ];
        if (condition === 'OR') {
          deskKeys.forEach((key) => {
            const orr = {
              [key]: In(deskIds),
            };
            OR.push(orr);
          });
          // baseWhere.salesDeskId = In(ids);
          // OR.push(baseWhere);
        } else if (condition === 'AND') {
          if (OR.length === 0) {
            deskKeys.forEach((key) => {
              const deskFilter = {
                [key]: In(deskIds),
                ...baseWhere,
              };
              OR.push(deskFilter);
            });
          } else {
            const updatedOR = OR.flatMap((item) =>
              deskKeys.map((key) => ({
                ...item,
                [key]: In(deskIds),
              })),
            );
            OR.length = 0;
            OR.push(...updatedOR);
          }
        }
      }
    });

    // const roleFilters = await this.roleFilterRelRepo.find({
    //   where: {
    //     role: { id: roleId },
    //   },
    //   relations: ['roleFilter'],
    // });

    // for (let i = 0; i < roleFilters.length; i++) {
    //   const role = roleFilters[i];

    //   if (role.roleFilter.name === 'Office') {
    //     const value: number[] = JSON.parse(role.filterRefIds);
    //     if (Array.isArray(value)) {
    //       baseWhere.officeId = In(value);
    //       isFilterAssigned = true;
    //     }
    //   } else if (role.roleFilter.name === 'Level') {
    //     const selfInfo = LevelEnum.find((l) => l.name === 'self');
    //     const levels = JSON.parse(role.filterRefIds) as number[];
    //     if (Array.isArray(levels)) {
    //       const isSelf = levels.find((l) => l === selfInfo?.id);
    //       if (isSelf) {
    //         isFilterAssigned = true;
    //         const representativeKeys = [
    //           'salesRepId',
    //           'retentionRepId',
    //           'financeRepId',
    //           'kycRepId',
    //           'supportRepId',
    //         ];
    //         representativeKeys.forEach((key) => {
    //           OR.push({ [key]: operator.operator.id, ...baseWhere });
    //         });
    //       }
    //     }
    //   } else if (role.roleFilter.name === 'Desk') {
    //     const value: number[] = JSON.parse(role.filterRefIds);
    //     if (Array.isArray(value)) {
    //       baseWhere.officeId = In(value);
    //       isFilterAssigned = true;
    //     }

    //     const representativeKeys = [
    //       'salesDeskId',
    //       'kycDeskId',
    //       'retentionDeskId',
    //       'financeDeskId',
    //       'supportDeskId',
    //     ];
    //     representativeKeys.forEach((key) => {
    //       OR.push({ [key]: value, ...baseWhere });
    //     });
    //   }
    // }

    if (!isFilterAssigned) {
      return null;
    }
    const where: FindOptionsWhere<Client> | FindOptionsWhere<Client>[] =
      OR.length ? OR : baseWhere;

    const item = filters.find((filter) => filter.name === key);
    const clients = await this.clientRepo.findBy(where);
    const list: number[] = [];

    for (let i = 0; i < clients.length; i++) {
      const element = clients[i];
      const userId = element.userId;
      if (!item) {
        list.push(userId);
        continue;
      }

      const operation = item.operation;
      const value = item.value[0] as number;
      const isBetween = operation === FilterOperation.BETWEEN;

      if (isBetween) {
        const lastValue = item.value[1];
        if (lastValue && typeof lastValue === 'number') {
          if (userId >= value && userId <= lastValue) {
            list.push(userId);
          }
        }
      } else {
        const isEqualOperation =
          operation === FilterOperation.EQUALS ||
          operation === FilterOperation.GREATER_THAN_OR_EQUAL ||
          operation === FilterOperation.LESS_THAN_OR_EQUAL;
        const isGreaterOperation =
          operation === FilterOperation.GREATER_THAN ||
          operation === FilterOperation.GREATER_THAN_OR_EQUAL;
        const isLessOperation =
          operation === FilterOperation.LESS_THAN ||
          operation === FilterOperation.LESS_THAN_OR_EQUAL;
        const isNotEqualOperation = operation === FilterOperation.NOT_EQUAL;
        const isGreater = userId > value;
        const isLess = userId < value;
        const isEqual = userId === value;
        const isNotEqual = userId !== value;

        if (isEqualOperation && isEqual) {
          list.push(userId);
        } else if (isGreaterOperation && isGreater) {
          list.push(userId);
        } else if (isLessOperation && isLess) {
          list.push(userId);
        } else if (isNotEqualOperation && isNotEqual) {
          list.push(userId);
        }
      }
    }
    if (isFilterAssigned) {
      if (filters && !OR.length) {
        return {
          operation: FilterOperation.IN,
          value: list,
          name: key,
        };
      }
      return {
        ...OR,
        operation: FilterOperation.IN,
        value: list,
        name: key,
      };
    }
    return {
      operation: FilterOperation.IN,
      value: list,
      name: key,
    };
  }

  public async advanceSearch({
    filters,
    limit,
    page,
    sort,
    relations,
    countOnly,
    ...rest
  }: AdvanceSearchDto & { OR?: IAdvanceFilters<T>['OR']; all: boolean , select: any}): Promise<{result:T[] , total:number , hasNextPage:boolean}> {
    const orFilters = [];
    if (Array.isArray(rest.or))
      rest?.or.map((filter) => {
        const or = AdvanceSearch.query([filter]);
        //@ts-expect-error type error
        orFilters.push(or);
      });
    const where = AdvanceSearch.query(filters);
    const order = sort ? AdvanceSearch.sorting(sort) : {};
    if (!where) {
      return { result: [], total: 0 , hasNextPage:false};
    }
    const modifiedQuery: FindOptionsWhere<T> | FindOptionsWhere<T>[] = [];
    if (Array.isArray(rest?.OR) && rest?.OR?.length) {
      rest?.OR.forEach((item) => {
        const thisQuery = AdvanceSearch.deepMerge(where, item);
        if (Object.keys(thisQuery).length) modifiedQuery.push(thisQuery);
      });
    }
    const finalizedQuery = modifiedQuery.length ? modifiedQuery : where;
    const ORFinalizeQuery: any = [];
    if (Array.isArray(finalizedQuery)) {
      finalizedQuery.map((q) => {
        const orList = orFilters.map((o) => {
          return AdvanceSearch.deepMerge(o, q);
        });

        if (orList.length) {
          ORFinalizeQuery.push(...orList);
        } else {
          ORFinalizeQuery.push(q);
        }
      });
    } else {
      if (orFilters.length) {
        orFilters.map((q) => {
          const thisQuery = Object.assign(q, finalizedQuery);
          if (Object.keys(thisQuery).length) ORFinalizeQuery.push(thisQuery);
        });
      } else {
        if (Object.keys(finalizedQuery).length)
          ORFinalizeQuery.push([finalizedQuery]);
      }
    }
    try {
      const data = await this.findWithPagination(
        { where: ORFinalizeQuery, order, relations, select : rest.select ? rest.select : undefined },
        { limit, page, all: rest.all ? 'true' : 'false' },
        true,
        countOnly,
      );
      if(!data){
        throw new BadRequestException("An error occurred")
      }
      return data;
    } catch (error) {
      console.error(error);
      const message = AdvanceSearch.getQueryErrorMessage(error, filters);
      if (message) {
        throw new BadRequestException(message);
      }
      return { result: [], total: 0 , hasNextPage:false};
    }
  }

  public async advanceFilters({
    limit,
    page,
    listName,
    userId,
    filters,
    relations,
    filterList,
    sortList,
    defaultSortKey,
    overrideFilters = false,
    listViewId,
    countOnly = false,
    defaultSortKeyOrder,
    ...rest
  }: IAdvanceFilters<T>) {
    const { defaultView, config } = await this.listCacheService.getListConfig(
      listName,
      userId,
      listViewId,
    );
    const sort: SortItem[] = [];
    const filter: FilterItem[] = [];

    const filtersArray = filterList ? filterList : defaultView.filters;
    const orArray = rest.orList || undefined;
    const orFilters: FilterItem[] = [];
    const sortsArray = sortList ? sortList : defaultView.sort;

    for (let i = 0; i < filtersArray.length; i++) {
      const filterElement = filtersArray[i];

      if (!filterElement.listColumnMeta) {
        continue;
      }

      const name = filterElement.listColumnMeta?.name;
      const operation = filterElement?.operator as FilterOperation;
      let value = filterElement.values as string[];
      if (!Array.isArray(filterElement.values)) {
        value = JSON.parse(filterElement.values.replace(/\\"/g, '"'));
      }
      const filterItem = {
        name,
        value,
        operation,
      };
      filter.push(filterItem);
    }

    if (orArray && Array.isArray(orArray)) {
      for (let i = 0; i < orArray.length; i++) {
        const filterElement = orArray[i];

        if (!filterElement.listColumnMeta) {
          continue;
        }

        const name = filterElement.listColumnMeta?.name;
        const operation = filterElement?.operator as FilterOperation;
        const value = filterElement.values as string[];
        const filterItem = {
          name,
          value,
          operation,
        };
        orFilters.push(filterItem);
      }
    }

    for (let i = 0; i < sortsArray.length; i++) {
      const sortEle = sortsArray[i];

      if (!sortEle.listColumnMeta) {
        continue;
      }
      const key = sortEle.listColumnMeta.name;
      const order = sortEle.sortOrder as SortOrder;
      const sortItem = {
        key,
        order,
      };
      sort.push(sortItem);
    }

    // Default sort
    if (defaultSortKey && sortsArray.length === 0) {
      sort.push({
        key: defaultSortKey,
        order: defaultSortKeyOrder ? defaultSortKeyOrder : SortOrder.DESC,
      });
    }

    if (filters && filters.length) {
      for (let i = 0; i < filters.length; i++) {
        const filterItem = filters[i];
        if (!overrideFilters) {
          filter.push(filterItem);
        } else {
          filter.unshift(filterItem);
        }
      }
    }

    const OR_QUERY = await this.getAllRolesFilters(userId, listName);
    let select : any = null;
    
    const generalGroup = config?.groups[0];
    if(generalGroup){
      select = this.getSelectParams(listName, generalGroup.meta);
    }
    
    const resp = await this.advanceSearch({
      filters: filter,
      sort: sort,
      limit,
      page,
      relations: relations || [],
      OR: this.combineORConditions(rest.OR || [], OR_QUERY as FindOptionsWhere<T>[]),
      all: rest?.all || false,
      or: orFilters,
      countOnly,
      select,
    });

    if(!resp){
      throw new BadRequestException("An error occurred") 
    }

    if (rest?.all && defaultView) {
      const view = config?.views.find((view) => view.id === defaultView?.id);
      return { ...resp, listConfig: config, view };
    }
    return { ...resp, listConfig: config };
  }

  public getSelectParams(listName:ListNames,columns:ListColumnsMeta[]){
    const select = this.getListingSelectParams(listName);

    if(!select){
      return this.setListingSelectParams(listName , columns)
    };

    return select;
  }

  public async transformIntoAdvanceFilters(
    listName: ListNames,
    userId: number,
    total: number,
    result: any[],
    listViewId?:number
  ) {
    const { defaultView, config } = await this.listCacheService.getListConfig(
      listName,
      userId,
      listViewId
    );

    const res = {
      result,
      listConfig: config,
      total,
      defaultView,
    };

    return res;
  }

  public addSortToQuery = (
    query: string,
    sort?: {
      sortOrder: 'ASC' | 'DESC';
      listColumnMeta: {
        name: string;
      };
    }[],
  ): string => {
    if (!sort?.length) return query;

    const orderByClause = sort
      .map((s) => `${s.listColumnMeta.name} ${s.sortOrder}`)
      .join(', ');

    const optionIndex = query.toUpperCase().lastIndexOf('OPTION');

    if (optionIndex === -1) {
      return `${query} ORDER BY ${orderByClause}`;
    }

    return `${query.slice(
      0,
      optionIndex,
    )}ORDER BY ${orderByClause} ${query.slice(optionIndex)}`;
  };

  private deepMerge(target: any, source: any) {
    const output = Object.assign({}, target);
    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach((key) => {
        if (this.isObject(source[key])) {
          if (!(key in target)) Object.assign(output, { [key]: source[key] });
          else output[key] = this.deepMerge(target[key], source[key]);
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
  }

  private isObject(item: any) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  protected async extractRawQuery(queryBuilder: QueryBuilder<T>) {
    const query = queryBuilder.getQuery();
    const parameters = queryBuilder.getParameters();

    let interpolatedQuery = query;

    Object.entries(parameters).forEach(([key, value]) => {
      let replacementValue;

      if (value === null) {
        replacementValue = 'NULL';
      } else if (Array.isArray(value)) {
        replacementValue =
          value.length > 0
            ? `${value
                .map((v) =>
                  typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : v,
                )
                .join(', ')}`
            : '';
      } else if (value instanceof Date) {
        replacementValue = `'${value
          .toISOString()
          .slice(0, 19)
          .replace('T', ' ')}'`;
      } else if (typeof value === 'string') {
        replacementValue = `'${value.replace(/'/g, "''")}'`;
      } else {
        replacementValue = value;
      }

      console.log(replacementValue, 'Replacement');
      interpolatedQuery = interpolatedQuery.replace(
        new RegExp(`:${key}\\b`, 'g'),
        replacementValue,
      );
      interpolatedQuery = interpolatedQuery.replace(
        new RegExp(`:...${key}\\b`, 'g'),
        replacementValue,
      );
    });

    return interpolatedQuery;
  }

  protected getDateRangeFilter(filters: FilterItem[], dateColumn: string): string {
    const dateFilter = filters.find((f)=>f.name === dateColumn)
    if (!dateFilter) {
      return '';
    }
    const [startDate, endDate] = dateFilter.value;
    const columnName = dateColumn || dateFilter?.name;
    return `AND ${columnName} BETWEEN '${startDate}' AND '${endDate}'`;
  }

  protected removeDateFilter(filters: FilterDto[],  dateColumn: string): any[] {
    if (!filters) return [];
    return filters.filter((f)=>f.listColumnMeta.name !== dateColumn);
  }

  async getViewAndFilters({ listName, userId, listViewId, filterList, filters, overrideFilters }: GetViewAndFilter) {
    const filter: FilterItem[] = [];

    const { defaultView, config } = await this.listCacheService.getListConfig(
      listName,
      userId,
      listViewId,
    );

    const filtersArray = filterList ? filterList : defaultView.filters;

    for (let i = 0; i < filtersArray.length; i++) {
      const filterElement = filtersArray[i];

      if (!filterElement.listColumnMeta) {
        continue;
      }

      const name = filterElement.listColumnMeta?.name;
      const operation = filterElement?.operator as FilterOperation;
      let value = filterElement.values as string[];
      if (!Array.isArray(filterElement.values)) {
        value = JSON.parse(filterElement.values.replace(/\\"/g, '"'));
      }
      const filterItem = {
        name,
        value,
        operation,
      };
      filter.push(filterItem);
    }

    if (filters && filters.length) {
      for (let i = 0; i < filters.length; i++) {
        const filterItem = filters[i];
        if (!overrideFilters) {
          filter.push(filterItem);
        } else {
          filter.unshift(filterItem);
        }
      }
    }

    return {
      defaultView,
      config,
      filter
    }

  }

  private combineORConditions(
    restOR: FindOptionsWhere<T>[],
    roleOR: FindOptionsWhere<T>[]
  ): FindOptionsWhere<T>[] {
    if (!restOR.length && !roleOR.length) {
      return [];
    }
    
    if (!restOR.length) {
      return roleOR;
    }
    
    if (!roleOR.length) {
      return restOR;
    }
  
    const combined: FindOptionsWhere<T>[] = [];
    
    restOR.forEach(restCondition => {
      roleOR.forEach(roleCondition => {
        const mergedCondition = this.deepMerge(restCondition, roleCondition);
        combined.push(mergedCondition);
      });
    });
    
    return combined;
  }
}
