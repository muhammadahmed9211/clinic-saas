import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  SerializeOptions,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CustomDropdownService } from './custom-dropdown.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ClientInfoDto } from './dto/custom-status.dto';
import { DeskTypeDto } from './dto/desk-type.dto';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Admin Custom Dropdowns')
@Controller({
  path: 'admin/custom-dropdown',
  version: '1',
})
export class CustomDropdownController {
  constructor(private readonly customDropdownService: CustomDropdownService) { }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get('info')
  @HttpCode(HttpStatus.OK)
  async getClientInfo(@Query() clientInfoDto: ClientInfoDto): Promise<any> {
    const data = await this.customDropdownService.getClientInfo(
      clientInfoDto.type,
    );
    return { data: data };
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @ApiOkResponse({
    schema: {
      example: [
        {
          id: '1',
          name: 'Sales Desk',
        },
      ],
    },
    status: '2XX',
  })
  @Get('desk/:id')
  @ApiParam({ name: 'id' })
  @ApiQuery({ name: 'search', required: false })
  @HttpCode(HttpStatus.OK)
  async getDropdown(
    @Param() param: DeskTypeDto,
    @Query('search') search?: string,
  ): Promise<any> {
    return await this.customDropdownService.getDropdown(param.id, search);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @ApiOkResponse({
    schema: {
      example: [
        {
          id: '1010',
          full_name: 'QA_test',
        },
      ],
    },
    status: '2XX',
  })
  @Get('operator/:id')
  @HttpCode(HttpStatus.OK)
  async getOperator(
    @Param('id') id: number,
    @GetUser() user: User,
  ): Promise<any> {
    return await this.customDropdownService.getOperator(id, user);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get('rejected-reasons')
  @HttpCode(HttpStatus.OK)
  async getRejectedReasons(@Request() Req: any): Promise<any> {
    const userLang = Req.user.languageIso;
    const data = await this.customDropdownService.getRejectedReasons(userLang);
    return { data: data };
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get('offices')
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'search', required: false }) 
  async getAllOffices(@Query('search') search?: string): Promise<any> {
    const data = await this.customDropdownService.getOffices(search);
    return { data }; 
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get('deskTypes')
  @HttpCode(HttpStatus.OK)
  async getdeskTypes(): Promise<any> {
    const data = await this.customDropdownService.getDeskTypes();
    return { data: data };
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get('desk-all')
  @HttpCode(HttpStatus.OK)
  async getAllDesk(): Promise<any> {
    const data = await this.customDropdownService.getAllDesk();
    return { data: data };
  }

  @Get('languages')
  @HttpCode(HttpStatus.OK)
  async getLanguages(): Promise<any> {
    const languages = await this.customDropdownService.getAllLanguages();
    return { data: languages };
  }
}
