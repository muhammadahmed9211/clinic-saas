import { Test, TestingModule } from '@nestjs/testing';
import { UserCreditCardsService } from './user-credit-cards.service';

describe('UserCreditCardsService', () => {
  let service: UserCreditCardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserCreditCardsService],
    }).compile();

    service = module.get<UserCreditCardsService>(UserCreditCardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
