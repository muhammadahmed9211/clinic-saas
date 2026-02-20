import { Test, TestingModule } from '@nestjs/testing';
import { ListColumnsSortController } from './list-columns-sort.controller';
import { ListColumnsSortService } from './list-columns-sort.service';

describe('ListColumnsSortController', () => {
  let controller: ListColumnsSortController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListColumnsSortController],
      providers: [ListColumnsSortService],
    }).compile();

    controller = module.get<ListColumnsSortController>(
      ListColumnsSortController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
