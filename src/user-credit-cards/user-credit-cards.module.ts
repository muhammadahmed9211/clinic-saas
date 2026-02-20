import { Module, forwardRef } from '@nestjs/common';
import { UserCreditCardsService } from './user-credit-cards.service';
import { UserCreditCardsController } from './user-credit-cards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCreditCard } from './entities/user-credit-card.entity';
import { TransactionModule } from 'src/transaction/transaction.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserCreditCard]),
    forwardRef(() => TransactionModule),
  ],
  controllers: [UserCreditCardsController],
  providers: [UserCreditCardsService],
  exports: [UserCreditCardsService],
})
export class UserCreditCardsModule {}
