import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';
import { BankAccountService } from 'src/admin/bank-account/bank-account.service';
import { GetBankAccountDto } from './dto/get-bank-account.dto';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';
import { ClientRepository } from 'src/users/repositories/client.repository';

@ApiBearerAuth()
@Roles(RoleEnum.client)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Bank Accounts')
@Controller({
  path: 'bank-account',
  version: '1',
})
export class BankAccountController {
  constructor(
    private readonly bankAccountService: BankAccountService,
    private readonly clientRepository: ClientRepository,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: GetBankAccountDto, @GetUser() user: User) {
    let regulationId: null | number = null;
    const client = await this.clientRepository.findOne({
      where: { userId: user.id },
      relations: ['regulation'],
    });
    if (client && client?.regulation?.id) {
      regulationId = client?.regulation?.id;
    }
    if (!regulationId) {
      throw new BadRequestException('Client Regulation not found');
    }
    return this.bankAccountService.findAllByCountry(query.currency, true, regulationId, user.id);
  }

  @Get("local")
  @HttpCode(HttpStatus.OK)
  async getCountryLocalBanks(@GetUser() user: User) {
    let regulationId: null | number = null;
    const client = await this.clientRepository.findOne({
      where: { userId: user.id },
      relations: ['regulation'],
    });
    if (client && client?.regulation?.id) {
      regulationId = client?.regulation?.id;
    }
    if (!regulationId) {
      throw new BadRequestException('Client Regulation not found');
    }
    return this.bankAccountService.getCountryMethodsBank(regulationId, user.id);
  }

  @Get('currency')
  @HttpCode(HttpStatus.OK)
  getCurrency() {
    return this.bankAccountService.getCurrencies();
  }
}