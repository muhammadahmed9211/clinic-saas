import { Test, TestingModule } from '@nestjs/testing';
import { TableOrderController } from './table-order.controller';
import { TableOrderService } from './table-order.service';

describe('TableOrderController', () => {
  let controller: TableOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TableOrderController],
      providers: [TableOrderService],
    }).compile();

    controller = module.get<TableOrderController>(TableOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
