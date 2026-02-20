import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ListNames } from 'src/list-item/dto/create-list-item.dto';
import { ListName } from 'src/list-item/entities/list-name.entity';
import { RedisCoreService } from 'src/redis/redis.service';
import { User } from 'src/users/entities/user.entity';
import { ListViewsFilter } from 'src/list-views-filter/entities/list-views-filter.entity';

@Injectable()
export class ListCacheService {
  constructor(
    @InjectRepository(ListName)
    private readonly listNameRepository: Repository<ListName>,
    @InjectRepository(ListViewsFilter)
    private readonly listViewFilterRepository: Repository<ListViewsFilter>,
    private readonly redis: RedisCoreService,
  ) { }

  getKey(listName: ListNames) {
    const key = `LIST:${listName}`;
    return key;
  }

  getViewKey(viewId: number) {
    const key = `LIST_VIEW:${viewId}`;
    return key;
  }

  async getListConfig(
    listName: ListNames,
    userId: User['id'],
    listViewId?: number,
  ) {
    const key = this.getKey(listName);
    let config: ListName | null = null;
    let defaultView: null | ListViewsFilter = null;

    const views: ListViewsFilter[] = [];


    const isExist = (await this.redis.get({ key })) as string | null;
    if (isExist) {
      console.log('GETTING CONFIG FROM REDIS', listName);
      config = JSON.parse(isExist) as ListName;
    }

    if (!config) {
      console.log('GETTING CONFIG FROM DATABASE', listName);
      config = await this.listNameRepository.findOne({
        where: { name: listName },
        relations: [
          'groups',
          'views',
          'groups.meta'
        ],
        loadEagerRelations: false,

      });
      await this.redis.set({ key, value: JSON.stringify(config) });
    }

    // find default view based on user id and list view id (if provided)
    if (Array.isArray(config?.views)) {
      for (let i = 0; i < config.views.length; i++) {
        const view = config?.views[i];
        view.filters = [];
        view.columns = [];
        view.sort = [];

        if (view.userId === userId || view.isPublic) {
          views.push(view);
        }

        if (listViewId) {
          if (view.id === listViewId) {
            defaultView = view;
          }
        } else {
          if (view.isUserDefault && view.userId === userId) {
            defaultView = view;
          } else if (view.isDefault && !defaultView) {
            defaultView = view;
          }
        }
      }
    }

    if (!defaultView) {
      const msg = listViewId
        ? `No View Exist for View ${listViewId}`
        : 'Not Default View Exist for List';
      throw new BadRequestException(msg);
    }

    const viewKey = this.getViewKey(defaultView.id)
    const isViewExist = (await this.redis.get({ key: viewKey })) as string | null;

    if (isViewExist) {
      console.log('GETTING VIEW FROM REDIS', defaultView.id);
      defaultView = JSON.parse(isViewExist) as ListViewsFilter;

    } else {
      const defaultViewData = await this.listViewFilterRepository.findOne({
        where: {
          id: defaultView.id
        },
        relations: [
          'columns',
          'columns.listColumnsMeta',
          'filters',
          'filters.listColumnMeta',
        ],
        loadEagerRelations:false
      });

      if(defaultViewData){
        defaultView = defaultViewData
      }

      if (defaultView) {
        defaultView.sort = []
      }

      await this.redis.set({ key: viewKey, value: JSON.stringify(defaultView) });
    }

    const listConfig = structuredClone(config);

    if (listConfig && listConfig?.views) {
      // Get the default index index from user views
      const viewIndex =views.findIndex((v)=> v.id === defaultView?.id);
      if(viewIndex !== -1){
        //Add details of default view
        views[viewIndex] = defaultView
      }else {
        const msg = listViewId
        ? `No View Exist for View ${listViewId}`
        : 'Oops! Something went wrong while trying to display the requested view.';
      throw new BadRequestException(msg);
      }
      listConfig.views = views
    }

    return { defaultView, config: listConfig };
  }

  async deleteListConfig(listName: string) {
    if (listName) {
      const key = this.getKey(listName as ListNames);
      await this.redis.remove({ key });
    }
  }

  async deleteViewConfig(viewId: number) {
    if (viewId) {
      const key = this.getViewKey(viewId);
      await this.redis.remove({ key });
    }
  }

  async refreshViewsInList(listName: string) {
    let config: ListName | null = null;
    const key = this.getKey(listName as ListNames)
    const views = await this.listViewFilterRepository.find({
      where: {
        list: {
          name: listName
        },
      },
      loadEagerRelations: false
    });
    const isExist = (await this.redis.get({ key })) as string | null;
    if (isExist) {
      config = JSON.parse(isExist) as ListName;
      config.views = views
      await this.redis.set({ key, value: JSON.stringify(config) });
    }
  }
}
