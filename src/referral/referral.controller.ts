import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ReferralService } from './referral.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({ path: 'referral', version: '1' })
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Get('invite-friend')
  getReferralSummary() {
    return this.referralService.getReferralData();
  }

  @Post('send-invite')
  async sendInvite(@Body('email') email: string) {
    return this.referralService.sendInvite(email);
  }

  @Post('withdraw')
  async withdrawBonus() {
    return this.referralService.withdrawBonus();
  }
}
