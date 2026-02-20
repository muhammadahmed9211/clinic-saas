import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BillingInformationService } from './billing-information.service';
import { CreateBillingInformationDto } from './dto/create-billing-information.dto';
import { UpdateBillingInformationDto } from './dto/update-billing-information.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';

@ApiBearerAuth()
@Roles(RoleEnum.client)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Billing Information')
@Controller({
  path: 'billing-information',
  version: '1',
})
export class BillingInformationController {
  constructor(
    private readonly billingInformationService: BillingInformationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  create(
    @Body() createBillingInformationDto: CreateBillingInformationDto,
    @GetUser() user: User,
  ) {
    return this.billingInformationService.create(
      createBillingInformationDto,
      user.id,
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findOne(@GetUser() user: User) {
    return this.billingInformationService.findOne(user.id);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  update(
    @Body() updateBillingInformationDto: UpdateBillingInformationDto,
    @GetUser() user: User,
  ) {
    return this.billingInformationService.update(
      user.id,
      updateBillingInformationDto,
    );
  }
}
