import { Test, TestingModule } from '@nestjs/testing';
import { ListFilterColumnsService } from './list-filter-columns.service';

describe('ListFilterColumnsService', () => {
  let service: ListFilterColumnsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListFilterColumnsService],
    }).compile();

    service = module.get<ListFilterColumnsService>(ListFilterColumnsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
