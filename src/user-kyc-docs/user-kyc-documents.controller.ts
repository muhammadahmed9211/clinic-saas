import {
  Controller,
  Post,
  Body,
  Request,
  Delete,
  UseGuards,
  Param,
  Get,
  Headers,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateUserKycDocumentsDto } from './dto/user-kyc-documents.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserKycDocumentsService } from './user-kyc-documents.service';
import { ShuftiService } from '../kyc-shufti/shufti.service';
import { LaunchIframeDto } from './dto/launch-iframe.dto';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';

@ApiTags('UserKycDocs')
@Controller({
  path: 'kyc-docs',
  version: '1',
})
export class UserKycDocuments {
  constructor(private readonly userKycDocs: UserKycDocumentsService,
    private readonly shuftiService: ShuftiService,
  ) {}


  @ApiBody({
    isArray: true,
    type: CreateUserKycDocumentsDto,
  })
  @ApiResponse({
    status: 201,
    description: 'The userKycDocs has been created successfully.',
  })
  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createUserKycDocs(
    @Request() request,
    @Body() data: CreateUserKycDocumentsDto[],
  ): Promise<any> {
    const userId = request.user.id;
    const roleId = request.user.roleId;
    return await this.userKycDocs.createUserKycDocs(data, userId, roleId);
  }

  @ApiParam({ name: 'id', description: 'Document ID' })
  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async removeUserKycDoc(
    @Param('id') id: number,
    @Request() req: any,
  ): Promise<any> {
    const roleId = req.user.role.id;
    const userId = req.user.id
    try {
      return await this.userKycDocs.removeDocument(id, roleId,userId);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAllUserKycDocs(@Request() request): Promise<any[]> {
    const userId = request.user.id;
    const documents = await this.userKycDocs.findAllUserKycDocs(userId);
    return documents;
  }


@ApiBearerAuth()
@ApiResponse({ status: 200, description: 'Launch Shufti iframe session' })
@ApiQuery({
  name: 'kycStep',
  required: true,
  description: 'Specify KYC step — either "identity" or "address".',
  enum: ['identity', 'address'],
  example: 'identity',
})
@ApiQuery({
  name: 'redirectUrl',
  required: false,
  description: 'Optional redirect URL after KYC completion (e.g., /account, /dashboard, /shufti)',
  example: '/account',
})
@Get('launch-iframe')
@UseGuards(AuthGuard('jwt'))
async launchKycIframe(
  @GetUser() user: User,
  @Headers('x_custom_lang') lang: string,
  @Query('kycStep') kycStep: 'identity' | 'address',
  @Query('redirectUrl') redirectUrl?: string, // 👈 optional query param
): Promise<any> {
  const userId = await this.userKycDocs.getClientById(user?.id);
  const shuftiResponse = await this.shuftiService.launchIframe(userId, lang, kycStep, redirectUrl);

  return {
    status: 'success',
    shuftiResponse,
    redirectUrl: redirectUrl || null, // 👈 return it for frontend clarity
  };
}


@ApiBearerAuth()
@ApiResponse({ status: 200, description: 'Launch Shufti mobile session' })
@ApiQuery({
  name: 'kycStep',
  required: true,
  description: 'Specify KYC step — either "identity" or "address".',
  enum: ['identity', 'address'],
  example: 'identity',
})
@Get('launch-mobile')
@UseGuards(AuthGuard('jwt'))
async launchKycMobile(
  @GetUser() user: User,
  @Headers('x_custom_lang') lang: string,
  @Query('kycStep') kycStep: 'identity' | 'address',// <-- get kycStep from query params
  @Query('isDarkMode') isDarkMode: boolean = false,
): Promise<any> {
  //@ts-expect-error isDarkMode can be string or boolean
  isDarkMode = isDarkMode === true || isDarkMode === 'true';
  const userId = await this.userKycDocs.getClientById(user?.id);
  const accessToken = await this.shuftiService.getShuftiAccessToken(isDarkMode);
  const payload = await this.shuftiService.buildPayload(userId, lang, kycStep); // pass kycStep
  return {
    status: 'success',
    config:accessToken,
    payload
  };
}



}
