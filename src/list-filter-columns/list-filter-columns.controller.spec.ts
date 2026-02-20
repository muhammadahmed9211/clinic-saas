import { Test, TestingModule } from '@nestjs/testing';
import { ListFilterColumnsController } from './list-filter-columns.controller';
import { ListFilterColumnsService } from './list-filter-columns.service';

describe('ListFilterColumnsController', () => {
  let controller: ListFilterColumnsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListFilterColumnsController],
      providers: [ListFilterColumnsService],
    }).compile();

    controller = module.get<ListFilterColumnsController>(
      ListFilterColumnsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
