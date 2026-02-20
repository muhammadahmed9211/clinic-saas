import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { DataSource } from 'typeorm';
import { AdvanceSearch } from 'src/database/base-repository/advance.search';
import { ListNames } from 'src/list-item/dto/create-list-item.dto';
import { SortItem } from 'src/database/base-repository/dto/advance-search.dto';
import { ListColumnsSort } from '../entities/list-columns-sort.entity';
import { ListCacheService } from 'src/list-cache/list-cache-service';
@Injectable()
export class ListColumnsSortRepository extends BaseRepository<ListColumnsSort> {
  constructor(dataSource: DataSource, listCacheService: ListCacheService) {
    super(ListColumnsSort, dataSource, listCacheService);
  }

  async isValidSort(viewFilterId: number, sort: SortItem) {
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
    const sortBy = AdvanceSearch.sorting([sort]);
    try {
      await listRepo.find({ order: sortBy, take: 2 });
      return true;
    } catch (error) {
      console.error(error);
      const message = AdvanceSearch.getQueryErrorMessage(error, []);
      if (message) {
        throw new BadRequestException(message);
      }
    }
    return false;
  }
}
