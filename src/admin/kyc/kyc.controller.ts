import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
  SerializeOptions,
  Post,
  Patch,
  Query,
  Request,
} from '@nestjs/common';
import { AdminKycService } from './kyc.service';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { required_kyc_documents } from './entities/admin-kyc.entity';
import {
  CreateDocumentDto,
  GetAllKycDocsDto,
  IbAggrementsDto,
} from './dto/admin-kyc.dto';
import { UpdateResult } from 'typeorm';
import { infinityPaginationNew } from 'src/utils/infinity-pagination';
import { QueryKycClientDto } from 'src/user-kyc-docs/dto/getKycDocuments.dto';
import {
  GetUserKycDocumentDetailDto,
  UpdateUserKycDocumentDetailDto,
} from './dto/userKycDocumentDetail.dto';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { CreateUserKycDocumentsDto } from 'src/user-kyc-docs/dto/user-kyc-documents.dto';
import { UserKycDocumentsService } from 'src/user-kyc-docs/user-kyc-documents.service';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Admin Kyc')
@Controller({
  path: 'admin/kyc',
  version: '1',
})
export class AdminKycController {
  userKycDocumentsService: any;
  fileService: any;
  constructor(
    private readonly adminKycService: AdminKycService,
    private readonly userKycDocs: UserKycDocumentsService,
  ) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number): Promise<required_kyc_documents> {
    return await this.adminKycService.getKycDocumentById(id);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post()
  @HttpCode(HttpStatus.OK)
  async create(
    @Body() createDocumentDto: CreateDocumentDto,
  ): Promise<required_kyc_documents> {
    return this.adminKycService.createDocument(createDocumentDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() dto: IbAggrementsDto,
  ): Promise<required_kyc_documents> {
    return await this.adminKycService.getKycDocumentDetails(dto.isPartner);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body() updateDto: CreateDocumentDto,
  ): Promise<UpdateResult> {
    return await this.adminKycService.updateDocument(id, updateDto);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number): Promise<void> {
    return this.adminKycService.softDelete(id);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get('userAnswersList/:id')
  @HttpCode(HttpStatus.OK)
  async findAllDocumentsOfClient(
    @Param('id') userId: number,
    @Query() query: QueryKycClientDto,
  ): Promise<any> {
    const page = query?.page ?? null;
    let limit = query?.limit ?? null;
    if (limit > 50) {
      limit = 50;
    }
    const data = await this.adminKycService.findAllWithPagination({
      userId: userId,
      paginationOptions: {
        page,
        limit,
      },
    });
    return infinityPaginationNew(true, null, data, { page, limit });
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch('document/:id/details')
  @HttpCode(HttpStatus.OK)
  async updateUserKycDocumentDetail(
    @Param('id') id: number,
    @Body() updateDto: UpdateUserKycDocumentDetailDto,
    @Request() req,
  ): Promise<UpdateResult> {
    const userId = req.user.id;
    return await this.adminKycService.updateUserKycDocumentDetail(
      id,
      updateDto,
      userId,
    );
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post('client/all-kyc-documents/list')
  @HttpCode(HttpStatus.OK)
  async findAllWithFilters(
    @Query() getAllKycDocs: GetAllKycDocsDto,
    @Body() body: ApplyListFilterSortColumnDto,
    @GetUser() user: User,
  ) {
    const { limit = 10, page = 1 } = getAllKycDocs || {};
    if (getAllKycDocs.userId) {
      return await this.adminKycService.getAllKycDocumentDetailById(
        Number(getAllKycDocs.userId),
      );
    } else {
      return await this.adminKycService.getAllKycDocumentDetail(
        user.id,
        limit,
        page,
        body,
      );
    }
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get('client/:id/document-detail')
  @HttpCode(HttpStatus.OK)
  async getUserKycDocumentDetail(
    @Param('id') id: number,
    @Query() getDto: GetUserKycDocumentDetailDto,
  ): Promise<UpdateResult> {
    return await this.adminKycService.getKycDocumentDetailById(id, getDto);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @ApiBody({
    isArray: true,
    type: CreateUserKycDocumentsDto,
  })
  @ApiResponse({
    status: 201,
    description: 'The userKycDocs has been created successfully.',
  })
  @ApiBearerAuth()
  @Post('client/:id/create-kyc-docs')
  @UseGuards(AuthGuard('jwt'))
  async createUserKycDocs(
    @Body() data: CreateUserKycDocumentsDto[],
    @Param('id') id: number,
    @Request() req: any,
  ): Promise<any> {
    const roleId = req?.user?.roleId;
    const operatorId = req?.user?.id;
    return await this.userKycDocs.createUserKycDocs(data, id, roleId,operatorId);
  }

  @ApiBearerAuth()
  @Get('client/:id/kyc-status-verification')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async getUserKycStatus(@Param('id') id: number): Promise<any> {
    try {
      const kycVerified = await this.adminKycService.isKycVerified(id);
      return { status: true, message: 'SUCCESS', data: kycVerified };
    } catch (error) {
      throw error;
    }
  }
}
