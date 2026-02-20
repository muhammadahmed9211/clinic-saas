import { Test, TestingModule } from '@nestjs/testing';
import { ListViewColumnsController } from './list-view-columns.controller';
import { ListViewColumnsService } from './list-view-columns.service';

describe('ListViewColumnsController', () => {
  let controller: ListViewColumnsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListViewColumnsController],
      providers: [ListViewColumnsService],
    }).compile();

    controller = module.get<ListViewColumnsController>(
      ListViewColumnsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
