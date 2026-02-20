import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserCreditCardsService } from './user-credit-cards.service';
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
@ApiTags('User Client Card Details')
@Controller({
  path: 'credit-cards',
  version: '1',
})
export class UserCreditCardsController {
  constructor(
    private readonly userCreditCardsService: UserCreditCardsService,
  ) {}

  @Get()
  findOne(@GetUser() user: User) {
    return this.userCreditCardsService.findAllByUserId(user.id);
  }
}
