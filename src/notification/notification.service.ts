import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { notifications } from './entity/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Label } from 'src/tasks/entities/label.entity';
import { LabelTranslation } from 'src/tasks/entities/label_translation.entity';
import { FilesService } from 'src/files/files.service';
import { I18nContext } from 'nestjs-i18n';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { UpdateNotificationLabelDto } from './dto/notification.dto';
import { CreateNotificationDto } from './dto/create_notification.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdateNotificationDto } from './dto/update_notification.dto';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { ListNames } from 'src/list-item/dto/create-list-item.dto';
import { NotificationMessages } from './entity/notification_messages.entity';
import { NotificationLabelRepository } from './repositories/notification_label.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventTypes } from 'src/common/services/event.type';
// import { SocketGateway } from 'src/socket/socket.gateway';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(notifications)
    private notificationsRepository: Repository<notifications>,
    @InjectRepository(Label)
    private labelRepository: Repository<Label>,
    @InjectRepository(LabelTranslation)
    private labelTranslationRepository: Repository<LabelTranslation>,
    private readonly filesService: FilesService,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(NotificationMessages)
    private readonly notificationLabelRepository: Repository<NotificationMessages>,
    private readonly notificationLabelListRepository: NotificationLabelRepository,
    private readonly eventEmitter: EventEmitter2,
    // private socketGateway: SocketGateway,
  ) {}

  async getNotifications(page: number, limit: number) {
    const notifications = await this.notificationsRepository.find({
      select: ['description_label_id', 'title_label_id', 'id', 'is_read', 'created_at'],
      relations: ['title_label_id', 'description_label_id'],
      take: limit,
      skip: (page - 1) * limit,
      order: { created_at: 'DESC' },
    });
    const totalNoti = await this.notificationsRepository.count();
    const modifiedNotifications = notifications.map((notification) => {
      const {
        user_id,
        creator_id,
        title_label_id,
        description_label_id,
        is_read,
        ...filteredNotification
      } = notification;
      return {
        ...filteredNotification,
        titleKey: notification?.title_label_id?.key || '',
        titleDescription: notification?.title_label_id?.description || '',
        descriptionKey: notification?.description_label_id?.key || '',
        description: notification?.description_label_id?.description || '', // Example modification
        is_read,
      };
    });
    return {
      data: modifiedNotifications,
      total: totalNoti,
      currentPage: page,
      limit,
      totalPages: Math.ceil(totalNoti / limit),
    };
  }

  async createNewNotification(
    notification: CreateNotificationDto,
    creator: User,
  ): Promise<NotificationMessages> {
    const findUser = await this.userRepository.findOne({
      where: { id: creator.id, isOperator: true },
      relations: ['operator'],
    });

    if (!findUser?.operator) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: 'Operator not found',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const result = await this.notificationLabelRepository.save(
      this.notificationLabelRepository.create({
        ...notification,
      }),
    );

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: result,
      oldData: null,
      entityId: result.id,
      entityType: 'ClientNotification',
      performerId: findUser.id,
      performerType: 'Operator',
      field: 'Client Notification Created',
    });

    return result;
  }

  async getNotificationList(payload: {
    userId: number;
    limit: number;
    page: number;
    dto: ApplyListFilterSortColumnDto;
  }) {
    const { userId, limit, page, dto } = payload;
    return this.notificationLabelListRepository.advanceFilters({
      listName: ListNames.NOTIFICATION_MESSAGES,
      userId,
      limit,
      page,
      relations: [
        'title_label_id.labelTranslation.regulation',
        'description_label_id.labelTranslation.regulation',
      ],
      filterList: dto?.filters || undefined,
      sortList: dto.sort || undefined,
      defaultSortKey: 'created_at',
      listViewId: dto.listViewId,
      overrideFilters: true,
      orList: dto.or,
    });
  }

  // getNotifications() {
  //   return [
  //     {
  //       title: 'Withdrawal Request',
  //       refId: '23424',
  //       status: 'pending',
  //       date: '07 Aug 2023',
  //       amount: '850123',
  //     },
  //     {
  //       title: 'Withdrawal Request',
  //       refId: '23424',
  //       status: 'pending',
  //       date: '07 Aug 2023',
  //       amount: '850123',
  //     },
  //     {
  //       title: 'Withdrawal Request',
  //       refId: '23424',
  //       status: 'pending',
  //       date: '07 Aug 2023',
  //       amount: '850123',
  //     },
  //     {
  //       title: 'Withdrawal Request',
  //       refId: '23424',
  //       status: 'pending',
  //       date: '07 Aug 2023',
  //       amount: '850123',
  //     },
  //   ];
  // }

  getBlogs() {
    return [
      {
        id: 1,
        title: "Australia's Q4 outlook 2023",
        description:
          'The RBA may ease policy and possibly cut rates in 2024 to counter the impact of previous monetary tightening on domestic consumption.',
        authorName: 'Nadia Elbilassy',
        date: '21 November 2023',
      },
      {
        id: 2,
        title: 'Global Market Trends',
        description:
          'Analyzing the latest trends in global markets and potential investment opportunities for traders.',
        authorName: 'John Trader',
        date: '25 November 2023',
      },
      {
        id: 3,
        title: 'Crypto Insights',
        description:
          'Exploring the current state of the cryptocurrency market and its potential impact on traditional financial systems.',
        authorName: 'CryptoExpert123',
        date: '28 November 2023',
      },
      {
        id: 4,
        title: 'Risk Management Strategies',
        description:
          'Effective risk management strategies for traders to navigate volatile markets and protect their investments.',
        authorName: 'RiskGuardian',
        date: '2 December 2023',
      },
      {
        id: 5,
        title: 'Forex Trading Tips',
        description:
          'Practical tips and techniques for successful forex trading in the ever-changing foreign exchange market.',
        authorName: 'FXMaster',
        date: '6 December 2023',
      },
    ];
  }

  async getNotificationById(id: number) {
    const notification = await this.notificationLabelRepository.findOne({
      where: { id },
      relations: [
        'title_label_id.labelTranslation.regulation',
        'description_label_id.labelTranslation.regulation',
      ],
    });
    if (!notification) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: {
            msg: 'Notification not found',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return notification;
  }

  async markNotificationAsRead(id: number): Promise<void> {
    const notification = await this.notificationsRepository.findOne({
      where: { id },
    });
    if (!notification) {
      throw new Error(`Notification with ID ${id} not found.`);
    }

    notification.is_read = true;
    await this.notificationsRepository.save(notification);
  }

  async updateNotificationLabel(
    id: number,
    dto: UpdateNotificationLabelDto,
  ): Promise<void> {
    const notification = await this.notificationsRepository.findOne({
      where: { id },
    });
    if (!notification) {
      throw new Error(`Notification with ID ${id} not found.`);
    }
    const updatedDto: any = {};
    if (dto.titleId) {
      updatedDto.title_label_id = { id: dto.titleId };
    }

    if (dto.descriptionId) {
      updatedDto.description_label_id = { id: dto.descriptionId };
    }
    await this.notificationsRepository.update(id, updatedDto);
  }

  async getNotificationsByUserId(
    {
      paginationOptions,
    }: {
      paginationOptions: IPaginationOptions;
    },
    userId: number,
    only_unread: boolean,
  ): Promise<any> {
    const i18n = I18nContext.current();
    const updatedLang = i18n?.lang.toLocaleLowerCase();
    const skip = (paginationOptions.page - 1) * paginationOptions.limit;
    const notifications = await this.notificationsRepository.find({
      skip,
      take: paginationOptions.limit,
      where: { user_id: { id: userId }, is_read: only_unread ? false: undefined },
      relations: {
        title_label_id: true,
        description_label_id: true,
      },
      order: { created_at: 'DESC' },
    });
    const count = notifications?.length;
    const { total, unread } = await this.notificationsRepository
    .createQueryBuilder('notification')
    .select('COUNT(*)', 'total')
    .addSelect(
      `SUM(CASE WHEN notification.is_read = 0 THEN 1 ELSE 0 END)`,
      'unread',
    )
    .where('notification.user_id = :userId', { userId })
    .getRawOne();

    const hasNextPage = skip + paginationOptions?.limit < total;
    const fileIDs = await Promise.all(
      notifications.map(async (notification) => {
        const userId = notification?.user_id?.id ?? null; // Handling potential null value
        const entity_id = notification?.entity_id ?? null; // Handling potential null value
        const entity_name = notification?.entity_name ?? null; // Handling potential null value

        // Fetch the transaction details if the entity is related to a transaction
        let transactionDetails = '';
        if (entity_name === 'transaction' && entity_id) {
          const transaction = await this.transactionRepository.findOne({
            where: {
              id: entity_id,
            },
            relations: [
              // 'bonuses',
              'method',
              'eWallet',
              'creditCardDetails',
              'exchangeDetails',
              'companyBank',
              'userBank',
              'kycRep',
              // 'evidence',
              'user',
            ],
          });
          if (transaction) {
            // Extracting relevant information from the transaction response
            const {
              type,
              status,
              amount,
              currency,
              companyBank,
              user,
              psp,
              method,
            } = transaction;

            // Getting user details (if available)
            const userDetails = user
              ? `User ID: ${user.id} \nName: ${user.firstName} ${user.lastName} \nEmail: ${user.email}`
              : 'User ID: N/A, \nName: N/A, \nEmail: N/A';

            // Getting PSP (Payment Service Provider) details (if available)
            const pspDetails = psp
              ? `PSP: ${psp.displayName} \nAggregator: ${psp.aggregatorName}`
              : 'PSP: N/A \nAggregator: N/A';

            // Getting bank details (if a company bank is linked)
            const bankDetails = companyBank
              ? `Bank: ${companyBank.bankName} \nAccount Name: ${companyBank.accountName} \nIBAN: ${companyBank.iban}`
              : 'Bank: N/A \nAccount Name: N/A \nIBAN: N/A';

            // Extracting method (like WIRE or other)
            const methodDetails = method
              ? `Payment Method: ${method.method}`
              : 'Payment Method: N/A';

            // Constructing the transaction details string
            transactionDetails = `
              Transaction Type: ${type},
              Status: ${status},
              Amount: ${amount} ${currency},
              ${userDetails},
              ${pspDetails},
              ${bankDetails},
              ${methodDetails}
            `;
          }
        }

        // Handling potential null value and using optional chaining
        const description = await this.labelTranslationRepository.findOne({
          where: {
            label: { id: notification.description_label_id?.id ?? null }, // Handling potential null value and using optional chaining
            langCode: updatedLang,
          },
        });
        let text = description?.text ?? null; // Handling potential null value
        text += transactionDetails
          ? `\n\nTransaction Details:\n${transactionDetails}`
          : '';

        const titleLabel = await this.labelTranslationRepository.findOne({
          where: {
            label: { id: notification.title_label_id?.id ?? null }, // Handling potential null value and using optional chaining
            langCode: updatedLang,
          },
        }); // Handling potential null value
        const title = titleLabel?.text ?? null; // Handling potential null value
        const created_by = notification?.created_by ?? null; // Handling potential null value
        const creatorId = notification?.creator_id?.id ?? null; // Handling potential null value
        const creator_profile = notification?.creator_id?.photo?.id ?? null; // Handling potential null value

        const profile_url = creator_profile
          ? await this.filesService.getSignedUrl(creator_profile as string)
          : null;

        const is_read = notification?.is_read ?? null; // Handling potential null value
        const is_deleted = notification?.is_deleted ?? null; // Handling potential null value
        const created_at = notification?.created_at ?? null; // Handling potential null value
        const link = notification?.link ?? null;
        const {
          user_id, // eslint-disable-line @typescript-eslint/no-unused-vars
          title_label_id, // eslint-disable-line @typescript-eslint/no-unused-vars
          creator_id, // eslint-disable-line @typescript-eslint/no-unused-vars
          description_label_id, // eslint-disable-line @typescript-eslint/no-unused-vars
          ...docWithoutFileId
        } = notification; // eslint-disable-line @typescript-eslint/no-unused-vars

        return {
          ...docWithoutFileId,
          userId,
          entity_id,
          entity_name,
          text,
          title,
          created_by,
          creatorId,
          profile_url,
          is_read,
          is_deleted,
          created_at,
          link,
        };
      }),
    );
    return { fileIDs, count, total, unread, hasNextPage };
  }

  async createNotification(notificationData: any): Promise<any> {
    notificationData.entity_id = notificationData.entity_id.toString();
    const notification = this.notificationsRepository.create(notificationData);
    // this.socketGateway.sendNotificationToUser(
    //   notificationData.user_id,
    //   notificationData,
    // );
    return this.notificationsRepository.save(notification);
  }

  async updateNotification(
    id: number,
    notificationData: UpdateNotificationDto,
    creator: User,
  ): Promise<NotificationMessages> {
    const notification = await this.notificationLabelRepository.findOne({
      where: { id },
      relations: ['title_label_id', 'description_label_id'],
    });

    if (!notification) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: 'Notification not found',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const findUser = await this.userRepository.findOne({
      where: { id: creator.id, isOperator: true },
      relations: ['operator'],
    });

    if (!findUser?.operator) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: 'Operator not found',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    if (
      notificationData?.title !== undefined &&
      !notificationData?.title.trim()
    ) {
      throw new BadRequestException('Title cannot be empty.');
    }
    if (
      notificationData?.description !== undefined &&
      !notificationData?.description.trim()
    ) {
      throw new BadRequestException('Description cannot be empty.');
    }

    const result = await this.notificationLabelRepository.save({
      ...notification,
      ...notificationData,
      title_label_id: {
        id: notificationData.title_label_id
          ? notificationData.title_label_id
          : undefined,
      },
      description_label_id: {
        id: notificationData.description_label_id
          ? notificationData.description_label_id
          : undefined,
      },
    });

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: result,
      oldData: notification,
      entityId: result.id,
      entityType: 'ClientNotification',
      performerId: findUser.id,
      performerType: 'Operator',
      field: 'Client Notification Updated',
    });

    return result
  }

  async deleteNotification(id: number, userId: number): Promise<void> {
    const isExist = await this.notificationLabelRepository.findOne({
      where: { id },
    });

    if (!isExist) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: {
            msg: 'Notification not found',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const notification = await this.notificationLabelRepository.findOne({
      where: { id },
    });
    if (!notification) {
      throw new Error(`Notification with ID ${id} not found.`);
    }

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: null,
      oldData: notification,
      entityId: notification.id,
      entityType: 'ClientNotification',
      performerId: userId,
      performerType: 'Operator',
      field: 'Client Notification Delete',
    });

    await this.notificationLabelRepository.softDelete(id);
  }
}
