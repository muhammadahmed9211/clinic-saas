import { Test, TestingModule } from '@nestjs/testing';
import { CustomDropdownService } from './custom-dropdown.service';

describe('CustomDropdownService', () => {
  let service: CustomDropdownService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomDropdownService],
    }).compile();

    service = module.get<CustomDropdownService>(CustomDropdownService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
