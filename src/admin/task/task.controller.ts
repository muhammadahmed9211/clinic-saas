import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';
import { ResponseWrapper } from 'src/utils/interface/mt5/base-response.interface';
import { Status } from 'src/utils/enums/mt5/response-status.enum';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { PaginationDto } from 'src/database/base-repository/dto/pagination.dto';
import { REMINDER_TIMES } from 'src/constants/reminder-times';

export enum RelatedTo {
  CLIENT = 1,
  TRANSACTION = 2,
  DEAL = 3,
  DEPOSIT = 4,
  RE_DEPOSIT = 5,
  COMPLAIN = 6,
  NEW_OPPORTUNITY = 7,
  PERSONAL = 8,
  PROTECTING = 9,
  NEGOTIATIONS = 10,
}

export const RelatedToData = [
  { id: RelatedTo.CLIENT, name: 'client' },
  { id: RelatedTo.TRANSACTION, name: 'transaction' },
  { id: RelatedTo.DEAL, name: 'deal' },
  { id: RelatedTo.DEPOSIT, name: 'deposit' },
  { id: RelatedTo.RE_DEPOSIT, name: 're-deposit' },
  { id: RelatedTo.COMPLAIN, name: 'complain' },
  { id: RelatedTo.NEW_OPPORTUNITY, name: 'new opportunity' },
  { id: RelatedTo.PERSONAL, name: 'personal' },
  { id: RelatedTo.PROTECTING, name: 'protecting' },
  { id: RelatedTo.NEGOTIATIONS, name: 'negotiations' },
];

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Admin Task')
@Controller({
  path: 'admin/task',
  version: '1',
})
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
    return this.taskService.create(createTaskDto, user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('list')
  findAll(
    @GetUser() user: User,
    @Body() body: ApplyListFilterSortColumnDto,
    @Query() query: PaginationDto & { open?: string },
  ) {
    return this.taskService.findByUser(user, body, query);
  }

  @HttpCode(HttpStatus.OK)
  @Post('list/completed')
  findAllCompleted(
    @GetUser() user: User,
    @Body() body: ApplyListFilterSortColumnDto,
    @Query() query: PaginationDto,
  ) {
    return this.taskService.findByUser(user, body, query, true);
  }

  @Get('related-to')
  findAllEntities() {
    return ResponseWrapper.wrap({
      status: Status.SUCCESS,
      statusCode: HttpStatus.OK,
      statusText: 'Entites Fetched Successfully',
      data: RelatedToData,
    });
  }

  @Get('related-to/:id/details')
  findEntityDetails(@Param('id') id: number) {
    const entity = [
      [],
      [
        {
          userId: 1040,
          firstName: 'Clarian',
          lastName: 'Clark',
          groupString: null,
          email: 'test90@example.com',
          telephone: '3172185928',
          telephonePrefix: '92',
          id2: null,
          fullAddress: 'Example Dubai',
          poBox: null,
          city: null,
          state: null,
          zip: null,
          kycNote: 'KYC approved',
          dateOfBirth: null,
          telephoneValid: null,
          affid: '7113434120',
          question2: '{}',
          agreementData: '{}',
          userSignature: null,
          mobile: null,
          questionAnswers: null,
        },
        {
          userId: 1057,
          firstName: 'John',
          lastName: 'Doe',
          groupString: null,
          email: 'tesdfasdfsadfasdt1@example.com',
          telephone: '3222152033',
          telephonePrefix: '92',
          id2: null,
          fullAddress: null,
          poBox: null,
          city: null,
          state: null,
          zip: null,
          kycNote: null,
          dateOfBirth: null,
          telephoneValid: null,
          affid: '7113434120',
          question2: '{}',
          agreementData: '{}',
          userSignature: null,
          mobile: null,
          questionAnswers: null,
        },
        {
          userId: 1063,
          firstName: 'Maaz',
          lastName: 'Hassan',
          groupString: null,
          email: 'maaz@mailinator.com',
          telephone: '3222152033',
          telephonePrefix: '92',
          id2: null,
          fullAddress: null,
          poBox: null,
          city: null,
          state: null,
          zip: null,
          kycNote: 'Please update this document',
          dateOfBirth: null,
          telephoneValid: null,
          affid: '7113434120',
          question2: '{}',
          agreementData: '{}',
          userSignature: null,
          mobile: null,
          questionAnswers: null,
        },
        {
          userId: 1070,
          firstName: 'John',
          lastName: 'Doe',
          groupString: 'string',
          email: 'mohtashim.m@malinator.com',
          telephone: '234567891',
          telephonePrefix: '+971',
          id2: 'string',
          fullAddress: null,
          poBox: 'string',
          city: 'Dubai',
          state: '00000',
          zip: 'string',
          kycNote: 'Please update this document',
          dateOfBirth: '2024-03-14T01:40:19.000Z',
          telephoneValid: 1,
          affid: '7252241876',
          question2:
            '[{"Qid":100,"questionText":"What is your gender?","answer":[{"Aid":500,"answerText":"male"}]}]',
          agreementData: '[{"Aid":100,"amswerText":"What is your gender?"}]',
          userSignature: 'dummy text',
          mobile: '+971 55 145 4388',
          questionAnswers: 'string',
        },
      ],
      [
        {
          currency: 'ETH',
          country: 'N/A',
          status: 'APPROVED',
          createdAt: '2024-04-17T03:28:45.680Z',
          updatedAt: '2024-04-17T03:33:05.890Z',
          userId: 1141,
          lastStatus: null,
          referenceKey: null,
          hash: 'N/A',
          referenceKeyName: null,
          id: '4024433E-F36B-1410-8F7A-001268AAE5F5',
          amount: 100.0,
          walletId: 76,
          type: 'DEPOSIT',
          withdrawRequestId: null,
          externalTransactionId: 'externalTransactionId123',
          commentForUser: 'Comment for user',
          internalComment: 'This is an internal comment',
          workflowStatus: 'NEW',
          priority: 'LOW',
          kycStatus: 'NONE',
          fee: 0.0,
          internalDeclineReason: 'Reason for internal decline',
          pspNameManual: 'Manual PSP Name',
          acquisitionStatus: 'Acquisition status',
        },
        {
          currency: 'USDT',
          country: 'N/A',
          status: 'APPROVED',
          createdAt: '2024-04-17T04:14:56.090Z',
          updatedAt: '2024-04-17T04:15:40.987Z',
          userId: 1143,
          lastStatus: null,
          referenceKey: null,
          hash: 'N/A',
          referenceKeyName: null,
          id: '4124433E-F36B-1410-8F7A-001268AAE5F5',
          amount: 1000.0,
          walletId: 78,
          type: 'DEPOSIT',
          withdrawRequestId: null,
          externalTransactionId: 'externalTransactionId123',
          commentForUser: 'Comment for user',
          internalComment: 'This is an internal comment',
          workflowStatus: 'NEW',
          priority: 'LOW',
          kycStatus: 'NONE',
          fee: 0.0,
          internalDeclineReason: 'Reason for internal decline',
          pspNameManual: 'Manual PSP Name',
          acquisitionStatus: 'Acquisition status',
        },
        {
          currency: 'USD',
          country: 'N/A',
          status: 'APPROVED',
          createdAt: '2024-04-17T04:20:22.153Z',
          updatedAt: '2024-04-17T04:23:39.683Z',
          userId: 1143,
          lastStatus: null,
          referenceKey: null,
          hash: 'N/A',
          referenceKeyName: null,
          id: '4C24433E-F36B-1410-8F7A-001268AAE5F5',
          amount: 10.0,
          walletId: 78,
          type: 'WITHDRAW',
          withdrawRequestId: 80,
          externalTransactionId: null,
          commentForUser: null,
          internalComment: null,
          workflowStatus: 'NEW',
          priority: 'MEDIUM',
          kycStatus: 'NONE',
          fee: 0.0,
          internalDeclineReason: null,
          pspNameManual: null,
          acquisitionStatus: null,
        },
        {
          currency: 'ETH',
          country: 'N/A',
          status: 'APPROVED',
          createdAt: '2024-04-17T06:07:15.013Z',
          updatedAt: '2024-04-17T06:09:17.493Z',
          userId: 1143,
          lastStatus: null,
          referenceKey: null,
          hash: 'N/A',
          referenceKeyName: null,
          id: '5724433E-F36B-1410-8F7A-001268AAE5F5',
          amount: 1000.0,
          walletId: 78,
          type: 'DEPOSIT',
          withdrawRequestId: null,
          externalTransactionId: null,
          commentForUser: null,
          internalComment: null,
          workflowStatus: 'NEW',
          priority: 'MEDIUM',
          kycStatus: 'NONE',
          fee: 0.0,
          internalDeclineReason: null,
          pspNameManual: null,
          acquisitionStatus: null,
        },
      ],
      [
        {
          Deal: 4,
          Timestamp: '133516864917096729',
          ExternalID: ' ',
          Login: 1005,
          Dealer: 0,
          Order: 0,
          Action: 2,
          Entry: 0,
          Reason: 2,
          Digits: 2,
          DigitsCurrency: 2,
          ContractSize: 0.0,
          Time: '2024-02-06T05:48:11.000Z',
          TimeMsc: '2024-02-06T05:48:11.709Z',
          Symbol: ' ',
          Price: 0.0,
          VolumeExt: 0,
          Profit: 100000.0,
          Storage: 0.0,
          Commission: 0.0,
          Fee: 0.0,
          RateProfit: 0.0,
          RateMargin: 0.0,
          ExpertID: 0,
          PositionID: 0,
          Comment: 'balance',
          ProfitRaw: 0.0,
          PricePosition: 0.0,
          PriceSL: 0.0,
          PriceTP: 0.0,
          VolumeClosedExt: 0,
          TickValue: 0.0,
          TickSize: 0.0,
          Flags: 0,
          Value: 0.0,
          Gateway: ' ',
          PriceGateway: 0.0,
          ModifyFlags: 0,
          MarketBid: 0.0,
          MarketAsk: 0.0,
          MarketLast: 0.0,
          Volume: 0,
          VolumeClosed: 0,
          ApiData: '[]',
        },
        {
          Deal: 5,
          Timestamp: '133517050405902597',
          ExternalID: ' ',
          Login: 1013,
          Dealer: 0,
          Order: 0,
          Action: 2,
          Entry: 0,
          Reason: 2,
          Digits: 2,
          DigitsCurrency: 2,
          ContractSize: 0.0,
          Time: '2024-02-06T10:57:20.000Z',
          TimeMsc: '2024-02-06T10:57:20.590Z',
          Symbol: ' ',
          Price: 0.0,
          VolumeExt: 0,
          Profit: 100000.0,
          Storage: 0.0,
          Commission: 0.0,
          Fee: 0.0,
          RateProfit: 0.0,
          RateMargin: 0.0,
          ExpertID: 0,
          PositionID: 0,
          Comment: 'balance',
          ProfitRaw: 0.0,
          PricePosition: 0.0,
          PriceSL: 0.0,
          PriceTP: 0.0,
          VolumeClosedExt: 0,
          TickValue: 0.0,
          TickSize: 0.0,
          Flags: 0,
          Value: 0.0,
          Gateway: ' ',
          PriceGateway: 0.0,
          ModifyFlags: 0,
          MarketBid: 0.0,
          MarketAsk: 0.0,
          MarketLast: 0.0,
          Volume: 0,
          VolumeClosed: 0,
          ApiData: '[]',
        },
        {
          Deal: 6,
          Timestamp: '133517332930757746',
          ExternalID: ' ',
          Login: 1014,
          Dealer: 0,
          Order: 0,
          Action: 2,
          Entry: 0,
          Reason: 2,
          Digits: 2,
          DigitsCurrency: 2,
          ContractSize: 0.0,
          Time: '2024-02-06T18:48:13.000Z',
          TimeMsc: '2024-02-06T18:48:13.075Z',
          Symbol: ' ',
          Price: 0.0,
          VolumeExt: 0,
          Profit: 100000.0,
          Storage: 0.0,
          Commission: 0.0,
          Fee: 0.0,
          RateProfit: 0.0,
          RateMargin: 0.0,
          ExpertID: 0,
          PositionID: 0,
          Comment: 'balance',
          ProfitRaw: 0.0,
          PricePosition: 0.0,
          PriceSL: 0.0,
          PriceTP: 0.0,
          VolumeClosedExt: 0,
          TickValue: 0.0,
          TickSize: 0.0,
          Flags: 0,
          Value: 0.0,
          Gateway: ' ',
          PriceGateway: 0.0,
          ModifyFlags: 0,
          MarketBid: 0.0,
          MarketAsk: 0.0,
          MarketLast: 0.0,
          Volume: 0,
          VolumeClosed: 0,
          ApiData: '[]',
        },
        {
          Deal: 7,
          Timestamp: '133517841241384495',
          ExternalID: ' ',
          Login: 1022,
          Dealer: 0,
          Order: 0,
          Action: 4,
          Entry: 0,
          Reason: 2,
          Digits: 2,
          DigitsCurrency: 2,
          ContractSize: 0.0,
          Time: '2024-02-07T08:55:24.000Z',
          TimeMsc: '2024-02-07T08:55:24.138Z',
          Symbol: ' ',
          Price: 0.0,
          VolumeExt: 0,
          Profit: 1.0,
          Storage: 0.0,
          Commission: 0.0,
          Fee: 0.0,
          RateProfit: 0.0,
          RateMargin: 0.0,
          ExpertID: 0,
          PositionID: 0,
          Comment: 'test',
          ProfitRaw: 0.0,
          PricePosition: 0.0,
          PriceSL: 0.0,
          PriceTP: 0.0,
          VolumeClosedExt: 0,
          TickValue: 0.0,
          TickSize: 0.0,
          Flags: 0,
          Value: 0.0,
          Gateway: ' ',
          PriceGateway: 0.0,
          ModifyFlags: 0,
          MarketBid: 0.0,
          MarketAsk: 0.0,
          MarketLast: 0.0,
          Volume: 0,
          VolumeClosed: 0,
          ApiData: '[]',
        },
      ],
    ];

    return ResponseWrapper.wrap({
      status: Status.SUCCESS,
      statusCode: HttpStatus.OK,
      statusText: 'Entites Fetched Successfully',
      data: entity[id],
    });
  }

  @Get('status-list')
  findAllStatuses() {
    return this.taskService.findAllStatuses();
  }

  @Get('task-summary')
  getTaskSummary(@GetUser() user: User) {
    return this.taskService.taskSumary(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @GetUser() user: User) {
    return this.taskService.update(+id, updateTaskDto, user.id);
  }

  @Patch(':id/mark-as-completed')
  async markAsCompleted(@Param('id') id: string) {
    return this.taskService.markComplete(+id);
  }

  @Patch(':id/mark-as-incomplete')
  async unMarkComplete(@Param('id') id: string) {
    return this.taskService.unmarkComplete(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.taskService.remove(+id, user);
  }

  @Get('reminder/times')
  getReminderTimes() {
    return ResponseWrapper.wrap({
      status: Status.SUCCESS,
      statusCode: HttpStatus.OK,
      statusText: 'Reminder Times Fetched Successfully',
      data: REMINDER_TIMES,
    });
  }
}
