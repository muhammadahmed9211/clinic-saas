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
    Post,
    Body,
    Patch,
    Delete,
    ParseIntPipe,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import {
    ApiBearerAuth,
    ApiTags,
  } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { EmailEventService } from './email.service';
import { EmailMapping } from './entity/email-mapping.entity';
import { CreateEmailEventDto, EmailEventDtoAdvance, UpdateEmailEventDto, UpdateEmailMappingDto } from './dto/email-event.dto';
  
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiTags('Admin Email Event')
  @Controller({
    path: 'admin/email-event',
    version: '1',
  })
  export class EmailEventController {
    constructor(private readonly emailEventService: EmailEventService) {}

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post()
  @HttpCode(HttpStatus.OK)
  async createLabel(@Body() createEmailEventDto: CreateEmailEventDto,@Request() req: any,) {
   try {
     const userId = req?.user?.id
     return await this.emailEventService.createEmailEvent(createEmailEventDto,userId);
   } catch (error) {
    throw error
   }
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getEmailEvent(@Param('id') id: number) {
   try {
     return await this.emailEventService.getEmailEvent(id);
   } catch (error) {
    throw error
   }
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateEmailEvent(
    @Param('id') id: number,
    @Body() updateEmailEventDto: UpdateEmailEventDto,
    @Request() req: any
  ) {
    try {
      const userId = req?.user?.id
      return await this.emailEventService.updateEmailEvent(id, updateEmailEventDto,userId);
    } catch (error) {
      throw error
    }
  }


  @SerializeOptions({
    groups: ['admin'],
  })
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteEmailEvent(@Param('id') id: number, @Request() req: any) {
   try {
    const userId = req?.user?.id
     return await this.emailEventService.deleteEmailEvent(id,userId);
   } catch (error) {
    throw error
   }
  }

  @SerializeOptions({ groups: ['admin'] })
  @Post('all-list')
  @HttpCode(HttpStatus.OK)
  async getLabelsAdvance(@Query() query: EmailEventDtoAdvance, @GetUser() user: User,  @Body() body: ApplyListFilterSortColumnDto,) {
    try {
      const { limit = 10, page = 1 } = query || {};
      return await this.emailEventService.getAllEmailEventsAdvance(
        user.id,
        limit,
        page,
        body,
      );
    } catch (error) {
      throw error
    }
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @HttpCode(HttpStatus.OK)
  @Get(':id/mappings')
  async getEmailMappings(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<EmailMapping[]> {
   try {
     return await this.emailEventService.getEmailMappings(id);
   } catch (error) {
    throw error
   }
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @HttpCode(HttpStatus.OK)
  @Patch('email-mapping/:id')
  async updateEmailMapping(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmailMapping: UpdateEmailMappingDto,
  ): Promise<void> {
   try {
     return await this.emailEventService.updateMapping(id, updateEmailMapping?.headerFooterId,updateEmailMapping?.bodyContentId);
   } catch (error) {
    throw error
   }
  }

}
  