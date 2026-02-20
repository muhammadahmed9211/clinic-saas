import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { BankAccountService } from './bank-account.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from '../kyc/dto/admin-kyc.dto';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';

@ApiBearerAuth()
@ApiTags('Admin Bank Accounts')
@Controller({
  path: 'admin/bank-account',
  version: '1',
})
export class BankAccountController {
  constructor(private readonly bankAccountService: BankAccountService) {}
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createBankAccountDto: CreateBankAccountDto, @GetUser() user:User) {
    return this.bankAccountService.create(createBankAccountDto , user.id);
  }

  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Post('list')
  getAll(
    @Query() pagination: PaginationDto,
    @Body() body: ApplyListFilterSortColumnDto,
    @GetUser() user: User,
  ) {
    const { limit = 10, page = 1 } = pagination || {};
    return this.bankAccountService.getAll(limit, page, body, user.id);
  }

  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll() {
    return await this.bankAccountService.findAll();
  }

  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Get('currency')
  async currency() {
    const currencies = await this.bankAccountService.getCurrencies();
    return currencies;
  }

  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const account = await this.bankAccountService.findOne(+id);
    if (!account) {
      throw new NotFoundException('Account does not exist');
    }
    return account;
  }

  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBankAccountDto: UpdateBankAccountDto,
    @GetUser() user:User
  ) {
    return this.bankAccountService.update(+id, updateBankAccountDto, user.id);
  }
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string, @GetUser() user:User) {
    return this.bankAccountService.remove(+id , user.id);
  }
}
