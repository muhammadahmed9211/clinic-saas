import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { Wallet } from './entities/wallet.entity';
import { Ledger } from './entities/ledger.entity';
import { WalletRepository } from './repositories/wallet.repository';
import { LedgerRepository } from './repositories/ledger.repository';
import { Server } from './entities/server.entity';
import { ServerRepository } from './repositories/server.repository';
import { TransactionRepository } from 'src/transaction/repositories/transaction.repository';
import { User } from 'src/users/entities/user.entity';
import { ClientRepository } from 'src/users/repositories/client.repository';
import { LeadsRepository } from 'src/admin/leads/repositories/lead.repository';
import { ClientsModule } from '@nestjs/microservices';
import { AccountModule } from 'src/mt5/account/account.module';
import { TradeRequestModule } from 'src/mt5/trading/trade-requests/trade-requests.module';
import { TransactionModule } from 'src/transaction/transaction.module';
import { RegulationsConfigModule } from 'src/admin/regulations/regulations-config/regulations-config.module';
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Ledger, Server, User, Operator]), forwardRef(() => TransactionModule)],
  controllers: [WalletController],
  providers: [
    TransactionRepository,
    LedgerRepository,
    WalletRepository,
    ServerRepository,
    WalletService,
    ClientRepository,
    LeadsRepository,
  ],
  exports: [WalletService],
})
export class WalletModule { }
