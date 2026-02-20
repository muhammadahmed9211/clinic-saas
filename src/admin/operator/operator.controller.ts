import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Patch,
  SerializeOptions,
  UseGuards,
  Query,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { OperatorService } from './operator.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  CreateOfficeDTO,
  DeskDTO,
  OperatorDTO,
  TokenDTO,
  UpdateDeskDTO,
  UpdateOfficeDTO,
} from './dto/create-operator.dto';
import { ResponseWrapper } from 'src/utils/interface/mt5/base-response.interface';
import { Status } from 'src/utils/enums/mt5/response-status.enum';
import {
  OperatorChangePasswordDto,
  UpdateOperatorDTO,
} from './dto/update-operator.dto';
import { TaskService } from '../task/task.service';
import { GetTaskQuery } from '../task/dto/task.dto';
import { I18nContext } from 'nestjs-i18n';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';
import { JwtPayloadType } from 'src/auth/strategies/types/jwt-payload.type';
import { PaginationDto } from 'src/database/base-repository/dto/pagination.dto';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { TaskEntityType } from '../task/entities/task.entity';
import {
  GenerateOperatorLinkDto,
  UpdateGeneratedOperatorDto,
} from './dto/generate-operator-link.dto';
import { CreateOperatorLinkDto } from './dto/create-operator-link.dto';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import {
  CreateOperatorTargetDto,
  GetOperatorTargetDto,
  UpdateAutoMonthlyTargetDto,
  UpdateOperatorTargetDto,
} from './dto/operator-target.dto';
import { DeleteOperatorDTO } from './dto/delete-operator.dto';
import { AllowFirstLogin } from 'src/auth/decorators/allow-first-login.decorator';
import { Require2FA } from 'src/auth/decorators/require-2fa.decorator';

@ApiBearerAuth()
//@Roles(RoleEnum.super_admin)
@UseGuards(AuthGuard('jwt'))
@ApiTags('Admin Operator')
@Controller({
  path: 'admin/operator',
  version: '1',
})
export class OperatorController {
  constructor(
    private readonly operatorService: OperatorService,
    private readonly taskService: TaskService,
  ) {}

  @Get('link-list')
  @HttpCode(HttpStatus.OK)
  async getLinks() {
    return this.operatorService.getOperatorLinks();
  }

  @Post('list')
  async getAllOperators(
    @GetUser() user: User,
    @Query() query: PaginationDto,
    @Body() body: ApplyListFilterSortColumnDto,
  ) {
    const userId = user.id;
    const { limit = 10, page = 1 } = query;
    return this.operatorService.getOperatorsList({
      userId,
      limit,
      page,
      dto: body,
    });
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get('operator-dropdown-list')
  @HttpCode(HttpStatus.OK)
  @ApiQuery({
    name: 'search',
    required: false,
  })
  async getOperatorsDropdown(
    @GetUser() user: User,
    @Query('search') search?: string,
  ): Promise<any> {
    try {
      const data = await this.operatorService.getOperatorsDropdownList(
        user,
        search,
      );
      return ResponseWrapper.wrap({
        status: Status.SUCCESS,
        statusCode: HttpStatus.OK,
        statusText: 'Operators fecthed',
        data: data,
      });
    } catch (error) {
      throw error;
    }
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':id/tasks')
  @HttpCode(HttpStatus.OK)
  async getOperatorTasks(
    @Param('id') id: number,
    @Query() query: GetTaskQuery,
  ): Promise<any> {
    return this.taskService.findByEntity(id, query, TaskEntityType.OPERATOR);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get('get-operator/:id')
  @HttpCode(HttpStatus.OK)
  async getOperator(@Param('id') id: number): Promise<any> {
    const data = await this.operatorService.getOperator(id);
    return { data: data };
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post('create-operators')
  @HttpCode(HttpStatus.CREATED)
  async getRejectedReasons(
    @Body() operatorDTO: OperatorDTO,
    @Request() req,
  ): Promise<any> {
    // if (operatorDTO.password_expiry_date) {
    //   operatorDTO.password_expiry_date = new Date(
    //     operatorDTO.password_expiry_date,
    //   );
    // }
    // if (operatorDTO.last_logon_time) {
    //   operatorDTO.last_logon_time = new Date(operatorDTO.last_logon_time);
    // }
    // if (operatorDTO.block_time) {
    //   operatorDTO.block_time = new Date(operatorDTO.block_time);
    // }
    const data = await this.operatorService.createOperator(
      operatorDTO,
      req.user,
    );
    return { data: data };
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch('update-operators/:id')
  @HttpCode(HttpStatus.OK)
  async updateOperator(
    @Request() request,
    @Param('id') id: number,
    @Body() operatorDTO: UpdateOperatorDTO,
  ): Promise<any> {
    const i18n = I18nContext.current();
    try {
      const result = await this.operatorService.updateOperator(
        request.user,
        id,
        operatorDTO,
      );
      const isSuccess = i18n?.t('success.operator.updated');
      return { message: isSuccess, data: result };
    } catch (error) {
      if (error instanceof NotFoundException) {
        const message = i18n?.t('errors.operator.notFound');
        throw new NotFoundException(message);
      }
      throw error;
    }
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch('delete-operator/:id')
  @HttpCode(HttpStatus.OK)
  async deleteOperator(@Param('id') id: number, @Body() body: DeleteOperatorDTO, @GetUser() user: User): Promise<any> {
    const data = await this.operatorService.isDeleteOperator(id, body, user);
    return { data: data };
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @AllowFirstLogin()
  @Require2FA()
  @Get(':id/generate-2fa-qr-code')
  @HttpCode(HttpStatus.OK)
  async generate2FAQRCode(@Param('id') id: number): Promise<any> {
    const operator = await this.operatorService.getOperatorWithoutTransform(id);

    if (!operator) {
      throw new NotFoundException('Operator not found');
    }
    if (!operator.totp_key) {
      throw new NotFoundException('2FA secret not found');
    }
    const qrCodeImage = await this.operatorService.generate2FAQRCode(id);
    return { qrCodeImage };
  }

  @Require2FA()
  @AllowFirstLogin()
  @Post(':id/verify-2fa-token')
  @HttpCode(HttpStatus.OK)
  async verify2FAToken(
    @Param('id') id: number,
    @Body() tokenDTO: TokenDTO,
  ): Promise<any> {
    const result = await this.operatorService.verify2FAToken(
      id,
      tokenDTO.token,
    );
    if (!result || !result.isValid) {
      throw new NotFoundException('Invalid token');
    }

    return {
      message: 'Token verified successfully',
      token: result.token,
      refreshToken: result.refreshToken,
      tokenExpires: result.tokenExpires,
    };
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post(':id/reset-2fa')
  @HttpCode(HttpStatus.OK)
  async reset2FA(@Param('id') id: number): Promise<any> {
    await this.operatorService.reset2FA(id);
    await this.operatorService.generate2FASecret(id);
    const qrCodeImage = await this.generate2FAQRCode(id);
    return {
      message: '2FA reset successful',
      qrCodeImage: qrCodeImage.qrCodeImage,
    };
  }

  @SerializeOptions({
    groups: ['me'],
  })
  // @Roles(RoleEnum.super_admin, RoleEnum.user_admin)
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id/change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Param('id') id: number,
    @Body() changePasswordDto: OperatorChangePasswordDto,
    @GetUser() user: JwtPayloadType,
  ): Promise<any> {
    await this.operatorService.changePassword(id, changePasswordDto, user);
    return { success: true, message: 'Password Changed Successfully' };
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post('desk')
  @HttpCode(HttpStatus.CREATED)
  async createDesk(@GetUser() user: User, @Body() deskDTO: DeskDTO): Promise<any> {
    return await this.operatorService.createDesk(user, deskDTO);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get('desk/:id')
  @HttpCode(HttpStatus.OK)
  async getDesk(@Param('id') id: number): Promise<any> {
    return await this.operatorService.getDesk(id);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch('desk/:id')
  @HttpCode(HttpStatus.OK)
  async updateDesk(
    @GetUser() user: User,
    @Param('id') id: number,
    @Body() deskDTO: UpdateDeskDTO,
  ): Promise<any> {
    return await this.operatorService.updateDesk(user, id, deskDTO);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Delete('desk/:id')
  @HttpCode(HttpStatus.OK)
  async deleteDesk(@GetUser() user: User, @Param('id') id: number): Promise<any> {
    return await this.operatorService.deleteDesk(user, id);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get('desks')
  async getAllDesks(): Promise<DeskDTO[]> {
    return await this.operatorService.getAllDesks();
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get('office/:id')
  @HttpCode(HttpStatus.OK)
  async getOfficeById(@Param('id') id: number): Promise<any> {
    return await this.operatorService.getOfficeById(id);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get('offices')
  @HttpCode(HttpStatus.OK)
  async getAllOffices(): Promise<any> {
    return await this.operatorService.getAllOffices();
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post('office')
  @HttpCode(HttpStatus.CREATED)
  async createOffice(@GetUser() user: User, @Body() createOfficeDTO: CreateOfficeDTO): Promise<any> {
    return await this.operatorService.createOffice(user , createOfficeDTO);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch('office/:id')
  @HttpCode(HttpStatus.OK)
  async updateOffice(
    @GetUser() user: User,
    @Param('id') id: number,
    @Body() updateOfficeDTO: UpdateOfficeDTO,
  ): Promise<any> {
    return await this.operatorService.updateOffice(user, id, updateOfficeDTO);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Delete('office/:id')
  @HttpCode(HttpStatus.OK)
  async deleteOffice(@GetUser() user: User, @Param('id') id: number): Promise<any> {
    return await this.operatorService.deleteOffice(user, id);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get('desk/:id/desk-operators')
  @HttpCode(HttpStatus.OK)
  async getDeskOperators(@Param('id') id: number): Promise<any> {
    return await this.operatorService.getAllDeskOperators(id);
  }

  @Post('generate-link')
  @HttpCode(HttpStatus.OK)
  async generateOperatorLink(
    @Body() generateOperatorLinkDto: GenerateOperatorLinkDto,
  ): Promise<any> {
    return this.operatorService.generateOperatorLinks(generateOperatorLinkDto);
  }

  @Post('add-link')
  @HttpCode(HttpStatus.OK)
  async addLink(@Body() createOperatorLinkDto: CreateOperatorLinkDto) {
    return this.operatorService.createOperatorLink(createOperatorLinkDto);
  }

  @Post('impersonate-client/:id')
  @HttpCode(HttpStatus.OK)
  async impersonateClient(@GetUser() user: User, @Param('id') client: number) {
    return this.operatorService.impersonatingClient(user, client);
  }

  @Post('impersonate-operator/:id')
  @HttpCode(HttpStatus.OK)
  async impersonateOperator(
    @GetUser() user: User,
    @Param('id') operator: number,
  ) {
    return this.operatorService.impersonatingOperator(user, operator);
  }

  @Patch('update-link/:id')
  async updateOperatorLink(
    @Param('id') id: string,
    @Body() updateGeneratedOperatorDto: UpdateGeneratedOperatorDto,
  ) {
    return this.operatorService.updateOperatorLink(
      +id,
      updateGeneratedOperatorDto,
    );
  }

  @Get('list-single-url/:id')
  async getSingleOperatorLink(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    return this.operatorService.getSingleOperatorLink(id);
  }

  @Delete('delete-link/:id')
  @HttpCode(HttpStatus.OK)
  async deleteOperatorLink(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.operatorService.deleteOperatorLink(id);
  }

  @Post('target')
  async create(@Body() createOperatorTargetDto: CreateOperatorTargetDto) {
    try {
      const data = await this.operatorService.createTarget(
        createOperatorTargetDto,
      );
      return {
        message: 'Target created successfully',
        statusCode: 200,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get(':id/target')
  async findOne(@Param('id') id: number, @Query() query: GetOperatorTargetDto) {
    try {
      const data = await this.operatorService.findOneTarget(
        id,
        query.month,
        query.year,
      );
      return {
        message: 'Target fetched successfully',
        statusCode: 200,
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  @Patch('target/:id')
  async update(
    @Param('id') id: number,
    @Body() updateOperatorTargetDto: UpdateOperatorTargetDto,
  ) {
    try {
      await this.operatorService.updateTarget(id, updateOperatorTargetDto);
      return {
        message: 'Target updated successfully',
        statusCode: 200,
      };
    } catch (error) {
      throw error;
    }
  }

  @Patch('update-auto-monthly-target/:id')
  @HttpCode(HttpStatus.OK)
  async updateAutoMonthlyTarget(
    @Request() request,
    @Param('id') id: number,
    @Body() body: UpdateAutoMonthlyTargetDto,
  ): Promise<any> {
    const i18n = I18nContext.current();
    try {
      const result = await this.operatorService.updateAutoMonthlyTarget(
        request.user,
        id,
        body,
      );
      const isSuccess = i18n?.t('success.operator.updated');
      return { message: isSuccess, data: result };
    } catch (error) {
      if (error instanceof NotFoundException) {
        const message = i18n?.t('errors.operator.notFound');
        throw new NotFoundException(message);
      }
      throw error;
    }
  }

  @Patch('image-delete/:id')
  async updateImage(
    @Param('id') id: number,
  ) {
    try {
      await this.operatorService.updateImage(id);
      return {
        message: 'Image delete successfully',
        statusCode: 200,
      };
    } catch (error) {
      throw error;
    }
  }

  @Require2FA()
  @AllowFirstLogin()
  @Patch('update-first-login/:id')
  async updateFirstLogin(
    @Param('id') id: number,
    @Body() changePasswordDto: OperatorChangePasswordDto,
    @GetUser() user: JwtPayloadType,
  ) {
    try {
      await this.operatorService.changePassword(id, changePasswordDto, user);
      return {
        message: 'First login updated successfully',
        statusCode: 200,
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete('target/:id')
  async remove(@Param('id') id: number) {
    try {
      const data = await this.operatorService.removeTarget(id);
      return {
        message: 'Target deleted successfully',
        statusCode: 200,
      };
    } catch (error) {
      throw error;
    }
  }
}
