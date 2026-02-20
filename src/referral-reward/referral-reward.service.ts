import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateReferralRewardDto } from './dto/update-referral-reward.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReferralReward } from './entities/referral-reward.entity';
import { User } from 'src/users/entities/user.entity';
import { Referrals } from 'src/referral-program/entities/referrals.entity';
import {
  ReferralRewardLedger,
  RewardAction,
} from 'src/referral-program/entities/referral-reward-legder.entity';
import { I18nContext } from 'nestjs-i18n';
import { Transaction } from 'src/transaction/entities/transaction.entity';

@Injectable()
export class ReferralRewardService {
  constructor(
    @InjectRepository(ReferralReward)
    private readonly referralRewardRepository: Repository<ReferralReward>,
    @InjectRepository(ReferralRewardLedger)
    private readonly referralRewardLedgerRepository: Repository<ReferralRewardLedger>,
  ) {}

  async getUserReferralWallet(user: User) {
    const isExist = await this.referralRewardRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
      },
    });
    if (!isExist) {
      const referralReward = await this.referralRewardRepository.save({
        balance: 0,
        totalEarned: 0,
        totalWithdraw: 0,
        user: {
          id: user.id,
        },
      });
      return referralReward;
    }
    return isExist;
  }

  async incrementRegisteredInUserReferral(user: User){
    const reward = await this.getUserReferralWallet(user);
    const registered = reward.registered + 1;
      await this.referralRewardLedgerRepository.save(
        this.referralRewardLedgerRepository.create({
          balance:reward.balance,
          totalEarned:reward.totalEarned,
          totalWithdraw:reward.totalWithdraw,
          balanceAfter:reward.balance,
          totalEarnedAfter:reward.totalEarned,
          totalWithdrawAfter:reward.totalWithdraw,
          action:RewardAction.INCREMENT_REGISTERED,
          version:reward.version,
          amount: 0,
          referralReward:reward,
        }),
      );
     await this.referralRewardRepository.update(reward.id , {registered})
  }

  async verifyUserReferralWalletBalance(user: User, amount: number) {
    const i18n = I18nContext.current();
    const wallet = await this.getUserReferralWallet(user);
    const isAmountExistInWallet = wallet.balance >= amount;
    if (!isAmountExistInWallet) {
      const message = i18n?.t('errors.transaction.insufficientFunds');
      throw new BadRequestException(message);
    }
    return wallet;
  }

  async credit(referrals: Referrals) {
    const referralReward = await this.getUserReferralWallet(referrals.referrer);
    const program = referrals.referralProgram;
    const rewardAmount = program.reward;
    let reward: null | number = null;
    if (referralReward && program && rewardAmount) {
      const action = RewardAction.REWARD_CREDIT;
      const totalEarned = referralReward.totalEarned;
      const balance = referralReward.balance;
      const totalEarnedAfter = totalEarned + rewardAmount;
      const balanceAfter = balance + rewardAmount;
      const totalWithdraw = referralReward.totalWithdraw;
      const totalWithdrawAfter = referralReward.totalWithdraw;
      const version = referralReward.version;
      await this.referralRewardLedgerRepository.save(
        this.referralRewardLedgerRepository.create({
          balance,
          totalEarned,
          totalWithdraw,
          balanceAfter,
          totalEarnedAfter,
          totalWithdrawAfter,
          action,
          version,
          amount: rewardAmount,
          referralReward,
          referrals,
        }),
      );
      const successful = referralReward.successful + 1;
      await this.referralRewardRepository.update(referralReward.id, {
        balance: balanceAfter,
        totalEarned: totalEarnedAfter,
        successful
      });
      reward = rewardAmount;
    }
    return { reward };
  }

  async debit(transaction: Transaction) {
    const { user } = transaction;
    const referralReward = await this.getUserReferralWallet(user);
    const amount = transaction.netAmount;
    let value: null | number = null;
    if (amount && referralReward) {
      const action = RewardAction.REWARD_WITHDRAW;
      const totalEarned = referralReward.totalEarned;
      const totalEarnedAfter = totalEarned;

      const balance = referralReward.balance;
      const balanceAfter = balance - amount;

      const totalWithdraw = referralReward.totalWithdraw;
      const totalWithdrawAfter = referralReward.totalWithdraw + amount;
      const version = referralReward.version;

      await this.referralRewardLedgerRepository.save(
        this.referralRewardLedgerRepository.create({
          balance,
          totalEarned,
          totalWithdraw,
          balanceAfter,
          totalEarnedAfter,
          totalWithdrawAfter,
          action,
          version,
          amount,
          referralReward,
          transaction,
        }),
      );
      await this.referralRewardRepository.update(referralReward.id, {
        balance: balanceAfter,
        totalWithdraw: totalWithdrawAfter,
      });
      value = amount;
    }
    if (!amount) {
      throw new BadRequestException('An Error Occurred While Transfer');
    }
    if (!value) {
      throw new BadRequestException('An Error Occurred While Transfer');
    }
    return { amount: value };
  }
}
