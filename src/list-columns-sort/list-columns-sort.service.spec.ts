import { Test, TestingModule } from '@nestjs/testing';
import { ListColumnsSortService } from './list-columns-sort.service';

describe('ListColumnsSortService', () => {
  let service: ListColumnsSortService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListColumnsSortService],
    }).compile();

    service = module.get<ListColumnsSortService>(ListColumnsSortService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
