import { Test, TestingModule } from '@nestjs/testing';
import { ListColumnsMetaService } from './list-columns-meta.service';

describe('ListColumnsMetaService', () => {
  let service: ListColumnsMetaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListColumnsMetaService],
    }).compile();

    service = module.get<ListColumnsMetaService>(ListColumnsMetaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
