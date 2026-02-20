import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Regulations } from '../regulations/entities/regulations.entity';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { FilterItem, FilterOperation } from 'src/database/base-repository/dto/advance-search.dto';
import { ListNames } from 'src/list-item/dto/create-list-item.dto';
import { EmailEvent } from './entity/email-event.entity';
import { EmailMapping } from './entity/email-mapping.entity';
import { EmailEventRepository } from './email.repository';
import { CreateEmailEventDto, UpdateEmailEventDto } from './dto/email-event.dto';
import { entityType, performerType } from '../active-log/active-log.type';
import { EventTypes } from 'src/common/services/event.type';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EmailEventService {
  constructor(
    @InjectRepository(EmailEvent)
    private readonly emailEventRepository: Repository<EmailEvent>,
    @InjectRepository(EmailMapping)
    private readonly emailMappingRepository: Repository<EmailMapping>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Regulations)
    private readonly regulationRepository: Repository<Regulations>,
    private emailEventsRepository: EmailEventRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async syncEmailMapping(emailEventId: number) {
   try {
     const regulations = await this.regulationRepository.find();
     const regulationIds = regulations.map((reg) => reg.id);
     const existingMappings = await this.emailMappingRepository.find({
       where: { emailEvent: { id: emailEventId } },
       relations: ['regulation'],
     });
   
     const existingRegulationIds = existingMappings.map((t) => t?.regulation?.id);
     const missingRegulations = regulations.filter(
       (reg) => !existingRegulationIds.includes(reg.id),
     );
 
     const newMappings = missingRegulations.flatMap((reg) => [
       this.emailMappingRepository.create({
         emailEvent: { id: emailEventId },
         regulation: reg,
         langCode: 'en',
       }),
       this.emailMappingRepository.create({
         emailEvent: { id: emailEventId },
         regulation: reg,
         langCode: 'ar',
       }),
     ]);
     if (newMappings.length > 0) {
     await this.emailMappingRepository.save(newMappings);
    }
   
     const translationsToDeleteIds = existingMappings
     .filter((t) => !t?.regulation?.id || !regulationIds.includes(t?.regulation?.id))
     .map((t) => t?.id);
   
     if (translationsToDeleteIds.length > 0) {
       await this.emailMappingRepository.softDelete(translationsToDeleteIds);
     }
   
     return { newMappings, deletedTranslations: translationsToDeleteIds };
   } catch (error) {
      throw error
   }
  }

  async createEmailEvent(createEmailEventDto: CreateEmailEventDto,userId:number): Promise<EmailEvent> {
   try {
     const {name} = createEmailEventDto;
     if (!name) {
       throw new NotFoundException('Name is not found in the payload');
     }
     const existingEmailEvent = await this.emailEventRepository.findOne({
       where: {
         name,
       },
     });
     if (existingEmailEvent) {
       throw new NotFoundException('Email event already exists');
     }
     const updatedDto = {
       ...createEmailEventDto,
       createdBy: {id:userId},
     }
     const emailEvent = this.emailEventRepository.create(updatedDto);
     const savedEmailEvent = await this.emailEventRepository.save(emailEvent);
     await this.syncEmailMapping(savedEmailEvent?.id)

     this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: savedEmailEvent,
      oldData: null,
      entityId: savedEmailEvent?.id,
      entityType: entityType.EMAIL_EVENT,
      performerId: userId,
      performerType: performerType.OPERATOR,
      field: 'Email Event Created',
    });
    
     return savedEmailEvent
   } catch (error) {
      throw error
   }
  }

  async getEmailEvent(id: number): Promise<EmailEvent> {
    try {
      const emailEvent = await this.emailEventRepository.findOne({ where: { id } });
      if (!emailEvent) {
        throw new NotFoundException(`Email event with ID ${id} not found.`);
      }
      return emailEvent;
    } catch (error) {
      throw error
    }
  }

  async updateEmailEvent(id: number, updateEmailEventDto: UpdateEmailEventDto,userId:number): Promise<EmailEvent> {
    try {
      const emailEvent = await this.getEmailEvent(id);
  
      if (updateEmailEventDto.name !== undefined && !updateEmailEventDto.name.trim()) {
        throw new BadRequestException('Name cannot be empty.');
      }
      if (updateEmailEventDto.description !== undefined && !updateEmailEventDto.description.trim()) {
        throw new BadRequestException('Description cannot be empty.');
      }
      if(updateEmailEventDto?.name){
        const emailEventWithSimilarName = await this.emailEventsRepository.findOne({
          where:{
            name: updateEmailEventDto?.name
          }
        })
        if(emailEventWithSimilarName){
          throw new BadRequestException('Email event with this name already exists.');
        }
      }
      await this.emailEventRepository.update(emailEvent.id, updateEmailEventDto);
      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: updateEmailEventDto,
        oldData: emailEvent,
        entityId: emailEvent?.id,
        entityType: entityType.EMAIL_EVENT,
        performerId: userId,
        performerType: performerType.OPERATOR,
        field: 'Email Event Updated',
      });
      return await this.getEmailEvent(id);
    } catch (error) {
      throw error;
    }
  }

  async deleteEmailEvent(id: number,userId:number): Promise<void> {
    try {
      const emailEvent = await this.getEmailEvent(id);
      await this.emailMappingRepository.softDelete({ emailEvent: { id } });
      await this.emailEventRepository.softDelete(emailEvent?.id);

      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: null,
        oldData: emailEvent,
        entityId: emailEvent?.id,
        entityType: entityType.EMAIL_EVENT,
        performerId: userId,
        performerType: performerType.OPERATOR,
        field: 'Email Event Deleted',
      });
    } catch (error) {
      throw error
    }
  }

  async getAllEmailEventsAdvance(
    userId: number,
    limit: number,
    page: number,
    dto: ApplyListFilterSortColumnDto,
  ): Promise<any> {
    try {
      const filters: FilterItem[] = [];
  
      const { result, ...rest } = await this.emailEventsRepository.advanceFilters({
        filters,
        limit,
        page,
        userId,
        listName: ListNames.EMAIL_EVENTS,
        filterList: dto.filters || undefined,
        sortList: dto.sort || undefined,
        relations: ['createdBy'],
        defaultSortKey: 'createdAt',
        listViewId: dto.listViewId,
      });
      const emailEvents = result;
      return {
        message: 'Email events fetched successfully',
        result: emailEvents,
        ...rest,
      };
    } catch (error) {
      throw error
    }
  }

  async getEmailMappings(emailEventId: number): Promise<EmailMapping[]> {
    try {
      await this.getEmailEvent(emailEventId)
      await this.syncEmailMapping(emailEventId)
      const mappings = await this.emailMappingRepository.find({
        where: { emailEvent: { id: emailEventId } },
        relations: ['regulation','headerFooter','bodyContent'],
      });
      return mappings;
    } catch (error) {
      throw error
    }
  }


  async updateMapping(emailMappingId: number, headerFooterId?:number, bodyContentId?:number): Promise<any> {
   try {
     const emailMapping = await this.emailMappingRepository.findOne({
       where: { id: emailMappingId },
     });
   
     if (!emailMapping) {
       throw new NotFoundException(`Email mapping with ID ${emailMappingId} not found`);
     }
     const updateData: any = {};
     if (headerFooterId) updateData.headerFooter = { id: headerFooterId };
     if (bodyContentId) updateData.bodyContent = { id: bodyContentId };
 
     if (Object.keys(updateData).length === 0) {
       throw new BadRequestException('No valid data provided for update');
     }
     await this.emailMappingRepository.update(emailMappingId, updateData);
     return {
       message: "Data updated succesfully"
     }
   } catch (error) {
    throw error
   }
  }
  

 
}