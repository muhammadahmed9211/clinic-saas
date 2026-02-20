import { Test, TestingModule } from '@nestjs/testing';
import { PowerBiController } from './power-bi.controller';
import { PowerBiService } from './power-bi.service';

describe('PowerBiController', () => {
  let controller: PowerBiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PowerBiController],
      providers: [PowerBiService],
    }).compile();

    controller = module.get<PowerBiController>(PowerBiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
