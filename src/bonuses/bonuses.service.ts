import { Injectable } from '@nestjs/common';

export const BONUS_DATA = [
  {
    category: 'General',
    bonuses: [
      {
        code: 'UCL25',
        minDeposit: 1000,
        bonusAmount: 275,
        currency: 'AED',
      },
    ],
  },
  {
    category: 'First deposit',
    bonuses: [
      {
        code: 'BRONZE',
        minDeposit: 2000,
        bonusAmount: 500,
        currency: 'AED',
      },
      {
        code: 'SILVER',
        minDeposit: 2000,
        bonusAmount: 500,
        currency: 'AED',
      },
    ],
  },
];

@Injectable()
export class BonusesService {
  getBonuses() {
    return BONUS_DATA;
  }

  applyBonus(code: string) {
    for (const category of BONUS_DATA) {
      const found = category.bonuses.find(
        (bonus) => bonus.code.toUpperCase() === code.toUpperCase(),
      );
      if (found) {
        return {
          status: 'success',
          message: 'Bonus applied successfully.',
          bonus: found,
        };
      }
    }

    return {
      status: 'error',
      message: 'Invalid bonus code.',
    };
  }
}
