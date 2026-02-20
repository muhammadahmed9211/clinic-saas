import { Module } from '@nestjs/common';
import { AuthAppleService } from './auth-apple.service';
import { ConfigModule } from '@nestjs/config';
import { AuthAppleController } from './auth-apple.controller';
import { AuthModule } from '../auth/auth.module';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [ConfigModule, AuthModule, FirebaseModule],
  providers: [AuthAppleService],
  exports: [AuthAppleService],
  controllers: [AuthAppleController],
})
export class AuthAppleModule {}
