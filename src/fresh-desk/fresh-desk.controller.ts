import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Request,
  UseInterceptors,
  UploadedFile,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateTicketDTO, ReplyTicketDTO } from './dto/create-tickets.dto';
import { FreshDeskService } from './fresh-desk.service';
import { PaginationFilterDto } from './dto/pagination-filter.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('FreshDesk')
@Controller({
  path: 'freshdesk',
  version: '1',
})
export class FreshDeskController {
  constructor(private readonly freshDeskService: FreshDeskService) { }

  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async openTicket(
    @UploadedFile() file: Express.Multer.File | Express.MulterS3.File,
    @Body() createTicketDTO: CreateTicketDTO,
    @Request() req,
  ): Promise<any> {
    try {
      return await this.freshDeskService.openTicket(createTicketDTO, file, req);
    } catch (error) {
      throw error;
    }
  }

  @ApiConsumes('multipart/form-data')
  @Post('/tickets/:id/reply')
  @UseInterceptors(FileInterceptor('file'))
  async replyToTicket(
    @UploadedFile() file: Express.Multer.File | Express.MulterS3.File,
    @Body() replyTicketDTO: ReplyTicketDTO,
    @Request() req,
    @Param('id') id: number,
  ): Promise<any> {
    try {
      return await this.freshDeskService.replyToTicket(
        replyTicketDTO,
        file,
        req,
        id,
      );
    } catch (error) {
      throw error;
    }
  }

  @Get('list-all-tickets')
  async listAllTicketController(
    @Query() query: PaginationFilterDto,
    @Request() req,
  ): Promise<any> {
    try {
      return await this.freshDeskService.listAllTicket(query, req);
    } catch (err) {
      throw err;
    }
  }

  @Get('list-single-ticket/:id')
  async listSingleTicket(
    @Param('id') id: number,
    @Request() req,
  ): Promise<any> {
    try {
      return await this.freshDeskService.listSingleTicket(id, req);
    } catch (err) {
      throw err;
    }
  }

  @Delete('delete-single-ticket/:id')
  async deleteTicket(@Param('id') id: number, @Request() req,): Promise<any> {
    try {
      return await this.freshDeskService.deleteTicket(id, req);
    } catch (err) {
      throw err;
    }
  }
}
