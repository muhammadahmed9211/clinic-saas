import { Injectable } from '@nestjs/common';
import { FilterOperation } from 'src/database/base-repository/dto/advance-search.dto';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { ListNames } from 'src/list-item/dto/create-list-item.dto';
import { ClientRepository } from 'src/users/repositories/client.repository';
import { UserLifeCycle } from 'src/utils/enums/user-lifecycle.enum';
import { IPaginationOptions } from 'src/utils/types/pagination-options';

@Injectable()
export class ApplicantService {
  constructor(private readonly clientsRepository: ClientRepository) {}
  async findManyWithPagination({
    paginationOptions,
    userId,
    dto,
  }: {
    userId: number;
    dto?: ApplyListFilterSortColumnDto;
    paginationOptions: IPaginationOptions;
  }) {
    const filters = [
      {
        name: 'userLifeCycle',
        operation: FilterOperation.EQUALS,
        value: [UserLifeCycle.APPLICANT],
      },
      {
        name: 'isActive',
        operation: FilterOperation.EQUALS,
        value: [true],
      },
    ];
    const filterParam = {
      ...paginationOptions,
      userId,
      relations: [
        'customKycStatus',
        'recentTask',
        'partner',
        'photo',
        'role',
        'status',
        'customSaleStatus',
        'customRetentionStatus',
        'wallet',
        'lead',
        'commissionProfile',
        'commissionProfile.classification'
      ],
      listName: ListNames.CLIENTS,
      filters,
      filterList: dto?.filters || undefined,
      sortList: dto?.sort || undefined,
      defaultSortKey: 'createdAt',
      listViewId: dto?.listViewId,
      orList: dto?.or,
    };
    return this.clientsRepository.advanceFilters(filterParam);
  }

  async findManyWithPaginationIb({
    paginationOptions,
    userId,
    dto,
  }: {
    userId: number;
    dto?: ApplyListFilterSortColumnDto;
    paginationOptions: IPaginationOptions;
  }) {
    const filters = [
      {
        name: 'userLifeCycle',
        operation: FilterOperation.EQUALS,
        value: [UserLifeCycle.APPLICANT],
      },
      {
        name: 'isActive',
        operation: FilterOperation.EQUALS,
        value: [true],
      },
      {
        name: 'type',
        operation: FilterOperation.IN,
        value: ['Introducing Broker (IB)','Fund Manager (MAM)','Liquidity Solution (Broker)','Franchise Partner (Office)'], 
      },
    ];
    const filterParam = {
      ...paginationOptions,
      userId,
      relations: [
        'customKycStatus',
        'recentTask',
        'partner',
        'photo',
        'role',
        'status',
        'customSaleStatus',
        'customRetentionStatus',
        'wallet',
        'lead',
        'commissionProfile',
        'commissionProfile.classification'
      ],
      listName: ListNames.CLIENTS,
      filters,
      filterList: dto?.filters || undefined,
      sortList: dto?.sort || undefined,
      defaultSortKey: 'createdAt',
      listViewId: dto?.listViewId,
      orList: dto?.or,
    };
    return this.clientsRepository.advanceFilters(filterParam);
  }

}




