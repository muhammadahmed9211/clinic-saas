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
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';
import { WalletService } from './wallet.service';

@ApiBearerAuth()
@ApiTags('Wallet')
@Roles(RoleEnum.client)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({
  path: 'wallet',
  version: '1',
})
export class WalletController {
  constructor(private readonly walletService: WalletService) {}
  @ApiBearerAuth()
  @Get()
  @Roles(RoleEnum.client)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  create(@GetUser() user: User) {
    return this.walletService.findAllByUserId(user.id);
  }

  @ApiBearerAuth()
  @Get('info')
  @Roles(RoleEnum.client)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  info(@GetUser() user: User) {
    return this.walletService.getUserWalletInfo(user.id);
  }
}
