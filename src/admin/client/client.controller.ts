import {
  Controller,
  Get,
  UseGuards,
  HttpStatus,
  HttpCode,
  SerializeOptions,
  Query,
  Param,
  Delete,
  Body,
  Patch,
  Post,
  Request,
  ParseIntPipe,
  Put,
  BadRequestException,
  Req,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { QueryClientDto } from 'src/users/dto/query-client.dto';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { ClientsService } from 'src/users/clients.service';
import { UserKycDocumentsService } from 'src/user-kyc-docs/user-kyc-documents.service';
import { NullableType } from 'src/utils/types/nullable.type';
import { UpdateClientDTO } from './dto/clientSales.dto';
import { RetentionInfoDTO } from './dto/clientRetention.dto';
import {
  CommunicationDto,
  CommunicationResponseDto,
  CreateCommunicationDto,
  CreateEmailLayoutDto,
  CreateEmailTemplateDto,
  EmailLayoutResponseDto,
  EmailTemplateResponseDto,
  SendEmailDto,
  UpdateEmailLayoutDto,
  UpdateEmailTemplateDto,
} from './dto/clientCommunication.dto';
import { ClientService } from './client.service';
import {
  ClientFdaUpdateInfo,
  ClientInfoDTO,
  ClientInfoUpdateDTO,
} from './dto/clientInfoEdit.dto';
import { WalletService } from 'src/wallet/wallet.service';
import { ClientService as Mt5ClientService } from 'src/mt5/client/client.service';
import { ClientSettingDto } from './dto/clientSetting.dto';
import { CreateAccountDto } from 'src/admin/client/dto/create-account-request.dto';
import { AllKycInfoDto, KycInfoDto } from './dto/clientKycInfo.dto';
import { ParamsTradingInfoDto } from 'src/trading/dto/trading-info.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { TableColumnOrder } from 'src/table-order/entities/table-order.entity';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { AccountService as Mt5AccountService } from 'src/mt5/account/account.service';
import {
  UpdateAccountRequestParams,
  UpdateAccountRightsRequest,
  UpdateAccountTrade,
} from 'src/mt5/account/dto/update-account-rights.dto';
import { ChangePasswordFromAdminDto } from 'src/mt5/account/dto/change-password.dto';
import { PositionService as Mt5PositionService } from 'src/mt5/trading/positions/position.service';
import { DealService } from 'src/mt5/trading/deals/deal.service';
import { GetPostionsQueryDto as GetPositionsQueryDto } from './dto/trading-info.dto';
import {
  CreateKycNoteDto,
  GetKycNotesDto,
  PaginationDto,
  UpdateKycNoteDto,
} from '../kyc/dto/admin-kyc.dto';
import { AdminKycService } from '../kyc/kyc.service';
import { notes } from '../kyc/entities/kycNotes.entity';
import {
  UpdateClientAnswersDto,
  UpdateClientPasswordDto,
} from './dto/updateClientAnswers.dto';
import { AdvanceSearchDto } from 'src/database/base-repository/dto/advance-search.dto';
import { I18nContext } from 'nestjs-i18n';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { GetTaskQuery } from '../task/dto/task.dto';
import { TaskEntityType } from '../task/entities/task.entity';
import { TaskService } from '../task/task.service';
import { UserEWalletService } from 'src/user-ewallet/user-ewallet.service';
import { UserCreditCardsService } from 'src/user-credit-cards/user-credit-cards.service';
import { CreateAccountRequest } from 'src/mt5/account/dto/create-account.dto';
import { ServerName } from 'src/wallet/entities/server.entity';
import { CreateUserCreditCardDto } from 'src/user-credit-cards/dto/create-user-credit-card.dto';
import { CreateUserEWalletDto } from 'src/user-ewallet/dto/create-user-ewallet.dto';
import { Mt5Account } from 'src/mt5/entities/mt5-account.entity';
import { Repository } from 'typeorm';
import { GetTransactionTaskParamDto } from './dto/get-transaction-tasks.param.dto';
import { TradingService } from 'src/trading/trading.service';
import {
  MessageDto,
  PreviewDto,
  TemplateDto,
  TemplateDtoAdvance,
} from 'src/auth/dto/auth-message.dto';
import { start } from 'elastic-apm-node';
import { EmailEntity } from 'src/mail/entities/email-entity.entity';
import { EmailVariable } from 'src/mail/entities/email-variable.entity';

@ApiTags('Admin clients')
@Controller({
  path: 'admin/client',
  version: '1',
})
export class ClientController {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly userKycDocumentsService: UserKycDocumentsService,
    private readonly adminClientService: ClientService,
    private readonly walletService: WalletService,
    private readonly mt5ClientService: Mt5ClientService,
    private readonly mt5AccountService: Mt5AccountService,
    @InjectRepository(TableColumnOrder)
    private readonly mt5DealService: DealService,
    private readonly mt5PositionService: Mt5PositionService,
    private readonly adminKycService: AdminKycService,
    private readonly tasksService: TaskService,
    private readonly userEWalletService: UserEWalletService,
    private readonly userCreditCardDetails: UserCreditCardsService,
    @InjectRepository(Mt5Account)
    private readonly mt5AccountRepository: Repository<Mt5Account>,
    private readonly tradingService: TradingService,
  ) {}

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get('credit')
  @HttpCode(HttpStatus.OK)
  getCreditList() {
    return {
      success: true,
      error: null,
      result: [
        {
          id: 6,
          creationTime: 1701264698000,
          lastUpdateTime: 1701264698000,
          brokerUserId: 17406,
          userId: 12150,
          operatorId: 3,
          operatorFullName: 'Admin',
          comment: 'test',
          amount: 10000,
          normalizedAmount: 10000,
          currency: 'USD',
          acquisitionStatus: 'Retention',
          repId: 1020,
          repName: 'Barak Ullah',
          repManagerId: 0,
          repManagerName: 'None',
          deskId: null,
          deskName: 'Sales',
          officeId: null,
          officeName: null,
          commentForUser: 'test',
          daysLeftToExpiration: null,
          status: 'ACTIVE',
        },
        {
          id: 5,
          creationTime: 1693912386000,
          lastUpdateTime: 1693912386000,
          brokerUserId: 16816,
          userId: 11760,
          operatorId: 1008,
          operatorFullName: 'Oumaima Saha',
          comment: 'Credit',
          amount: 100000,
          normalizedAmount: 100000,
          currency: 'USD',
          acquisitionStatus: 'Retention',
          repId: 0,
          repName: 'None',
          repManagerId: 0,
          repManagerName: 'None',
          deskId: null,
          deskName: 'Sales',
          officeId: null,
          officeName: null,
          commentForUser: 'Credit',
          daysLeftToExpiration: null,
          status: 'ACTIVE',
        },
        {
          id: 4,
          creationTime: 1693894448000,
          lastUpdateTime: 1693894448000,
          brokerUserId: 16879,
          userId: 11780,
          operatorId: 1004,
          operatorFullName: 'Support Example',
          comment: 'CREDIT-OUT',
          amount: -20000,
          normalizedAmount: -20000,
          currency: 'USD',
          acquisitionStatus: 'Retention',
          repId: 0,
          repName: 'None',
          repManagerId: 0,
          repManagerName: 'None',
          deskId: null,
          deskName: 'Sales',
          officeId: null,
          officeName: null,
          commentForUser: 'CREDIT-OUT',
          daysLeftToExpiration: null,
          status: 'ACTIVE',
        },
        {
          id: 3,
          creationTime: 1693894366000,
          lastUpdateTime: 1693894366000,
          brokerUserId: 16879,
          userId: 11780,
          operatorId: 1004,
          operatorFullName: 'Support Example',
          comment: 'CREDIT-IN',
          amount: 20000,
          normalizedAmount: 20000,
          currency: 'USD',
          acquisitionStatus: 'Retention',
          repId: 0,
          repName: 'None',
          repManagerId: 0,
          repManagerName: 'None',
          deskId: null,
          deskName: 'Sales',
          officeId: null,
          officeName: null,
          commentForUser: 'CREDIT-IN',
          daysLeftToExpiration: null,
          status: 'ACTIVE',
        },
        {
          id: 2,
          creationTime: 1693480425000,
          lastUpdateTime: 1693480425000,
          brokerUserId: 16748,
          userId: 11726,
          operatorId: 1004,
          operatorFullName: 'Support Example',
          comment: 'CREDIT-N',
          amount: 500,
          normalizedAmount: 500,
          currency: 'USD',
          acquisitionStatus: 'Retention',
          repId: 0,
          repName: 'None',
          repManagerId: 0,
          repManagerName: 'None',
          deskId: null,
          deskName: 'Sales',
          officeId: null,
          officeName: null,
          commentForUser: 'CREDIT-IN',
          daysLeftToExpiration: null,
          status: 'ACTIVE',
        },
        {
          id: 1,
          creationTime: 1692345383000,
          lastUpdateTime: 1692345383000,
          brokerUserId: 16670,
          userId: 11673,
          operatorId: 1003,
          operatorFullName: 'Main Admin',
          comment: 'trfy',
          amount: 70000,
          normalizedAmount: 70000,
          currency: 'USD',
          acquisitionStatus: 'Retention',
          repId: 0,
          repName: 'None',
          repManagerId: 0,
          repManagerName: 'None',
          deskId: null,
          deskName: 'Sales',
          officeId: null,
          officeName: null,
          commentForUser: 'cre',
          daysLeftToExpiration: null,
          status: 'ACTIVE',
        },
      ],
      paging: {
        start: 0,
        limit: 50,
        total: 6,
        hasMore: null,
      },
    };
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get('deposit')
  @HttpCode(HttpStatus.OK)
  getDepositList() {
    return {
      success: true,
      error: null,
      result: {
        id: 0,
        creationTime: 0,
        data: {
          lastFtds: {
            id: 0,
            creationTime: 0,
            lastUpdateTime: 0,
            name: 'lastFtds',
            header: [
              'User ID',
              'Name',
              'Country',
              'Amount',
              'FTD',
              'Affiliate',
              'Sales Agent',
              'Retention Agent',
              'Decision Time',
            ],
            data: [
              [
                12176,
                'testNav Delete',
                '<i class="flag-icon flag-icon-pk"/> Pakistan',
                'USD 100.00',
                'Yes',
                'QA Manual (2)',
                'Barak Ullah',
                'None',
                1704206664000,
              ],
              [
                12153,
                'tester tester',
                '<i class="flag-icon flag-icon-il"/> Israel',
                'USD 10.00',
                'No',
                'QA Manual (2)',
                'None',
                'None',
                1704189264000,
              ],
              [
                12153,
                'tester tester',
                '<i class="flag-icon flag-icon-il"/> Israel',
                'USD 15.00',
                'Yes',
                'QA Manual (2)',
                'Barak Ullah',
                'None',
                1702979108000,
              ],
              [
                12152,
                'Manual test',
                '<i class="flag-icon flag-icon-il"/> Israel',
                'USD 20.00',
                'Yes',
                'QA Manual (2)',
                'Barak Ullah',
                'None',
                1701343428000,
              ],
              [
                12130,
                'Testerino Test',
                '<i class="flag-icon flag-icon-il"/> Israel',
                'USD 15.00',
                'No',
                'QA Manual (2)',
                'Barak Ullah',
                'None',
                1700749514000,
              ],
              [
                12130,
                'Testerino Test',
                '<i class="flag-icon flag-icon-il"/> Israel',
                'USD 1.00',
                'Yes',
                'QA Manual (2)',
                'Barak Ullah',
                'None',
                1700747777000,
              ],
              [
                12129,
                'Manual Job',
                '<i class="flag-icon flag-icon-il"/> Israel',
                'USD 1.00',
                'Yes',
                'QA Manual (2)',
                'Barak Ullah',
                'None',
                1700745095000,
              ],
              [
                11946,
                'manual TestDemo',
                '<i class="flag-icon flag-icon-il"/> Israel',
                'USD 1.00',
                'No',
                'QA Manual (2)',
                'None',
                'None',
                1700725772000,
              ],
              [
                11946,
                'manual TestDemo',
                '<i class="flag-icon flag-icon-il"/> Israel',
                'USD 1.00',
                'No',
                'QA Manual (2)',
                'None',
                'None',
                1700655819000,
              ],
              [
                12119,
                'Manual Testeroo',
                '<i class="flag-icon flag-icon-il"/> Israel',
                'USD 1.00',
                'Yes',
                'QA Manual (2)',
                'Barak Ullah',
                'None',
                1700655350000,
              ],
              [
                11946,
                'manual TestDemo',
                '<i class="flag-icon flag-icon-il"/> Israel',
                'USD 1.00',
                'No',
                'QA Manual (2)',
                'None',
                'None',
                1700655332000,
              ],
              [
                11946,
                'manual TestDemo',
                '<i class="flag-icon flag-icon-il"/> Israel',
                'USD 1.00',
                'Yes',
                'QA Manual (2)',
                'None',
                'None',
                1700654872000,
              ],
              [
                12118,
                'Final  Countdown',
                '<i class="flag-icon flag-icon-il"/> Israel',
                'USD 1.00',
                'No',
                'QA Manual (2)',
                'Barak Ullah',
                'None',
                1700654037000,
              ],
              [
                12118,
                'Final  Countdown',
                '<i class="flag-icon flag-icon-il"/> Israel',
                'USD 1.00',
                'Yes',
                'QA Manual (2)',
                'Barak Ullah',
                'None',
                1700648298000,
              ],
              [
                12114,
                'manual test',
                '<i class="flag-icon flag-icon-il"/> Israel',
                'USD 1.00',
                'Yes',
                'QA Manual (2)',
                'Barak Ullah',
                'None',
                1700582301000,
              ],
              [
                12113,
                'manual test',
                '<i class="flag-icon flag-icon-il"/> Israel',
                'USD 1.00',
                'No',
                'QA Manual (2)',
                'Barak Ullah',
                'None',
                1700581765000,
              ],
              [
                12113,
                'manual test',
                '<i class="flag-icon flag-icon-il"/> Israel',
                'USD 1.00',
                'No',
                'QA Manual (2)',
                'Barak Ullah',
                'None',
                1700581686000,
              ],
              [
                12113,
                'manual test',
                '<i class="flag-icon flag-icon-il"/> Israel',
                'USD 1.00',
                'Yes',
                'QA Manual (2)',
                'Barak Ullah',
                'None',
                1700577313000,
              ],
              [
                12098,
                'Manual Test',
                '<i class="flag-icon flag-icon-il"/> Israel',
                'USD 11.00',
                'Yes',
                'QA Manual (2)',
                'Barak Ullah',
                'None',
                1700576853000,
              ],
              [
                12092,
                'Uncle Bob',
                '<i class="flag-icon flag-icon-il"/> Israel',
                'USD 11.00',
                'Yes',
                'QA Manual (2)',
                'Barak Ullah',
                'None',
                1700566260000,
              ],
              [
                12099,
                'test test',
                '<i class="flag-icon flag-icon-fr"/> France',
                'USD 100.00',
                'Yes',
                'QA Manual (2)',
                'Barak Ullah',
                'None',
                1700564442000,
              ],
              [
                12087,
                'Testing Testerino',
                '<i class="flag-icon flag-icon-cy"/> Cyprus',
                'USD 50.00',
                'Yes',
                'QA Manual (2)',
                'Barak Ullah',
                'None',
                1700553189000,
              ],
              [
                12085,
                'test test',
                '<i class="flag-icon flag-icon-cy"/> Cyprus',
                'USD 100.00',
                'Yes',
                'QA Manual (2)',
                'Barak Ullah',
                'None',
                1700487944000,
              ],
              [
                12063,
                'Upload Test',
                '<i class="flag-icon flag-icon-gb"/> United Kingdom',
                'USD 100.00',
                'No',
                'QA Manual (2)',
                'None',
                'None',
                1700146073000,
              ],
              [
                12063,
                'Upload Test',
                '<i class="flag-icon flag-icon-gb"/> United Kingdom',
                'USD 100.00',
                'Yes',
                'QA Manual (2)',
                'None',
                'None',
                1700143371000,
              ],
            ],
            error: null,
          },
        },
      },
      paging: null,
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Post(':id/change-password')
  @HttpCode(HttpStatus.OK)
  async updatePassword(
    @Param('id') id: number,
    @Body() updateClientPasswordDto: UpdateClientPasswordDto,
  ): Promise<any> {
    const i18n = I18nContext.current();
    const successMessage = i18n?.t('success.password.updated');

    await this.clientsService.updateClientPassword(
      +id,
      updateClientPasswordDto,
    );
    return { success: true, message: successMessage };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: QueryClientDto, @GetUser() user: User) {
    const page = query?.page ?? null;
    const limit = query?.limit ?? null;
    const roleId = user?.role?.id;
    if (!roleId) {
      throw new ForbiddenException('User role not found');
    }
    const data = await this.clientsService.findManyWithPagination({
      paginationOptions: {
        page,
        limit,
      },
      userId: user.id,
    });
    return data;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Post('list')
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Query() query: QueryClientDto,
    @GetUser() user: User,
    @Body() body: ApplyListFilterSortColumnDto,
  ) {
    const page = query?.page ?? null;
    const limit = query?.limit ?? null;
    const data = await this.clientsService.findManyWithPagination({
      paginationOptions: {
        page,
        limit,
      },
      userId: user.id,
      dto: body,
    });
    return data;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Post('listIb')
  @HttpCode(HttpStatus.OK)
  async getAllClientIb(
    @Query() query: QueryClientDto,
    @GetUser() user: User,
    @Body() body: ApplyListFilterSortColumnDto,
  ) {
    const page = query?.page ?? null;
    const limit = query?.limit ?? null;
    const data = await this.clientsService.findManyWithPaginationIb({
      paginationOptions: {
        page,
        limit,
      },
      userId: user.id,
      dto: body,
    });
    return data;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Post('search')
  @HttpCode(HttpStatus.OK)
  advanceSearchUser(@Body() dto: AdvanceSearchDto) {
    return this.clientsService.search(dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id/tasks')
  @HttpCode(HttpStatus.OK)
  async getClientTasks(@Param('id') id: number, @Query() query: GetTaskQuery) {
    return this.tasksService.findByEntity(id, query, TaskEntityType.CLIENT);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id/transaction/:tId/tasks')
  @HttpCode(HttpStatus.OK)
  async getTransactionTasks(
    @Param() param: GetTransactionTaskParamDto,
    @Query() query: GetTaskQuery,
  ) {
    return this.tasksService.findByEntity(
      param.tId,
      query,
      TaskEntityType.TRANSACTION,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id/sales')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<any> {
    return this.clientsService.findOneClient(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch(':id/sales')
  @HttpCode(HttpStatus.OK)
  async updateOne(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDTO,
  ): Promise<NullableType<any>> {
    const i18n = I18nContext.current();
    const data = await this.clientsService.updateClient(+id, updateClientDto); // data
    const isSuccess = i18n?.t('client.salesData');
    return { message: isSuccess, data: data };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':id/retention')
  @HttpCode(HttpStatus.OK)
  async getRetentionInfo(@Param('id') id: string): Promise<any> {
    return this.clientsService.getRetentionInfo(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch(':id/retention')
  @HttpCode(HttpStatus.OK)
  async updateRetentionInfo(
    @Param('id') id: string,
    @Body() retentionInfoDto: RetentionInfoDTO,
  ): Promise<NullableType<any>> {
    const i18n = I18nContext.current();
    const data = await this.clientsService.updateRetentionInfo(
      +id,
      retentionInfoDto,
    );
    const isSuccess = i18n?.t('client.retentionData');
    return {
      message: isSuccess,
      data: data,
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Post('/addTemplate')
  @HttpCode(HttpStatus.OK)
  async addEmailTemplate(
    @Body() createEmailTemplateDto: CreateEmailTemplateDto,
    @Request() req: any,
  ): Promise<{ message: string; data: EmailTemplateResponseDto }> {
    const i18n = I18nContext.current();
    const { language, title, entityId } = createEmailTemplateDto;
    const userId = req.user.id;
    await this.clientsService.createEmailTemplate(
      createEmailTemplateDto,
      userId,
    );
    const responseDto: EmailTemplateResponseDto = {
      title,
      language,
      entityId,
    };
    const isSuccess = i18n?.t('success.email.success');
    return {
      message: `${isSuccess}`,
      data: responseDto,
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch('/updateTemplate/:id')
  @HttpCode(HttpStatus.OK)
  async updateEmailTemplate(
    @Param('id') id: string,
    @Body() createEmailTemplateDto: UpdateEmailTemplateDto,
    @Request() req: any,
  ): Promise<{ message: string; data: EmailTemplateResponseDto }> {
    const i18n = I18nContext.current();
    const userId = req?.user?.id
    const { language, text, name, title } = createEmailTemplateDto;
    await this.clientsService.updateEmailTemplate(+id, createEmailTemplateDto,userId);
    const responseDto: EmailTemplateResponseDto = {
      text,
      name,
      language,
      title,
    };
    const isSuccess = i18n?.t('success.email.success');
    return {
      message: `${isSuccess}`,
      data: responseDto,
    };
  }

  @SerializeOptions({ groups: ['admin'] })
  @ApiBearerAuth()
  @Get('template/entities')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async getAllEmailEntities(): Promise<EmailEntity[]> {
    return this.clientsService.getAllEmailEntities();
  }

  // @UseGuards(AuthGuard('jwt'))
  // @SerializeOptions({ groups: ['admin'] })
  // @ApiBearerAuth()
  // @HttpCode(HttpStatus.OK)
  // @Post('send/dynamic-email')
  // async sendDynamicEmail(
  //   @Body() sendEmailDto: SendEmailDto,
  //   @Request() req: any,
  // ) {
  //   console.log('req: ', req);
  //   const {
  //     templateId,
  //     userId,
  //     subject,
  //     from,
  //     to,
  //     layoutId,
  //     entityId,
  //     entityValue,
  //   } = sendEmailDto;
  //   const operatorId = req?.user?.id;

  //   // Step 1: Fetch a single variable associated with the given template ID
  //   const templateEntity =
  //     await this.clientsService.getTemplateEntity(templateId);

  //   if (!templateEntity) {
  //     throw new NotFoundException('No entity found for the given template ID');
  //   }

  //   // Assuming templateVariable has entityId and entityType fields
  //   const { name: entityType } = templateEntity.entity;
  //   const { name: templateName } = templateEntity;

  //   // Step 2: Fetch dynamic data for the entity using the fetched variable
  //   const dynamicData = await this.clientsService.fetchTemplateVariables(
  //     entityId,
  //     entityType,
  //     entityValue,
  //   );
  //   await this.clientsService.sendDynamicEmail({
  //     template: templateName,
  //     subject,
  //     from,
  //     to,
  //     layoutId,
  //     entityId,
  //     entityType,
  //     entityValue,
  //     operatorId,
  //     dynamicData,
  //   });

  //   // Step 3: Call your email sending function with the dynamic data

  //   return { message: 'Email sent successfully' };
  // }

  @SerializeOptions({ groups: ['admin'] })
  @ApiBearerAuth()
  @Get('templates')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async getTemplates(@Query() query: TemplateDto) {
    const page = query.page ?? 1;
    let limit = query.limit ?? 10;
    if (limit > 50) limit = 50;

    return await this.clientsService.getTemplates({
      paginationOptions: { page, limit },
      searchValue: query.searchValue,
      searchColumn: query.searchColumn,
      startDate: query.startDate,
      endDate: query.endDate,
      sortBy: query.sortBy ?? 'id',
      sortOrder: query.sortOrder ?? 'DESC',
      version: query.version,
    });
  }

  @SerializeOptions({ groups: ['admin'] })
  @ApiBearerAuth()
  @Post('templates')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async getTemplatesAdvance(
    @Query() query: TemplateDtoAdvance,
    @GetUser() user: User,
    @Body() body: ApplyListFilterSortColumnDto,
  ) {
    const { limit = 10, page = 1 } = query || {};
    return await this.clientsService.getAllEmailTemplatesAdvance(
      user.id,
      limit,
      page,
      body,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/template/:id')
  @HttpCode(HttpStatus.OK)
  async getTemplate(@Param('id', ParseIntPipe) id: number): Promise<any> {
    try {
      return await this.clientsService.getOneTemplate(id);
    } catch (error) {
      console.error('Error getting message:', error);
      throw error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete('/template/:id')
  @HttpCode(HttpStatus.OK)
  async deleteTemplate(@Param('id', ParseIntPipe) id: number,@Request() req: any): Promise<any> {
    try {
      const userId = req?.user?.id;
      return await this.clientsService.deleteEmailTemplateById(id,userId);
    } catch (error) {
      console.error('Error getting message:', error);
      throw error;
    }
  }

  @SerializeOptions({ groups: ['admin'] })
  @ApiBearerAuth()
  @Get('template/variables/:entityId')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async getVariablesByEntityId(
    @Param('entityId') entityId: number,
  ): Promise<EmailVariable[]> {
    const variables =
      await this.clientsService.getVariablesByEntityId(entityId);
    if (!variables.length) {
      throw new NotFoundException(
        `No variables found for entity ID ${entityId}`,
      );
    }
    return variables;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Post('/addLayout')
  @HttpCode(HttpStatus.OK)
  async addEmailLayout(
    @Body() createEmailLayoutDto: CreateEmailLayoutDto,
    @Request() req: any,
  ): Promise<{ message: string; data: EmailLayoutResponseDto }> {
    const i18n = I18nContext.current();
    const userId = req.user.id;
    const { language, layout, name, regulation, companyName, regulationId } =
      createEmailLayoutDto;
    await this.clientsService.createEmailLayout(createEmailLayoutDto, userId);
    const responseDto: EmailLayoutResponseDto = {
      layout,
      name,
      language,
      regulation,
      regulationId,
      companyName,
    };
    const isSuccess = i18n?.t('success.email.success');
    return {
      message: `${isSuccess}`,
      data: responseDto,
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch('/updateLayout/:id')
  @HttpCode(HttpStatus.OK)
  async updateEmailLayout(
    @Param('id') id: string,
    @Body() updateEmailLayoutDto: UpdateEmailLayoutDto,
    @Request() req: any,

  ): Promise<{ message: string; data: EmailLayoutResponseDto }> {
    const i18n = I18nContext.current();
    const userId = req.user.id;
    const { language, layout, name, regulation, companyName, regulationId } =
      updateEmailLayoutDto;
    await this.clientsService.updateEmailLayout(+id, updateEmailLayoutDto,userId);
    const responseDto: EmailLayoutResponseDto = {
      regulation,
      regulationId,
      name,
      language,
      companyName,
      layout,
    };
    const isSuccess = i18n?.t('success.email.success');
    return {
      message: `${isSuccess}`,
      data: responseDto,
    };
  }

  @SerializeOptions({ groups: ['admin'] })
  @ApiBearerAuth()
  @Get('layouts')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async getLayouts(@Query() query: TemplateDto) {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) limit = 50;

    return await this.clientsService.getAllEmailLayouts({
      paginationOptions: { page, limit },
      searchValue: query.searchValue,
      searchColumn: query.searchColumn,
      startDate: query.startDate,
      endDate: query.endDate,
      sortBy: query.sortBy ?? 'id',
      sortOrder: query.sortOrder ?? 'DESC',
      version: query.version,
    });
  }

  @SerializeOptions({ groups: ['admin'] })
  @ApiBearerAuth()
  @Post('layouts')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async getLayoutsAdvance(
    @Query() query: TemplateDtoAdvance,
    @GetUser() user: User,
    @Body() body: ApplyListFilterSortColumnDto,
  ) {
    const { limit = 10, page = 1 } = query || {};
    return await this.clientsService.getAllEmailLayoutsAdvance(
      user.id,
      limit,
      page,
      body,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/layout/:id')
  @HttpCode(HttpStatus.OK)
  async getLayout(@Param('id', ParseIntPipe) id: number): Promise<any> {
    try {
      return await this.clientsService.getLayoutById({ id });
    } catch (error) {
      console.error('Error getting message:', error);
      throw error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete('/layout/:id')
  @HttpCode(HttpStatus.OK)
  async deleteLayout(@Param('id', ParseIntPipe) id: number, @Request() req: any): Promise<any> {
    try {
      const userId = req.user.id;
      return await this.clientsService.deleteEmailLayoutById(id, userId);
    } catch (error) {
      console.error('Error getting message:', error);
      throw error;
    }
  }

  @SerializeOptions({ groups: ['admin'] })
  @ApiBearerAuth()
  @Post('preview-email')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async getPreview(@Body() previewDto: PreviewDto) {
    return await this.clientsService.getEmailPreview(previewDto);
  }

  // @SerializeOptions({
  //   groups: ['admin'],
  // })
  // @Get(':id/bank-info')
  // @HttpCode(HttpStatus.OK)
  // async getBankInfo(
  //   @Param('id') id: string,
  // ): Promise<NullableType<BankInfoDTO>> {
  //   return this.clientsService.getBankInfo(+id);
  // }

  // @SerializeOptions({
  //   groups: ['admin'],
  // })
  // @Patch(':id/bank-info')
  // @HttpCode(HttpStatus.OK)
  // async updateBankInfo(
  //   @Param('id') id: string,
  //   @Body() bankInfoDto: BankInfoDTO,
  // ): Promise<NullableType<any>> {
  //   const data = await this.clientsService.updateBankInfo(+id, bankInfoDto);
  //   return {
  //     message: `Client's bank data updated successfully`,
  //     data: data,
  //   };
  // }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Post('/communication')
  @HttpCode(HttpStatus.OK)
  async createCommunication(
    @Body() createCommunicationDto: CreateCommunicationDto,
    @Request() request,
  ): Promise<{ message: string; data: CommunicationResponseDto }> {
    const i18n = I18nContext.current();
    const { type, text, userId, html } = createCommunicationDto;
    const operatorId = request.user.id;

    const updatedCreateCommunicationDto = {
      ...createCommunicationDto,
      operatorId,
    };

    await this.clientsService.createCommunication(
      updatedCreateCommunicationDto,
    );
    const responseDto: CommunicationResponseDto = {
      type,
      text,
      html,
      userId,
      starred: false,
      operatorId: operatorId,
    };
    const isSuccess = i18n?.t('success.email.success');

    return {
      message: `${isSuccess}`,
      data: responseDto,
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch(':id/communication/:cid/star')
  async updateStarredStatus(
    @Param('id') userId: string,
    @Param('cid') communicationId: string,
  ): Promise<NullableType<any>> {
    const i18n = I18nContext.current();
    const updatedCommunication = await this.clientsService.updateStarredStatus(
      +userId,
      +communicationId,
    );
    const isSuccess = i18n?.t('success.client.communicationDataUpdate');
    return {
      message: isSuccess,
      data: updatedCommunication,
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':id/e-wallet')
  async getClientEWallet(@Param('id') userId: string) {
    return this.userEWalletService.findAllByUserId(+userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Post(':id/e-wallet')
  async createUserEWallet(
    @Param('id') userId: string,
    @Body() dto: CreateUserEWalletDto,
  ) {
    return this.userEWalletService.create(dto, +userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':id/credit-cards')
  async getClientCreditCard(@Param('id') userId: string) {
    return this.userCreditCardDetails.findAllByUserId(+userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Post(':id/credit-cards')
  async createUserCreditCard(
    @Param('id') userId: string,
    @Body() dto: CreateUserCreditCardDto,
  ) {
    return this.userCreditCardDetails.create(dto, +userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':userId/communication')
  @ApiQuery({
    name: 'starred',
    type: Boolean,
    required: false,
    description: 'Filter by starred status',
  })
  async getAllCommunicationsByUserId(
    @Param('userId') userId: string,
    @Query('starred') starred: string,
  ): Promise<CommunicationDto[]> {
    const isStarred = starred && starred.toLowerCase() === 'true';
    const data = await this.clientsService.getAllCommunicationsByUserId(
      +userId,
      !!isStarred,
    );
    return data;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/communication-details/:id')
  @HttpCode(HttpStatus.OK)
  async getMessage(@Param('id', ParseIntPipe) id: number): Promise<any> {
    try {
      const message = await this.clientsService.getOneMessageId(id);
      return message;
    } catch (error) {
      console.error('Error getting message:', error);
      throw error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch(':id/edit-fda')
  @HttpCode(HttpStatus.OK)
  async editFda(
    @Param('id') id: string,
    @Body() clientInfoUpdateDto: ClientFdaUpdateInfo,
    @GetUser() user: User,
  ): Promise<NullableType<ClientFdaUpdateInfo>> {
    const { adjustedFtdAmount } = clientInfoUpdateDto;
    if (!adjustedFtdAmount || adjustedFtdAmount <= 0) {
      throw new BadRequestException('FTD amount should be greater then 0');
    }
    const data = await this.clientsService.editClientInfo(
      +id,
      { adjustedFtdAmount },
      user,
    );
    return data;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch(':id/edit-info')
  @HttpCode(HttpStatus.OK)
  async updateClientInfo(
    @Param('id') id: string,
    @Body() clientInfoUpdateDto: ClientInfoUpdateDTO,
    @GetUser() user: User,
  ): Promise<NullableType<ClientInfoUpdateDTO>> {
    const data = await this.clientsService.editClientInfo(
      +id,
      clientInfoUpdateDto,
      user,
    );
    return data;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':id/edit-info')
  @HttpCode(HttpStatus.OK)
  async getClientInfo(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ClientInfoDTO> {
    return this.clientsService.getClientInfo(user, id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch(':id/settings')
  @HttpCode(HttpStatus.OK)
  async updateClientSettings(
    @Param('id') id: number,
    @Body() updateDto: ClientSettingDto,
  ): Promise<string> {
    return await this.adminClientService.updateClientOne(id, updateDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':id/settings')
  @HttpCode(HttpStatus.OK)
  async getClientSettings(
    @Param('id') id: number,
  ): Promise<ClientSettingDto | null> {
    return await this.adminClientService.getClientsToggle(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch(':id/wallet')
  @HttpCode(HttpStatus.OK)
  async getUserWallet(@Param('id') id: number): Promise<any> {
    return await this.walletService.findAllByUserId(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get('accounts-data/:id')
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'accountId', required: false })
  async getMt5AccountsData(
    @Param('id') userId: string,
    @Query('accountId') accountId?: string,
  ) {
    return this.mt5ClientService.getClientAccountSummary(+userId, accountId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':id/accounts-list')
  @HttpCode(HttpStatus.OK)
  async getUserAccountsList(@Param('id') id: number) {
    return this.adminClientService.getUserAccountsList(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Post(':id/create-account')
  @HttpCode(HttpStatus.OK)
  async createAccount(
    @Param('id') id: number,
    @Body() createAccountDto: CreateAccountDto,
    @GetUser() user: User,
  ) {
    return this.adminClientService.createAccount(
      id,
      createAccountDto,
      true,
      user,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch(':id/kyc-info')
  @HttpCode(HttpStatus.OK)
  async updateClientKycInfo(
    @Param('id') id: string,
    @Body() kycInfoDto: AllKycInfoDto,
    @Request() Req: any,
  ): Promise<NullableType<any>> {
    try {
      const operatorId = Req.user.id;
      return this.clientsService.updateClientKycInfo(
        +id,
        kycInfoDto,
        +operatorId,
      );
    } catch (error) {
      throw error;
    }
    // return {
    //   message: `Client's kyc data updated successfully`,
    //   data: data,
    // };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':id/stats-data')
  @HttpCode(HttpStatus.OK)
  async getStatsData(@Param('id') userId: string) {
    return this.clientsService.getStatsSummary(+userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch(':id/user-documents/:kid')
  @HttpCode(HttpStatus.OK)
  async updateClientMultipleKycInfo(
    @Param('id') id: string,
    @Param('kid') user_kyc_id: string,
    @Body() kycInfoDto: KycInfoDto,
    @Request() Req: any,
  ): Promise<NullableType<any>> {
    const approverId = Req.user.id;

    const data = await this.userKycDocumentsService.updateClientKycInfo(
      +id,
      +user_kyc_id,
      kycInfoDto,
      +approverId,
    );
    return {
      message: `Client's kyc data updated successfully`,
      data: data,
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':id/all-accounts')
  @HttpCode(HttpStatus.OK)
  async getAllAccounts(@Param() param: ParamsTradingInfoDto) {
    try {
      const { live, demo } = await this.mt5ClientService.getAllAccountsByUserId(
        param.id,
      );
      const mt5Accounts = await this.mt5AccountRepository.find({
        where: { user: { id: param.id } },
      });
      const wallets = await this.walletService.findAllByUserId(param.id);

      return {
        wallets,
        live: live.map((account) => {
          return {
            ...account,
            id: mt5Accounts.find((a) => a.login == account.login)?.id,
            tradingType: mt5Accounts.find((a) => a.login == account.login)
              ?.tradingType,
            // group: '**********',
          };
        }),
        demo: demo.map((account) => {
          return {
            ...account,
            id: mt5Accounts.find((a) => a.login == account.login)?.id,
            tradingType: mt5Accounts.find((a) => a.login == account.login)
              ?.tradingType,
            // group: '**********',
          };
        }),
      };
    } catch (error) {
      console.error('Error fetching accounts and wallet: ', error);
      if (
        error instanceof InternalServerErrorException ||
        error instanceof Error
      )
        throw new InternalServerErrorException(
          'Error fetching accounts and wallet',
        );

      throw error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':id/agreements')
  @HttpCode(HttpStatus.OK)
  async getAllAgreementsByUserId(@Param('id') id: number): Promise<any> {
    return this.clientsService.getAllAgreementsByUserId(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':login/get-trading-rights')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get trading account rights' })
  @ApiResponse({
    description: 'Gets the specified rights of the trading account.',
  })
  async getTradingRights(
    @Param() params: UpdateAccountRequestParams,
  ): Promise<any> {
    return this.mt5AccountService.getAccountRights(params);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Put(':login/update-trading-rights')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update trading account rights' })
  @ApiResponse({
    description: 'Updates the specified rights of the trading account.',
  })
  async updateTradingRights(
    @Param() params: UpdateAccountRequestParams,
    @Body() dto: UpdateAccountRightsRequest,
    @GetUser() user: User,
  ): Promise<any> {
    return this.mt5AccountService.updateAccountRights(dto, params.login, user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':login/trading-info')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get trading info' })
  @ApiResponse({
    description: 'Gets trading info of the selected trading account.',
  })
  async getTradingInfo(
    @Param() params: UpdateAccountRequestParams,
  ): Promise<any> {
    return this.adminClientService.getTradingInfo(params);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Post('/trading-account/:login/change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change trading account password' })
  @ApiResponse({
    description: 'Change password of the selected trading account.',
  })
  async changeTradingAccountPassword(
    @Param() params: UpdateAccountRequestParams,
    @Body() dto: ChangePasswordFromAdminDto,
    @GetUser() user: User,
  ): Promise<any> {
    try {
      if (dto.Password !== dto.ConfirmPassword)
        throw new BadRequestException('Passwords do not match');
      return this.mt5AccountService.changePassword(
        { ...dto, Login: params.login, CurrentPassword: '' },
        'admin',
        user,
      );
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':login/deals')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get deals' })
  @ApiResponse({
    description: 'Gets closed deals of the selected trading account.',
  })
  async getDeals(
    @Query() query: GetPositionsQueryDto,
    @Param() params: UpdateAccountRequestParams,
  ): Promise<any> {
    const i18n = I18nContext.current();
    const { page = 1, from, to } = query;
    let limit = query?.limit ?? 1000;

    if (from && to && from > to) {
      throw new Error("The 'from' date must be before the 'to' date.");
    }

    const account = await this.mt5AccountRepository.findOne({
      where: { login: params.login },
      relations: ['user'],
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const { info: jsonData, total } = await this.tradingService.get({
      paginationOptions: { page, limit },
      accountId: params.login,
      trade: 'closed',
      user: account?.user,
      from,
      to,
    });

    const { data, hasNextPage } = infinityPagination(jsonData, { page, limit });

    // const deals = await this.mt5DealService.getDealPaged({
    //   login: params.login,
    //   from,
    //   to,
    // } as DealPagedDto);

    // const startIndex = (page - 1) * limit;
    // const endIndex = startIndex + limit;
    // const paginatedDeals = deals?.result?.slice(startIndex, endIndex);

    // const { data, hasNextPage } = infinityPagination(paginatedDeals, {
    //   page,
    //   limit,
    // });

    const isSuccess = i18n?.t('success.client.dealsFetched');

    return {
      status: 0,
      statusCode: HttpStatus.OK,
      message: isSuccess,
      result: {
        data,
        hasNextPage,
        total,
      },
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':login/positions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Postions' })
  @ApiResponse({
    description: 'Gets open postions of the selected trading account.',
  })
  async getPostions(
    @Query() query: GetPositionsQueryDto,
    @Param() params: UpdateAccountRequestParams,
  ): Promise<any> {
    const i18n = I18nContext.current();
    const { page = 1, from, to } = query;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    if (from && to && from > to) {
      throw new Error("The 'from' date must be before the 'to' date.");
    }

    const account = await this.mt5AccountRepository.findOne({
      where: { login: params.login },
      relations: ['user'],
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const { info: jsonData, total } = await this.tradingService.get({
      paginationOptions: { page, limit },
      accountId: params.login,
      trade: 'open',
      user: account?.user,
      from,
      to,
    });

    const { data, hasNextPage } = infinityPagination(jsonData, {
      page,
      limit,
    });

    // const postions = await this.mt5PositionService.getPositionPaged({
    //   login: params.login,
    //   from,
    //   to,
    // } as PositionPagedDto);

    // const startIndex = (page - 1) * limit;
    // const endIndex = startIndex + limit;
    // const paginatedPositions = postions?.result?.slice(startIndex, endIndex);

    // const { data, hasNextPage } = infinityPagination(paginatedPositions, {
    //   page,
    //   limit,
    // });

    const isSuccess = i18n?.t('success.client.positionsFetched');

    return {
      status: 0,
      statusCode: HttpStatus.OK,
      message: isSuccess,
      result: {
        data,
        hasNextPage,
        total,
      },
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Post('notes')
  @HttpCode(HttpStatus.OK)
  async createNotes(
    @Body() createKycNoteDto: CreateKycNoteDto,
    @Req() req: any,
  ): Promise<any> {
    try {
      const i18n = I18nContext.current();
      const createdBy = req.user.id;
      await this.adminKycService.createNote(createKycNoteDto, createdBy);
      const isSuccess = i18n?.t('success.client.noteCreated');
      return { success: true, message: isSuccess };
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Put(':id/block-unblock')
  @HttpCode(HttpStatus.OK)
  async blockUnblockUser(@Param('id') id: number, @GetUser() user: User): Promise<any> {
    try {
      await this.adminClientService.blockUnblockUser(id, user);
      return { success: true, message: 'Data updated successfully' };
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Put(':id/toggle-pending-withdrawal')
  @HttpCode(HttpStatus.OK)
  async togglePendingWithdrawalVisibility(
    @Param('id') id: number,
  ): Promise<any> {
    try {
      const success =
        await this.adminClientService.togglePendingWithdrawalVisibility(id);
      return {
        success,
        message: `Update ${success ? 'successfully' : 'failed'}`,
      };
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Post(':id/force-logout')
  @HttpCode(HttpStatus.OK)
  async forceLogout(@Param('id', ParseIntPipe) id: number): Promise<any> {
    try {
      await this.adminClientService.forceLogout(id);
      return { success: true, message: 'Data updated successfully' };
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch('notes/:id')
  @HttpCode(HttpStatus.OK)
  async updateNote(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateKycNoteDto: UpdateKycNoteDto,
    @Req() req: any,
  ): Promise<any> {
    const i18n = I18nContext.current();
    const createdBy = req.user.id;
    await this.adminKycService.updateKycNote(id, updateKycNoteDto, createdBy);
    const isSuccess = i18n?.t('success.client.noteUpdated');
    return { success: true, message: isSuccess };
  }

  // @SerializeOptions({
  //   groups: ['admin'],
  // })
  // @Get(':id/notes')
  // async getKycNotes(
  //   @Param('id') id: number,
  //   @Query() getKycNotesDto: GetKycNotesDto,
  // ): Promise<notes[]> {
  //   let data;
  //   if (getKycNotesDto.documentId !== undefined) {
  //     data = await this.adminKycService.getKycNotes(
  //       id,
  //       getKycNotesDto.type,
  //       getKycNotesDto.documentId,
  //     );
  //   } else {
  //     data = await this.adminKycService.getKycNotes(id, getKycNotesDto.type);
  //   }
  //   return data;
  // }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':id/notes')
  async getKycNotes(
    @Param('id') id: number,
    @Query() getKycNotesDto: GetKycNotesDto,
    @Query() paginationDto: PaginationDto,
  ): Promise<notes[]> {
    const { page, limit } = paginationDto;
    const documentId = getKycNotesDto.documentId;
    const type = getKycNotesDto.type;
    const paginationOptions = paginationDto ? { page, limit } : undefined;

    const data = await this.adminKycService.getKycNotes(
      id,
      type,
      documentId,
      getKycNotesDto?.ticketId,
      paginationOptions,
    );

    return data;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get('/notes/:id')
  async getSingleKycNote(@Param('id') id: number): Promise<any> {
    return await this.adminKycService.getSingleNote(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get('account-wallet/:id')
  async getAccountWallet(@Param('id') id: number) {
    return await this.adminClientService.getAccountWallet(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Delete('notes/:id')
  async softDeleteKycNote(
    @Param('id') id: number,
    @Req() req: any,
  ): Promise<any> {
    const i18n = I18nContext.current();
    const userId = req?.user?.id;
    await this.adminKycService.softDeleteKycNote(id, userId);
    const isSuccess = i18n?.t('success.client.noteDeleted');
    return { success: true, message: isSuccess };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch('/:userId/answers')
  @HttpCode(HttpStatus.OK)
  async ansUpdate(
    @Body() body: UpdateClientAnswersDto,
    @Param('userId') userId: string,
    @Request() req: any,
  ) {
    const session_user = req?.user?.id;
    return this.clientsService.updateClientAnswers(+userId, body, session_user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Post('/:userId/create-trading-account')
  @HttpCode(HttpStatus.OK)
  async createTradingAccount(
    @Body() createAccountDto: CreateAccountRequest,
    @Param('userId') userId: string,
    @GetUser() operatorUser: User,
  ) {
    const user = await this.clientsService.findOne({ id: +userId });
    if (!user) throw new NotFoundException('User not found');
    switch (createAccountDto.Server.toLowerCase()) {
      case 'mt5-live':
        return this.mt5AccountService.createAccount(
          {
            ...createAccountDto,
            Server: ServerName.LIVE,
          },
          user,
          true,
          operatorUser,
        );
      case 'mt5-demo':
        return this.mt5AccountService.createDemoAccount(
          {
            ...createAccountDto,
            Server: ServerName.DEMO,
          },
          user,
          true,
          operatorUser,
        );
      default:
        throw new NotFoundException('Server not found');
    }
  }

  @Post('communication/sendgrid/webhook')
  @HttpCode(HttpStatus.OK)
  async createWebhookCommunication(
    @Body() createWebhookCommunication: any,
  ): Promise<any> {
    const i18n = I18nContext.current();
    console.log('createWebhookCommunication: ', createWebhookCommunication);
    await this.clientsService.updateMessageRead(createWebhookCommunication);
    const isSuccess = i18n?.t('success.client.webhookCreated');
    return { success: true, message: isSuccess };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Post('/block-accounts/:id')
  @HttpCode(HttpStatus.OK)
  async updateAccountStatus(
    @Param('id') id: number,
    @GetUser() user: User,
  ): Promise<any> {
      const mt5Accounts = await this.mt5AccountRepository.find({
        where: { user: { id } },
      });
      if (mt5Accounts.length > 0) {
        for (const account of mt5Accounts) {
          await this.mt5AccountService.updateAccountRights({allowTrade : false}, account?.login, user);
        }
        return { success: true, message: 'Data updated successfully' };
      }
      return { success: false, message: 'No accounts found' };
  }


  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Post('/mt5-creation/:id')
  @HttpCode(HttpStatus.OK)
  async updateAccountCreation(
    @Param('id') id: number,
    @GetUser() user: User,
  ): Promise<any> {
    try {
      await this.adminClientService.mt5Creation(id, user);
      return { success: true, message: 'Data updated successfully' };
    } catch (error) {
      throw error;
    }
  }
}
