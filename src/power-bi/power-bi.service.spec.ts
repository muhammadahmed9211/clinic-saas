import { Test, TestingModule } from '@nestjs/testing';
import { PowerBiService } from './power-bi.service';

describe('PowerBiService', () => {
  let service: PowerBiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PowerBiService],
    }).compile();

    service = module.get<PowerBiService>(PowerBiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
