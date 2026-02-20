import {
  Controller,
  Post,
  Patch,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
  Get,
  Param,
  BadRequestException,
  Delete,
  HttpException,
  Headers,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto, SinglePaymentMethod } from './dto/create-transaction.dto';
import { ApiBearerAuth, ApiHeaders, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateTransferDto, TransferRewardDto } from './dto/create-transfer.dto';
import { GetTransactionList } from './dto/get-transaction.list';
import { WithdrawRequestDTO } from './dto/create-withdraw-request.dto';
import { CreateCryptoAddress } from './dto/create-cypto-address.dto';
import { GetTransaction } from './dto/get-transaction';
import {
  CreateManualBank,
  CreateManualCrypto,
} from './dto/create-manual-crypto.dto';
import {
  WithdrawSubType,
  WithdrawType,
} from './entities/withdraw-request.entity';
import { Methods } from './entities/transaction-method.entity';
import { TransactionType } from './entities/transaction.entity';
import { OtpService } from 'src/otp/otp.service';
import { OtpTypes } from 'src/users/entities/otp.entity';
import { ClientsService } from 'src/users/clients.service';

@ApiBearerAuth()
@ApiTags('Transaction')
@Controller({
  path: 'transaction',
  version: '1',
})
export class TransactionController {
  constructor(private readonly transactionService: TransactionService, private readonly otpService: OtpService, private readonly clientsService: ClientsService) { }

  @ApiBearerAuth()
  @ApiHeaders([{ name: 'x_custom_lang', schema: { default: 'en' } }])
  @Post()
  @Roles(RoleEnum.client)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @GetUser() user: User,
    @Headers('x-channel-id') channelId : string
  ) {
    const isCrypto = createTransactionDto.single_payment_method === SinglePaymentMethod.crypto;
    const isMobileChannel = channelId === '002';
    this.transactionService.isAmountInRange(
      createTransactionDto.amount,
      TransactionType.DEPOSIT,
      false,
      isCrypto
    );
    const response = await this.transactionService.createDeposit(createTransactionDto, user);
    if (isMobileChannel){
      const isUrl = typeof response.url === 'string';
      if(isUrl){
        return {
          webview : response.url,
          url:null
        }
      }else {
        return {
          ...response,
          webview:null
        }
      }
    }
    return response
  }

  @ApiBearerAuth()
  @Post('transfer')
  @Roles(RoleEnum.client)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  createTransfer(
    @Body() createTransactionDto: CreateTransferDto,
    @GetUser() user: User,
  ) {
    return this.transactionService.transfer(createTransactionDto, user);
  }

  @ApiBearerAuth()
  @Post('transfer-reward')
  @Roles(RoleEnum.client)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  transferReward(
    @GetUser() user: User,
  ) {
    return this.transactionService.transferReward(user);
  }

  @ApiBearerAuth()
  @Post('withdraw')
  @Roles(RoleEnum.client)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  async createWithdraw(
    @Body() withdrawRequestDto: WithdrawRequestDTO,
    @GetUser() user: User,
  ) {
    const { verificationId, ...withdrawRequest } = withdrawRequestDto;
    
    const userInfo = await this.clientsService.findOne({
      email: user?.email as string,
      isOperator: false,
      status: {
        id: 1,
      },
    });

    if (!userInfo?.totp) {
      if (!verificationId) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            error: {
              msg: 'Verification id is required',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      await this.otpService.isOTPisVerifiedinTimeSpan({ verificationId, email: user?.email ?? "", type: OtpTypes.verify_transaction })
    }

    this.transactionService.isAmountInRange(
      withdrawRequest.amount,
      TransactionType.WITHDRAW,
    );
    const methods = {
      [WithdrawType.CRYPTO]: Methods.CRYPTO,
      [WithdrawType.CREDIT_DEBIT_CARD]: Methods.CREDIT_CARD,
      [WithdrawType.BANK_WIRE_TRANSFER]: Methods.WIRE,
      [WithdrawType.E_WALLET]: Methods.E_WALLET,
    };
    if(withdrawRequest.login){
      throw new BadRequestException('Login is not allowed');
    }
    const method = methods[withdrawRequest.type];
    if (withdrawRequest.walletId && withdrawRequest.login) {
      throw new BadRequestException(
        'Wallet Id and Login cannot be processed in one request',
      );
    }
    return this.transactionService.createWithdrawRequest(
      withdrawRequest,
      user,
      false,
      false,
      WithdrawSubType.CLIENT_REQUEST,
      method,
      undefined,
      verificationId
    );
  }

  @ApiBearerAuth()
  @Post('manual-bank')
  @Roles(RoleEnum.client)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  manualBank(@Body() depositRequest: CreateManualBank, @GetUser() user: User) {
    if(1 > depositRequest.amount){
      throw new BadRequestException('Minimum deposit limit is 1')
    }
    return this.transactionService.createManualBank(depositRequest, user);
  }

  @ApiBearerAuth()
  @Get()
  @Roles(RoleEnum.client)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  getAll(@Query() query: GetTransactionList, @GetUser() user: User) {
    return this.transactionService.findAll(query, user.id, true);
  }

  @ApiBearerAuth()
  @Get('crypto-coins')
  @Roles(RoleEnum.client)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  getCoinsList() {
    return this.transactionService.getCryptoCoinsList();
  }

  @ApiBearerAuth()
  @Get('supported-crypto')
  @Roles(RoleEnum.client)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  getSupportedCoins(@Query('coin') coin?:string, @Query('channel') channel?:string) {
    return this.transactionService.getSupportedCoinsList(coin, channel);
  }

  @ApiBearerAuth()
  @Get('withdraw-request')
  @Roles(RoleEnum.client)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  getWithdrawRequest(@GetUser() user: User) {
    return this.transactionService.findUserWithdrawRequest(user.id);
  }

  @ApiBearerAuth()
  @Delete('withdraw-request/:id')
  @Roles(RoleEnum.client)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  deleteWithdrawReq(@Param('id') id: number, @GetUser() user: User) {
    return this.transactionService.deleteWithdrawRequest(+id, user.id);
  }

  @ApiBearerAuth()
  @Get(':id')
  @Roles(RoleEnum.client)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  getOne(@Param() param: GetTransaction, @GetUser() user: User) {
    return this.transactionService.getById(param.id, user.id);
  }

  @ApiBearerAuth()
  @Post('crypto-address')
  @Roles(RoleEnum.client)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  getDepositAddress(@Body() dto: CreateCryptoAddress) {
    const { coin } = dto;
    return this.transactionService.getDepositAddress(coin);
  }

  @ApiBearerAuth()
  @Post('manual-crypto')
  @Roles(RoleEnum.client)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  createManualCrypto(@Body() dto: CreateManualCrypto, @GetUser() user: User) {
    if(1 > dto.amount){
      throw new BadRequestException('Minimum deposit limit is 1')
    }
    return this.transactionService.createManualCrypto(dto, user);
  }

  @ApiBearerAuth()
  @Patch('cancel/:id')
  @Roles(RoleEnum.client)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  cancelRequest(@Param() params: GetTransaction, @GetUser() user: User) {
    return this.transactionService.cancelWithdrawalRequest(params.id, user);
  }
}
