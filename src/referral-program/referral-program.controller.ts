import {
  Controller,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
  Query,
  Header,
  Headers,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import { ReferralProgramService } from './referral-program.service';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';
import { PaginationDto } from 'src/database/base-repository/dto/pagination.dto';

@ApiBearerAuth()
@ApiTags('Referrals')
@Controller({
  path: 'referral',
  version: '1',
})
export class ReferralProgramController {
  constructor(
    private readonly referralProgramService: ReferralProgramService,
  ) {}

  @Get('referrals')
  @Roles(RoleEnum.client)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  referrals(@GetUser() user: User, @Query() pagination: PaginationDto) {
    return this.referralProgramService.getReferrals(user, pagination);
  }

  @Get('info')
  @Roles(RoleEnum.client)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  info(@GetUser() user: User) {
    return this.referralProgramService.getRewardInfo(user);
  }

  @Get('run')
   @ApiHeader({
    name: 'x-execution-token',
    description: 'Execution token required to run the referral program',
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  run(@Headers('x-execution-token') token: string) {
    return this.referralProgramService.run(token);
  }
}
