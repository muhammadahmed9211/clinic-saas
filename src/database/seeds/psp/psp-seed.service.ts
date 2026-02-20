import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  PSP,
  PspDisplayName,
  PspNames,
} from 'src/transaction/entities/psp.entity';
@Injectable()
export class PspSeedService {
  constructor(
    @InjectRepository(PSP)
    private repository: Repository<PSP>,
  ) {}

  async run() {
    const countPSP = await this.repository.count();
    const data = [
      {
        name: PspNames.BridgerPay,
        displayName: PspDisplayName.BridgerPay,
        description: PspDisplayName.BridgerPay,
      },
      {
        name: PspNames.BankTransfer,
        displayName: PspDisplayName.BankTransfer,
        description: PspDisplayName.BankTransfer,
      },
      {
        name: PspNames.CryptoDeposit,
        displayName: PspDisplayName.CryptoDeposit,
        description: PspDisplayName.CryptoDeposit,
      },
      {
        name: PspNames.NONE,
        displayName: PspDisplayName.NONE,
        description: PspDisplayName.NONE,
      },
      {
        name: PspNames.TELR,
        displayName: PspDisplayName.TELR,
        description: PspDisplayName.TELR,
      },
      {
        name: PspNames.DPO,
        displayName: PspDisplayName.DPO,
        description: PspDisplayName.DPO,
      },
      {
        name: PspNames.N_GENIUS,
        displayName: PspDisplayName.N_GENIUS,
        description: PspDisplayName.N_GENIUS,
      },
      {
        name: PspNames.EPay,
        displayName: PspDisplayName.EPay,
        description: PspDisplayName.EPay,
      },
    ];

    const allPsp = data.map((p) => {
      return this.repository.create(p);
    });

    if (!countPSP) {
      await this.repository.save(allPsp);
    }
  }
}
