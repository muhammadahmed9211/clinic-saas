import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  HttpCode,
  HttpStatus,
  Delete,
  Request,
  Patch,
  SerializeOptions,
} from '@nestjs/common';
import {
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PartnerKycDocsService } from './partner-kyc-documents.service';
import {
  CreatePartneKycDto,
  UpdatePartnerKycDocumentDetailDto,
  partnerKycInfoDto,
} from './dto/createPartnerKycDocs.dto';
import { UpdateResult } from 'typeorm';
import { NullableType } from 'src/utils/types/nullable.type';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';

@ApiTags('Partner Kyc Docs')
@Controller({
  path: 'admin/partner/:id',
  version: '1',
})
export class PartnerKycDocsController {
  constructor(private readonly partnerKycDocs: PartnerKycDocsService) {}

  @ApiBody({
    isArray: true,
    type: CreatePartneKycDto,
  })
  @ApiResponse({
    status: 201,
    description: 'The partnerKycDocs has been created successfully.',
  })
  @ApiBearerAuth()
  @Post('kyc-docs')
  @UseGuards(AuthGuard('jwt'))
  async createPartnerKycDocs(
    @Param('id') id: number,
    @Body() data: CreatePartneKycDto[],
    @GetUser() user: User
  ): Promise<any> {
    const partnerId = id;
    return await this.partnerKycDocs.createPartnerKycDocs(data, user, +partnerId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/all-kyc-documents/list')
  @HttpCode(HttpStatus.OK)
  async findAllWithFilters(
    @Param('id') id: number,
    // @Body() body: ApplyListFilterSortColumnDto,
    // @GetUser() partner: Partner,
  ) {
    // const { limit = 10, page = 1 } = getAllPartnerKycDocsDto || {};
    return await this.partnerKycDocs.getAllKycDocumentDetailById(Number(id));
    // } else {
    //   return await this.partnerKycDocs.getAllKycDocumentDetail(
    //     partner.id,
    //     limit,
    //     page,
    //     body,
    //   );
  }

  // @ApiBearerAuth()
  // @Get('list')
  // @UseGuards(AuthGuard('jwt'))
  // async findAllUserKycDocs(@Request() request): Promise<any[]> {
  //   const userId = request.user.id;
  //   const documents = await this.partnerKycDocs.findAllPartnerKycDocs(userId);
  //   return documents;
  // }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch('details')
  @HttpCode(HttpStatus.OK)
  async updatePartnerKycDocumentDetail(
    @Param('id') id: number,
    @Body() updatePartnerDto: UpdatePartnerKycDocumentDetailDto,
    @GetUser() user: User,
  ): Promise<UpdateResult> {
    return await this.partnerKycDocs.updatePartnerKycDocumentDetail(
      id,
      updatePartnerDto,
      user,
    );
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch('partner-documents')
  @HttpCode(HttpStatus.OK)
  async updateClientMultipleKycInfo(
    @Param('id') id: number,
    @Body() kycInfoDto: partnerKycInfoDto,
    @Request() Req: any,
  ): Promise<NullableType<any>> {
    const approverId = Req.user.id;
    const data = await this.partnerKycDocs.updatePartnerKycInfo(
      +id,
      kycInfoDto,
      +approverId,
    );
    return {
      message: `Client's kyc data updated successfully`,
      data: data,
    };
  }

  @ApiParam({ name: 'id', description: 'Document ID' })
  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async removePartnerKycDoc(@Param('id') id: number): Promise<any> {
    return await this.partnerKycDocs.removeDocument(id);
  }
}
