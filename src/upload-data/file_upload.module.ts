import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { JobModule } from 'src/jobs-processor/job.module';
import { ClientsModule } from 'src/users/clients.module';
import { Client } from 'src/users/entities/client.entity';
import { DataUpload } from 'src/users/entities/data_upload.entity';
import { User } from 'src/users/entities/user.entity';
import { ClientRepository } from 'src/users/repositories/client.repository';
import { WorldCheckModule } from 'src/world-check/worldCheck.module';
import { FileUploadController } from './file_upload.controller';
import { FileUploadService } from './file_upload.service';
import { DataUploadRepository } from './repositries/data-upload.repositries';

@Module({
  imports: [
    TypeOrmModule.forFeature([DataUpload, User, Client]),
    ClientsModule,
    WorldCheckModule,
    forwardRef(() => AuthModule),
    forwardRef(() => JobModule),
  ],
  controllers: [FileUploadController],
  providers: [DataUploadRepository, FileUploadService, ClientRepository],
  exports: [FileUploadService],
})
export class FileUploadModule {}
