import {
  Controller,
  Get,
  UseGuards,
  HttpStatus,
  HttpCode,
  SerializeOptions,
  Param,
  Body,
  Post,
  BadRequestException,
  Patch,
  Query,
  Delete
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TransactionService } from 'src/transaction/transaction.service';
import { CreateManualTransactionDto } from 'src/transaction/dto/create-manual-transaction.dto';
import { CreateTransferDto } from 'src/transaction/dto/create-transfer.dto';
import { CreateWithdraw } from 'src/transaction/dto/create-withdraw.dto';
import { WithdrawType } from 'src/transaction/entities/withdraw-request.entity';
import {
  UpdateTransactionDto,
  UpdateTransactionParamDto,
} from 'src/transaction/dto/update-transcation.dto';
import { GetTransaction } from 'src/transaction/dto/get-transaction';
import { AdvanceSearchDto } from 'src/database/base-repository/dto/advance-search.dto';
import { PaginationDto } from 'src/database/base-repository/dto/pagination.dto';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';
import { TransactionType } from 'src/transaction/entities/transaction.entity';
import {
  CreateTransactionNote,
  UpdateTransactionNote,
} from 'src/transaction/dto/create-transaction-note.dto';
import { CreateAdjustmentDto } from 'src/transaction/dto/create-adjustment.dto';
import { WhitelistPipe } from 'src/common/decorators/event-pattern-with-prefix';
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Admin Transactions')
@Controller({
  path: 'admin/client',
  version: '1',
})
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get('transaction/crypto-coins')
  @HttpCode(HttpStatus.OK)
  getCoinsList() {
    return this.transactionService.getCryptoCoinsList();
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post('transaction/list')
  @HttpCode(HttpStatus.OK)
  findAllWithFilters(
    @Query() pagination: PaginationDto,
    @Body() body: ApplyListFilterSortColumnDto,
    @GetUser() user: User,
  ) {
    const { limit = 50, page = 1 } = pagination || {};
    return this.transactionService.findAllWithFilters(
      limit,
      page,
      body,
      user.id,
    );
  }


  @SerializeOptions({
    groups: ['admin'],
  })
  @Post(':id/transaction/list')
  @HttpCode(HttpStatus.OK)
  findClientWithFilters(
    @Query() pagination: PaginationDto,
    @Body() body: ApplyListFilterSortColumnDto,
    @GetUser() user: User,
    @Param('id') clientUserId:string
  ) {
    const dto = {
      filters : body.filters,
      sort : body.sort,
      listViewId:body?.listViewId
    };
    if(isNaN(Number(clientUserId))){
      throw new BadRequestException("Invalid Client Id")
    };

    const { limit = 10, page = 1 } = pagination || {};
    return this.transactionService.findAllWithFilters(
      limit,
      page,
      dto,
      user.id,
      Number(clientUserId)
    );
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post('transaction/list/exports')
  @HttpCode(HttpStatus.OK)
  findAllWithFiltersForExport(
    @Query() pagination: PaginationDto,
    @Body() body: ApplyListFilterSortColumnDto,
    @GetUser() user: User,
  ) {
    const { limit = 50, page = 1 } = pagination || {};

    const response = {
      message:
        'Request submitted successfully. You will receive exported data on your email shortly.',
    };

    setTimeout(async () => {
      await this.transactionService.findAllWithFiltersForExport(
        limit,
        page,
        body,
        user.id,
      );
    }, 0);

    return response;
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get('transaction/psp')
  @HttpCode(HttpStatus.OK)
  getPspList() {
    return this.transactionService.getPspList();
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get('transaction/:id')
  @HttpCode(HttpStatus.OK)
  async getById(@Param() param: GetTransaction, @GetUser() user: User) {
    const transaction = await this.transactionService.getById(param.id, undefined, true, user.id);
    await this.transactionService.isTransactionUserAllowedToOperator(transaction.user.id , user.id)
    return transaction
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post(':id/transaction/deposit')
  @HttpCode(HttpStatus.OK)
  async deposit(
    @Param('id') userId: string,
    @Body(WhitelistPipe) dto: CreateManualTransactionDto,
    @GetUser() user: User,
  ) {
    await this.transactionService.isTransactionUserAllowedToOperator(+userId, user.id)
    return this.transactionService.createManualTransaction(dto, +userId, user);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post(':id/transaction/transfer')
  @HttpCode(HttpStatus.OK)
  async transfer(
    @Param('id') userId: string,
    @Body(WhitelistPipe) dto: CreateTransferDto,
    @GetUser() user: User,
  ) {
    if (!dto.internalComment) {
      throw new BadRequestException('Internal comment is required');
    }
    await this.transactionService.isTransactionUserAllowedToOperator(+userId, user.id)
    return this.transactionService.transfer(dto, user, userId);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post(':id/transaction/adjustment')
  @HttpCode(HttpStatus.OK)
  async adjustment(
    @Param('id') userId: string,
    @Body(WhitelistPipe) dto: CreateAdjustmentDto,
    @GetUser() user: User,
  ) {
    if (!dto.internalComment) {
      throw new BadRequestException('Internal comment is required');
    }
    await this.transactionService.isTransactionUserAllowedToOperator(+userId, user.id)
    return this.transactionService.adjustment(dto, user, userId);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post(':id/transaction/withdrawal')
  @HttpCode(HttpStatus.OK)
  async withdrawal(
    @Param('id') userId: string,
    @Body(WhitelistPipe) dto: CreateWithdraw,
    @GetUser() user: User,
  ) {
    this.transactionService.isAmountInRange(
      dto.amount,
      TransactionType.WITHDRAW,
      true,
    );
    await this.transactionService.isTransactionUserAllowedToOperator(+userId, user.id)
    const wireDetails = {
      userBankId: dto.userBankId,
      companyBankId: dto.companyBankId,
    };
    const cryptoDetails = {
      cryptoHashReference: dto.cryptoHashReference,
      cryptoClientWalletAddress: dto.cryptoClientWalletAddress,
      cryptoCoinName: dto.cryptoCoinName,
      paidCryptoCoin: dto.paidCryptoCoin,
      network: dto.network,
    };

    const { amount, isApproved, login, walletId, subType, method } = dto;
    const payload = {
      pspTransactionId: dto?.pspTransactionId,
      internalReferenceNo: dto?.internalReferenceNo,
      evidenceId: dto?.evidenceId,
      pspId: dto.pspId,
      tradingPlatformId: dto.tradingPlatformId,
      transactionNote: dto.transactionNote,
      internalNote: dto.internalNote,
      internalComment: dto?.internalComment,
      commentForUser: dto?.commentForUser,
      brokerExternalId: dto?.brokerExternalId,
      pspAccountNo: dto?.pspAccountNo,
      externalNote: dto?.externalNote,
      creditCardDetailsId: dto.creditCardDetailsId,
      userEWalletId: dto.userEWalletId,
      ...cryptoDetails,
      ...wireDetails,
    };

    return this.transactionService.createWithdrawRequest(
      {
        ...dto,
        payload,
        amount,
        type: WithdrawType.NONE,
        login: login,
        walletId: walletId,
      },
      user,
      true,
      isApproved,
      subType,
      method,
      userId,
    );
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch('transaction/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param() params: UpdateTransactionParamDto,
    @Body(WhitelistPipe) dto: UpdateTransactionDto,
    @GetUser() user: User,
  ) {
    const isExist = await this.transactionService.getById(params.id);
    await this.transactionService.isTransactionUserAllowedToOperator(isExist.user.id, user.id)
    const resp = await this.transactionService.update(dto, params.id, user.id);
    this.transactionService.emitOnUpdate(isExist, resp, user);
    return resp;
  }
  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch('transaction/:id/approve')
  @HttpCode(HttpStatus.OK)
  async approve(
    @Param() params: UpdateTransactionParamDto,
    @Body(WhitelistPipe) dto: UpdateTransactionDto,
    @GetUser() user: User,
  ) {
    return this.transactionService.approveManualTransaction(
      params.id,
      dto,
      user,
      true
    );
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch('transaction/:id/reject')
  @HttpCode(HttpStatus.OK)
  async reject(
    @Param() params: UpdateTransactionParamDto,
    @Body(WhitelistPipe) dto: UpdateTransactionDto,
    @GetUser() user: User,
  ) {
    const result = await this.transactionService.rejectTransaction(
      params.id,
      dto,
      user,
      true
    );
    return result;
  }


  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch('transaction/:id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancel(
    @Param() params: UpdateTransactionParamDto,
    @Body(WhitelistPipe) dto: UpdateTransactionDto,
    @GetUser() user: User,
  ) {
    const result = await this.transactionService.cancelWithdraw(
      params.id,
      user,
      true
    );
    return result;
  }


  @SerializeOptions({
    groups: ['admin'],
  })
  @Post('transaction/:id/note')
  @HttpCode(HttpStatus.OK)
  async addNote(
    @Param('id') transactionId: string,
    @Body(WhitelistPipe) dto: CreateTransactionNote,
    @GetUser() user: User,
  ) {
    return this.transactionService.createNote(transactionId, user, dto);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get('transaction/:id/note')
  @HttpCode(HttpStatus.OK)
  async getNotes(@Param('id') transactionId: string, @GetUser() user: User) {
    return this.transactionService.getNotes(transactionId, user.id);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get('transaction/note/:id')
  @HttpCode(HttpStatus.OK)
  async getNote(@Param('id') noteId: string, @GetUser() user: User) {
    return this.transactionService.getNote(Number(noteId), user.id);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch('transaction/note/:id')
  @HttpCode(HttpStatus.OK)
  async updateNote(
    @Param('id') noteId: string,
    @Body(WhitelistPipe) dto: UpdateTransactionNote,
    @GetUser() user: User,
  ) {
    return this.transactionService.updateNote(Number(noteId), user.id, dto);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Delete('transaction/note/:id')
  @HttpCode(HttpStatus.OK)
  async deleteNote(@Param('id') noteId: string, @GetUser() user: User) {
    return this.transactionService.deleteNote(Number(noteId), user.id);
  }
}
