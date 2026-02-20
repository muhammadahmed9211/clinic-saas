import { Module } from '@nestjs/common';
import { ReferralRewardService } from './referral-reward.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReferralReward } from './entities/referral-reward.entity';
import { ReferralRewardLedger } from 'src/referral-program/entities/referral-reward-legder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReferralReward, ReferralRewardLedger])],
  providers: [ReferralRewardService],
  exports: [ReferralRewardService],
})
export class ReferralRewardModule {}
