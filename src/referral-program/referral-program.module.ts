import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReferralProgramService } from './referral-program.service';
import { ReferralProgram } from './entities/referral-program.entity';
import { Referrals } from './entities/referrals.entity';
import { User } from 'src/users/entities/user.entity';
import { ReferralRewardLedger } from './entities/referral-reward-legder.entity';
import { ReferralRule } from './entities/referral-rule.entity';
import { ReferralProgramController } from './referral-program.controller';
import { UserRepository } from 'src/users/repositories/user.repository';
import { ReferralReward } from 'src/referral-reward/entities/referral-reward.entity';
import { ReferralRewardModule } from 'src/referral-reward/referral-reward.module';
import { AdminReferralProgramController } from 'src/admin/client/referral-program/referral-program.controller';
import { ClientRepository } from 'src/users/repositories/client.repository';
import { ReferralsRepository } from './repositories/referrals.repository';
import { LabelTranslation } from 'src/tasks/entities/label_translation.entity';
import { Label } from 'src/tasks/entities/label.entity';
import { Regulations } from 'src/admin/regulations/entities/regulations.entity';
import { RuleGroup } from 'src/rule/entities/rule-group.entity';
import { ReferralProgramRepository } from './repositories/referral-program.repository';
import { FileEntity } from 'src/files/entities/file.entity';
import { FilesService } from 'src/files/files.service';
import { FilesModule } from 'src/files/files.module';

@Module({
  controllers:[ReferralProgramController, AdminReferralProgramController],

  imports: [
    TypeOrmModule.forFeature([
      ReferralProgram,
      ReferralReward,
      ReferralRewardLedger,
      ReferralRule,
      Referrals,
      User,
      Label,
      LabelTranslation,
      Regulations,
      RuleGroup,
      FileEntity
    ]),
    ReferralRewardModule,
    FilesModule
  ],
  providers: [ReferralProgramService, UserRepository, ClientRepository, ReferralsRepository, ReferralProgramRepository], 
  exports:[ReferralProgramService]
})
export class ReferralProgramModule {}
