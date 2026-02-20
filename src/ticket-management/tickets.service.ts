import {
  BadRequestException,
  UnauthorizedException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, LessThan,MoreThan,Like, Not, Raw, Repository } from 'typeorm';
import { TicketReplies } from './entities/ticket-replies.entity';
import {
  CreateClientTicketsDto,
  CreatedFor,
  CreateTicketsDto,
  MergeTicketsDto,
  ReplyClientTicketsDto,
  ReplyTicketsDto,
  TicketEmails,
  TicketEmailSubjects,
  TicketPriority,
  TicketStatus,
  UpdateTicketsDto,
} from './dto/tickets.dto';
import { PaginationDto } from 'src/database/base-repository/dto/pagination.dto';
import { ApplyListFilterSortColumnDto, FilterDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { TicketsRepository } from './repositories/tickets.repository';
import { ListNames } from 'src/list-item/dto/create-list-item.dto';
import { FilesService } from 'src/files/files.service';
import { User } from 'src/users/entities/user.entity';
import { TicketCategoryDesk } from './entities/ticket-category-desk.entity';
import { OperatorDeskRel } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator-desk.entity';
import { TicketCategory } from './entities/ticket-category.entity';
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
import { ClientRepository } from 'src/users/repositories/client.repository';
import {
  FilterItem,
  FilterOperation,
} from 'src/database/base-repository/dto/advance-search.dto';
import { EventTypes } from 'src/common/services/event.type';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  entityType,
  performerType,
} from 'src/admin/active-log/active-log.type';
import { Lead } from 'src/admin/leads/entities/lead.entity';
import { ConfigService } from '@nestjs/config';
import { TicketPaginationFilterDto } from 'src/fresh-desk/dto/tickets-pagination.dto';
import { AllConfigType } from 'src/config/config.type';
import { ClientsService } from 'src/users/clients.service';
import { EmailEntity } from 'src/mail/entities/email-entity.entity';
import { EmailEvent } from 'src/admin/email-mapping/entity/email-event.entity';
import { EmailMapping } from 'src/admin/email-mapping/entity/email-mapping.entity';
import { TicketCollaborators } from './entities/ticket-collaborators.entity';
import { MailService } from 'src/mail/mail.service';
import { MergedTicket, MergeStatus } from './entities/ticket-merge.entity';
import { v4 as uuidv4 } from 'uuid';
import { Tickets } from './entities/tickets.entity';
import { CreateLeadNoteDto } from 'src/admin/leads/opportunity/dto/notes.dto';
import { NotesType } from 'src/admin/kyc/dto/admin-kyc.dto';
import { OpportunityService } from 'src/admin/leads/opportunity/opportunity.service';
import { ignoreElements } from 'rxjs';
import { TicketType } from 'src/fresh-desk/dto/create-tickets.dto';
import { I18nContext } from 'nestjs-i18n';
import { EmailList } from 'src/mail/entities/emailList.entity';
export class TicketsService {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    @InjectRepository(TicketReplies)
    private ticketRepliesRepository: Repository<TicketReplies>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(EmailEntity)
    private emailEntityRepository: Repository<EmailEntity>,
    @InjectRepository(EmailEvent)
    private emailEventRepository: Repository<EmailEvent>,
    @InjectRepository(EmailMapping)
    private emailMappingRepository: Repository<EmailMapping>,
    @InjectRepository(EmailList)
    private emailListRepository: Repository<EmailList>,
    @InjectRepository(TicketCategoryDesk)
    private ticketCategoryDeskRepository: Repository<TicketCategoryDesk>,
    @InjectRepository(OperatorDeskRel)
    private operatorDeskRelDeskRepository: Repository<OperatorDeskRel>,
    @InjectRepository(Operator)
    private operatorRepository: Repository<Operator>,
    @InjectRepository(TicketCategory)
    private ticketCategoryRepository: Repository<TicketCategory>,
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
    @InjectRepository(TicketCollaborators)
    private readonly ticketCollaboratorsRepository: Repository<TicketCollaborators>,
    @InjectRepository(MergedTicket)
    private readonly mergedTicketRepository: Repository<MergedTicket>,
    private readonly ticketsRepository: TicketsRepository,
    private readonly filesService: FilesService,
    private readonly eventEmitter: EventEmitter2,
    private clientsRepository: ClientRepository,
    private readonly clientsService: ClientsService,
    private readonly mailService: MailService,
    private readonly opportunityService: OpportunityService,
  ) { }

  async createAdminTicket(
    createTicketDto: CreateTicketsDto,
    req: any,
    userIdViaEmail?: number,
    email?: string
  ): Promise<any> {
    try {
      let userId = userIdViaEmail ? userIdViaEmail : req.user.id;
      const defaultFromEmail  = this.configService.getOrThrow('mail.ticketReplyEmail', { infer: true });
      const whereCondition = {
      };
      if(email){
        whereCondition['email'] = email
      }else{
        whereCondition['id'] = userId
      }
      const user = await this.userRepository.findOne({ where: whereCondition, relations: ['operator'] });
      userId = user?.id;
      const { isOperator, isPartner, isBroker, isClient } = user ?? {};

      const ticketType = isOperator
        ? 'Operator'
        : isPartner
          ? 'Partner'
          : isBroker
            ? 'Broker'
            : isClient
              ? 'Client'
              : '';

      const whereOptions = {
        id: createTicketDto.createdForId,
        ...(createTicketDto.createdFor === CreatedFor.CLIENT
          ? { isClient: true }
          : createTicketDto.createdFor === CreatedFor.OPERATOR
            ? { isOperator: true }
            : {}),
      };

      const checkCreatedFor = await this.userRepository.findOne({
        where: whereOptions,
      });

      if (!checkCreatedFor) {
        throw new BadRequestException(
          `Invalid user or role mismatch for createdFor: ${createTicketDto.createdFor}`,
        );
      }
      const categoryExists = await this.ticketCategoryRepository.findOne({
        where: { id: createTicketDto.category_id },
      });

      if (!categoryExists) {
        throw new BadRequestException('Invalid category');
      }

      if (
        createTicketDto.attachments &&
        createTicketDto.attachments.length > 0
      ) {
        const ticketsWithAttachments = await this.ticketsRepository.find({
          where: { attachments: Not(IsNull()) },
        });
        const usedAttachmentIds = ticketsWithAttachments.flatMap(
          (ticket) => ticket.attachments,
        );
        for (const attachmentId of createTicketDto.attachments) {
          if (usedAttachmentIds.includes(attachmentId)) {
            throw new BadRequestException(
              `Attachment ID ${attachmentId} has already been used in another ticket`,
            );
          }
        }
      }

      let deskId;

      deskId = createTicketDto.deskId;
      if (!deskId) {
        throw new BadRequestException('Desk ID is required for operators');
      }

      const deskExists = await this.ticketCategoryDeskRepository.findOne({
        where: {
          desk: { id: deskId },
        },
      });

      if (!deskExists) {
        throw new BadRequestException('Invalid desk ID for the given category');
      }

      await this.validateCreatedFor(
        createTicketDto.createdFor,
        createTicketDto.createdForId,
      );

      let checkAssignee;
      if(createTicketDto.assigneeId){
        checkAssignee = await this.userRepository.findOne({
        where: {
          operator: { id: createTicketDto.assigneeId },
          isOperator: true,
        },
      });
      if (!checkAssignee) {
        throw new BadRequestException('assignee not found');
      }
      
    }

      const operatorRelDesk =
        await this.operatorDeskRelDeskRepository.find({
          where: {
            desk: { id: createTicketDto.deskId },
          },
          relations: {
            operator: true
          },
          select: ['operator']
        });

      // Validate collaborators
      const collaboratorIds = createTicketDto.collaboratorIds || [];
      const collaborators = await this.userRepository.find({
        where: {
          isOperator: true,
          id: In(collaboratorIds),
        },
        relations: {
          operator: true
        }
      });


      if (!collaborators) {
        throw new BadRequestException(
          'Some collaborators could not be found or are invalid',
        );
      }
      const getToEmail = await this.userRepository.findOne({
        where: {
          id: createTicketDto.createdForId
        },
      })

      // First, create the ticket without the crmLink
      const ticket = await this.ticketsRepository.save({
        // ticketNumber: this.generateTicketNumber(),
        ...createTicketDto,
        user: { id: userId },
        deskId,
        ticketType,
        createdBy: { id: userId },
        createdFor: createTicketDto.createdFor,
        createdForId: { id: createTicketDto.createdForId },
        assigneeId: checkAssignee?.id,
        fromEmail: createTicketDto.fromEmail? createTicketDto.fromEmail : defaultFromEmail ,
        subject: createTicketDto.title,
        // collaboratorId: checkCollaborator?.id,
      });
      //tikcetNumber column being updating with id
      ticket.ticketNumber = ticket.id;
      const ticketTitle =  `Ticket #${ticket.id} - ${createTicketDto.title}`;

      const collaboratorEntries = collaborators.map((collaborator) => ({
        ticket: { id: ticket.id },
        collaborator: { id: collaborator.id },
      }));
      const updatedCollaborators = await this.ticketCollaboratorsRepository.save(collaboratorEntries);
 

      let baseUrlClient = this.configService.get('app.frontendDomain', { infer: true });
      const clientLink = `${baseUrlClient}/tickets/${ticket.id}`;
      let baseUrl = this.configService.get('app.crmFrontEndUrl', { infer: true });
      const crmLink = `${baseUrl}/support-tickets/${ticket.id}`;

      const updatedTicket = await this.ticketsRepository.save({
        ...ticket,
        crmLink,
        clientLink,
        title: ticketTitle,
        to: getToEmail?.email ? [getToEmail.email]:[],
      });
      const logData = {
        ...updatedTicket,
        updatedCollaborators,
      };
      if (ticket.createdFor === 'CLIENT') {
        this.eventEmitter.emit(EventTypes.USER_LOG, {
          newData: logData,
          oldData: null,
          entityId: ticket?.id, //clientId
          entityType: entityType.TICKET, //client 
          performerId: userId,
          performerType: performerType.OPERATOR,
          field: 'Ticket Created',
          parentId: updatedTicket?.id,
          parentType:  entityType.TICKET
        });
        await this.sendEmailToClient({
          entityName: 'tickets',
          entityValue: ticket?.id.toString(),
          createdForId: createTicketDto?.createdForId,
          emailEventName: TicketEmails.TICKET_CREATE_CLIENT,
          subjectEnglish: `Ticket #${ticket.id} - ${TicketEmailSubjects.TICKET_CREATE_CLIENT_ENGLISH}`,
          subjectArabic: `التذكرة #${ticket.id} - ${TicketEmailSubjects.TICKET_CREATE_CLIENT_ARABIC}`,
          operatorId: userId,
          fromEmail: createTicketDto.fromEmail ? createTicketDto.fromEmail : defaultFromEmail,
          cc: createTicketDto?.cc,
          bcc: createTicketDto?.bcc
        });
      } else {
        const operatorId = user?.operator.id;
        this.eventEmitter.emit(EventTypes.USER_LOG, {
          newData: logData,
          oldData: null,
          entityId: ticket.id,//operatorId
          entityType: entityType.TICKET, //operator 
          performerId: operatorId,
          performerType: performerType.OPERATOR,
          field: 'Ticket Created',
          parentId: updatedTicket?.id,
          parentType:  entityType.TICKET
        });
        await this.sendEmailToOperator({
          entityName: 'tickets',
          entityValue: ticket?.id.toString(),
          emailEventName: TicketEmails.TICKET_CREATE_OPERATOR,
          subject: `Ticket #${ticket?.id} - ${TicketEmailSubjects.TICKET_CREATE_OPERATOR}`,
          operatorId: userId,
          createdForId: createTicketDto?.createdForId,
          fromEmail: createTicketDto.fromEmail ? createTicketDto.fromEmail : defaultFromEmail,
          cc: createTicketDto?.cc,
          bcc: createTicketDto?.bcc
        });
      }
      const operatorIds = operatorRelDesk.map((relation) => relation?.operator?.id);
      await this.sendEmailToOperator({
        entityName: 'tickets',
        entityValue: ticket?.id.toString(),
        emailEventName: TicketEmails.TICKET_ASSIGN_DESK,
        subject: `Ticket #${ticket.id} - ${TicketEmailSubjects.TICKET_ASSIGN_DESK}`,
        operatorId: userId,
        bulkOperatorIds: operatorIds,
        fromEmail: createTicketDto.fromEmail ? createTicketDto.fromEmail : defaultFromEmail
      });
      if(checkAssignee?.id){
        await this.sendEmailToOperator({
          entityName: 'tickets',
          entityValue: ticket?.id.toString(),
          emailEventName: TicketEmails.TICKET_ASSIGN_OPERATOR,
          subject: `Ticket #${ticket.id} - ${TicketEmailSubjects.TICKET_ASSIGN_OPERATOR}`,
          operatorId: userId,
          createdForId: checkAssignee?.id,
          fromEmail: createTicketDto.fromEmail ? createTicketDto.fromEmail : defaultFromEmail
        });
      }
    
      if (createTicketDto?.collaboratorIds && createTicketDto.collaboratorIds.length > 0) {
         const operatorIds = collaborators.map(collaborator => collaborator?.operator?.id).filter(Boolean);
          await this.sendEmailToOperator({
            entityName: 'tickets',
            entityValue: ticket?.id.toString(),
            emailEventName: TicketEmails.TICKET_ASSIGN_COLLABORATOR,
            subject: `Ticket #${ticket.id} - ${TicketEmailSubjects.TICKET_ASSIGN_COLLABORATOR}`,
            operatorId: userId,
            bulkOperatorIds: operatorIds,
            fromEmail: createTicketDto.fromEmail ? createTicketDto.fromEmail : defaultFromEmail
          });
      }
      return {
        statusCode: 201,
        message: 'Ticket created successfully',
        data: { ticket: updatedTicket, crmLink: crmLink },
      };
    } catch (error) {
      throw error;
    }
  }

  async createClientTicket(
    createClientTicketsDto: CreateClientTicketsDto,
    req?: any,
    userIdViaEmail?:number,
    email?:string
  ): Promise<any> {
    try {
      let userId = userIdViaEmail ? userIdViaEmail : req.user.id;
      const defaultFromEmail  = this.configService.getOrThrow('mail.ticketReplyEmail', { infer: true });
      const whereCondition = {
      };
      if(email){
        whereCondition['email'] = email
      }else{
        whereCondition['id'] = userId
      }
      const user = await this.userRepository.findOne({ where: whereCondition });
      userId = user?.id;
      const { isOperator, isPartner, isBroker, isClient } = user ?? {};

      const ticketType = isOperator
        ? 'Operator'
        : isPartner
          ? 'Partner'
          : isBroker
            ? 'Broker'
            : isClient
              ? 'Client'
              : '';

      const categoryExists = await this.ticketCategoryRepository.findOne({
        where: { id: createClientTicketsDto.category_id },
      });

      if (!categoryExists) {
        throw new BadRequestException('Invalid category');
      }
      let deskId;

      const categoryDesk = await this.ticketCategoryDeskRepository.findOne({
        where: { ticket_category_id: createClientTicketsDto.category_id, isDefaultDesk: true },
      });

      if (!categoryDesk) {
        throw new BadRequestException('No desk found for the given category');
      }

      deskId = categoryDesk.deskId;

      if (
        createClientTicketsDto.attachments &&
        createClientTicketsDto.attachments.length > 0
      ) {
        const ticketsWithAttachments = await this.ticketsRepository.find({
          where: { attachments: Not(IsNull()) },
        });
        const usedAttachmentIds = ticketsWithAttachments.flatMap(
          (ticket) => ticket.attachments,
        );
        for (const attachmentId of createClientTicketsDto.attachments) {
          if (usedAttachmentIds.includes(attachmentId)) {
            throw new BadRequestException(
              `Attachment ID ${attachmentId} has already been used in another ticket`,
            );
          }
        }
      }

      const ticket = this.ticketsRepository.create({
        // ticketNumber: this.generateTicketNumber(),
        ...createClientTicketsDto,
        userId,
        deskId,
        ticketType,
        createdFor: CreatedFor.CLIENT,
        createdBy: { id: userId },
        createdForId: { id: userId },
        subject: createClientTicketsDto.title,
        fromEmail: createClientTicketsDto.fromEmail ? createClientTicketsDto.fromEmail : defaultFromEmail
      });
      //tikcetNumber column being updating with id
      ticket.ticketNumber = ticket.id;

      const savedTicket = await this.ticketsRepository.save(ticket);
      const ticketTitle = `Ticket #${savedTicket.id} - ${createClientTicketsDto.title}`;

      let baseUrlClient = this.configService.get('app.frontendDomain', { infer: true });
      const clientLink = `${baseUrlClient}/tickets/${savedTicket.id}`;
      let baseUrl = this.configService.get('app.crmFrontEndUrl', { infer: true });
      const crmLink = `${baseUrl}/support-tickets/${ticket.id}`;

      // Update ticket with links
      const updatedTicket = await this.ticketsRepository.save({
        ...ticket,
        clientLink,
        crmLink,
        title:ticketTitle
      });

      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: updatedTicket,
        oldData: null,
        entityId: ticket?.id, //clientId
        entityType: entityType.TICKET, //client 
        performerId: userId,
        performerType: performerType.OPERATOR,
        field: 'Ticket Created',
        parentId: ticket?.id,
        parentType:  entityType.TICKET
      });

      await this.sendEmailToClient({
        entityName: 'tickets',
        entityValue: savedTicket?.id.toString(),
        createdForId: userId,
        emailEventName: TicketEmails.TICKET_CREATE_CLIENT,
        subjectEnglish: `Ticket #${savedTicket.id} - ${TicketEmailSubjects.TICKET_CREATE_CLIENT_ENGLISH}`,
        subjectArabic: `التذكرة #${savedTicket.id} - ${TicketEmailSubjects.TICKET_CREATE_CLIENT_ARABIC}`,
        operatorId: userId,
        fromEmail: createClientTicketsDto.fromEmail ? createClientTicketsDto.fromEmail : defaultFromEmail
      });
      const operatorRelDesk =
        await this.operatorDeskRelDeskRepository.find({
          where: {
            desk: { id: deskId },
          },
          relations: {
            operator: true
          },
          select: ['operator']
        });
      const operatorIds = operatorRelDesk.map((relation) => relation?.operator?.id);
      await this.sendEmailToOperator({
        entityName: 'tickets',
        entityValue: savedTicket?.id.toString(),
        emailEventName: TicketEmails.TICKET_ASSIGN_DESK,
        subject:`Ticket #${ticket.id} - ${TicketEmailSubjects.TICKET_ASSIGN_DESK}`,
        bulkOperatorIds: operatorIds,
        fromEmail: createClientTicketsDto.fromEmail ? createClientTicketsDto.fromEmail : defaultFromEmail
      });

      return {
        statusCode: 201,
        message: 'Ticket created successfully',
        data: {
          ticket: updatedTicket,
          clientLink
        },
      };
    } catch (error) {
     throw error
    }
  }

  async update(
    ticketId: number,
    updateTicketDto: UpdateTicketsDto,
    req: any,
    response?: any
  ): Promise<any> {
    const userId = req.user.id;
    let operatorIds: number[] = [];

    // Fetch the operator
    const operator = await this.operatorRepository.findOne({ where: { email: req?.user?.email } });
    if (!operator) {
      throw new NotFoundException('Operator not found');
    }

    
    if (!response) {
      throw new BadRequestException('You do not have access to update details of this ticket');
    }

    // Fetch the ticket
    const ticket = await this.ticketsRepository.findOne({
      where: { id: ticketId },
      relations: ['createdForId.operator','ticketCollaborators','category','createdBy.operator','assignee.operator'],
    });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    const originalTicket = { ...ticket };

    // Handle desk changes (either from category update or direct desk update)
    let newDeskId: number | null = null;

    // If category is changing, get the desk from category
    if (updateTicketDto.category_id) {
      const category = await this.ticketCategoryRepository.findOne({
        where: { id: updateTicketDto.category_id }
      });
      if (!category) {
        throw new BadRequestException(`Invalid category: ${updateTicketDto.category_id}`);
      }
      ticket.category = category;
      ticket.assigneeId = null;
      ticket.assignee = null; 
      ticket.deskId = null;
      ticket.desk = null;
    
    }

    if(updateTicketDto.desk_id){
      const categoryDesk = await this.ticketCategoryDeskRepository.findOne({
        where: { ticket_category_id: ticket.category.id,desk:{id:updateTicketDto.desk_id} },
        relations:{
          desk:true
        }
      });
      if (!categoryDesk?.desk?.id) {
        throw new BadRequestException(`Desk not assigned to the category: ${ticket.category.categories}`);
      }
      ticket.desk = categoryDesk.desk;
      newDeskId = updateTicketDto.desk_id;
      ticket.assigneeId = null;
      ticket.assignee = null;
      const operatorRelDesk = await this.operatorDeskRelDeskRepository.find({
        where: { desk: { id: newDeskId } },
        relations: { operator: true },
      });

      operatorIds = operatorRelDesk.map((relation) => relation?.operator?.id);
    }


    // Handle assignee updates (regardless of desk changes)
    if (updateTicketDto.assignedTo  && ticket.deskId) {
      // Check if the operator-desk relationship exists
      const operatorDeskRelation = await this.operatorDeskRelDeskRepository.findOne({
        where: {
          operator: { id: updateTicketDto.assignedTo },
          desk: { id:  ticket.deskId }, // Use new desk ID if desk is changing, otherwise use current desk ID
        },
      });

      if (!operatorDeskRelation) {
        throw new BadRequestException(
          'The specified operator is not assigned to the desk',
        );
      }

      // Verify the assignee exists and is an operator
      const assignee = await this.userRepository.findOne({
        where: { operator: { id: updateTicketDto.assignedTo }, isOperator: true },
      });
      if (!assignee) {
        throw new BadRequestException('Assignee not found or is not an operator');
      }

      // Update the assignee
      ticket.assignee = assignee;
      ticket.assigneeId = assignee.id;

      // Send email notification to the new assignee
      await this.sendEmailToOperator({
        entityName: 'tickets',
        entityValue: ticket.id.toString(),
        emailEventName: TicketEmails.TICKET_ASSIGN_OPERATOR,
        subject: `Ticket #${ticket.id} - ${TicketEmailSubjects.TICKET_ASSIGN_OPERATOR}`,
        operatorId: userId,
        createdForId: assignee.id,
        fromEmail: ticket?.fromEmail
      });
    }
 

    if (updateTicketDto.status) {
       if (!Object.values(TicketStatus).includes(updateTicketDto.status)) {
    throw new BadRequestException(`Invalid ticket status: ${updateTicketDto.status}`);
  }
      ticket.status = updateTicketDto.status;
      if (updateTicketDto.status === TicketStatus.RESOLVED) {
        ticket.resolvedAt = new Date();

        if (ticket.createdFor == CreatedFor.OPERATOR) {
          await this.sendEmailToOperator({
            entityName: 'tickets',
            entityValue: ticket.id.toString(),
            emailEventName: TicketEmails.TICKET_RESOLVED_OPERATOR,
            subject: `Ticket #${ticket.id} - ${TicketEmailSubjects.TICKET_RESOLVED_OPERATOR}`,
            operatorId: userId,
            createdForId: ticket.createdForId?.id,
            fromEmail: ticket?.fromEmail
          });
        } else if (ticket.createdFor == CreatedFor.CLIENT) {
          await this.sendEmailToClient({
            entityName: 'tickets',
            entityValue: ticket.id.toString(),
            createdForId: ticket.createdForId?.id,
            emailEventName: TicketEmails.TICKET_RESOLUTION_CLIENT,
            subjectEnglish: `Ticket #${ticket.id} - ${TicketEmailSubjects.TICKET_RESOLUTION_CLIENT_ENGLISH}`,
            subjectArabic: `التذكرة #${ticket.id} - ${TicketEmailSubjects.TICKET_RESOLUTION_CLIENT_ARABIC}`,
            operatorId: userId,
            fromEmail: ticket?.fromEmail
          });
        }
      }
      else if (updateTicketDto.status === TicketStatus.CLOSED) {
        ticket.closedAt = new Date();
        //   const operatorIds =
        //   ticket?.ticketType === 'Operator'
        //     ? [ticket.createdBy?.operator?.id, ticket?.assignee?.operator?.id, ticket?.createdForId?.operator?.id].filter(Boolean)
        //     : [ticket?.assignee?.operator?.id].filter(Boolean);
        // if (operatorIds.length > 0) {
        //   await this.sendEmailToOperator({
        //     entityName: 'tickets',
        //     entityValue: ticket.id.toString(),
        //     emailEventName: TicketEmails.TICKET_CLOSE_OPERATOR,
        //     subject: `Ticket #${ticket.id} - ${TicketEmailSubjects.TICKET_CLOSE_OPERATOR}`,
        //     operatorId: userId,
        //     bulkOperatorIds: operatorIds,
        //     fromEmail: ticket?.fromEmail
        //   });
        // }
        // if (ticket.createdFor == CreatedFor.CLIENT) {
        //   await this.sendEmailToClient({
        //     entityName: 'tickets',
        //     entityValue: ticket.id.toString(),
        //     createdForId: ticket.createdForId?.id,
        //     emailEventName: TicketEmails.TICKET_CLOSE_CLIENT,
        //     subjectEnglish: `Ticket #${ticket.id} - ${TicketEmailSubjects.TICKET_CLOSE_CLIENT_ENGLISH}`,
        //     subjectArabic: `التذكرة #${ticket.id} - ${TicketEmailSubjects.TICKET_CLOSE_CLIENT_ARABIC}`,
        //     operatorId: userId,
        //     fromEmail: ticket?.fromEmail
        //   });
        // }
      }
    }

    if (updateTicketDto.priority) {
      ticket.priority = updateTicketDto.priority;
    }

    try {
     
      const updatedTicket = await this.ticketsRepository.save(ticket);
      if(operatorIds.length > 0){
        await this.sendEmailToOperator({
          entityName: 'tickets',
          entityValue: ticket.id.toString(),
          emailEventName: TicketEmails.TICKET_ASSIGN_DESK,
          subject: `Ticket #${ticket.id} - ${TicketEmailSubjects.TICKET_ASSIGN_DESK}`,
          operatorId: userId,
          bulkOperatorIds: operatorIds,
          fromEmail: ticket?.fromEmail
        });
      }
     

      let updatedCollaborators: TicketCollaborators[] = [];

    if (updateTicketDto.collaboratorIds) {
      const existingCollaborators = await this.ticketCollaboratorsRepository.find({
        where: { ticket: { id: ticketId } },
        relations: ['collaborator'],
      });
      
      const existingCollaboratorIds = existingCollaborators.map(c => c.collaborator.id);
    
      const newCollaboratorIds = updateTicketDto.collaboratorIds.filter(
        id => !existingCollaboratorIds.includes(id)
      );
      
      await this.ticketCollaboratorsRepository.softDelete({
        ticket: { id: ticketId },
        collaborator: { id: Not(In(updateTicketDto.collaboratorIds)) },
      });
      
      if (newCollaboratorIds.length > 0) {
        const newCollaborators = await this.userRepository.find({
          where: { id: In(newCollaboratorIds), isOperator: true },
          relations:{
            operator: true
          }
        });
         const operatorIds = newCollaborators.map(collaborator => collaborator?.operator?.id).filter(Boolean);
      
        const collaboratorEntries = newCollaborators.map(collaborator => ({
          ticket: { id: ticketId },
          collaborator: { id: collaborator.id },
        }));
      
        updatedCollaborators = await this.ticketCollaboratorsRepository.save(collaboratorEntries);	
        await this.sendEmailToOperator({
          entityName: 'tickets',
          entityValue: ticket?.id.toString(),
          emailEventName: TicketEmails.TICKET_ASSIGN_COLLABORATOR,
          subject: `Ticket #${ticket.id} - ${TicketEmailSubjects.TICKET_ASSIGN_COLLABORATOR}`,
          operatorId: userId,
          bulkOperatorIds: operatorIds,
          fromEmail: ticket?.fromEmail
        });
      }
    }

      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['operator'],
      });

      const logData = {
        ...updatedTicket,
        ticketCollaborators:updatedCollaborators,
      };

      const operatorId = user?.operator?.id;
      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: logData,
        oldData: originalTicket,
        entityId: ticket?.id,
        entityType: entityType.TICKET,
        performerId: operatorId,
        performerType: performerType.OPERATOR,
        field: 'Ticket Updated',
        parentId: updatedTicket?.id,
        parentType:  entityType.TICKET
      });

      return {
        statusCode: 200,
        message: 'Ticket updated successfully',
      };
    } catch (error) {
      
      console.error('Error updating ticket:', error); // Add this line

      throw new InternalServerErrorException(
        'An error occurred while updating the ticket',
      );
    }
  }

  async getAll(req: any): Promise<any> {
    try {
      const userId = req.user.id;
      const user = await this.userRepository.findOne({ where: { id: userId } });

      let deskIDs: number[] = [];
      let isOperator = true;

      if (user?.isOperator === true) {
        isOperator = true;
        const operator = await this.operatorRepository.findOne({
          where: { id: user.operator.id },
        });
        deskIDs = JSON.parse(operator?.desk_id || '[]').map(Number);

        if (!Array.isArray(deskIDs) || deskIDs.length === 0) {
          throw new UnauthorizedException(
            'Unauthorized: invalid or missing operator desk IDs',
          );
        }
      }

      // Construct query options
      const queryOptions: any = {
        relations: [
          'replies',
          'category',
          'category.categoryDesks',
          'category.categoryDesks.desk',
          'assignee',
          'desk',
          'ticketCollaborators',
          'ticketCollaborators.collaborator',
        ],
        order: { createdAt: 'DESC' },
      };

      if (isOperator) {
        // queryOptions.where = { deskId: In(deskIDs) };
      } else {
        queryOptions.where = { userId };
      }

      // Fetch tickets
      const tickets = await this.ticketsRepository.find(queryOptions);

      if (!tickets.length) {
        return {
          statusCode: 200,
          message: 'No tickets found',
          data: [],
        };
      }

      // Process tickets
      const processedTickets = await Promise.all(
        tickets.map(async (ticket) => {
          const attachmentUrls =
            ticket.attachments && ticket.attachments.length > 0
              ? await Promise.all(
                ticket.attachments.map(async (attachmentId) => {
                  try {
                    const url = await this.filesService.getSignedUrl(attachmentId);
                    return {
                      id: attachmentId,
                      url: url || null,
                      message: url ? 'valid attachment' : 'invalid attachment',
                    };
                  } catch (error) {
                    console.warn(
                      `Failed to get signed URL for attachment ID ${attachmentId}:`,
                      error.message,
                    );
                    return {
                      id: attachmentId,
                      url: null,
                    };
                  }
                }),
              )
              : [];

          // Transform collaborators
          const collaborators =
            ticket.ticketCollaborators
              ?.map((collaborator) => {
                if (collaborator.collaborator) {
                  return {
                    id: collaborator.collaborator.id,
                    fullName: collaborator.collaborator.fullName,
                    email: collaborator.collaborator.email,
                  };
                }
                return null;
              })
              .filter(Boolean) || [];

          // Exclude ticketCollaborators from the response
          const { ticketCollaborators, ...rest } = ticket;

          return {
            ...rest,
            attachmentUrls,
            collaborators,
          };
        }),
      );

      return {
        statusCode: 200,
        message: 'Tickets fetched successfully',
        data: processedTickets,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new InternalServerErrorException(
        'An error occurred while fetching the tickets',
      );
    }
  }



  async getAllClientTickets(
    params: TicketPaginationFilterDto,
    req: any,
  ): Promise<any> {
    const userId = req.user.id;
    try {
      const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['operator'] });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      const page = params.page || 1;
      const limit = params.limit || 10;
      const skip = (page - 1) * limit;

      // Handle status filter
      const ticketStatus = params.status ? params.status.toUpperCase() : null;

      const queryOptions: any = {
        relations: [
          'replies',
          'category',
          'category.categoryDesks',
          'category.categoryDesks.desk',
          'createdBy',
          'assignee',
          'desk',
        ],
        order: { createdAt: 'DESC' },
        take: limit,
        skip: skip,
      };

      if (!user.isOperator) {
        // For regular users, filter by both createdForId and createdById
        queryOptions.where = [
          {
            createdForId: {
              id: userId
            },
            ...(ticketStatus && { status: ticketStatus }) // Add status filter
          },
          {
            createdBy: {
              id: userId
            },
            ...(ticketStatus && { status: ticketStatus }) // Add status filter
          }
        ];
      } else {
        const deskIds = JSON.parse(user?.operator?.desk_id)
          .map(Number)
          .filter(id => !isNaN(id));

        if (!deskIds.length) {
          throw new BadRequestException('No valid desk IDs found');
        }

        queryOptions.where = {
          deskId: In(deskIds),
          ...(ticketStatus && { status: ticketStatus }) // Add status filter for operators
        };
      }

      // Rest of the code remains the same...
      const [tickets, totalCount] =
        await this.ticketsRepository.findAndCount(queryOptions);

      if (!tickets.length) {
        return {
          statusCode: 200,
          message: 'No tickets found',
          data: [],
          count: 0,
          page,
          limit,
          totalPages: 0,
        };
      }
      
      const ticketsWithUrls = await Promise.all(
        tickets.map(async (ticket) => {
          const attachmentUrls =
            ticket.attachments && ticket.attachments.length > 0
              ? await Promise.all(
                ticket.attachments.map(async (attachmentId) => {
                  try {
                    const url = await this.filesService.getSignedUrl(attachmentId);
                    return {
                      id: attachmentId,
                      url: url || null,
                      message: url
                        ? 'valid attachment'
                        : 'invalid attachment',
                    };
                  } catch (error) {
                    console.warn(
                      `Failed to get signed URL for attachment ID ${attachmentId}:`,
                      error.message,
                    );
                    return {
                      id: attachmentId,
                      url: null,
                      message: 'invalid attachment',
                    };
                  }
                }),
              )
              : [];

          return {
            ...ticket,
            attachmentUrls,
            createdBy: ticket.createdBy?.fullName,
          };
        }),
      );

      return {
        statusCode: 200,
        message: 'Tickets fetched successfully',
        data: ticketsWithUrls,
        count: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: page * limit < totalCount
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new InternalServerErrorException(
        'An error occurred while fetching the tickets',
      );
    }
  }


    async listCategories(req: any): Promise<any> {
    const userId = req.user.id;
    try {
      const TicketCategories = await this.ticketCategoryRepository.find({
        relations: ['categoryDesks'],
      });
      return {
        statusCode: 200,
        message: 'Tickets fetched successfully',
        data: TicketCategories,
      };
    } catch (error) {
      throw error;
    }
  }

  async listDesks(categoryId: number) {
    const categoryDesks = await this.ticketCategoryDeskRepository.find({
      where: { ticket_category_id: categoryId },
      relations: ['desk'],
    });

    return categoryDesks.map(categoryDesk => ({
      id: categoryDesk.desk.id.toString(),
      name: categoryDesk.desk.name,
      managerOperator: categoryDesk.desk.manager
    }));
  }


  async listTickets(
    req: any,
    query: PaginationDto,
    dto: ApplyListFilterSortColumnDto,
    ticketIds?:number[],
    userIdViaEmail?:any
  ): Promise<any> {
    const userId = userIdViaEmail ? userIdViaEmail : req.user.id;
    const { limit = 10, page = 1 } = query;

    const filters : FilterItem[]= [];
    if(Array.isArray(ticketIds) && ticketIds.length > 0){
      filters.push({ name: 'id', operation: FilterOperation.IN, value: ticketIds});
    }
   

    try {
      const response = await this.ticketsRepository.advanceFilters({
        limit,
        page,
        userId,
        relations: [
          'replies',
          'assignee',
          'desk',
          'createdBy',
          'category',
          'ticketCollaborators',
          'createdForId',
        ],
        filterList: dto.filters || undefined,
        sortList: dto.sort || undefined,
        listName: ListNames.TICKETS,
        defaultSortKey: 'createdAt',
        listViewId:dto.listViewId,
        filters
      });

      const tickets = response.result || [];

      const ticketsWithUrls = await Promise.all(
        tickets.map(async (ticket) => {
          const attachmentUrls =
            ticket.attachments && ticket.attachments.length > 0
              ? await Promise.all(
                ticket.attachments.map(async (attachmentId) => {
                  try {
                    const url =
                      await this.filesService.getSignedUrl(attachmentId);
                    return {
                      id: attachmentId,
                      url: url || null,
                      message: url
                        ? 'valid attachment'
                        : 'invalid attachment',
                    };
                  } catch (error) {
                    console.warn(
                      `Failed to get signed URL for attachment ID ${attachmentId}:`,
                      error.message,
                    );
                    return {
                      id: attachmentId,
                      url: null,
                      message: 'invalid attachment',
                    };
                  }
                }),
              )
              : [];


          return {
            ...ticket,
            attachmentUrls,
          };
        }),
      );

      return {
        ...response,
        result: ticketsWithUrls,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new InternalServerErrorException(
        'An error occurred while fetching the tickets',
      );
    }
  }

  async clientTickets(
    req: any,
    query: PaginationDto,
    dto: ApplyListFilterSortColumnDto,
    createdId: number,
  ): Promise<any> {
    const userId = req.user.id;
    const { limit = 10, page = 1 } = query;

    const filters :FilterItem[]= [
      {
        name: 'createdForId.id',
        operation: FilterOperation.EQUALS,
        value: [createdId],
      },
      {
        name: 'createdFor',
        operation: FilterOperation.EQUALS,
        value: [CreatedFor.CLIENT],
      },
    ];

    try {
      const response = await this.ticketsRepository.advanceFilters({
        limit,
        page,
        userId,
        relations: [
          'replies',
          'assignee',
          'desk',
          'createdBy',
          'category'
        ],
        filterList: dto.filters || undefined,
        sortList: dto.sort || undefined,
        listName: ListNames.TICKETS,
        defaultSortKey: 'createdAt',
        filters
      });

      const tickets = response.result || [];

      const ticketsWithUrls = await Promise.all(
        tickets.map(async (ticket) => {
          const attachmentUrls =
            ticket.attachments && ticket.attachments.length > 0
              ? await Promise.all(
                ticket.attachments.map(async (attachmentId) => {
                  try {
                    const url =
                      await this.filesService.getSignedUrl(attachmentId);
                    return {
                      id: attachmentId,
                      url: url || null,
                      message: url
                        ? 'valid attachment'
                        : 'invalid attachment',
                    };
                  } catch (error) {
                    console.warn(
                      `Failed to get signed URL for attachment ID ${attachmentId}:`,
                      error.message,
                    );
                    return {
                      id: attachmentId,
                      url: null,
                      message: 'invalid attachment',
                    };
                  }
                }),
              )
              : [];

          return {
            ...ticket,
            attachmentUrls,
          };
        }),
      );

      return {
        result: ticketsWithUrls,
        total: response.total,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new InternalServerErrorException(
        'An error occurred while fetching the tickets',
      );
    }
  }


  async getOneClientTicket(ticketId: number, req: any): Promise<any> {
    try {
      const userId = req.user.id;

      const ticket = await this.ticketsRepository.findOne({
        where: [
          {
            id: ticketId,
            createdForId: { id: userId }
          },
          {
            id: ticketId,
            createdBy: { id: userId }
          }
        ],
        relations: [
          'replies',
          'replies.createdBy',
          'category',
          'category.categoryDesks',
          'category.categoryDesks.desk',
          'assignee',
          'desk',
          'createdBy.client',
          'createdBy.operator',
          'createdForId',
          'ticketCollaborators',
          'ticketCollaborators.collaborator',
          'ticketCollaborators.collaborator.photo',
        ],
        order: { createdAt: 'DESC' },
      });

      if (!ticket) {
        throw new HttpException('Ticket not found', HttpStatus.NOT_FOUND);
      }
      const sortReplies = ticket.replies?.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime(),);
      const transformedTicket = {
        ...ticket,
        replies: sortReplies?.map((reply) => ({
          id: reply.id,
          comment: reply.comment,
          createdAt: reply.createdAt,
          attachments: reply.attachments,
          platform: reply.platform,
          createdBy: {
            id: reply.createdBy?.id,
            firstName: reply.createdBy?.firstName,
            lastName: reply.createdBy?.lastName,
            photo: reply.createdBy?.photo,
            isOperator: reply.createdBy?.isOperator,
            isClient: reply.createdBy?.isClient,
          },
        })),
        createdBy: ticket.createdBy
          ? {
            id: ticket.createdBy.id,
            firstName: ticket.createdBy.firstName,
            lastName: ticket.createdBy.lastName,
            email: ticket.createdBy.email,
            photo: ticket.createdBy.photo,
            isOperator: ticket.createdBy.isOperator,
            isClient: ticket.createdBy.isClient,
          }
          : null,
        assignee: ticket.assignee
          ? {
            id: ticket.assignee.operator.id,
            firstName: ticket.assignee.firstName,
            lastName: ticket.assignee.lastName,
          }
          : null,
      };

      return {
        statusCode: 200,
        message: 'Ticket fetched successfully',
        data: await this.prepareTicketResponse(transformedTicket),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new InternalServerErrorException(
        'An error occurred while fetching the ticket',
      );
    }
  }

  private async prepareTicketResponse(ticket: any): Promise<any> {
    const ticketAttachmentUrls = await Promise.all(
      (ticket.attachments || []).map(async (attachmentId) => {
        try {
          const url = await this.filesService.getSignedUrl(attachmentId,true);
          return {
            id: attachmentId,
            url: url.url || null,
            fileType: url.fileType,
            message: url ? 'valid attachment' : 'invalid attachment',
          };
        } catch (error) {
          console.warn(
            `Failed to get signed URL for attachment ID ${attachmentId}:`,
            error.message,
          );
          return { id: attachmentId, url: null, message: 'invalid attachment' };
        }
      }),
    );

    const processedReplies = await Promise.all(
      (ticket.replies || []).map(async (reply) => {
        const replyAttachmentUrls = await Promise.all(
          (reply.attachments || []).map(async (attachmentId) => {
            try {
              const url = await this.filesService.getSignedUrl(attachmentId,true);
              return {
                id: attachmentId,
                url: url?.url || null,
                fileType: url?.fileType,
                message: url ? 'valid attachment' : 'invalid attachment',
              };
            } catch (error) {
              console.warn(
                `Failed to get signed URL for reply attachment ID ${attachmentId}:`,
                error.message,
              );
              return {
                id: attachmentId,
                url: null,
                message: 'invalid attachment',
              };
            }
          }),
        );
        return { ...reply, replyAttachmentUrls };
      }),
    );

    return { ...ticket, ticketAttachmentUrls, replies: processedReplies };
  }

  async delete(ticketId: number, req: any, response?:any): Promise<any> {
    try {
      const userId = req.user.id;

      if (!response) {
        throw new BadRequestException('You do not have access to delete this ticket');
      }
      const user = await this.userRepository.findOne({ where: { id: userId } });


      if (!user) {
        throw new BadRequestException('User not found');
      }

      const ticket = await this.ticketsRepository.findOne({
        where: { id: ticketId },
        relations: ['replies', 'createdForId'],
      });


      if (!ticket) {
        throw new BadRequestException('Ticket not found');
      }

      if (ticket.userId !== userId && !user.isOperator) {
        throw new UnauthorizedException(
          'Unauthorized: Only ticket owners and operators can delete this ticket',
        );
      }

      await this.ticketsRepository.softDelete({ id: ticketId });
      await this.ticketCollaboratorsRepository.softDelete({ ticket:{id:ticketId} });

      if (ticket.replies && ticket.replies.length > 0) {
        for (const reply of ticket.replies) {
          await this.ticketRepliesRepository.softDelete(reply.id);
        }
      }

      const deletedTicket = await this.ticketsRepository.softDelete({
        id: ticketId,
      });
      const operatorId = user?.operator?.id;

      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData:null,
        oldData: deletedTicket,
        entityId: ticketId,
        entityType: entityType.TICKET,
        performerId: operatorId,
        performerType: performerType.OPERATOR,
        field: 'Ticket Deleted',
        parentId: ticketId,
        parentType:  entityType.TICKET
      });

      return {
        statusCode: 200,
        message: 'Ticket deleted successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new InternalServerErrorException(
        'An error occurred while deleting the ticket',
      );
    }
  }

  
  async replyTicket(
    ticketId: number,
    replyTicketDTO: ReplyTicketsDto,
    req?: any,
    response?:any,
    userIdViaEmail?:number,
    email?:string
  ) {
    try {
       let userId = userIdViaEmail ? userIdViaEmail : req.user.id;
      const whereCondition = {
      };
      if(email){
        whereCondition['email'] = email
      }else{
        whereCondition['id'] = userId
      }
      const user = await this.userRepository.findOne({ where: whereCondition, relations: ['operator'] });
      userId = user?.id;
      if (!response) {
        throw new BadRequestException('You do not have access to reply to this ticket');
      }

      const {message,to,from, cc, bcc, attachments} = replyTicketDTO

      if (!user) {
        throw new BadRequestException('User not found');
      }

      const ticket = await this.ticketsRepository.findOne({
        where: { id: ticketId },
        relations: [
          'replies',
          'category',
          'category.categoryDesks',
          'category.categoryDesks.desk',
          'desk',
          'createdForId.client.regulation',
          'ticketCollaborators',
          'ticketCollaborators.collaborator',
          'ticketCollaborators.collaborator.photo',
          'assignee.operator'
        ],
      });

      if (!ticket) {
        throw new BadRequestException(`Ticket with ID ${ticketId} not found`);
      }

      if (replyTicketDTO.attachments && replyTicketDTO.attachments.length > 0) {
        const ticketsWithAttachments = await this.ticketsRepository.find({
          where: { attachments: Not(IsNull()) },
        });
        const usedAttachmentIds = ticketsWithAttachments.flatMap(
          (ticket) => ticket.attachments,
        );
        for (const attachmentId of replyTicketDTO.attachments) {
          if (usedAttachmentIds.includes(attachmentId)) {
            throw new BadRequestException(
              `Attachment ID ${attachmentId} has already been used in another ticket`,
            );
          }
        }
      }

         const ccEmails = new Set(cc || []); // Use Set to avoid duplicates

    // Add assignee email to CC if exists and not the sender
    if (ticket?.assignee?.email) {
      ccEmails.add(ticket.assignee.email);
    }

    // Add all collaborators' emails to CC (excluding the sender)
    if (ticket?.ticketCollaborators?.length > 0) {
      ticket.ticketCollaborators.forEach((collab) => {
        if (collab?.collaborator?.email) {
          ccEmails.add(collab.collaborator.email);
        }
      });
    }

    // Convert Set back to array
    const finalCcEmails = Array.from(ccEmails);

      const newReply = this.ticketRepliesRepository.create({
        createdById: userId,
        comment: replyTicketDTO.message,
        ticketId: ticket.id,
        attachments: replyTicketDTO.attachments,
        to: to ? to : [],
        cc: finalCcEmails ? finalCcEmails : [],
        bcc: bcc ? bcc : [],
        from,
        platform: replyTicketDTO?.platform ? replyTicketDTO?.platform : 'portal',
        messageId: replyTicketDTO?.messageId ? replyTicketDTO?.messageId : ''
      });

      if (ticket.status === TicketStatus.RESOLVED) {
        ticket.status = TicketStatus.OPEN;
        await this.ticketsRepository.save(ticket);
      }
      let previousReplies:any[] = [];
      let previousMessageId = null;
      let references:any[] = [];

      if (ticket.status === TicketStatus.CLOSED) {
        if (ticket.permanentlyClosed == false) {
          ticket.status = TicketStatus.OPEN
          await this.ticketsRepository.save(ticket);
        } else {
          const newSubject = ticket.title.replace(/#\d+\s*-\s*/, '').trim();
          const createTicketDto: CreateTicketsDto = {
            title: newSubject,
            description: replyTicketDTO?.message,
            category_id: ticket?.category?.id,
            attachments: replyTicketDTO.attachments || [],
            deskId: ticket?.desk?.id,
            priority: ticket?.priority,
            createdFor: ticket?.createdFor,
            createdForId: ticket?.createdForId?.id,
            collaboratorIds: ticket?.ticketCollaborators.map(collaborator => collaborator?.collaborator?.id) || [],
            assigneeId: ticket?.assignee?.operator?.id,
            fromEmail: ticket?.fromEmail,
            cc: ticket?.cc ?ticket.cc : [],
            bcc: ticket?.bcc ?ticket.bcc : [],
          }
          await this.createAdminTicket(createTicketDto, req)
          throw new BadRequestException("You can't reply to a permanently closed ticket. A new ticket has been created");
        }
      }

      await this.ticketRepliesRepository.save(newReply);
      previousReplies = await this.ticketRepliesRepository.find({
        where: { ticketId ,messageId: Not(IsNull()),},
        order: { createdAt: 'ASC' }
      });
      const defaultFromEmail =  this.configService.getOrThrow('mail.ticketReplyEmail', { infer: true });
    
      if (previousReplies.length > 0) {
        previousMessageId = previousReplies[previousReplies.length - 1].messageId; 
        references = previousReplies.map(reply => reply.messageId);
      }  
      await this.ticketRepliesRepository.save(newReply);
      await this.handleTicketReplies(ticket, newReply, userId);
      if(!userIdViaEmail){  
      await this.mailService.sendHtmlViaEmail({
        to,
        from: ticket?.fromEmail ? ticket.fromEmail : defaultFromEmail,
        data: {
          from:ticket?.fromEmail ? ticket.fromEmail : defaultFromEmail,
          subject: ticket?.title,
          userId: ticket?.createdForId?.id,
          html: message,
          operatorId: userId,
          regulation: ticket?.createdForId?.client?.regulation?.name,
          regulationId: ticket?.createdForId?.client?.regulation?.id,
          cc:finalCcEmails,
          bcc,
          fileUuids: attachments,
          isTicket:true,
          ticketReplyId: newReply?.id,
          ticketId: ticket?.id,
          previousMessageId,
          references
        },
      });  
    }

      const operatorId = user?.operator?.id;
      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: newReply,
        oldData: null,
        entityId: ticket?.id,
        entityType: entityType.TICKET,
        performerId: operatorId,
        performerType: performerType.OPERATOR,
        field: 'Ticket Replied',
        parentId: ticket?.id,
        parentType: entityType.TICKET,
      });

      // Retrieve updated ticket with collaborators
      const collaborators = await Promise.all(
        ticket.ticketCollaborators?.map(async (collab) => ({
          id: collab.collaborator?.id,
          firstName: collab.collaborator?.firstName,
          lastName: collab.collaborator?.lastName,
          email: collab.collaborator?.email,
          photo: collab.collaborator?.photo?.id
            ? {
              id: collab.collaborator.photo.id,
              url: await this.filesService.getSignedUrl(collab.collaborator.photo.id),
            }
            : null,
        })) || []
      );

      const updatedTicket = await this.ticketsRepository.findOne({
        where: { id: ticketId },
        relations: [
          'replies',
          'category',
          'category.categoryDesks',
          'category.categoryDesks.desk',
          'assignee',
          'desk',
          'ticketCollaborators',
          'ticketCollaborators.collaborator',
        ],
        order: { replies: { createdAt: 'DESC' } },
      });

      return {
        ...updatedTicket,
        collaborators,
      };
    } catch (error) {
      console.log('error: ', error);
      throw error
    }
  }

  async replyClientTicket(
    ticketId: number,
    replyClientTicketsDto: ReplyClientTicketsDto,
    req?: any,
    userIdViaEmail?:number,
    email?:string
  ) {
    try {
      const defaultFromEmail =  this.configService.getOrThrow('mail.ticketReplyEmail', { infer: true });
      let userId = userIdViaEmail ? userIdViaEmail : req.user.id;
      const whereCondition = {
      };
      if(email){
        whereCondition['email'] = email
      }else{
        whereCondition['id'] = userId
      }
      const user = await this.userRepository.findOne({ where: whereCondition });
      const system = await this.userRepository.findOne({ where: { operator: { full_name: 'System' } } });
      if(!system) throw new NotFoundException('System user not found');

      const ticket = await this.ticketsRepository.findOne({
        where: { id: ticketId },
        relations: [
          'replies',
          'category',
          'category.categoryDesks',
          'category.categoryDesks.desk',
          'assignee',
          'desk',
          'createdForId',
          'ticketCollaborators.collaborator',
        ],
      });

      if (!ticket) {
        throw new BadRequestException(`Ticket with ID ${ticketId} not found`);
      }

      if(userId != ticket?.createdForId?.id && userId != system?.id){
        throw new BadRequestException(
          'Unauthorized: Only ticket owners and operators can reply to this ticket',
        );
      }
      
      userId = user?.id;

      if (
        replyClientTicketsDto.attachments &&
        replyClientTicketsDto.attachments.length > 0
      ) {
        const ticketsWithAttachments = await this.ticketsRepository.find({
          where: { attachments: Not(IsNull()) },
        });
        const usedAttachmentIds = ticketsWithAttachments.flatMap(
          (ticket) => ticket.attachments,
        );
        for (const attachmentId of replyClientTicketsDto.attachments) {
          if (usedAttachmentIds.includes(attachmentId)) {
            throw new BadRequestException(
              `Attachment ID ${attachmentId} has already been used in another ticket`,
            );
          }
        }
      }

      const { title, message: comment, attachments,to,from,cc,bcc,platform,messageId } = replyClientTicketsDto;

      const newReply = this.ticketRepliesRepository.create({
        title,
        createdById: userId,
        comment,
        ticketId: ticket.id,
        attachments,
        to: to?to:[],
        from,
        cc: cc?cc:[],
        bcc: bcc?bcc:[],
        platform,
        messageId
      });

      if (ticket.status === TicketStatus.RESOLVED) {
        ticket.status = TicketStatus.OPEN
        await this.ticketsRepository.save(ticket);
      }

      if (ticket.status === TicketStatus.CLOSED) {
        if (ticket.permanentlyClosed == false) {
          ticket.status = TicketStatus.OPEN
          await this.ticketsRepository.save(ticket);
        } else {
          const newSubject = ticket.title.replace(/#\d+\s*-\s*/, '').trim();
          const createTicketDto: CreateClientTicketsDto = {
            title: newSubject,
            description: replyClientTicketsDto.message,
            category_id: ticket.category.id,
            attachments: attachments,
            fromEmail: ticket?.fromEmail
          }
          await this.createClientTicket(createTicketDto, req)
          throw new BadRequestException("You can't reply to a permanently closed ticket. A new ticket has been created");
        }
      }

      await this.ticketRepliesRepository.save(newReply);
      if (ticket?.assignee?.id) {
        await this.sendEmailToOperator({
          entityName: 'ticket_replies',
          entityValue: newReply?.id.toString(),
          emailEventName: TicketEmails.TICKET_REPLY_CLIENT_TO_OPERATOR,
          subject: `Ticket #${ticket.id} - ${TicketEmailSubjects.TICKET_REPLY_CLIENT_TO_OPERATOR}`,
          operatorId: userId,
          createdForId: ticket?.assignee?.id,
          fromEmail: ticket?.fromEmail ? ticket.fromEmail : defaultFromEmail,
        });
      }

      if (ticket?.ticketCollaborators?.length > 0) {
        for (const ticketCollaborator of ticket?.ticketCollaborators) {
          if (ticketCollaborator?.collaborator?.id) {
            await this.sendEmailToOperator({
              entityName: 'ticket_replies',
              entityValue: newReply?.id.toString(),
              emailEventName: TicketEmails.TICKET_REPLY_CLIENT_TO_OPERATOR,
              subject: `Ticket #${ticket.id} - ${TicketEmailSubjects.TICKET_REPLY_CLIENT_TO_OPERATOR}`,
              operatorId: userId,
              createdForId: ticketCollaborator.collaborator.id,
              fromEmail: ticket?.fromEmail ? ticket.fromEmail : defaultFromEmail,
            });
          }
        }
      }
     

      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: newReply,
        oldData: null,
        entityId: ticket?.id,
        entityType: entityType.TICKET,
        performerId: userId,
        performerType: performerType.USER,
        field: 'Ticket Replied',
        parentId: ticket?.id,
        parentType: entityType.TICKET,
      });

      return await this.ticketsRepository.findOne({
        where: { id: ticketId },
        relations: [
          'replies',
          'category',
          'category.categoryDesks',
          'category.categoryDesks.desk',
          'assignee',
          'desk',
        ],
        order: { replies: { createdAt: 'DESC' } },
      });
    } catch (error) {
      throw error;
    }
  }

  

  async validateCreatedFor(
    createdFor: string,
    createdForId: number,
  ): Promise<void> {
    const repositoryMap = {
      CLIENT: this.clientsRepository,
      OPERATOR: this.operatorRepository,
    };
    const repository = repositoryMap[createdFor];

    if (!repository) {
      throw new BadRequestException(
        'Invalid createdFor type. Must be CLIENT or OPERATOR',
      );
    }

    // const queryColumn = createdFor === 'CLIENT' ? 'userId' : 'id';

    const entity = await this.userRepository.findOne({
      where: { id: Number(createdForId) },
    });

    if (!entity) {
      throw new BadRequestException(`Invalid ${createdFor} ID`);
    }
  }

async autoCloseResolvedTickets() {
  const defaultFromEmail = this.configService.getOrThrow('mail.ticketReplyEmail', { infer: true });

  const user = await this.userRepository.findOne({
    where: { operator: { full_name: 'System' } },
    relations: ['operator'],
  });

  if (!user) {
    throw new NotFoundException('System user not found');
  }

  const userId = user?.id?.toString();
  const operatorId = user?.operator?.id;

  const fortyEightHoursAgo = new Date();
  fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);

  const tickets = await this.ticketsRepository.find({
    where: {
      status: TicketStatus.RESOLVED,
      deleteAt: IsNull(),
      resolvedAt: LessThan(fortyEightHoursAgo),
    },
    relations: ['createdForId', 'createdBy.operator', 'assignee.operator'],
  });

  const ticketsToClose: Tickets[] = [];

  for (const ticket of tickets) {
    const replies = await this.ticketRepliesRepository.find({
      where: {
        ticketId: ticket.id,
        createdAt: MoreThan(fortyEightHoursAgo), // replies within the last 48 hours
        deleteAt: IsNull(),
      },
    });
    if (replies.length === 0) {
      ticketsToClose.push(ticket);
    }
  }

  const ticketIdsToClose = ticketsToClose.map(t => t.id);

  if (ticketIdsToClose.length === 0) return;

  // ✅ Bulk update
  await this.ticketsRepository.update(
    { id: In(ticketIdsToClose) },
    {
      status: TicketStatus.CLOSED,
      closedAt: new Date(),
      closedReason: 'Auto-closed after 48 hours of inactivity',
    },
  );

  const updatedTickets = await this.ticketsRepository.find({
    where: { id: In(ticketIdsToClose) },
  });

  const updatedMap = new Map(updatedTickets.map(t => [t.id, t]));

  for (const ticket of ticketsToClose) {
    const updatedTicket = updatedMap.get(ticket.id);

    // const bulkOperatorIds =
    //   ticket?.ticketType === 'Operator'
    //     ? [ticket.createdBy?.operator?.id, ticket?.assignee?.operator?.id].filter(Boolean)
    //     : [ticket?.assignee?.operator?.id].filter(Boolean);

    // // if (bulkOperatorIds.length > 0) {
    // //   await this.sendEmailToOperator({
    // //     entityName: 'tickets',
    // //     entityValue: ticket.id.toString(),
    // //     emailEventName: TicketEmails.TICKET_CLOSE_OPERATOR,
    // //     subject: `Ticket #${ticket.id} - ${TicketEmailSubjects.TICKET_CLOSE_OPERATOR}`,
    // //     operatorId: userId,
    // //     bulkOperatorIds,
    // //     fromEmail: ticket?.fromEmail ?? defaultFromEmail,
    // //   });
    // // }

    // if (ticket.createdFor === CreatedFor.CLIENT) {
    //   await this.sendEmailToClient({
    //     entityName: 'tickets',
    //     entityValue: ticket.id.toString(),
    //     createdForId: ticket.createdForId?.id,
    //     emailEventName: TicketEmails.TICKET_CLOSE_CLIENT,
    //     subjectEnglish: `Ticket #${ticket.id} - ${TicketEmailSubjects.TICKET_CLOSE_CLIENT_ENGLISH}`,
    //     subjectArabic: `التذكرة #${ticket.id} - ${TicketEmailSubjects.TICKET_CLOSE_CLIENT_ARABIC}`,
    //     operatorId: userId,
    //     fromEmail: ticket?.fromEmail ?? defaultFromEmail,
    //   });
    // }

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: updatedTicket,
      oldData: ticket,
      entityId: ticket.id,
      entityType: entityType.TICKET,
      performerId: operatorId,
      performerType: performerType.OPERATOR,
      field: 'Ticket Auto Closed',
      parentId: ticket.id,
      parentType: entityType.TICKET,
    });
  }
}



   async autoPermanentlyCloseTickets() {
    const defaultFromEmail = this.configService.getOrThrow('mail.ticketReplyEmail', { infer: true });
    const user = await this.userRepository.findOne({
      where: { operator: { full_name: 'System' } },
      relations: ['operator'],
    });
    if (!user) {
      throw new NotFoundException('System user not found');
    }
    const userId = user?.id?.toString();
    const operatorId= user?.operator?.id;
    const fortyEightHoursAgo = new Date();
    fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);

    // Fetch IDs of tickets that have been closed for 48+ hours
    const ticketsClosedFor48Hours = await this.ticketsRepository.find({
      where: {
        deleteAt: IsNull(),
        status: TicketStatus.CLOSED,
        permanentlyClosedAt: IsNull() ,
        closedAt: LessThan(fortyEightHoursAgo),
      },
      relations: ['createdForId', 'createdBy.operator', 'assignee.operator'],
    });

    const ticketIds = ticketsClosedFor48Hours.map(ticket => ticket.id);

    // Perform a bulk update if there are tickets to update
    if (ticketIds.length > 0) {
     const updatedStatus =  await this.ticketsRepository.update(
        { id: In(ticketIds) },
        {
          permanentlyClosed: true,
          permanentlyClosedAt: new Date(),
          permanentlyClosedReason: 'Auto-closed after 96 hours of inactivity',
        }
        
      );
      const updatedTickets = await this.ticketsRepository.find({
        where: { id: In(ticketIds) },
      });
     const updatedMap = new Map(updatedTickets.map(t => [t.id, t]));
      for(const ticket of ticketsClosedFor48Hours){
          const updatedTicket = updatedMap.get(ticket.id);
          // const bulkOperatorIds =
          //   ticket?.ticketType == 'Operator'
          //     ? [ticket.createdBy?.operator?.id, ticket?.assignee?.operator?.id].filter(Boolean)
          //     : [ticket?.assignee?.operator?.id].filter(Boolean);
          //       if(bulkOperatorIds.length > 0){
          //           await this.sendEmailToOperator({
          //   entityName: 'tickets',
          //   entityValue: ticket.id.toString(),
          //   emailEventName: TicketEmails.TICKET_PERMANENT_CLOSE_OPERATOR,
          //   subject: `Ticket #${ticket.id} - ${TicketEmailSubjects.TICKET_PERMANENT_CLOSE_OPERATOR}`,
          //   operatorId: userId,
          //   bulkOperatorIds,
          //   fromEmail: ticket?.fromEmail ? ticket.fromEmail : defaultFromEmail,
        //   // });
        // }

        this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData:updatedTicket,
        oldData:ticket,
        entityId: ticket.id,
        entityType: entityType.TICKET,
        performerId: operatorId,
        performerType: performerType.OPERATOR,
        field: 'Ticket Permanently Closed',
        parentId: ticket.id,
        parentType: entityType.TICKET,
      });
      }

    }
  }




  async sendDynamicEmail(
    sendEmailDto: any,
  ) {
    try {
      const {
        templateId,
        userId,
        subject,
        from,
        to,
        layoutId,
        entityId,
        entityValue,
        operatorId,
        regulationId,
        cc,
        bcc
      } = sendEmailDto;

      let templateEntity: any = null;
      if (templateId) {
        templateEntity =
          await this.clientsService.getTemplateEntity(templateId);
      }


      if (!templateEntity) {
        throw new NotFoundException('No entity found for the given template ID');
      }

      const { name: entityType } = templateEntity.entity;
      const { name: templateName } = templateEntity;

      const dynamicData = await this.clientsService.fetchTemplateVariables(
        entityId,
        entityType,
        entityValue,
      );
      await this.clientsService.sendDynamicEmail({
        template: templateName,
        subject,
        from,
        to,
        layoutId,
        entityId,
        entityType,
        entityValue,
        operatorId,
        userId,
        regulationId,
        dynamicData,
        cc,
        bcc
      });

      return { message: 'Email sent successfully' };
    } catch (error) {
      
      throw error
    }
  }

  private async getEntityByName(name: string) {
    const entity = await this.emailEntityRepository.findOne({ where: { name } });
    if (!entity) throw new Error(`Entity with name ${name} not found`);
    return entity;
  }

  private async getUserById(userId: any) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    return user;
  }

  private async getUsers(userIds: (number | undefined)[] | number[]) {
    const users = await this.userRepository.find({
      where: { operator: { id: In(userIds) } },
      select: ['email']
    });
    return users;
  }

  private async getClientById(userId: number) {
    const client = await this.clientsRepository.findOne({
      where: { userId },
      relations: { regulation: true },
    });
    return client;
  }

  private async getEmailEventByName(name: string) {
    const emailEvent = await this.emailEventRepository.findOne({
      where: { name },
      select: ['id'],
    });
    if (!emailEvent) throw new Error(`Email event with name ${name} not found`);
    return emailEvent;
  }

  private async getEmailMappings(client, emailEvent) {
    const emailMappings = await this.emailMappingRepository.findOne({
      where: {
        emailEvent: { id: emailEvent.id },
        regulation: { id: client.regulation?.id },
        langCode: client.languageIso?.toLowerCase(),
      },
      relations: {
        bodyContent: true,
        headerFooter: true,
        emailEvent: true,
      },
    });
    if (!emailMappings) throw new Error(`Email mappings not found for the given client and email event`);
    return emailMappings;
  }

  private async getEmailMappingOperator(emailEvent) {
    const emailMappings = await this.emailMappingRepository.findOne({
      where: {
        emailEvent: { id: emailEvent.id },
        regulation: { name: 'FSCA' },
        langCode: 'en',
      },
      relations: {
        bodyContent: true,
        headerFooter: true,
        emailEvent: true,
      },
    });
    if (!emailMappings) throw new Error(`Email mappings not found for the given client and email event`);
    return emailMappings;
  }

  private getSupportEmail() {
    return this.configService.getOrThrow('mail.supportEmail', { infer: true });
  }


  async sendEmailToClient({
    entityName,
    entityValue,
    createdForId,
    emailEventName,
    subjectEnglish,
    subjectArabic,
    operatorId,
    fromEmail,
    cc,
    bcc
  }: {
    entityName: string;
    entityValue: string;
    createdForId: number;
    emailEventName: string;
    subjectEnglish: string;
    subjectArabic: string;
    operatorId: string;
    fromEmail?: string;
    cc?: string[];
    bcc?: string[];
  }): Promise<void> {
    try {
      const client = await this.getClientById(createdForId);
      if(!client){
       return await this.sendEmailToOperator(
         {
            entityName,
            entityValue,
            emailEventName,
            subject: subjectEnglish,
            operatorId,
            createdForId,
            fromEmail,
            cc,
            bcc
          }
        )
      }
      const entity = await this.getEntityByName(entityName);
      const emailEvent = await this.getEmailEventByName(emailEventName);
      const emailMappings = await this.getEmailMappings(client, emailEvent);
      const supportEmail = this.getSupportEmail();
      const sendEmailDto = {
        entityId: entity?.id,
        entityValue,
        userId: { id: createdForId },
        templateId: emailMappings?.bodyContent?.id,
        layoutId: emailMappings?.headerFooter?.id,
        regulationId: client?.regulation?.id,
        subject:
          client?.languageIso === 'EN'
            ? subjectEnglish
            : subjectArabic,
        from: fromEmail ? fromEmail : supportEmail,
        to: client?.email,
        operatorid: operatorId,
        cc,
        bcc
      };
      await this.sendDynamicEmail(sendEmailDto);
    } catch (error) {
      
      throw error
    }
  }


  async sendEmailToOperator({
    entityName,
    entityValue,
    emailEventName,
    subject,
    operatorId,
    createdForId,
    bulkOperatorIds,
    fromEmail
  }: {
    entityName: string;
    entityValue: string;
    emailEventName: string;
    subject: string;
    operatorId?: string;
    createdForId?: any;
    bulkOperatorIds?: (number|undefined)[];
    fromEmail?: string,
    cc?: string[],
    bcc?: string[]
  }): Promise<void> {
    try {
      const entity = await this.getEntityByName(entityName);
      let createdFor: any = null;
      if (createdForId) {
        createdFor = await this.getUserById(createdForId);
      } else if (!bulkOperatorIds || bulkOperatorIds.length === 0) {
        throw new BadRequestException("Either 'createdForId' or 'bulkOperatorIds' must be provided.");
      }
      const emailEvent = await this.getEmailEventByName(emailEventName);
      const emailMappings = await this.getEmailMappingOperator(emailEvent);
      const supportEmail = this.getSupportEmail();
      let OperatorEmails: (string | null)[] = [];
      if (createdFor?.email) {
        OperatorEmails.push(createdFor.email);
      }
      if (bulkOperatorIds) {
        const users = await this.getUsers(bulkOperatorIds)
        const userEmails = users.map(user => user.email)
        OperatorEmails = [...OperatorEmails, ...userEmails]
      }
      const sendEmailDto = {
        entityId: entity?.id,
        entityValue,
        userId: { id: createdForId },
        templateId: emailMappings?.bodyContent?.id,
        layoutId: emailMappings?.headerFooter?.id,
        subject,
        from: fromEmail ? fromEmail : supportEmail,
        to: OperatorEmails,
        operatorid: operatorId,
      };
      await this.sendDynamicEmail(sendEmailDto);
    } catch (error) {
      
      throw error
    }
  }

  async handleTicketReplies(ticket: any, newReply: any, userId: any): Promise<void> {
  try {
    const defaultFromEmail = this.configService.getOrThrow('mail.ticketReplyEmail', { infer: true });
    const operatorRecipients: Set<any> = new Set(); // Use Set to avoid duplicates
    
    // Get all collaborator IDs from the array
    const collaboratorIds = ticket?.ticketCollaborators?.map((collab: any) => collab.id) || [];
    
    if (ticket?.createdFor == CreatedFor.OPERATOR) {
      if (userId === ticket?.assignee?.id) {
        // Assignee replied - notify creator and all collaborators
        if (ticket?.createdForId?.id) {
          operatorRecipients.add(ticket.createdForId.id);
        }
        collaboratorIds.forEach((collabId: any) => {
          if (collabId !== userId) { // Don't notify the sender
            operatorRecipients.add(collabId);
          }
        });
      } else if (collaboratorIds.includes(userId)) {
        // Collaborator replied - notify creator, assignee, and other collaborators
        if (ticket?.createdForId?.id) {
          operatorRecipients.add(ticket.createdForId.id);
        }
        if (ticket?.assignee?.id && ticket.assignee.id !== userId) {
          operatorRecipients.add(ticket.assignee.id);
        }
        collaboratorIds.forEach((collabId: any) => {
          if (collabId !== userId) { // Don't notify the sender
            operatorRecipients.add(collabId);
          }
        });
      } else if (userId == ticket?.createdForId?.id) {
        // Creator replied - notify assignee and all collaborators
        if (ticket?.assignee?.id) {
          operatorRecipients.add(ticket.assignee.id);
        }
        collaboratorIds.forEach((collabId: any) => {
          operatorRecipients.add(collabId);
        });
      }

      // Send emails to all operator recipients
      for (const recipientId of operatorRecipients) {
        await this.sendEmailToOperator({
          entityName: 'ticket_replies',
          entityValue: newReply?.id.toString(),
          emailEventName: TicketEmails.TICKET_REPLY_OPERATOR,
          subject: `Ticket #${ticket?.id} - ${TicketEmailSubjects.TICKET_REPLY_OPERATOR}`,
          operatorId: userId,
          createdForId: recipientId,
          fromEmail: ticket?.fromEmail ? ticket.fromEmail : defaultFromEmail,
        });
      }
    }

    if (ticket?.createdFor == CreatedFor.CLIENT) {
      const clientRecipients: Set<any> = new Set(); // Use Set to avoid duplicates

      if (userId == ticket?.assignee?.id && collaboratorIds.length > 0) {
        // Assignee replied - notify all collaborators
        collaboratorIds.forEach((collabId: any) => {
          clientRecipients.add(collabId);
        });
      } else if (collaboratorIds.includes(userId)) {
        // Collaborator replied - notify assignee and other collaborators
        if (ticket?.assignee?.id) {
          clientRecipients.add(ticket.assignee.id);
        }
        collaboratorIds.forEach((collabId: any) => {
          if (collabId !== userId) { // Don't notify the sender
            clientRecipients.add(collabId);
          }
        });
      }

      // Send emails to all client recipients (operators)
      for (const recipientId of clientRecipients) {
        await this.sendEmailToOperator({
          entityName: 'ticket_replies',
          entityValue: newReply?.id.toString(),
          emailEventName: TicketEmails.TICKET_REPLY_OPERATOR,
          subject: `Ticket #${ticket.id} - ${TicketEmailSubjects.TICKET_REPLY_OPERATOR}`,
          operatorId: userId,
          createdForId: recipientId,
          fromEmail: ticket?.fromEmail ? ticket.fromEmail : defaultFromEmail,
        });
      }

      // Always send email to the client when it's a client ticket
      await this.sendEmailToClient({
        entityName: 'ticket_replies',
        entityValue: newReply?.id.toString(),
        createdForId: ticket?.createdForId?.id,
        emailEventName: TicketEmails.TICKET_REPLY_CLIENT_VIA_OPERATOR,
        subjectEnglish: `Ticket #${ticket.id} - ${TicketEmailSubjects.TICKET_REPLY_CLIENT_VIA_OPERATOR_ENGLISH}`,
        subjectArabic: `التذكرة #${ticket.id} - ${TicketEmailSubjects.TICKET_REPLY_CLIENT_VIA_OPERATOR_ARABIC}`,
        operatorId: userId,
        fromEmail: ticket?.fromEmail ? ticket.fromEmail : defaultFromEmail,
      });
    }
  } catch (error) {
    throw error;
  }
}

  async getTicketHistory(createdForId: any,req:any): Promise<any> {
  try {
      const tickets = await this.ticketsRepository.find({
        where: {
          createdForId: { id: createdForId },
        },
        order: {
          createdAt: 'DESC',
        },
        take: 4,
        select: ['id', 'title', 'createdAt', 'status'],
      });
      const ticketIds = tickets.map(ticket => ticket.id);
      await this.getMultipleTickets(req, ticketIds);
  
      return tickets.map(ticket => ({
        ...ticket,
        title: ticket.title.replace(/^Ticket\s*#\d+\s*-\s*/i, '').trim(),
      }));
  } catch (error) {
    
    throw error;
  }
  }

  async postReplyRoleWise(
    ticketId: number,
    dto: ReplyTicketsDto,
    req?: any,
    userIdViaEmail?:any,
    email?:string
  ): Promise<any> {
    try {
      const response = await this.getSingleTicket(req,ticketId,userIdViaEmail);
  
      return await this.replyTicket(ticketId,dto, req, response,userIdViaEmail,email);
    } catch (error) {
      throw error
    }
 
  }

  async deleteTicketRoleWise(
    ticketId: number,
    req: any,
  ): Promise<any> {
    const response = await this.getSingleTicket(req,ticketId);

    return this.delete(ticketId, req, response);
 
  }

  async mergeTicketsRoleWise(
    dto: MergeTicketsDto,
    req: any,
  ): Promise<any> {
    const allIds = [dto.primaryTicketId, ...dto.secondaryTicketIds];
    const response = await this.getMultipleTickets(req,allIds);

    return this.mergeTickets(dto, req, response);
 
  }

  async getSingleTicket(req:any,ticketId:number,userIdViaEmail?:any){
     const tickets = await this.getMultipleTickets(req, [ticketId],userIdViaEmail);
     if(tickets && tickets.length > 0){
      return tickets[0]
     };
     throw new NotFoundException("Ticket not found")
  }

  async getMultipleTickets(req:any,ticketIds:number[],userIdViaEmail?:any){
    const allTicketsIds = ticketIds.map(ticketId => Number(ticketId));
    //@ts-expect-error type-error
     const resp = await this.listTickets(req, {} , {} , allTicketsIds,userIdViaEmail);
     if(ticketIds.length != resp.result.length){
      throw new NotFoundException("Ticket not found")
     }
     return resp.result
  }

  async updateTicketsRoleWise(
    ticketId: number,
    dto: UpdateTicketsDto,
    req: any,
  ): Promise<any> {
    const response = await this.getSingleTicket(req,ticketId);

    return this.update(ticketId,dto, req, response);
 
  }

  async getTicketDetailsRoleWise(
    ticketId: number,
    req: any,
    query: PaginationDto
  ): Promise<any> {
    const response = await this.getSingleTicket(req,ticketId);

    return this.getOne(ticketId, req, response, query.page || 1, query.limit || 10, query.all||'false');
 
  }

  async mergeTickets(dto: MergeTicketsDto, req, res) {
    const defaultFromEmail  = this.configService.getOrThrow('mail.ticketReplyEmail', { infer: true });
    const createdBy = req.user.id
    const { primaryTicketId, secondaryTicketIds } = dto;
  
    if (secondaryTicketIds.includes(primaryTicketId)) {
      throw new BadRequestException('Primary ticket cannot also be a secondary ticket.');
    }
  
    const allIds = [primaryTicketId, ...secondaryTicketIds];
    const tickets = await this.ticketsRepository.find({
      where: { id: In(allIds) },
      relations: ['createdBy.operator', 'assignee.operator', 'createdForId.client'],
    })
    if (tickets.length !== allIds.length) {
      throw new NotFoundException('One or more ticket IDs are invalid.');
    }
  
    const existingMergeGroup = await this.mergedTicketRepository.findOne({
      where: { ticket_id: primaryTicketId, status: MergeStatus.PRIMARY },
    });
  
    if (existingMergeGroup) {
      const currentMergedTickets = await this.mergedTicketRepository.find({
        where: { merge_group_id: existingMergeGroup.merge_group_id },
      });
  
      if (currentMergedTickets.length >= 5) {
        throw new BadRequestException('Cannot merge more than 5 tickets in one group.');
      }
  
      const alreadyMergedIds = currentMergedTickets.map(t => t.ticket_id);
      const newSecondaryIds = secondaryTicketIds.filter(id => !alreadyMergedIds.includes(id));
  
      if (newSecondaryIds.length + currentMergedTickets.length > 5) {
        throw new BadRequestException('Adding these tickets would exceed the 5-ticket merge limit.');
      }
  
      const alreadyMergedSecondary = currentMergedTickets.filter(t => t.status === MergeStatus.SECONDARY).map(t => t.ticket_id);
      const attemptedRemovals = alreadyMergedSecondary.filter(id => !secondaryTicketIds.includes(id));
      if (attemptedRemovals.length > 0) {
        throw new BadRequestException('Cannot remove previously merged tickets.');
      }
  
      const newMergedEntriesRaw = newSecondaryIds.map(id => ({
        ticket_id: id,
        merge_group_id: existingMergeGroup.merge_group_id,
        status: MergeStatus.SECONDARY,
      }));

      const newMergedEntries = this.mergedTicketRepository.create(newMergedEntriesRaw);
  
      if (newMergedEntries.length > 0) {
        await this.mergedTicketRepository.save(newMergedEntries);
        await this.ticketsRepository.update(newSecondaryIds, {
          status: TicketStatus.CLOSED,
          permanentlyClosed: true,
          closedAt: new Date(),
          permanentlyClosedAt: new Date(),
          permanentlyClosedReason: 'Closed as part of ticket merge',
        });
        const secondaryTickets = tickets.filter(t => newSecondaryIds.includes(t.id));
        const primaryTicketDetails = await this.ticketsRepository.findOne({
          where: {
            id: primaryTicketId
          },
          relations: ['createdForId']
        })
    
        const userDetails = await this.userRepository.findOne({
          where:{
            id: primaryTicketDetails?.createdForId?.id
          },
          relations:{
            client:true
          }
        })
        const createNoteDto: CreateLeadNoteDto = {
          type: NotesType.TICKET_GENERAL,
          ticket_id: primaryTicketId,
          note: `The ticket merged the following tickets: ${newSecondaryIds}`,
          ...(userDetails?.client?.leadId
            ? { lead_id: userDetails.client.leadId }
            : { user_id: userDetails?.id }),
        };
        await this.opportunityService.createNote(createNoteDto, createdBy);
         for (const ticket of secondaryTickets) {
          if(ticket?.ticketType == 'Operator'){
            if( ticket?.assignee?.id){
              await this.sendEmailToOperator({
                entityName: 'tickets',
                entityValue: ticket.id.toString(),
                emailEventName: TicketEmails.TICKET_MERGE_OPERATOR,
                subject: `Ticket #${ticket.id} - ${TicketEmailSubjects.TICKET_MERGE_OPERATOR}`,
                operatorId: createdBy,
                bulkOperatorIds:[ticket.createdBy?.operator?.id, ticket.assignee?.operator?.id].filter(Boolean),
                fromEmail: ticket?.fromEmail ? ticket.fromEmail : defaultFromEmail,
              });
            }
            else{
                await this.sendEmailToOperator({
                  entityName: 'tickets',
                  entityValue: ticket.id.toString(),
                  emailEventName: TicketEmails.TICKET_MERGE_OPERATOR,
                  subject: `Ticket #${ticket.id} - ${TicketEmailSubjects.TICKET_MERGE_OPERATOR}`,
                  operatorId: createdBy,
                  bulkOperatorIds:[ticket.createdBy?.operator?.id].filter(Boolean),
                  fromEmail: ticket?.fromEmail ? ticket.fromEmail : defaultFromEmail,
                });
            }
          }
          else{
            if( ticket?.assignee?.id){
              await this.sendEmailToOperator({
                entityName: 'tickets',
                entityValue: ticket.id.toString(),
                emailEventName: TicketEmails.TICKET_MERGE_OPERATOR,
                subject: `Ticket #${ticket.id} - ${TicketEmailSubjects.TICKET_MERGE_OPERATOR}`,
                operatorId: createdBy,
                bulkOperatorIds:[ticket?.assignee?.operator?.id].filter(Boolean),
                fromEmail: ticket?.fromEmail ? ticket.fromEmail : defaultFromEmail,
              });
            }
          }
          const createNoteDto: CreateLeadNoteDto = {
            type: NotesType.TICKET_GENERAL,
            ticket_id: ticket.id,
            note: `The ticket merged with primary ticket : ${primaryTicketId}`,
                ...(ticket?.createdForId?.client?.leadId
                ? { lead_id: ticket?.createdForId?.client?.leadId }
                : { user_id:ticket?.createdForId?.id }),
          };
          await this.opportunityService.createNote(createNoteDto, createdBy);
          this.eventEmitter.emit(EventTypes.USER_LOG, {
            newData: newMergedEntriesRaw,
            oldData: null,
            entityId: existingMergeGroup?.merge_group_id, 
            entityType: entityType.MERGE_TICKET, 
            performerId: createdBy,
            performerType: performerType.OPERATOR,
            field: 'Ticket Merged',
            parentId: ticket?.id,
            parentType: entityType.TICKET
          });
      }
  
      return { message: 'Merge updated successfully.', mergeGroupId: existingMergeGroup.merge_group_id };
    }} else {
      // Initial merge
      if (secondaryTicketIds.length > 4) {
        throw new BadRequestException('Cannot merge more than 4 secondary tickets.');
      }
  
      const existingMerged = await this.mergedTicketRepository.find({
        where: allIds.map(id => ({ ticket_id: id })),
      });
  
      if (existingMerged.length > 0) {
        throw new BadRequestException('One or more tickets are already merged.');
      }
  
      const mergeGroupId = uuidv4();
  
      const toInsert = [
        {
          ticket_id: primaryTicketId,
          merge_group_id: mergeGroupId,
          status: MergeStatus.PRIMARY,
        },
        ...secondaryTicketIds.map(id => ({
          ticket_id: id,
          merge_group_id: mergeGroupId,
          status: MergeStatus.SECONDARY,
        })),
      ];
  
      await this.mergedTicketRepository.save(toInsert);
      await this.ticketsRepository.update(secondaryTicketIds, {
        status: TicketStatus.CLOSED,
        permanentlyClosed: true,
        closedAt: new Date(),
        permanentlyClosedAt: new Date(),
        permanentlyClosedReason: 'Closed as part of ticket merge',
      });
      const secondaryTickets = tickets.filter(t => secondaryTicketIds.includes(t.id));

      const primaryTicketMergeId = await this.mergedTicketRepository.findOne({
        where:{merge_group_id:mergeGroupId, status:MergeStatus.PRIMARY}
      })
      const primaryTicketDetails = await this.ticketsRepository.findOne({
        where: {
          id: primaryTicketId
        },
        relations: ['createdForId']
      })
  
      const userDetails = await this.userRepository.findOne({
        where:{
          id: primaryTicketDetails?.createdForId?.id
        },
        relations:{
          client:true
        }
      })
      const createNoteDto: CreateLeadNoteDto = {
        type: NotesType.TICKET_GENERAL,
        ticket_id: primaryTicketId,
        note: `The ticket merged the following tickets: ${secondaryTicketIds}`,
        ...(userDetails?.client?.leadId
          ? { lead_id: userDetails.client.leadId }
          : { user_id: userDetails?.id }),
      };
      for (const ticket of secondaryTickets) {
          if(ticket?.ticketType == 'Operator'){
            if( ticket?.assignee?.id){
              await this.sendEmailToOperator({
                entityName: 'tickets',
                entityValue: ticket.id.toString(),
                emailEventName: TicketEmails.TICKET_MERGE_OPERATOR,
                subject: `Ticket #${ticket.id} - ${TicketEmailSubjects.TICKET_MERGE_OPERATOR}`,
                operatorId: createdBy,
                bulkOperatorIds:[ticket.createdBy?.operator?.id, ticket.assignee?.operator?.id].filter(Boolean),
                fromEmail: ticket?.fromEmail ? ticket.fromEmail : defaultFromEmail,
              });
            }
            else{
                await this.sendEmailToOperator({
                  entityName: 'tickets',
                  entityValue: ticket.id.toString(),
                  emailEventName: TicketEmails.TICKET_MERGE_OPERATOR,
                  subject: `Ticket #${ticket.id} - ${TicketEmailSubjects.TICKET_MERGE_OPERATOR}`,
                  operatorId: createdBy,
                  bulkOperatorIds:[ticket.createdBy?.operator?.id].filter(Boolean),
                  fromEmail: ticket?.fromEmail ? ticket.fromEmail : defaultFromEmail,
                });
            }
          }
          else{
            if( ticket?.assignee?.id){
              await this.sendEmailToOperator({
                entityName: 'tickets',
                entityValue: ticket.id.toString(),
                emailEventName: TicketEmails.TICKET_MERGE_OPERATOR,
                subject: `Ticket #${ticket.id} - ${TicketEmailSubjects.TICKET_MERGE_OPERATOR}`,
                operatorId: createdBy,
                bulkOperatorIds:[ticket?.assignee?.operator?.id].filter(Boolean),
                fromEmail: ticket?.fromEmail ? ticket.fromEmail : defaultFromEmail,
              });
            }
          }
           const createNoteDto: CreateLeadNoteDto = {
            type: NotesType.TICKET_GENERAL,
            ticket_id: ticket.id,
            note: `The ticket merged with primary ticket : ${primaryTicketId}`,
                ...(ticket?.createdForId?.client?.leadId
                ? { lead_id: ticket?.createdForId?.client?.leadId }
                : { user_id:ticket?.createdForId?.id }),
          };
          await this.opportunityService.createNote(createNoteDto, createdBy);
          this.eventEmitter.emit(EventTypes.USER_LOG, {
            newData: toInsert,
            oldData: null,
            entityId: primaryTicketMergeId?.merge_group_id, 
            entityType: entityType.MERGE_TICKET, 
            performerId: createdBy,
            performerType: performerType.OPERATOR,
            field: 'Ticket Merged',
            parentId: ticket?.id,
            parentType: entityType.TICKET
          });
      }
      await this.opportunityService.createNote(createNoteDto, createdBy);
      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: toInsert,
        oldData: null,
        entityId: primaryTicketMergeId?.id, 
        entityType: entityType.MERGE_TICKET, 
        performerId: createdBy,
        performerType: performerType.OPERATOR,
        field: 'Ticket Merged',
        parentId: primaryTicketDetails?.id,
        parentType: entityType.TICKET
      });
  
      return { message: 'Tickets merged successfully.', mergeGroupId };
    }
  
}

   async searchTicketsRoleWise(
    req: any,
    query: PaginationDto,
    search: string,
  ): Promise<any> {

    const response = await this.listTickets(req, query,{
      filters: [
        {
           operator: FilterOperation.CONTAINS, values: [search], listColumnMeta: { name: "id" }
        }
      ],
      sort: []
    });

    return this.searchTicketsByIdFromResponse(response,query, search);
 
  }


  async searchTicketsByIdFromResponse(
    response: any, // your JSON response
    query: PaginationDto,
    search: string,
  ): Promise<{ data: Partial<Tickets>[]; total: number; page: number; limit: number , hasNextPage: boolean}> {
    const page = query.page || 1;
    const limit = query.limit || 10;
  
    // Get merged ticket ids if you still want to exclude some (you can skip this if not needed)
    const merged = await this.mergedTicketRepository.find({
      select: ['ticket_id'],
    });
    const mergedTicketIds = merged.map((m) => m.ticket_id);
  
    // Filter tickets from the response
    let tickets = response.result || [];
  
    tickets = tickets.filter((ticket) => {
      const matchesSearch = ticket.id.toString().includes(search);
      const notMerged = !mergedTicketIds.includes(ticket.id);
      return matchesSearch && notMerged;
    });
  
    const total = response.total;
    const hasNextPage = response.hasNextPage;
  
    // Apply pagination
    const paginatedTickets = tickets
      .map((ticket) => ({
        id: ticket.id,
        title: ticket.title.replace(/^Ticket\s*#\d+\s*-\s*/i, '').trim(),
        createdAt: ticket.createdAt,
        status: ticket.status,
      }));
  
    return {
      data: paginatedTickets,
      total,
      page,
      limit,
      hasNextPage
    };
  }
  

  async getMergeTickets(ticketId: number,req: any): Promise<any> {
    try {
      await this.getSingleTicket(req, ticketId);
      const ticket = await this.mergedTicketRepository.findOne({
        where: { ticket_id: ticketId },
      });

      if (!ticket) {
        return {
          message: 'Ticket not found',
          statusCode: 200,
          data: []
        }
      }
    
      const allMergeTickets =  await this.mergedTicketRepository.find({
        where:{
          merge_group_id: ticket?.merge_group_id
        },
        relations: ['ticket'],
      })

      const projected = allMergeTickets.map((merge) => ({
        id: merge.ticket.id,
        title: merge.ticket.title.replace(/^Ticket\s*#\d+\s*-\s*/i, '').trim(),
        createdAt: merge.ticket.createdAt,
        ticketStatus: merge.ticket.status,
        mergeStatus: merge?.status
      }));
      return {
        statusCode: 200,
        message: 'Ticket fetched successfully',
        data: projected
      };
    } catch (error) {
      throw error;
    }
  }

  //elm account deletion
 async createAccountDeletionTicket(reasons: string[], req: any): Promise<any> {
  const userId = req.user.id;
  const user = await this.userRepository.findOne({ where: { id: userId } });

  if (!user) {
    throw new BadRequestException('User not found');
  }

  const description = reasons?.length
    ? reasons.join('\n')
    : 'User did not provide a reason.';

  const dto: CreateTicketsDto = {
    title: 'Account Deletion Request',
    description,
    category_id: 2,
    priority: TicketPriority.MEDIUM,
    createdFor: CreatedFor.CLIENT,
    createdForId: userId,
    deskId: undefined,
    userId,
    attachments: [],
    assigneeId: undefined,
    collaboratorIds: [],
  };
  return this.createClientTicket(dto, req);
}

async cancelDeletionRequest(ticketId: number, req: any): Promise<any> {
  try {
    const userId = req.user.id;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const ticket = await this.ticketsRepository.findOne({ where: { id: ticketId } });
    if (!ticket) {
      throw new BadRequestException('Ticket not found');
    }

    if (ticket.userId !== userId && !user.isOperator) {
      throw new UnauthorizedException(
        'Unauthorized: Only ticket owners or operators can cancel the delete request',
      );
    }

    const now = new Date();

    await this.ticketsRepository.update(ticketId, {
      status: TicketStatus.CLOSED,
      closedAt: now,
      closedReason: 'Cancelled Account Deletion Request by client',
    });

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: {
        status: TicketStatus.CLOSED,
        closedAt: now,
        closedReason: 'Cancelled Account Deletion Request by client',
      },
      oldData: ticket,
      entityId: ticketId,
      entityType: entityType.TICKET,
      performerId: user?.operator?.id ?? userId,
      performerType: performerType.OPERATOR,
      field: 'Ticket Deletion Request Cancelled',
      parentId: ticketId,
      parentType: entityType.TICKET,
    });

    return {
      statusCode: 200,
      message: 'Account deletion request cancelled successfully',
    };
  } catch (error) {
    if (error instanceof HttpException) throw error;
    throw new InternalServerErrorException(
      'An error occurred while cancelling the deletion request',
    );
  }
}
async checkOpenAccountDeletionTicket(userId: number): Promise<{
  hasOpenRequest: boolean;
  ticketId?: number;
  crmLink?: string;
  clientLink?: string;
  status?: TicketStatus;
  description?: string;
  priority?: TicketPriority;
  comments?: string;
}> {
  const user = await this.userRepository.findOne({ where: { id: userId } });

  if (!user) {
    throw new BadRequestException('User not found');
  }

  const existingTicket = await this.ticketsRepository.findOne({
    where: {
      title: Like('%Account Deletion Request'),
      createdFor: CreatedFor.CLIENT,
      createdForId: { id: userId },
      status: TicketStatus.OPEN,
    },
    select: ['id', 'crmLink', 'clientLink', 'status', 'description', 'priority', 'comments'],
  });

  if (existingTicket) {
    return {
      hasOpenRequest: true,
      ticketId: existingTicket.id,
      crmLink: existingTicket.crmLink,
      clientLink: existingTicket.clientLink,
      status: existingTicket.status,
      description: existingTicket.description,
      priority: existingTicket.priority,
      comments: existingTicket.comments,
    };
  }

  return { hasOpenRequest: false };
}

  async getOne(ticketId: number, req: any, response?: any, page: number = 1, limit: number = 10, all: string = 'false'): Promise<any> {
  try {
    const operator = await this.operatorRepository.findOne({ where: { email: req?.user?.email } });
    if (!operator) {
      throw new NotFoundException('Operator not found');
    }

    if (!response) {
      throw new BadRequestException('You do not have access to update details of this ticket');
    }

    const ticket = await this.ticketsRepository.findOne({
      where: { id: ticketId },
      relations: ['category.categoryDesks.desk', 'assignee', 'desk'],
    });

    if (!ticket) {
      throw new HttpException('Ticket not found', HttpStatus.NOT_FOUND);
    }

    const [createdByUser, createdForUser] = await Promise.all([
      ticket.createdById ? this.getUserWithDetails(ticket.createdById) : null,
      ticket.createdForIdId ? this.getUserWithDetails(ticket.createdForIdId) : null,
    ]);

    const paginatedReplies = await this.getPaginatedReplies(ticketId, page, limit);
    
    const collaborators = await this.getCollaborators(ticketId);

    const transformedTicket = {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      category_id: ticket.category_id,
      priority: ticket.priority,
      status: ticket.status,
      ticketNumber: ticket.ticketNumber,
      userId: ticket.userId,
      attachments: ticket.attachments,
      comments: ticket.comments,
      platofrm: ticket.platform,
      channel: ticket?.fromEmail,
      to: ticket?.to,
      cc: ticket?.cc,
      bcc: ticket?.bcc,
      collaboratorId: null,
      assigneeId: ticket.assigneeId,
      createdFor: ticket.createdFor,
      deskId: ticket.deskId,
      ticketType: ticket.ticketType,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      resolvedAt: ticket.resolvedAt,
      closedAt: ticket.closedAt,
      closedReason: ticket.closedReason,
      permanentlyClosed: ticket.permanentlyClosed,
      permanentlyClosedAt: ticket.permanentlyClosedAt,
      permanentlyClosedReason: ticket.permanentlyClosedReason,  
      deleteAt: ticket.deleteAt,
      crmLink: ticket.crmLink,
      clientLink: ticket.clientLink,
      replies: paginatedReplies.data,
      repliesPagination: {
        currentPage: page,
        totalPages: paginatedReplies.totalPages,
        totalItems: paginatedReplies.totalItems,
        hasNext: paginatedReplies.hasNext,
        hasPrevious: paginatedReplies.hasPrevious,
      },
      category: ticket.category,
      assignee: ticket.assignee
        ? {
          id: ticket.assignee.id,
          firstName: ticket.assignee.firstName,
          lastName: ticket.assignee.lastName,
        }
        : null,
      desk: ticket.desk,
      createdBy: await this.transformUserForResponse(createdByUser),
      createdForId: await this.transformUserForResponse(createdForUser, true),
      collaborators,
      ticketAttachmentUrls: [],
    };

    return {
      statusCode: 200,
      message: 'Ticket fetched successfully',
      data: await this.prepareTicketResponse(transformedTicket),
    };
  } catch (error) {
    throw error;
  }
}

private async getUserWithDetails(userId: number) {
  return this.userRepository.findOne({
    where: { id: userId },
    relations: ['client', 'role', 'photo'],
  });
}

private async getPaginatedReplies(ticketId: number, page: number, limit: number) {
  const offset = (page - 1) * limit;
  
  const [replies, totalItems] = await this.ticketRepliesRepository.findAndCount({
    where: { ticketId },
    relations: ['createdBy', 'createdBy.photo'],
    order: { createdAt: 'ASC' },
    skip: offset,
    take: limit,
  });

  // Calculate total pages based on total items and limit
  const totalPages = Math.ceil(totalItems / limit);
  
  // Transform replies
  const transformedReplies = await Promise.all(
    replies.map(async (reply) => ({
      id: reply.id,
      comment: reply.comment,
      createdAt: reply.createdAt,
      attachments: reply.attachments,
      to: reply.to,
      from: reply.from,
      cc: reply.cc,
      bcc: reply.bcc,
      platform: reply.platform,
      createdBy: reply.createdBy
        ? {
          id: reply.createdBy.id,
          firstName: reply.createdBy.firstName,
          lastName: reply.createdBy.lastName,
          photo: reply.createdBy.photo?.id
            ? {
              id: reply.createdBy.photo.id,
              url: await this.filesService.getSignedUrl(reply.createdBy.photo.id),
            }
            : null,
        }
        : null,
    }))
  );

  return {
    data: transformedReplies,
    totalItems,
    totalPages,
    currentPage: page,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
  };
}

private async getCollaborators(ticketId: number) {
  const ticketCollaborators = await this.ticketCollaboratorsRepository.find({
    where: { ticket: { id: ticketId } },
    relations: ['collaborator', 'collaborator.photo'],
  });

  return Promise.all(
    ticketCollaborators.map(async (collab) => ({
      id: collab.collaborator?.id,
      firstName: collab.collaborator?.firstName,
      lastName: collab.collaborator?.lastName,
      email: collab.collaborator?.email,
      photo: collab.collaborator?.photo?.id
        ? {
          id: collab.collaborator.photo.id,
          url: await this.filesService.getSignedUrl(collab.collaborator.photo.id),
        }
        : null,
    }))
  );
}

private async transformUserForResponse(user: any, includeAdditionalFields = false) {
  if (!user) return null;

  const baseUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    client: user.client ? { leadId: user.client.leadId } : null,
    photo: user.photo?.id
      ? {
        id: user.photo.id,
        url: await this.filesService.getSignedUrl(user.photo.id),
      }
      : null,
  };

  if (includeAdditionalFields) {
    return {
      ...baseUser,
      telephone: user.telephone,
      telephonePrefix: user.telephonePrefix,
      role: user.role
        ? {
          id: user.role.id,
          name: user.role.name,
        }
        : null,
    };
  }

  return baseUser;
}
  

  async emailList(): Promise<EmailList[]> {
    try {
      const emailList = await this.emailListRepository.find({
        where:{ticketConfigured: true,}
      })
      return emailList
    } catch (error) {
      throw error
    }
  }
}

