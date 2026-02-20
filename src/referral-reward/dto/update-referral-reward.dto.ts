import { PartialType } from '@nestjs/swagger';
import { CreateReferralRewardDto } from './create-referral-reward.dto';

export class UpdateReferralRewardDto extends PartialType(CreateReferralRewardDto) {}
