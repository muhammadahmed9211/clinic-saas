import { Module } from '@nestjs/common';
import { HeartBeatController } from './heart-beat.controller';
import { HeartBeatService } from './heart-beat.service';
import { RedisCoreModule } from 'src/redis/redis.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [RedisCoreModule, TypeOrmModule.forFeature([User]), FilesModule],
  controllers: [HeartBeatController],
  providers: [HeartBeatService],
  exports: [HeartBeatService],
})
export class HeartBeatModule {}
