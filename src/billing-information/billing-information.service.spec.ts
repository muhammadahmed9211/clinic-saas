import { Test, TestingModule } from '@nestjs/testing';
import { BillingInformationService } from './billing-information.service';

describe('BillingInformationService', () => {
  let service: BillingInformationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BillingInformationService],
    }).compile();

    service = module.get<BillingInformationService>(BillingInformationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
