import { Test, TestingModule } from '@nestjs/testing';
import { ListColumnsGroupService } from './list-columns-group.service';

describe('ListColumnsGroupService', () => {
  let service: ListColumnsGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListColumnsGroupService],
    }).compile();

    service = module.get<ListColumnsGroupService>(ListColumnsGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
