import { Module } from '@nestjs/common';
import { ApplicantController } from './applicant.controller';
import { ApplicantService } from './applicant.service';
import { ClientRepository } from '../../users/repositories/client.repository';

@Module({
  controllers: [ApplicantController],
  providers: [ApplicantService, ClientRepository],
  exports: [ApplicantService],
})
export class ApplicantModule {}
