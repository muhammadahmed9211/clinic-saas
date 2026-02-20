import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AdminTask,
  RepeatIntervalType,
  RepeatType,
  TaskEntityType,
} from './entities/task.entity';
import { LessThan, MoreThan, Not, Repository } from 'typeorm';
import { ResponseWrapper } from 'src/utils/interface/mt5/base-response.interface';
import { Status } from 'src/utils/enums/mt5/response-status.enum';
import { GetTaskQuery } from './dto/task.dto';
import { TaskStatus } from './entities/task-status.entity';
import { NullableType } from 'src/utils/types/nullable.type';
import {
  FilterItem,
  FilterOperation,
} from 'src/database/base-repository/dto/advance-search.dto';
import { AdminTaskRepository } from './repositories/admin-task.respository';
import { PaginationDto } from 'src/database/base-repository/dto/pagination.dto';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { ListNames } from 'src/list-item/dto/create-list-item.dto';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { RoleEnum } from 'src/roles/roles.enum';
import { Exception } from 'handlebars';
import { ClientRepository } from 'src/users/repositories/client.repository';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import {
  NotificationMessages,
  NotificationTitles,
} from 'src/notification/constants/notification.messages';
import { Label } from 'src/tasks/entities/label.entity';
import { notifications } from 'src/notification/entity/notification.entity';
// import { SocketGateway } from 'src/socket/socket.gateway';
import { EventTypes } from 'src/common/services/event.type';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  addDays,
  addWeeks,
  addMonths,
  isEqual,
  parse,
  isBefore,
  isDate,
} from 'date-fns';
import { REMINDER_TIMES } from 'src/constants/reminder-times';
import { Lead } from '../leads/entities/lead.entity';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: AdminTaskRepository,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(TaskStatus)
    private readonly taskStatusRepository: Repository<TaskStatus>,
    @InjectRepository(Label)
    private readonly labelRepository: Repository<Label>,
    private readonly clientRepository: ClientRepository,
    @InjectRepository(notifications)
    private notificationRepository: Repository<notifications>,
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
    // private socketGateway: SocketGateway,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async create(createTaskDto: CreateTaskDto, user: User) {
    try {
      const assignee = await this.userRepository.findOne({
        where: {
          operator: { id: createTaskDto.assignTo },
        },
      });
      let contact: NullableType<Lead> = null;
      if (createTaskDto.contact) {
        contact = await this.leadRepository.findOne({
          where: {
            id: createTaskDto.contact,
          },
        });
      }
      if (createTaskDto.remindBefore && createTaskDto.remindBefore != 0) {
        createTaskDto.reminder = new Date(
          new Date(createTaskDto.dueDate).getTime() -
          createTaskDto.remindBefore,
        );
      }
      if (!assignee) throw new NotFoundException('Assignee not found');
      if (createTaskDto.dueDate < new Date())
        throw new Exception('Due date cannot be in the past');
      const isCompleted =
        createTaskDto.status.toLowerCase() === 'completed' ? true : false;
      const task = this.taskRepository.create({
        ...createTaskDto,
        entityId: createTaskDto.entityId.toString(),
        createdBy: user,
        previousStatus: createTaskDto.status,
        isCompleted,
        assignTo: assignee,
        contact,
      });

      const createdTask = await this.taskRepository.save(task);

      if (
        createdTask &&
        task.entity === TaskEntityType.CLIENT &&
        task.entityId
      ) {
        const taskToUpdate = !Array.isArray(createdTask)
          ? createdTask
          : createdTask[0];
        await this.updateClientLastUpdatedTask(+task.entityId, taskToUpdate);
      }

      const link = `${process.env.CRM_FRONT_END_URL}/tasks/${task.id}`;

      const label = await this.labelRepository.findOne({
        where: {
          description: NotificationMessages.task_creation_operator,
        },
      });

      const labelTitle = await this.labelRepository.findOne({
        where: {
          description: NotificationTitles.task_creation_operator_title,
        },
      });

      const userDetail = await this.userRepository.findOne({
        where: { id: user.id },
      });

      //send notification
      const notificationData = {
        entity_id: createdTask.id.toString(),
        entity_name: 'task',
        description_label_id: { id: label?.id },
        title_label_id: { id: labelTitle?.id },
        created_by: userDetail?.operator?.full_name || '',
        is_read: false,
        is_deleted: false,
        user_id: { id: assignee?.id },
        creator_id: { id: userDetail?.operator?.id },
        admin_description: `New Task is assigned\n
        Subject: ${task.subject}\n
        Name: ${task.contact?.firstName} ${task.contact?.lastName}`,
        link,
      };

      const notification = this.notificationRepository.create(notificationData);
      await this.notificationRepository.save(notification);
      // this.socketGateway.sendNotificationToUser(assignee?.id, {
      //   ...notification,
      //   title: labelTitle?.description,
      //   description: label?.description,
      // });

      const data = await this.taskRepository.save(task);

      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: data,
        oldData: null,
        entityId: task.id,
        entityType: 'Task',
        parentId: task.entityId,
        parentType:
          task.entity == 'partner'
            ? 'Affiliate'
            : task.entity == 'client'
              ? 'User'
              : task.entity == 'general'
                ? 'Task'
                : task.entity,
        performerId: user.id,
        performerType: 'Operator',
        field: 'Task Created',
      });

      // this.eventEmitter.emit(EventTypes.ACTIVE_LOG, {
      //   action: 'RecordCreated',
      //   entity_id: user.id,
      //   entity_type: 'Task',
      //   json_object: data,
      //   performer_id: user.id,
      //   performer_type: 'Operator',
      //   is_from_archive: 0,
      //   trigger_type: 'Default',
      // });

      return ResponseWrapper.wrap({
        status: Status.SUCCESS,
        statusCode: HttpStatus.CREATED,
        statusText: 'Task Created Successfully',
        data,
      });
    } catch (error) {
      console.error('Error creating task:', error);
      throw new InternalServerErrorException(
        error.message || 'Error creating task',
      );
    }
  }

  async findAll() {
    try {
      return ResponseWrapper.wrap({
        status: Status.SUCCESS,
        statusCode: HttpStatus.OK,
        statusText: 'Tasks Fetched Successfully',
        data: await this.taskRepository.find({
          relations: ['assignee', 'createdBy'],
        }),
      });
    } catch (error) {
      console.error('Error finding tasks:', error);
      if (
        error instanceof InternalServerErrorException ||
        error instanceof Error
      )
        throw new InternalServerErrorException('Error finding task');

      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const task = await this.taskRepository.find({
        where: { id },
        relations: ['assignTo', 'createdBy', 'contact'],
      });
      if (!task) throw new NotFoundException('Task not found');
      return ResponseWrapper.wrap({
        status: Status.SUCCESS,
        statusCode: HttpStatus.OK,
        statusText: 'Task Fetched Successfully',
        data: task,
      });
    } catch (error) {
      console.error('Error finding task:', error);
      if (
        error instanceof InternalServerErrorException ||
        error instanceof Error
      )
        throw new InternalServerErrorException('Error finding task');

      throw error;
    }
  }

  async findByUser(
    user: User,
    body: ApplyListFilterSortColumnDto,
    query: PaginationDto & { open?: string },
    completed: boolean = false,
  ) {
    try {
      const { limit = 10, page = 1, open } = query;

      let filters: FilterItem[] = [];
      // if (user.role?.id !== RoleEnum.super_admin) {
      //   filters = [
      //     {
      //       name: 'createdBy.id',
      //       operation: FilterOperation.EQUALS,
      //       value: [user.id],
      //     },
      //   ];
      // }
      if (completed) {
        filters.push({
          name: 'isCompleted',
          operation: FilterOperation.EQUALS,
          value: [true],
        });
      }

      if (open && open === 'true') {
        filters.push({
          name: 'isCompleted',
          operation: FilterOperation.EQUALS,
          value: [false],
        });
      }

      const relations: string[] = ['assignTo', 'createdBy', 'contact', 'lead'];

      return this.taskRepository.advanceFilters({
        userId: user.id,
        filters,
        relations,
        limit,
        page,
        filterList: body.filters || undefined,
        sortList: body.sort || undefined,
        listName: ListNames.TASKS,
        defaultSortKey: 'createdAt',
        listViewId: body.listViewId,
      });
    } catch (error) {
      console.error('Error finding task:', error);
      if (
        error instanceof InternalServerErrorException ||
        error instanceof Error
      )
        throw new InternalServerErrorException('Error finding task');

      throw error;
    }
  }

  async findByRelation(id: number, query: GetTaskQuery) {
    try {
      const { page = 1 } = query;
      const limit = query?.limit ?? 10;
      // if (limit > 50) limit = 50;

      let tasks: NullableType<AdminTask[]>;

      tasks = await this.taskRepository.find({
        where: [{ assignTo: { id } }, { createdBy: { id } }],
        relations: ['assignTo', 'createdBy', 'contact'],
        order: { createdAt: 'desc' },
      });

      if (query?.status) {
        tasks = tasks.filter((task) => {
          task.status === query.status;
        });
      }
      if (query?.isCompleted === 'true') {
        tasks = tasks.filter((task) => task.isCompleted);
      }

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedTasks = tasks.slice(startIndex, endIndex);

      const { data, hasNextPage } = infinityPagination(paginatedTasks, {
        page,
        limit,
      });

      return ResponseWrapper.wrap({
        status: Status.SUCCESS,
        statusCode: HttpStatus.OK,
        statusText: 'Tasks Fetched Successfully',
        data: { data, hasNextPage, total: tasks.length },
      });
    } catch (error) {
      console.error('Error finding tasks:', error);
      if (
        error instanceof InternalServerErrorException ||
        error instanceof Error
      )
        throw new InternalServerErrorException('Error finding task');

      throw error;
    }
  }

  async findByEntity(
    id: number | string,
    query: GetTaskQuery,
    entity: TaskEntityType,
  ) {
    try {
      const { page = 1 } = query;
      const limit = query?.limit ?? 10;
      // if (limit > 50) limit = 50;

      let tasks: NullableType<AdminTask[]>;

      if (entity === TaskEntityType.TRANSACTION) {
        tasks = await this.taskRepository.find({
          where: { entity, entityId: id.toString() },
          relations: ['assignTo', 'createdBy', 'contact'],
          order: { createdAt: 'desc' },
        });
      } else {
        tasks = await this.taskRepository.find({
          where: { entity, entityId: id.toString() },
          relations: ['assignTo', 'createdBy', 'contact'],
          order: { createdAt: 'desc' },
        });
      }

      if (query?.status) {
        tasks = tasks.filter((task) => {
          task.status === query.status;
        });
      }
      if (query?.isCompleted === 'true') {
        tasks = tasks.filter((task) => task.isCompleted);
      }

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedTasks = tasks.slice(startIndex, endIndex);

      const { data, hasNextPage } = infinityPagination(paginatedTasks, {
        page,
        limit,
      });

      return ResponseWrapper.wrap({
        status: Status.SUCCESS,
        statusCode: HttpStatus.OK,
        statusText: 'Tasks Fetched Successfully',
        data: { data, hasNextPage, total: tasks.length },
      });
    } catch (error) {
      console.error('Error finding tasks:', error);
      if (
        error instanceof InternalServerErrorException ||
        error instanceof Error
      )
        throw new InternalServerErrorException('Error finding task');

      throw error;
    }
  }

  async advanceFilters({
    paginationOptions,
    userId,
    body,
    entity,
    entityId,
  }: {
    paginationOptions: IPaginationOptions;
    userId: number;
    body?: ApplyListFilterSortColumnDto;
    entity: TaskEntityType;
    entityId: string;
  }) {
    try {
      const filters = [
        {
          name: 'entity',
          operation: FilterOperation.EQUALS,
          value: [entity],
        },
        {
          name: 'entityId',
          operation: FilterOperation.EQUALS,
          value: [entityId],
        },
      ];

      const filterParams = {
        ...paginationOptions,
        relations: ['assignTo', 'createdBy', 'contact'],
        listName: ListNames.TASKS,
        userId: userId,
        filters,
        filterList: body?.filters || undefined,
        sortList: body?.sort || undefined,
        defaultSortKey: 'createdAt',
        listViewId: body?.listViewId,
      };

      return this.taskRepository.advanceFilters(filterParams);
    } catch (error) {
      console.error('Error finding tasks:', error);
      throw new InternalServerErrorException(
        error.message || 'Error finding task',
      );
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, userId: number) {
    try {
      const task = await this.taskRepository.findOne({
        where: { id },
        relations: ['assignTo'],
      });
      if (!task) throw new Error('Task not found');
      if (
        updateTaskDto.status &&
        updateTaskDto.status.toLowerCase() === 'completed' &&
        task.status.toLowerCase() !== 'completed'
      ) {
        await this.markComplete(id);
      }
      if (
        updateTaskDto.status &&
        updateTaskDto.status.toLowerCase() !== 'completed' &&
        task.status.toLowerCase() === 'completed'
      ) {
        await this.unmarkComplete(id);
      }

      let assignee, contact;
      if (
        updateTaskDto.assignTo !== task.assignTo?.id &&
        updateTaskDto.assignTo !== task.assignTo?.operator?.id
      ) {
        assignee = await this.userRepository.findOne({
          where: {
            operator: { id: updateTaskDto.assignTo },
            isOperator: true,
          },
        });
        if (!assignee) throw new Error('Assignee not found');
      }

      if (updateTaskDto.contact) {
        contact = await this.leadRepository.findOne({
          where: {
            id: updateTaskDto.contact,
          },
        });
        if (!contact) throw new Error('Contact not found');
      }
      if (updateTaskDto?.remindBefore && updateTaskDto?.dueDate) {
        updateTaskDto.reminder = new Date(
          new Date(updateTaskDto.dueDate).getTime() -
          updateTaskDto?.remindBefore,
        );
      } else if (updateTaskDto?.remindBefore) {
        updateTaskDto.reminder = new Date(
          new Date(task.dueDate).getTime() - updateTaskDto?.remindBefore,
        );
      }

      const updatedTask = await this.taskRepository.save({
        ...task,
        ...updateTaskDto,
        entityId:
          updateTaskDto.entityId?.toString() ?? task.entityId.toString(),
        assignTo: assignee ?? task.assignTo,
        contact: contact ?? task.contact,
      });

      if (
        updatedTask &&
        task.entity === TaskEntityType.CLIENT &&
        task.entityId
      ) {
        const taskToUpdate = !Array.isArray(updatedTask)
          ? updatedTask
          : updatedTask[0];
        await this.updateClientLastUpdatedTask(+task.entityId, taskToUpdate);
      }

      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: updatedTask,
        oldData: task,
        entityId: task.id,
        entityType: 'Task',
        parentId: task.entityId,
        parentType:
          task.entity == 'partner'
            ? 'Affiliate'
            : task.entity == 'client'
              ? 'User'
              : task.entity == 'general'
                ? 'Task'
                : task.entity,
        performerId: userId,
        performerType: 'Operator',
        field: 'Task Updated',
      });

      return ResponseWrapper.wrap({
        status: Status.SUCCESS,
        statusCode: HttpStatus.OK,
        statusText: 'Tasks Updated Successfully',
        data: updatedTask,
      });
    } catch (error) {
      console.error('Error updating task:', error);
      throw new InternalServerErrorException(
        error.message ?? 'Error updating task',
      );
    }
  }

  async remove(id: number, user: User) {
    try {
      const task = await this.taskRepository.findOne({ where: { id } });
      if (!task) throw new NotFoundException('Task not found');
      await this.taskRepository.softDelete(id);

      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: null,
        oldData: task,
        entityId: task.id,
        entityType: 'Task',
        parentId: task.entityId,
        parentType:
          task.entity == 'partner'
            ? 'Affiliate'
            : task.entity == 'client'
              ? 'User'
              : task.entity == 'general'
                ? 'Task'
                : task.entity,
        performerId: user.id,
        performerType: 'Operator',
        field: 'Task Delete',
      });

      return ResponseWrapper.wrap({
        status: Status.SUCCESS,
        statusCode: HttpStatus.OK,
        statusText: 'Task Deleted Successfully',
        data: null,
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      throw new InternalServerErrorException('Error delete task');
    }
  }

  async markComplete(id: number) {
    try {
      const task = await this.taskRepository.findOne({
        where: { id },
        relations: ['createdBy', 'assignTo', 'contact'],
      });
      if (!task) throw new NotFoundException('Task not found');
      if (task.repeat !== RepeatType.NEVER) {
        let nextDate: Date;
        switch (task.repeat) {
          case RepeatType.DAILY:
            nextDate = addDays(task.dueDate, 1);
            break;
          case RepeatType.WEEKLY:
            nextDate = addWeeks(task.dueDate, 1);
            break;
          case RepeatType.MONTHLY:
            nextDate = addMonths(task.dueDate, 1);
            break;
          default:
            return;
        }
        switch (task.repeatIntervalType) {
          case RepeatIntervalType.ON:
            if (task?.on) {
              let onDate: Date;
              if (isDate(task.on)) {
                onDate = task.on;
              } else if (typeof task.on === 'string') {
                onDate = parse(task.on, 'yyyy-MM-dd', new Date());
              } else {
                console.error('Invalid date format for task.on');
                return;
              }

              if (isBefore(nextDate, onDate) || isEqual(nextDate, onDate)) {
                const updatedTask = this.taskRepository.create({
                  description: task.description,
                  subject: task.subject,
                  entity: task.entity,
                  relatedTo: task.relatedTo,
                  relatedToId: task.relatedToId,
                  contact: task.contact,
                  priority: task.priority,
                  entityId: task.entityId,
                  leadId: task.leadId,
                  status: task.status,
                  isCompleted: task.isCompleted,
                  previousStatus: task.previousStatus,
                  repeat: task.repeat,
                  repeatIntervalType: task.repeatIntervalType,
                  on: task.on,
                  dueDate: nextDate,
                  createdBy: task.createdBy,
                  assignTo: task.assignTo,
                });
                await this.taskRepository.save(updatedTask);
              }
            }
            break;
          case RepeatIntervalType.AFTER:
            if (task?.after && task.after > 0) {
              const updatedTask = this.taskRepository.create({
                description: task.description,
                subject: task.subject,
                entity: task.entity,
                relatedTo: task.relatedTo,
                relatedToId: task.relatedToId,
                contact: task.contact,
                priority: task.priority,
                entityId: task.entityId,
                leadId: task.leadId,
                status: task.status,
                isCompleted: task.isCompleted,
                previousStatus: task.previousStatus,
                repeat: task.repeat,
                repeatIntervalType: task.repeatIntervalType,
                after: task.after - 1,
                dueDate: nextDate,
                createdBy: task.createdBy,
                assignTo: task.assignTo,
              });
              await this.taskRepository.save(updatedTask);
            }
            break;
        }
      }
      await this.taskRepository.save(
        this.taskRepository.create({
          ...task,
          previousStatus: task.status,
          status: 'COMPLETED',
          isCompleted: true,
        }),
      );
      return ResponseWrapper.wrap({
        status: Status.SUCCESS,
        statusCode: HttpStatus.OK,
        statusText: 'Task Completed Successfully',
        data: null,
      });
    } catch (error) {
      console.error('Error marking task complete:', error);
      throw new InternalServerErrorException(
        error.message ?? 'Error marking task complete',
      );
    }
  }

  async unmarkComplete(id: number) {
    try {
      const task = await this.taskRepository.findOne({ where: { id } });
      if (!task) throw new NotFoundException('Task not found');
      const updatedTask = this.taskRepository.create({
        ...task,
        previousStatus: task.previousStatus,
        status: task.previousStatus ? 'COMPLETED' : 'NOT STARTED',
        isCompleted: false,
      });
      await this.taskRepository.save(updatedTask);
      return ResponseWrapper.wrap({
        status: Status.SUCCESS,
        statusCode: HttpStatus.OK,
        statusText: 'Task unmarked Successfully',
        data: null,
      });
    } catch (error) {
      console.error('Error marking task complete:', error);
      throw new InternalServerErrorException(
        error.message ?? 'Error marking task complete',
      );
    }
  }

  async findAllStatuses() {
    try {
      return ResponseWrapper.wrap({
        status: Status.SUCCESS,
        statusCode: HttpStatus.OK,
        statusText: 'Statuses Fetched Successfully',
        data: await this.taskStatusRepository.find({ select: ['id', 'name'] }),
      });
    } catch (error) {
      console.error('Error finding statuses:', error);
      throw new InternalServerErrorException('Error finding statuses');
    }
  }

  async taskSumary(user: User) {
    try {
      const open = await this.taskRepository.advanceFilters({
        userId: user.id,
        filters: [
          { name: "isCompleted", operation: FilterOperation.EQUALS, value: [false] }
        ],
        limit: 0,
        page: 0,
        filterList: undefined,
        sortList: undefined,
        listName: ListNames.TASKS,
        defaultSortKey: 'createdAt',
        listViewId: undefined,
        countOnly: true
      });

      const completed = await this.taskRepository.advanceFilters({
        userId: user.id,
        filters: [
          { name: "isCompleted", operation: FilterOperation.EQUALS, value: [true] }
        ],
        limit: 0,
        page: 0,
        filterList: undefined,
        sortList: undefined,
        listName: ListNames.TASKS,
        defaultSortKey: 'createdAt',
        listViewId: undefined,
        countOnly: true
      });

      const assignToMe = await this.taskRepository.advanceFilters({
        userId: user.id,
        filters: [
          { name: "assignTo.id", operation: FilterOperation.EQUALS, value: [user.id] }
        ],
        limit: 0,
        page: 0,
        filterList: undefined,
        sortList: undefined,
        relations: ['assignTo'],
        listName: ListNames.TASKS,
        defaultSortKey: 'createdAt',
        listViewId: undefined,
        countOnly: true
      });

      const overDue = await this.taskRepository.advanceFilters({
        userId: user.id,
        filters: [
          { name: "assignTo.id", operation: FilterOperation.EQUALS, value: [user.id] }, { name: "isCompleted", operation: FilterOperation.EQUALS, value: [false] },
          // @ts-expect-error type error on date filter
          { name: "dueDate", operation: FilterOperation.LESS_THAN, value: [new Date()] }
        ],
        limit: 0,
        page: 0,
        filterList: undefined,
        sortList: undefined,
        relations: ['assignTo'],
        listName: ListNames.TASKS,
        defaultSortKey: 'createdAt',
        listViewId: undefined,
        countOnly: true
      });
      
      return ResponseWrapper.wrap({
        status: Status.SUCCESS,
        statusCode: HttpStatus.OK,
        statusText: 'Task Summary Fetched Successfully',
        data: {
          open:open.total,
          completed:completed.total,
          assignToMe:assignToMe.total,
          overDue:overDue.total,
        },
      });
    } catch (error) {
      console.error('Error fetching task summary:', error);
      if (
        error instanceof InternalServerErrorException ||
        error instanceof Error
      )
        throw new InternalServerErrorException('Error fetching task summary');

      throw error;
    }
  }

  async updateClientLastUpdatedTask(clientId: number, task: AdminTask) {
    const existingTask = await this.clientRepository.findOne({
      where: { recentTask: { id: task.id } },
      relations: ['recentTask'],
    });

    if (existingTask) {
      await this.clientRepository.save(
        this.clientRepository.create({
          ...existingTask,
          recentTask: null,
        }),
      );
    }

    const client = await this.clientRepository.findOne({
      where: { userId: clientId },
    });
    if (client) {
      await this.clientRepository.save({
        ...client,
        recentTask: task,
      });
    }
  }
  async findOverdueTasksForNotification(): Promise<void> {
    return;
    const now = new Date();
    const twoMinutesAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes() - 2,
      0,
      0,
    );
    const overdueTasks = await this.taskRepository.find({
      where: {
        dueDate: new Date(twoMinutesAgo),
        isCompleted: false,
      },
      relations: ['assignTo', 'createdBy', 'contact'],
    });

    for (const task of overdueTasks) {
      await this.createNotification(task, 'overdue');
    }
  }

  async findUpcomingTasksForNotification(): Promise<void> {
    return;
    const now = new Date();
    const twoMinutesFromNow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes() + 2,
      0,
      0,
    );
    const upcomingTasks = await this.taskRepository.find({
      where: {
        dueDate: new Date(twoMinutesFromNow),
        isCompleted: false,
      },
      relations: ['assignTo', 'createdBy', 'contact'],
    });
    for (const task of upcomingTasks) {
      await this.createNotification(task, 'upcoming');
    }
  }

  async findReminderTasksForNotification(): Promise<void> {
    return;
    const now = new Date();
    const dateNow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes(),
      0,
      0,
    );
    const reminderTasks = await this.taskRepository.find({
      where: {
        reminder: new Date(dateNow),
        isCompleted: false,
      },
      relations: ['assignTo', 'createdBy', 'contact'],
    });
    for (const task of reminderTasks) {
      await this.createNotification(task, 'reminder');
    }
  }

  // async findOverDueTasksForNotification(): Promise<void> {
  //   const now = new Date();
  //   const dueTasks = await this.taskRepository.find({
  //     where: {
  //       dueDate: LessThanOrEqual(now),
  //       isCompleted: false,
  //     },
  //     relations: ['assignTo', 'createdBy', 'contact'],
  //   });
  //   const label = await this.labelRepository.findOne({
  //     where: {
  //       description: NotificationMessages.task_overdue_message,
  //     },
  //   });
  //   const labelTitle = await this.labelRepository.findOne({
  //     where: {
  //       description: NotificationTitles.task_overdue_title,
  //     },
  //   });
  //   console.log(`================ Overdue Tasks ================${dueTasks}`);
  //   for (const task of dueTasks) {
  //     await this.createNotificationOverDue(task, label, labelTitle);
  //   }
  // }

  // private async createNotificationOverDue(
  //   task: AdminTask,
  //   label: Label | null,
  //   labelTitle: Label | null,
  // ): Promise<void> {
  //   const link = `${process.env.CRM_FRONT_END_URL}/tasks/${task.id}`;

  //   const notificationData = {
  //     entity_id: task.id.toString(),
  //     entity_name: 'task',
  //     description_label_id: { id: label?.id },
  //     title_label_id: { id: labelTitle?.id },
  //     created_by: task.createdBy?.operator?.full_name || '',
  //     is_read: false,
  //     is_deleted: false,
  //     user_id: { id: task.assignTo?.id },
  //     creator_id: { id: task.createdBy?.operator?.id },
  //     admin_description: `New Task is assigned\n
  //     Subject: ${labelTitle?.description}\n
  //     Name: ${task.contact?.firstName} ${task.contact?.lastName}`,
  //     link,
  //   };

  //   const notification = this.notificationRepository.create(notificationData);
  //   await this.notificationRepository.save(notification);
  //   this.socketGateway.sendNotificationToUser(task.assignTo?.id, {
  //     ...notification,
  //     title: labelTitle?.description,
  //     description: label?.description,
  //   });
  // }

  async findOverDueTasksForNotification(): Promise<void> {
    return;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const BATCH_SIZE = 100;

    // Get overdue tasks
    const dueTasks = await this.taskRepository.find({
      where: {
        dueDate: MoreThan(twentyFourHoursAgo),
        isCompleted: false,
      },
      relations: ['assignTo', 'createdBy', 'contact'],
    });

    if (dueTasks.length === 0) return;

    // Fetch labels once
    const [label, labelTitle] = await Promise.all([
      this.labelRepository.findOne({
        where: { description: NotificationMessages.task_reminder_message },
      }),
      this.labelRepository.findOne({
        where: { description: NotificationTitles.task_reminder_title },
      }),
    ]);

    // Process in batches of 100
    for (let i = 0; i < dueTasks.length; i += BATCH_SIZE) {
      const taskBatch = dueTasks.slice(i, i + BATCH_SIZE);

      // Create notifications for current batch
      const notificationsBatch = taskBatch.map((task) => ({
        entity_id: task.id.toString(),
        entity_name: 'task',
        description_label_id: { id: label?.id },
        title_label_id: { id: labelTitle?.id },
        created_by: task.createdBy?.operator?.full_name || '',
        is_read: false,
        is_deleted: false,
        user_id: { id: task.assignTo?.id },
        creator_id: { id: task.createdBy?.operator?.id },
        admin_description: `Your Task is overdued.
        Subject: ${task.subject}
        Name: ${task.contact?.firstName} ${task.contact?.lastName}`,
        link: `${process.env.CRM_FRONT_END_URL}/tasks/${task.id}`,
      }));

      // Batch insert notifications
      // const createdNotifications =
      //   this.notificationRepository.create(notificationsBatch);
      // await this.notificationRepository.save(createdNotifications);

      // Send socket notifications for current batch
      taskBatch.forEach((task, index) => {
        // this.socketGateway.sendNotificationToUser(task.assignTo?.id, {
        //   ...notificationsBatch[index],
        //   title: labelTitle?.description,
        //   description: label?.description,
        // });
      });
    }
  }

  private async createNotification(
    task: AdminTask,
    type: 'upcoming' | 'overdue' | 'reminder',
  ): Promise<void> {
    const label = await this.labelRepository.findOne({
      where: {
        description:
          type === 'upcoming'
            ? NotificationMessages.task_due_message
            : type === 'overdue'
              ? NotificationMessages.task_overdue_message
              : NotificationMessages.task_reminder_message,
      },
    });
    const labelTitle = await this.labelRepository.findOne({
      where: {
        description:
          type === 'upcoming'
            ? NotificationTitles.task_due_title
            : type === 'overdue'
              ? NotificationTitles.task_overdue_title
              : NotificationTitles.task_reminder_title,
      },
    });
    const userDetail = await this.userRepository.findOne({
      where: { id: task.createdBy.id },
    });

    const link = `${process.env.CRM_FRONT_END_URL}/tasks/${task.id}`;

    const notificationData = {
      entity_id: task.id.toString(),
      entity_name: 'task',
      description_label_id: { id: label?.id },
      title_label_id: { id: labelTitle?.id },
      created_by: userDetail?.operator?.full_name || '',
      is_read: false,
      is_deleted: false,
      user_id: { id: task.assignTo?.id },
      creator_id: { id: userDetail?.operator?.id },
      admin_description:
        type === 'upcoming'
          ? `Task is due in 2 minutes.
            Subject: ${task.subject}
            Name: ${task.contact?.firstName} ${task.contact?.lastName}`
          : type === 'overdue'
            ? `Task is overdue by 2 minutes.
            Subject: ${task.subject}
            Name: ${task.contact?.firstName} ${task.contact?.lastName}`
            : `Your Task is overdued.
            Subject: ${task.subject}
            Name: ${task.contact?.firstName} ${task.contact?.lastName}`,
      link,
    };

    // const notification = this.notificationRepository.create(notificationData);
    // await this.notificationRepository.save(notification);
    // this.socketGateway.sendNotificationToUser(task.assignTo?.id, {
    //   ...notificationData,
    //   title: labelTitle?.description,
    //   description: label?.description,
    // });
  }

  async updateTasksStatusByLeadId(leadId: number): Promise<void> {
    const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);
    const operatorUser = await this.userRepository.findOne({
      where: { operator: { full_name: 'System' } },
      relations: ['operator'],
    });
    await this.taskRepository.update(
      {
        contact: { id: leadId },
        createdAt: LessThan(thirtySecondsAgo),
        isCompleted: false,
        createdBy: { id: operatorUser?.id }
      },
      {
        isCompleted: true,
        status: "COMPLETED"
      }
    );
  }


}
