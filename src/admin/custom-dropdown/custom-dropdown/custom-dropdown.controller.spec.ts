import { Test, TestingModule } from '@nestjs/testing';
import { CustomDropdownController } from './custom-dropdown.controller';

describe('CustomDropdownController', () => {
  let controller: CustomDropdownController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomDropdownController],
    }).compile();

    controller = module.get<CustomDropdownController>(CustomDropdownController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
