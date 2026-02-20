import {
  Controller,
  Get,
  UseGuards,
  HttpStatus,
  HttpCode,
  SerializeOptions,
  Param,
  Body,
  Query,
  Post,
  Patch,
  Delete,
  HttpException,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ReferralProgramService } from 'src/referral-program/referral-program.service';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';
import { PaginationDto } from 'src/database/base-repository/dto/pagination.dto';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { CreateReferralDto } from 'src/referral-program/dto/create-referral.dto';
import { UpdateReferralDto } from 'src/referral-program/dto/update-referral.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Admin Referral')
  @SerializeOptions({
    groups: ['admin'],
  })
@Controller({
  path: 'admin',
  version: '1',
})
export class AdminReferralProgramController {
  constructor(
    private readonly referralProgramService: ReferralProgramService,
  ) { }


  @Post('client/:id/referrals/list')
  @HttpCode(HttpStatus.OK)
  getReferrals(
    @Query() pagination: PaginationDto,
    @Body() body: ApplyListFilterSortColumnDto,
    @GetUser() user: User,
    @Param('id') clientId: string,
  ) {
    const { limit = 10, page = 1 } = pagination || {};
    return this.referralProgramService.getReferralsList(
      limit,
      page,
      body,
      user,
      +clientId,
    );
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get('client/:id/referral-info')
  @HttpCode(HttpStatus.OK)
  getReferralsInfo(@GetUser() user: User, @Param('id') clientId: string) {
    return this.referralProgramService.getRewardInfoByClientId(user, +clientId);
  }
  
   @Post('/referral-program/create')
    @ApiBody({ type: CreateReferralDto })
    async createBonus(@Body() dto: CreateReferralDto, @GetUser() user: User) {
    return this.referralProgramService.createReferralProgram(dto, user.id);
    }

    @Patch('/referral-program/:id')
    @ApiBody({ type: UpdateReferralDto })
    async updateReferralProgram(
    @Param('id') id: number,
    @Body() dto: UpdateReferralDto,
    @GetUser() user: User,
  ) {
    return this.referralProgramService.updateReferralProgram(Number(id), dto, user.id);
  }

    @Delete('/referral-program/:id')
    async deleteReferralProgram(
    @Param('id') id: number,
    @GetUser() user: User,
  ) {
    return this.referralProgramService.deleteReferralProgram(Number(id), user.id);
  }

  @Post('/referral-program/list')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get filtered referral program list with pagination' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Referral programs retrieved successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async getFilteredReferralList(
  @Query() query: PaginationDto,
  @GetUser() user: User,
  @Body() body: ApplyListFilterSortColumnDto,
) {
  try {
    const result = await this.referralProgramService.getFilteredReferralList({
      paginationOptions: {
        page: query.page || 1,
        limit: query.limit || 10,
      },
      userId: user.id,
      dto: body,
    });
    return result;
  } catch (error) {
    throw new HttpException(
      error.message || 'Internal server error',
      error.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

@Get('/referral-program/:id')
@ApiParam({ name: 'id', type: Number })
async getReferralProgramById(@Param('id', ParseIntPipe) id: number) {
  return this.referralProgramService.getReferralProgramById(id);
}

}
