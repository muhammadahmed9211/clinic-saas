import { Module } from '@nestjs/common';
import { UserEWalletService } from './user-ewallet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEWallet } from './entities/user-ewallet.entity';
import { UserEWalletController } from './user-ewallet.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEWallet])],
  controllers: [UserEWalletController],
  providers: [UserEWalletService],
  exports: [UserEWalletService],
})
export class UserEWalletModule {}
