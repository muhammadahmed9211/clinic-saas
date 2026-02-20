import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LabelTranslation } from 'src/tasks/entities/label_translation.entity';
import { User } from 'src/users/entities/user.entity';
import { Label } from 'src/tasks/entities/label.entity';
import { Regulations } from '../regulations/entities/regulations.entity';
import { CreateLabelDto, UpdateLabelDto } from './dto/label.dto';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { FilterItem, FilterOperation } from 'src/database/base-repository/dto/advance-search.dto';
import { labelRepository } from './label.repository';
import { ListNames } from 'src/list-item/dto/create-list-item.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventTypes } from 'src/common/services/event.type';
import { entityType, performerType } from '../active-log/active-log.type';

@Injectable()
export class LabelService {
  constructor(
    @InjectRepository(Label)
    private readonly labelRepository: Repository<Label>,
    @InjectRepository(LabelTranslation)
    private readonly labelTranslationRepository: Repository<LabelTranslation>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(Regulations)
    private readonly regulationRepository: Repository<Regulations>,
    private labelsRepository: labelRepository,
  ) {}

  async syncLabelTranslations(labelId: number) {
   try {
     const regulations = await this.regulationRepository.find();
     const regulationIds = regulations.map((reg) => reg.id);
     const existingTranslations = await this.labelTranslationRepository.find({
       where: { label: { id: labelId } },
       relations: ['regulation'],
     });
   
     const existingRegulationIds = existingTranslations.map((t) => t?.regulation?.id);
     const missingRegulations = regulations.filter(
       (reg) => !existingRegulationIds.includes(reg.id),
     );
 
     const newTranslations = missingRegulations.flatMap((reg) => [
       this.labelTranslationRepository.create({
         label: { id: labelId },
         regulation: reg,
         langCode: 'en',
         text: '',
       }),
       this.labelTranslationRepository.create({
         label: { id: labelId },
         regulation: reg,
         langCode: 'ar',
         text: '',
       }),
     ]);
     if (newTranslations.length > 0) {
     await this.labelTranslationRepository.save(newTranslations);
    }
   
     const translationsToDeleteIds = existingTranslations
     .filter((t) => !t?.regulation?.id || !regulationIds.includes(t?.regulation?.id))
     .map((t) => t?.id);
   
     if (translationsToDeleteIds.length > 0) {
       await this.labelTranslationRepository.softDelete(translationsToDeleteIds);
     }
   
     return { newTranslations, deletedTranslations: translationsToDeleteIds };
   } catch (error) {
      throw error
   }
  }

  async createLabel(createLabelDto: CreateLabelDto,userId:number): Promise<Label> {
   try {
     const {key} = createLabelDto;
     if (!key) {
       throw new NotFoundException('Key is not found in the payload');
     }
     const newName = key ? key.toLocaleLowerCase().replace(/ /g, '_') : undefined;
     const existingLabel = await this.labelRepository.findOne({
       where: {
         key: newName,
       },
     });
     if (existingLabel) {
       throw new NotFoundException('Label already exists');
     }
     const updatedDto = {
       ...createLabelDto,
       user: {id:userId},
       key: newName
     }
     const label = this.labelRepository.create(updatedDto);
     const savedLabel = await this.labelRepository.save(label);
     await this.syncLabelTranslations(savedLabel?.id)
     this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: savedLabel,
      oldData: null,
      entityId: savedLabel?.id,
      entityType: entityType.LABEL,
      performerId: userId,
      performerType: performerType.OPERATOR,
      field: 'Label Created',
    });
     return savedLabel
   } catch (error) {
      throw error
   }
  }

  async getLabel(id: number): Promise<Label> {
    try {
      const label = await this.labelRepository.findOne({ where: { id } });
      if (!label) {
        throw new NotFoundException(`Label with ID ${id} not found.`);
      }
      return label;
    } catch (error) {
      throw error
    }
  }

  async updateLabel(id: number, updateLabelDto: UpdateLabelDto,user: User): Promise<Label> {
    try {
      const label = await this.getLabel(id);
      const newName = updateLabelDto.key ? updateLabelDto.key.toLocaleLowerCase().replace(/ /g, '_') : undefined;
      const updatedDto = {
        ...updateLabelDto,
        key: newName
      }
     const updatedLabel = await this.labelRepository.update(label?.id,updatedDto);
      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: updatedDto,
        oldData: label,
        entityId: label?.id,
        entityType: entityType.LABEL,
        performerId: user.id,
        performerType: performerType.OPERATOR,
        field: 'Label Updated',
      });
      return label
    } catch (error) {
      throw error
    }
  }

  async deleteLabel(id: number, user: User): Promise<void> {
    try {
      const label = await this.getLabel(id);
      await this.labelTranslationRepository.softDelete({ label: { id } })
      const deletedLabel = await this.labelRepository.softDelete(label?.id);
      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: deletedLabel,
        oldData: label,
        entityId: label?.id,
        entityType: entityType.LABEL,
        performerId: user.id,
        performerType: performerType.OPERATOR,
        field: 'Label Deleted',
      });
    } catch (error) {
      throw error
    }
  }

  async getAllLabelsAdvance(
    userId: number,
    limit: number,
    page: number,
    dto: ApplyListFilterSortColumnDto,
  ): Promise<any> {
    try {
      const filters: FilterItem[] = [];
  
      const { result, ...rest } = await this.labelsRepository.advanceFilters({
        filters,
        limit,
        page,
        userId,
        listName: ListNames.LABELS,
        filterList: dto.filters || undefined,
        sortList: dto.sort || undefined,
        relations: ['user'],
        defaultSortKey: 'createdAt',
        listViewId: dto.listViewId,
      });
      const labels = result;
      return {
        message: 'Labels fetched successfully',
        result: labels,
        ...rest,
      };
    } catch (error) {
      throw error
    }
  }

  async getLabelTranslations(labelId: number): Promise<LabelTranslation[]> {
    try {
      await this.getLabel(labelId)
      await this.syncLabelTranslations(labelId)
      const translations = await this.labelTranslationRepository.find({
        where: { label: { id: labelId } },
        relations: ['regulation'],
      });
      return translations;
    } catch (error) {
      throw error
    }
  }


  async updateText(labelTranslationId: number, newText: string): Promise<any> {
   try {
     const labelTranslation = await this.labelTranslationRepository.findOne({
       where: { id: labelTranslationId },
     });
   
     if (!labelTranslation) {
       throw new NotFoundException(`Label translation with ID ${labelTranslationId} not found`);
     }
     await this.labelTranslationRepository.update(labelTranslationId,{text:newText});
     return {
       message: "Data updated succesfully"
     }
   } catch (error) {
    throw error
   }
  }

  async getAllLabels(): Promise<any> {
    try {
      const labels = await this.labelRepository.find({
        select: ['id', 'key'],
      });
      return labels;
    } catch (error) {
      throw error;
    }
  }
  

 
}
