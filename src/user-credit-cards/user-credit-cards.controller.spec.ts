import { Test, TestingModule } from '@nestjs/testing';
import { UserCreditCardsController } from './user-credit-cards.controller';
import { UserCreditCardsService } from './user-credit-cards.service';

describe('UserCreditCardsController', () => {
  let controller: UserCreditCardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserCreditCardsController],
      providers: [UserCreditCardsService],
    }).compile();

    controller = module.get<UserCreditCardsController>(
      UserCreditCardsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
