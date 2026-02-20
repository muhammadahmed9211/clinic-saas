import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { QueryClientDto } from 'src/users/dto/query-client.dto';
import { User } from 'src/users/entities/user.entity';
import { ApplicantService } from './applicant.service';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Applicants')
@Controller({
  path: 'admin/applicants',
  version: '1',
})
export class ApplicantController {
  constructor(private readonly applicantService: ApplicantService) {}

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post('list')
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Query() query: QueryClientDto,
    @GetUser() user: User,
    @Body() body: ApplyListFilterSortColumnDto,
  ) {
    const page = query?.page ?? null;
    const limit = query?.limit ?? null;
    const data = await this.applicantService.findManyWithPagination({
      paginationOptions: {
        page,
        limit,
      },
      userId: user.id,
      dto: body,
    });
    return data;
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post('listIb')
  @HttpCode(HttpStatus.OK)
  async getAllIb(
    @Query() query: QueryClientDto,
    @GetUser() user: User,
    @Body() body: ApplyListFilterSortColumnDto,
  ) {
    const page = query?.page ?? null;
    const limit = query?.limit ?? null;
    const data = await this.applicantService.findManyWithPaginationIb({
      paginationOptions: {
        page,
        limit,
      },
      userId: user.id,
      dto: body,
    });
    return data;
  }


}
