import { Test, TestingModule } from '@nestjs/testing';
import { ListViewColumnsService } from './list-view-columns.service';

describe('ListViewColumnsService', () => {
  let service: ListViewColumnsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListViewColumnsService],
    }).compile();

    service = module.get<ListViewColumnsService>(ListViewColumnsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
