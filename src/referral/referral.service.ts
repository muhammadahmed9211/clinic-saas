import { Injectable } from '@nestjs/common';

@Injectable()
export class ReferralService {
  getReferralData() {
    return {
      registeredReferrals: 10,
      successfulReferrals: 6,
      bonuses: {
        totalEarned: 300,
        withdrewAmount: 200,
        remainingBalance: 100,
      },
    };
  }

  async sendInvite(email: string) {
    // Just returning success message -logic pending
    return {
      url: 'https://client.siliconfort.com/register-live-trading-account-F1',
      message: `Invitation sent successfully`,
    };
  }

  async withdrawBonus() {
    //logic pending
    return {
      message: 'Withdrawal request submitted successfully',
    };
  }
}
