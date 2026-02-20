import { Test, TestingModule } from '@nestjs/testing';
import { ListViewsFilterService } from './list-views-filter.service';

describe('ListViewsFilterService', () => {
  let service: ListViewsFilterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListViewsFilterService],
    }).compile();

    service = module.get<ListViewsFilterService>(ListViewsFilterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
