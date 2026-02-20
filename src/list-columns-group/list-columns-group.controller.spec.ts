import { Test, TestingModule } from '@nestjs/testing';
import { ListColumnsGroupController } from './list-columns-group.controller';
import { ListColumnsGroupService } from './list-columns-group.service';

describe('ListColumnsGroupController', () => {
  let controller: ListColumnsGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListColumnsGroupController],
      providers: [ListColumnsGroupService],
    }).compile();

    controller = module.get<ListColumnsGroupController>(
      ListColumnsGroupController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
