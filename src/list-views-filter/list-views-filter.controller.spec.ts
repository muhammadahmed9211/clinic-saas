import { Test, TestingModule } from '@nestjs/testing';
import { ListViewsFilterController } from './list-views-filter.controller';
import { ListViewsFilterService } from './list-views-filter.service';

describe('ListViewsFilterController', () => {
  let controller: ListViewsFilterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListViewsFilterController],
      providers: [ListViewsFilterService],
    }).compile();

    controller = module.get<ListViewsFilterController>(
      ListViewsFilterController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
