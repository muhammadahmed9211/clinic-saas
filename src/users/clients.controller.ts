import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
  SerializeOptions,
  ParseIntPipe,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { NullableType } from '../utils/types/nullable.type';
import { RoleEnum } from 'src/roles/roles.enum';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { GetAllClientsQueryDto } from './dto/get-all-clients-query.dto';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { FilterOperation } from 'src/database/base-repository/dto/advance-search.dto';
import { GetAllUsersQueryDto } from './dto/get-all-users-query.dto';
import { TokenDTO } from 'src/admin/operator/dto/create-operator.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Clients')
@Controller({
  path: 'clients',
  version: '1',
})
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get('generate-2fa-qr-code')
  @HttpCode(HttpStatus.OK)
  async generate2FAQRCode( @GetUser() user: User): Promise<any> {
    const id = user?.id
    const client = await this.clientsService.getClient(id);
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    if (!client.totp_key) {
      throw new NotFoundException('2FA secret not found');
    }
    const qrCodeImage = await this.clientsService.generate2FAQRCode(id);
    return { qrCodeImage };
  }

  @Post('verify-2fa-token')
  @HttpCode(HttpStatus.OK)
  async verify2FAToken(
    @GetUser() user: User,
    @Body() tokenDTO: TokenDTO,
  ): Promise<any> {
    const id = user?.id
    const isTokenValid = await this.clientsService.verify2FAToken(
      id,
      tokenDTO.token,
    );
    if (!isTokenValid) {
      throw new NotFoundException('Invalid token');
    }

    return { message: 'Token verified successfully' };
  }

  
  @Post('reset-2fa')
  @HttpCode(HttpStatus.OK)
  async reset2FA( @GetUser() user: User): Promise<any> {
    const id = user?.id
    await this.clientsService.reset2FA(id);
    await this.clientsService.generate2FASecret(id);
    const qrCodeImage = await this.generate2FAQRCode(user);
    return {
      message: '2FA reset successful',
      qrCodeImage: qrCodeImage?.qrCodeImage?.QR,
      secretKey: qrCodeImage?.qrCodeImage?.secretKey
    };
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @HttpCode(HttpStatus.OK)
  @Get('all-users')
  async findAllUsers(
    @GetUser() user: User,
    @Query() query: GetAllUsersQueryDto,
  ) {
    const userId = user.id;
    const searchFilter = [
      {
        listColumnMeta: {
          name: 'firstName',
        },
        operator: FilterOperation.CONTAINS,
        values: [query.search || ''],
      },
      {
        listColumnMeta: {
          name: query.type == '0' ? 'isClient' : query.type == '1' ? 'isOperator' : 'isPartner',
        },
        operator: FilterOperation.EQUALS,
        values: [1],
      },
    ];
    const data = await this.clientsService.getUserListForDropdown({
      userId,
      all: true,
      //@ts-expect-error typeerror
      dto: {
        filters: searchFilter,
      },
    });

    const mappedResult = data.result.map((item) => ({
      id: item?.id ?? '',
      name: item?.firstName + ' ' + item?.lastName,
      email: item?.email,
      type : item?.isOperator === true ? 'operator' : item?.isClient === true ? 'client' : 'partner' 
    }));
    return mappedResult;
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @HttpCode(HttpStatus.OK)
  @Get('all-operators')
  async findAllOperators(
    @Query() query: GetAllUsersQueryDto,
  ) {
    let userId:number;
    userId = await this.clientsService.getSystemUser() 
    const searchFilter = [
      {
        listColumnMeta: {
          name: 'firstName',
        },
        operator: FilterOperation.CONTAINS,
        values: [query.search || ''],
      },
      {
        listColumnMeta: {
          name: query.type == '0' ? 'isClient' : query.type == '1' ? 'isOperator' : 'isPartner',
        },
        operator: FilterOperation.EQUALS,
        values: [1],
      },
    ];
    const data = await this.clientsService.getUserListForDropdown({
      userId,
      //@ts-expect-error typeerror
      dto: {
        filters: searchFilter,
      },
       ...(query.limit ? { limit: query.limit, page: query.page } : {all:true}),
    });

    const mappedResult = data.result.map((item) => ({
      id: item?.id ?? '',
      name: item?.firstName + ' ' + item?.lastName,
      email: item?.email,
      type : item?.isOperator === true ? 'operator' : item?.isClient === true ? 'client' : 'partner' 
    }));
    return mappedResult;
  }


  @SerializeOptions({
    groups: ['admin'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProfileDto: CreateClientDto): Promise<User> {
    return this.clientsService.create(createProfileDto);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get('all')
  @HttpCode(HttpStatus.OK)
  async findAll(@GetUser() user: User, @Query() query: GetAllClientsQueryDto) {
    const userId = user.id;
    const searchFilter = {
      listColumnMeta: {
        name: 'firstName',
      },
      operator: FilterOperation.CONTAINS,
      values: [query.search || ''],
    };
    const data = await this.clientsService.getClientListForDropdown({
      userId,
      all: true,
      //@ts-expect-error typeerror
      dto: {
        filters: [searchFilter],
      },
    });

    const mappedResult = data.result.map((item) => ({
      id: item?.userId ?? '',
      name: item?.firstName + ' ' + item?.lastName,
      email: item.email,
      photoId: item?.photo,
      leadId: item?.leadId,
    }));

    return mappedResult;
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(
    @GetUser() user: User,
    @Param('id') id: string,
  ): Promise<NullableType<User>> {
    return this.clientsService.findOneById(user, {
      id: +id,
      status: { id: 1 }
    });
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: number,
    @Body() updateProfileDto: UpdateClientDto,
  ): Promise<User> {
    return this.clientsService.update(id, updateProfileDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number): Promise<void> {
    return this.clientsService.softDelete(id);
  }

  @Delete('/purge/multiple')
  @Roles(RoleEnum.super_admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async purge(@Body() ids: number[]): Promise<void> {
    return await this.clientsService.purgeMultipleUser(ids);
  }

  @Delete(':id/delete')
  async softDeleteUser(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    return await this.clientsService.deleteUser(user, id);
  }

  @Delete(':id/purge')
  async purgeUser(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return await this.clientsService.purgeUser(id);
  }
}