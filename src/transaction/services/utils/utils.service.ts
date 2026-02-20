import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionUtilsService {
  constructor() {}

  get AEDtoUsdConversion() {
    return 3.67;
  }

  convertUSDToAED(amount: number): number {
    const usdAmount = amount * this.AEDtoUsdConversion;
    const toFixed = usdAmount.toFixed(2);
    return Number(toFixed);
  }

  convertAEDToUSD(amount: number): number {
    const usdAmount = amount / this.AEDtoUsdConversion;
    const toFixed = usdAmount.toFixed(2);
    return Number(toFixed);
  }

  createComment(comment: string, transactionId: string) {
    const first8 = transactionId.substring(0, 8); // or uuid.slice(0, 8);
    const last12 = transactionId.substring(transactionId.length - 12); // or
    const id = `${first8}*${last12}`;
    return `${comment}:${id}`;
  }

  normalizeAmount(amount:number){
    const normaleAmount = amount.toFixed(2);
    return Number(normaleAmount);
  }
}
