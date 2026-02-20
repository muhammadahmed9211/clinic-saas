import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventRegistraionService } from './event-registraion.service';
import { EventRegistraionController } from './event-registraion.controller';
import { EventRegistration } from './entities/event-registration.entity';
import { Lead } from 'src/admin/leads/entities/lead.entity';
import { LeadsModule } from 'src/admin/leads/leads.module';
import { EventRegistrationRepository } from './repositories/event-registration.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([EventRegistration, Lead]),
        LeadsModule,
    ],
    providers: [EventRegistraionService, EventRegistrationRepository],
    controllers: [EventRegistraionController]
})
export class EventRegistraionModule { }
