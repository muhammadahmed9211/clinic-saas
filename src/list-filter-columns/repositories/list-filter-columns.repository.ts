import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { DataSource } from 'typeorm';
import { ListColumnFilter } from '../entities/list-filter-column.entity';
import { AdvanceSearch, byPassRepositories, internalListingList } from 'src/database/base-repository/advance.search';
import { ListNames } from 'src/list-item/dto/create-list-item.dto';
import { FilterItem } from 'src/database/base-repository/dto/advance-search.dto';
import { ListCacheService } from 'src/list-cache/list-cache-service';

@Injectable()
export class ListFilterColumnsRepository extends BaseRepository<ListColumnFilter> {
  constructor(dataSource: DataSource, listCacheService: ListCacheService) {
    super(ListColumnFilter, dataSource, listCacheService);
  }

  async isValidFilter(viewFilterId: number, filter: FilterItem) {
    const view = await this.listViewRepo.findOne({
      where: { id: viewFilterId },
      relations: ['list'],
    });
    if (!view?.list.name) {
      throw new BadRequestException('Error Finding the View');
    }
    const listRepo = AdvanceSearch.getListRepository(
      this.dataSource,
      view?.list.name as ListNames,
    );
    if (!listRepo) {
      throw new BadRequestException('Error Finding the List');
    }
    const query = AdvanceSearch.query([filter]);
    try {
      await listRepo.findOneBy({ ...query });
      return true;
    } catch (error) {
      console.error(error);
      const message = AdvanceSearch.getQueryErrorMessage(error, [filter]);
      if (message) {
        throw new BadRequestException(message);
      }
    }
    return false;
  }

  async isValidFilters(viewFilterId: number, filter: FilterItem[]) {
    const view = await this.listViewRepo.findOne({
      where: { id: viewFilterId },
      relations: ['list'],
    });
    if (!view?.list.name) {
      throw new BadRequestException('Error Finding the View');
    }
    const isInternalFilterList = internalListingList[view.list.name];
    if(isInternalFilterList){
      return isInternalFilterList
    }
    const shouldByPassCheck = byPassRepositories[view?.list.name];
    if(shouldByPassCheck){
      return true;
    }
    const listRepo = AdvanceSearch.getListRepository(
      this.dataSource,
      view?.list.name as ListNames,
    );
    if (!listRepo) {
      throw new BadRequestException('Error Finding the List');
    }
    const query = AdvanceSearch.query(filter);
    try {
      await listRepo.findOneBy({ ...query });
      return true;
    } catch (error) {
      console.error(error);
      const message = AdvanceSearch.getQueryErrorMessage(error, filter);
      if (message) {
        throw new BadRequestException(message);
      }
    }
    return false;
  }
}
