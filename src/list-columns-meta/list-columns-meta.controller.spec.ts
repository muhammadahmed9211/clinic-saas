import { Test, TestingModule } from '@nestjs/testing';
import { ListColumnsMetaController } from './list-columns-meta.controller';
import { ListColumnsMetaService } from './list-columns-meta.service';

describe('ListColumnsMetaController', () => {
  let controller: ListColumnsMetaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListColumnsMetaController],
      providers: [ListColumnsMetaService],
    }).compile();

    controller = module.get<ListColumnsMetaController>(
      ListColumnsMetaController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
