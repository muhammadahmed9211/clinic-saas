import { Module } from '@nestjs/common';
import { BonusService } from './bonus.service';
import { BonusController } from './bonus.controller';
import { Bonus } from './entities/bonus.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonusReward } from 'src/transaction/entities/bonus-reward.entity';
import { Label } from 'src/tasks/entities/label.entity';
import { LabelTranslation } from 'src/tasks/entities/label_translation.entity';
import { BonusRepository, BonusRepositoryProvider } from './repositories/bonus.repostitory';
import { Client } from 'src/users/entities/client.entity';
import { Currencies } from 'src/currencies/entities/currencies.entity';
import { BonusCountries } from './entities/bonus-countries.entity';
import { BankAccountModule } from 'src/admin/bank-account/bank-account.module';
import { BonusControllerV2 } from './bonus.controller.v2';

@Module({
  imports: [TypeOrmModule.forFeature([Bonus, BonusReward, Label, LabelTranslation, Client, Currencies, BonusCountries]), BankAccountModule],
  controllers: [BonusController, BonusControllerV2],
  providers: [BonusService, BonusRepositoryProvider],
  exports: [BonusService],
})
export class BonusModule {}