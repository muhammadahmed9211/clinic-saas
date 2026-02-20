import { Test, TestingModule } from '@nestjs/testing';
import { TableOrderService } from './table-order.service';

describe('TableOrderService', () => {
  let service: TableOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TableOrderService],
    }).compile();

    service = module.get<TableOrderService>(TableOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
