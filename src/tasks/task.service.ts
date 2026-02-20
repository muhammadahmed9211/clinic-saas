import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserTask } from './entities/user_task.entity';
import { JwtPayloadType } from 'src/auth/strategies/types/jwt-payload.type';
import { NullableType } from 'src/utils/types/nullable.type';
import {
  CreateUserTaskDto,
  UpdateTaskLabelDto,
} from './dto/user_task_create.dto';
import { MasterTask } from './entities/master_task.entity';
import { LabelTranslation } from './entities/label_translation.entity';
import { AuthService } from 'src/auth/auth.service';
import { I18nContext } from 'nestjs-i18n';
import { UserTaskCompleteDto } from './dto/user_task_complete.dto';
import { TaskLabel } from './enum/task.enum';
import { Label } from './entities/label.entity';
import { User } from 'src/users/entities/user.entity';
import { RegulationsConfigService } from 'src/admin/regulations/regulations-config/regulations-config.service';
import { CreateMasterTaskDto } from './dto/master_task_create.dto';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { MasterTaskRepository } from './repositories/master_task.repository';
import { ListNames } from 'src/list-item/dto/create-list-item.dto';
import { UpdateMasterTaskDto } from './dto/master_task_update.dto';
import { RegulationRuleKeys } from 'src/admin/regulations/regulations-config/entities/regulation-rule.entity';
import { RegulationEventKeys } from 'src/admin/regulations/regulations-config/entities/regulation-event.entity';
import { EventTypes } from 'src/common/services/event.type';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { entityType, performerType } from 'src/admin/active-log/active-log.type';

Injectable();
export class MasterTaskService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @InjectRepository(MasterTask)
    private readonly taskRepository: Repository<MasterTask>,
    @InjectRepository(UserTask)
    private readonly userTaskRepository: Repository<UserTask>,
    @InjectRepository(LabelTranslation)
    private readonly labelTranslationRepository: Repository<LabelTranslation>,
    @InjectRepository(Label)
    private readonly labelRepository: Repository<Label>,
    private readonly regulationsConfigService: RegulationsConfigService,
    private readonly eventEmitter: EventEmitter2,
    private readonly masterTaskListRepository: MasterTaskRepository,
  ) {}

  async createMasterTask(data: CreateMasterTaskDto, user: User) {
    const task = await this.taskRepository.save(
      this.taskRepository.create({ ...data }),
    );

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: task,
      oldData: null,
      entityId: task?.id,
      entityType: entityType.CLIENT_TASK,
      performerId: user.id,
      performerType: performerType.OPERATOR,
      field: 'Client Task Created',
    });
  
    return task;
    
  }

 

  async findOne(id: number): Promise<MasterTask | null> {
    const data = await this.taskRepository.findOne({
      where: { id },
      relations: ['label', 'label.labelTranslation', 'regulation', 'createdBy'],
    });

    if (!data) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: {
            msg: 'Task not found',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return data;
  }

  async getMasterTaskList(payload: {
    userId: number;
    limit: number;
    page: number;
    dto: ApplyListFilterSortColumnDto;
  }) {
    const { userId, limit, page, dto } = payload;
    return this.masterTaskListRepository.advanceFilters({
      listName: ListNames.MASTER_TASK,
      userId,
      limit,
      page,
      relations: ['label', 'label.labelTranslation', 'regulation'],
      filterList: dto?.filters || undefined,
      sortList: dto.sort || undefined,
      defaultSortKey: 'createdAt',
      listViewId: dto.listViewId,
      overrideFilters: true,
      orList: dto.or,
    });
  }

  async updateMasterTask(id: number, dto: UpdateMasterTaskDto, user: User) {
    const data = await this.taskRepository.findOne({ where: { id } });
    const { label = null, ...task } = dto;

    if (!data) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: {
            msg: 'Task not found',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (label) {
      const taskName = await this.taskRepository.findOne({
        where: { label: { id: label } },
      });
      if (taskName) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: {
              msg: 'label already exists in task',
            },
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    const updateData: Partial<MasterTask> = {
      ...data,
      ...task,
    }

    if (label) {
      updateData.label = this.labelRepository.create({ id: label })
    }
    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: updateData,
      oldData: data,
      entityId: updateData?.id,
      entityType: entityType.CLIENT_TASK,
      performerId: user.id,
      performerType: performerType.OPERATOR,
      field: 'Client Task Updated',
    });

    return await this.taskRepository.save(updateData);
  }

  async findByName(name: string): Promise<MasterTask | null> {
    return await this.taskRepository.findOne({ where: { name } });
  }

  async findById(id: number): Promise<MasterTask | null> {
    return await this.taskRepository.findOneBy({ id });
  }

  async findAll(): Promise<any> {
    return await this.taskRepository.find({});
  }

  async updateTaskLabel(id: number, dto: UpdateTaskLabelDto): Promise<void> {
    const task = await this.taskRepository.findOne({
      where: { id },
    });
    if (!task) {
      throw new Error(`Task with ID ${id} not found.`);
    }
    const updatedDto: any = {};
    if (dto.labelId) {
      updatedDto.label = { id: dto.labelId };
    }
    await this.taskRepository.update(id, updatedDto);
  }

  async createUserTask(data: CreateUserTaskDto) {
    return await this.userTaskRepository.save(data);
  }

  async findUserTask(
    userJwtPayload: JwtPayloadType,
  ): Promise<NullableType<UserTask | any>> {
    const i18n = I18nContext.current();
    const user = await this.authService.findClient(userJwtPayload.id);

    const data = await this.userTaskRepository
      .createQueryBuilder('userTask')
      .leftJoinAndSelect('userTask.task', 'task')
      .leftJoinAndSelect('task.label', 'label')
      .leftJoinAndSelect(
        'label.labelTranslation',
        'labelTranslation',
        'labelTranslation.langCode = :langCode AND labelTranslation.regulation.id = :regulationId',
        {
          langCode: i18n?.lang.toLocaleLowerCase(),
          regulationId: user?.regulation.id || 1,
        },
      )
      .where('userTask.user.id = :userId', { userId: userJwtPayload.id })
      .andWhere('userTask.isCompleted = :isCompleted', { isCompleted: false })
      .andWhere('task.isDeleted = :isDeleted', { isDeleted: false })
      .getOne();

    if (!data) return { message: 'All tasks completed', status: 200 };

    return {
      ...data.task.label.labelTranslation[0],
      name: data.task.name,
      description: data.task.description,
      url: data.task.masterUrl,
      isForced: data.task.isForcedComplete,
    };
  }

  async createTaskCompleted(
    userJwtPayload: JwtPayloadType,
    data?: UserTaskCompleteDto,
  ): Promise<NullableType<UserTask | any>> {
    const userTask = await this.userTaskRepository.findOne({
      where: {
        user: { id: userJwtPayload.id },
        isCompleted: false,
      },
      relations: ['task'],
      select: {
        task: {
          id: true,
          name: true,
        },
      },
    });

    if (!userTask) {
      return { message: 'All tasks completed', status: 200 };
    }
    await this.userTaskRepository.update(userTask.id, { isCompleted: true });

    const user = await this.authService.findClient(userJwtPayload.id);

    const checkFor: RegulationRuleKeys[] = [
      RegulationRuleKeys.proof_of_payment,
    ];

    if (!user) {
      throw new BadRequestException('User not found');
    }
    const regulationConfig =
      await this.regulationsConfigService.isAllowedInRegulation(
        user.regulation.id,
        RegulationEventKeys.withdrawal_creation,
        checkFor,
      );

    const task = await this.taskRepository.findOne({
      where: { id: userTask.task.id, isDeleted: false },
      relations: ['label'],
      select: {
        label: { id: true, key: true },
      },
    });

    if (!task?.successor) {
      return { message: 'All tasks completed' };
    }

    const successorTask = await this.taskRepository.findOne({
      where: { id: task.successor, isDeleted: false },
      relations: ['label'],
      select: {
        label: { id: true, key: true },
      },
    });

    if (
      successorTask?.label?.key === RegulationRuleKeys.proof_of_payment &&
      regulationConfig[0] == false
    ) {
      return { message: 'All tasks completed' };
    }

    const checkUserTask = await this.userTaskRepository.findOne({
      where: {
        user: { id: userJwtPayload.id },
        task: { id: 6 },
        isCompleted: true,
      },
    });

    if (checkUserTask) {
      return { message: 'All tasks completed' };
    }

    if (data?.documentId === 2) {
      return await this.userTaskRepository.save([
        {
          user: { id: userJwtPayload.id },
          task: { id: 5 },
          isCompleted: false,
          isForced: task?.isForcedComplete,
          dateTime: new Date(),
          url: task?.masterUrl,
          label: { id: task.successor },
        },
        {
          user: { id: userJwtPayload.id },
          task: { id: 6 },
          isCompleted: true,
          isForced: task?.isForcedComplete,
          dateTime: new Date(),
          url: task?.masterUrl,
          label: { id: task.successor },
        },
      ]);
    }
    return await this.userTaskRepository.save({
      user: { id: userJwtPayload.id },
      task: { id: task?.successor },
      isCompleted: false,
      isForced: task?.isForcedComplete,
      dateTime: new Date(),
      url: task?.masterUrl,
      label: { id: task.successor },
    });
  }

  async findAndCreateTask(user: User) {
    const findUserTask = await this.userTaskRepository.findOne({
      where: {
        user: { id: user.id },
      },
    });

    if (findUserTask) {
      return findUserTask;
    }

    const taskLabel = await this.labelRepository.findOne({
      where: {
        key: TaskLabel.clientregistration_contact_details,
      },
    });

    const findTask = await this.findByName(
      TaskLabel.clientregistration_contact_details,
    );

    return await this.createUserTask({
      user: { id: user.id },
      label: { id: taskLabel?.id || 1 },
      task: { id: findTask?.id || 1 },
      isForced: findTask?.isForcedComplete || true,
      dateTime: new Date(),
      url: findTask?.masterUrl || '',
      isCompleted: false,
    });
  }

  async deleteMasterTask(id: number, user: User) {
    const data = await this.taskRepository.findOne({ where: { id } });

    if (!data) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: {
            msg: 'Task not found',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const deletedTask = await this.taskRepository.softDelete({ id });

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: deletedTask,
      oldData: data,
      entityId: data?.id,
      entityType: entityType.CLIENT_TASK,
      performerId: user.id,
      performerType: performerType.OPERATOR,
      field: 'Client Task Deleted',
    });
    return deletedTask;
  }

}
