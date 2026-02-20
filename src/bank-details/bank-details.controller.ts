import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BankDetailsService } from './bank-details.service';
import { CreateBankDetailDto } from './dto/create-bank-detail.dto';
import { UpdateBankDetailDto } from './dto/update-bank-detail.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';
import { PaginationDto } from 'src/database/base-repository/dto/pagination.dto';

@ApiBearerAuth()
@Roles(RoleEnum.client)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Bank Details')
@Controller({
  path: 'bank-details',
  version: '1',
})
export class BankDetailsController {
  constructor(private readonly bankDetailsService: BankDetailsService) {}

  @Post()
  create(
    @Body() createBankDetailDto: CreateBankDetailDto,
    @GetUser() user: User,
  ) {
    return this.bankDetailsService.create(createBankDetailDto, user.id);
  }

  @Get()
  findAll(@GetUser() user: User, @Query() query: PaginationDto) {
    return this.bankDetailsService.findAll(user.id, query);
  }

  @Get(':id')
  findOne(@GetUser() user: User, @Param('id') id: string) {
    return this.bankDetailsService.findOne(user.id, +id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBankDetailDto: UpdateBankDetailDto,
    @GetUser() user: User,
  ) {
    return this.bankDetailsService.update(+id, updateBankDetailDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.bankDetailsService.remove(+id, user.id);
  }
}
