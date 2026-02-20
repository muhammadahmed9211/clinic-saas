import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankAccount } from 'src/admin/bank-account/entities/bank-account.entity';
import { PSP } from 'src/transaction/entities/psp.entity';
import {
  Methods,
  TransactionMethod,
} from 'src/transaction/entities/transaction-method.entity';
import {
  Dictionary,
  IWidgetResponseType,
  TransactionRepository,
} from 'src/transaction/repositories/transaction.repository';
import { In, Repository } from 'typeorm';

@Injectable()
export class TransactionWidgetsService implements OnModuleInit {
  private methods: TransactionMethod[];
  private psp: PSP[];
  private bankAccount: BankAccount[];

  constructor(
    private readonly transactionRepository: TransactionRepository,
    @InjectRepository(TransactionMethod)
    private readonly transactionMethodRepository: Repository<TransactionMethod>,
    @InjectRepository(PSP)
    private readonly pspRepository: Repository<PSP>,
    @InjectRepository(BankAccount)
    private readonly bankAccountRepository: Repository<BankAccount>,
  ) {}
  get config() {
    const allowedMethods = [
      Methods.CREDIT_CARD,
      Methods.CRYPTO,
      Methods.WIRE,
      Methods.E_WALLET,
      Methods.EXCHANGE,
    ];
    const allowedPsp = [];

    const pspDictionary: Dictionary = {};
    this.psp.forEach(({ id, displayName }) => {
      pspDictionary[id] = displayName;
    });

    const bankAccountDictionary: Dictionary = {};
    this.bankAccount.forEach(({ id, bankName }) => {
      bankAccountDictionary[id] = bankName;
    });

    return {
      allowedMethods,
      allowedPsp,
      pspDictionary,
      bankAccountDictionary,
    };

  }

  async onModuleInit() {
    const psp = await this.pspRepository.find({ withDeleted: true });
    const bankAccount = await this.bankAccountRepository.find({
      withDeleted: true,
    });

    this.psp = psp;
    this.bankAccount = bankAccount;

    const { allowedMethods } = this.config;

    const methods = await this.transactionMethodRepository.find({
      where: {
        method: In(allowedMethods),
      },
    });
    this.methods = methods;
  }

  async getDepositSummaryByMethodsAndPsp(now:Date, filters:any) {
    const allowedMethods = [Methods.CREDIT_CARD, Methods.CRYPTO, Methods.WIRE];
    const methods = this.methods.filter((m)=>{
        const isAllowed = allowedMethods.find((method)=> m.method === method)
        return !!isAllowed
    });
    const resp =
      await this.transactionRepository.getDepositSummaryByMethodsAndPsp(
        methods,
        now,
        filters.clientFilter
      );
    return resp;
  }


  async getDepositAndWithdrawSummaryByMethods(now:Date, filters:any) {
    const allowedMethods = [Methods.CREDIT_CARD, Methods.CRYPTO, Methods.WIRE, Methods.EXCHANGE];
    const methods = this.methods.filter((m)=>{
        const isAllowed = allowedMethods.find((method)=> m.method === method)
        return !!isAllowed
    });
    const resp =
      await this.transactionRepository.getDepositAndWithdrawSummaryByMethods(
        methods,
        now,
        filters.clientFilter
      );
    return resp;
  }

  async getPspApprovedAndFailedDepositSummary(filter:any) {
    const resp =
      await this.transactionRepository.getPspApprovedAndFailedDepositSummary(filter.clientFilter);
    return resp;
  }

  async getLatestTransaction() {
    const resp = await this.transactionRepository.getLatestTransaction();
    return resp;
  }

  async getDepositSummaryByMethods(): Promise<IWidgetResponseType[]> {
    const resp = await this.transactionRepository.getDepositSummaryByMethods(
      this.methods,
      'INITIATED',
    );
    return resp;
  }

  async getNetDepositSummaryByMethods(): Promise<IWidgetResponseType[]> {
    const resp = await this.transactionRepository.getDepositSummaryByMethods(
      this.methods,
      'NET',
    );
    return resp;
  }

  async getNetDepositPspSettlement(now:Date) {
    const resp =
      await this.transactionRepository.monthlyPspSettlementAmount(now);
    return resp;
  }
}
