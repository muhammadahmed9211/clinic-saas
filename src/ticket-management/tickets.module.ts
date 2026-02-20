import { forwardRef, HttpException, HttpStatus, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientTicketsController, SupportTicketsController, TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { Tickets } from './entities/tickets.entity';
import { TicketReplies } from './entities/ticket-replies.entity';
import { TicketsRepository } from './repositories/tickets.repository';
import { FilesModule } from 'src/files/files.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import { TicketCategory } from './entities/ticket-category.entity';
import { TicketCategoryDesk } from './entities/ticket-category-desk.entity';
import { OperatorDeskRel } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator-desk.entity';
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
import { ClientRepository } from 'src/users/repositories/client.repository';
import { Client } from 'src/users/entities/client.entity';
import { Lead } from 'src/admin/leads/entities/lead.entity';
import { ClientsModule } from 'src/users/clients.module';
import { EmailEntity } from 'src/mail/entities/email-entity.entity';
import { EmailEvent } from 'src/admin/email-mapping/entity/email-event.entity';
import { EmailMapping } from 'src/admin/email-mapping/entity/email-mapping.entity';
import { TicketCollaborators } from './entities/ticket-collaborators.entity';
import { MailModule } from 'src/mail/mail.module';
import { MergedTicket } from './entities/ticket-merge.entity';
import { OpportunityModule } from 'src/admin/leads/opportunity/opportunity.module';
import { OtpModule } from 'src/otp/otp.module';
import { EmailList } from 'src/mail/entities/emailList.entity';

@Module({
  imports: [MailModule,FilesModule,forwardRef(() => OtpModule), ClientsModule,OpportunityModule, TypeOrmModule.forFeature([Tickets, TicketReplies, TicketCategory, TicketCategoryDesk, User, OperatorDeskRel, Operator, Client, Lead,EmailEntity,EmailEvent,EmailMapping,TicketCollaborators,MergedTicket,EmailList]),
  ],

  controllers: [TicketsController, ClientTicketsController, SupportTicketsController],
  providers: [TicketsService, TicketsRepository, ConfigModule, ConfigService, ClientRepository],
  exports: [TicketsService],
})
export class TicketsModule { }