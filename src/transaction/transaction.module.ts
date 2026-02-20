import { Global, Module, forwardRef } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { BridgerPayService } from './services/bridgerpay/bridgerpay.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { ClientsModule } from 'src/users/clients.module';
import { WalletModule } from 'src/wallet/wallet.module';
import { BridgerPayController } from './services/bridgerpay/bridgerpay.controller';
import { AccountModule } from 'src/mt5/account/account.module';
import { TradeRequestModule } from 'src/mt5/trading/trade-requests/trade-requests.module';
import { TransactionRepository } from './repositories/transaction.repository';
import { WithdrawRequestRepository } from './repositories/widthdraw-request.repository.';
import { BankDetailsModule } from 'src/bank-details/bank-details.module';
import { MT5Service } from './services/mt5/mt5.service';
import { BinanceService } from './services/binance/binance.service';
import { Mt5Account } from 'src/mt5/entities/mt5-account.entity';
import { FileEntity } from 'src/files/entities/file.entity';
import { PSP } from './entities/psp.entity';
import { PspRepository } from './repositories/psp.repository';
import { BillingInformationModule } from 'src/billing-information/billing-information.module';
import { TransactionMethod } from './entities/transaction-method.entity';
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
import { Desk } from 'src/admin/custom-dropdown/custom-dropdown/entities/desk.entity';
import { BankAccount } from 'src/admin/bank-account/entities/bank-account.entity';
import { BankDetail } from 'src/bank-details/entities/bank-detail.entity';
import { UserKycModule } from 'src/user-kyc-docs/user-kyc-documents.module';
import { TransactionEvents } from './entities/transaction-events.entity';
import { TransactionEventsService } from './services/transcation-events/transaction-events.service';
import { UserCreditCardsModule } from 'src/user-credit-cards/user-credit-cards.module';
import { UserEWalletModule } from 'src/user-ewallet/user-ewallet.module';
import { Exchange } from './entities/exchange.entity';
import { TransactionActivityLogsService } from './services/transaction-activity-logs/transaction-activity-logs.service';
import { UserTask } from 'src/tasks/entities/user_task.entity';
import { Label } from 'src/tasks/entities/label.entity';
import { MasterTask } from 'src/tasks/entities/master_task.entity';
import { FilesModule } from 'src/files/files.module';
import { TransactionReceipt } from './entities/transaction-receipt.entity';
import { TransactionNotificationService } from './services/transcation-notification/transaction-notification.service';
import { NotificationModule } from 'src/notification/notification.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { TransactionMailService } from './services/transcation-email/transaction-mail.service';
import { Client } from 'src/users/entities/client.entity';
import { MailModule } from 'src/mail/mail.module';
import { TransactionTaskService } from './services/transcation-tasks/transaction-tasks.service';
import { TaskModule } from 'src/admin/task/task.module';
import { User } from 'src/users/entities/user.entity';
import { LegacyService } from './services/legacy/legacy.service';
import { LegacyController } from './services/legacy/legacy.controller';
import { ExportedTransactions } from './entities/export.entity';
import { NGeniusService } from './services/n-genius/n-genius.service';
import { DpoService } from './services/dpo/dpo.service';
import { DpoController } from './services/dpo/dpo.controller';
import { NGeniusController } from './services/n-genius/n-genius.controller';
import { TransactionUtilsService } from './services/utils/utils.service';
import { AggregatorModule } from 'src/aggregator/aggregator.module';
import { WithdrawRequest } from './entities/withdraw-request.entity';
import { PraxisController } from './services/praxis/praxis.controller';
import { PraxisService } from './services/praxis/praxis.service';
import { MyFatoorahController } from './services/my-fatoorah/myfatoorah.controller';
import { MyFatoorahService } from './services/my-fatoorah/myfatoorah.service';
import { ClientRepository } from 'src/users/repositories/client.repository';
import { AlphaPayController } from './services/alphapay/alphapay.controller';
import { AlphaPayService } from './services/alphapay/alphapay.service';
import { notes } from 'src/admin/kyc/entities/kycNotes.entity';
import { Lead } from 'src/admin/leads/entities/lead.entity';
import { OtpModule } from 'src/otp/otp.module';
import { Otp } from 'src/users/entities/otp.entity';
import { AdminKycModule } from 'src/admin/kyc/kyc.module';
import { MaskDataModule } from 'src/roles/maskData/maskData.module';
import { TransactionJobService } from './services/transaction-job/transaction-job.service';
import { KafkaModule } from 'src/kafka/kafka.module';
import { TransactionWidgetsService } from './services/transaction-widgets/transaction-widgets.service';
import { SupportedCrypto } from './entities/supported-crypto.entity';
import { CryptoNetwork } from './entities/crypto-network.entity';
import { Partitioners } from 'kafkajs';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { ClientsModule as KafkaClientsModule, Transport } from '@nestjs/microservices';
import { Ledger } from 'src/wallet/entities/ledger.entity';
import { LedgerRepository } from 'src/wallet/repositories/ledger.repository';
import { JenaPayService } from './services/jenapay/jenapay.service';
import { JenaPayController } from './services/jenapay/jenapay.controller';
import { PspModule } from 'src/psp/psp.module';
import { ReferralRewardModule } from 'src/referral-reward/referral-reward.module';
import { BonusReward } from './entities/bonus-reward.entity';
import { BonusModule } from 'src/bonus/bonus.module';

@Global()
@Module({
  imports: [
    HttpModule,
    AdminKycModule,
    forwardRef(() => ClientsModule),
    UserEWalletModule,
    forwardRef(() => WalletModule),
    forwardRef(() => AccountModule),
    TradeRequestModule,
    BankDetailsModule,
    BillingInformationModule,
    UserCreditCardsModule,
    UserKycModule,
    FilesModule,
    NotificationModule,
    MailerModule,
    MailModule,
    TaskModule,
    HttpModule,
    AggregatorModule,
    TaskModule,
    OtpModule,
    MaskDataModule,
    KafkaModule,
    BonusModule,
     PspModule,
    // TransferModule,
    TypeOrmModule.forFeature([
      TransactionMethod,
      Transaction,
      Mt5Account,
      FileEntity,
      PSP,
      Operator,
      Desk,
      BankAccount,
      BankDetail,
      TransactionEvents,
      Exchange,
      UserTask,
      Label,
      MasterTask,
      TransactionReceipt,
      User,
      Client,
      ExportedTransactions,
      WithdrawRequest,
      notes,
      Lead,
      Otp,
      SupportedCrypto,
      CryptoNetwork,
      Ledger,
      BonusReward
    ]),
    ReferralRewardModule
  ],
  controllers: [
    TransactionController,
    BridgerPayController,
    DpoController,
    NGeniusController,
    MyFatoorahController,
    LegacyController,
    PraxisController,
    AlphaPayController,
    JenaPayController
  ],
  providers: [
    TransactionRepository,
    TransactionActivityLogsService,
    WithdrawRequestRepository,
    BinanceService,
    TransactionEventsService,
    PspRepository,
    BridgerPayService,
    TransactionService,
    TransactionNotificationService,
    TransactionMailService,
    TransactionTaskService,
    MT5Service,
    LegacyService,
    NGeniusService,
    MyFatoorahService,
    DpoService,
    PraxisService,
    TransactionUtilsService,
    ClientRepository,
    AlphaPayService,
    TransactionJobService,
    TransactionWidgetsService, 
    LedgerRepository,
    JenaPayService,
    LedgerRepository
  ],
  exports: [
    TransactionService,
    WithdrawRequestRepository,
    TransactionRepository,
    BridgerPayService,
    MT5Service,
    TransactionJobService,
    TransactionWidgetsService,
  ],
})
export class TransactionModule {}
