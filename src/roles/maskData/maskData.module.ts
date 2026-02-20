import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaskData } from '../entities/mask_data.entity';
import { MaskDataController } from './maskData.controller';
import { MaskDataService } from './maskData.service';
import { User } from 'src/users/entities/user.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([MaskData, User])],
  controllers: [MaskDataController],
  providers: [MaskDataService],
  exports: [MaskDataService],
})
export class MaskDataModule {}
