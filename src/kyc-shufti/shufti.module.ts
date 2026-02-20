import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ShuftiService } from './shufti.service';
import shuftiConfig from './config/shufti.config';
import { WebhookController } from './shufti.controller';
import { FilesModule } from 'src/files/files.module';
import { UserKycModule } from 'src/user-kyc-docs/user-kyc-documents.module';
import { AdminKycModule } from 'src/admin/kyc/kyc.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { CustomStatus } from 'src/admin/client/entities/custom_status.entity';
import { ClientsModule } from 'src/users/clients.module';
import { RejectedReason } from 'src/admin/kyc/entities/rejected_reasons.entity';
import { required_kyc_documents } from 'src/admin/kyc/entities/admin-kyc.entity';
import { AccountModule } from 'src/mt5/account/account.module';
import { Mt5Account } from 'src/mt5/entities/mt5-account.entity';
import { Mt5AccountRepository } from 'src/mt5/account/repositories/mt5-account.repository';

@Module({
  imports: [
    ConfigModule.forFeature(shuftiConfig),

    FilesModule,
    forwardRef(() => ClientsModule),
    forwardRef(() => AdminKycModule),
    forwardRef(() => UserKycModule),
    TypeOrmModule.forFeature([
      CustomStatus,
      RejectedReason,
      User,
      required_kyc_documents,
      Mt5Account,
    ]),
    forwardRef(() => AccountModule),
  ],
  controllers: [WebhookController],
  providers: [ShuftiService, Mt5AccountRepository],
  exports: [ShuftiService],
})
export class ShuftiModule {}
