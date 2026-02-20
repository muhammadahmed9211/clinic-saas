import { Test, TestingModule } from '@nestjs/testing';
import { BillingInformationController } from './billing-information.controller';
import { BillingInformationService } from './billing-information.service';

describe('BillingInformationController', () => {
  let controller: BillingInformationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillingInformationController],
      providers: [BillingInformationService],
    }).compile();

    controller = module.get<BillingInformationController>(
      BillingInformationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
