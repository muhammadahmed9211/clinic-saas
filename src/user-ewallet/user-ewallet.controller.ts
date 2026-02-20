import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';
import { UserEWalletService } from './user-ewallet.service';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';

@ApiBearerAuth()
@Roles(RoleEnum.client)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('User E Wallet')
@Controller({
  path: 'e-wallet',
  version: '1',
})
export class UserEWalletController {
  constructor(private readonly userEWalletService: UserEWalletService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  getAll(@GetUser() user: User) {
    return this.userEWalletService.findAllByUserId(user.id);
  }
}
