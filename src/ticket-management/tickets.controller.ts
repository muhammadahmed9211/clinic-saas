import { Controller, Post, Body, Patch, HttpCode, HttpStatus, Param, Get, Delete, Request, UseGuards, Query, NotFoundException, } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { AuthGuard } from '@nestjs/passport';
import { AddCommentDto, CreateClientTicketsDto, CreateTicketsDto, DeleteAccountTicketDto, MergeTicketsDto, ReplyClientTicketsDto, ReplyTicketsDto, TicketPriority, TicketStatus, UpdateTicketsDto } from './dto/tickets.dto';
import { PaginationDto } from 'src/database/base-repository/dto/pagination.dto';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import { TicketPaginationFilterDto } from 'src/fresh-desk/dto/tickets-pagination.dto';
import { User } from 'src/users/entities/user.entity';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { ServiceAuthGuard } from 'src/common/guards/ticket-service.guard';
import { OtpTypes } from 'src/users/entities/otp.entity';
import { OtpService } from 'src/otp/otp.service';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Admin Tickets')
@Controller({
  path: 'admin/tickets',
  version: '1',
})
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) { }

  @Get('email-list')
  @HttpCode(HttpStatus.OK)
  async emailList() {
    try {
    const data = await this.ticketsService.emailList();
    return {statusCode: 200, message:'Email list fetched successfully', data}
    } catch (error) {
      throw error
    }
  }

  @Post('create')
  async create(
    @Body() createTicketDto: CreateTicketsDto,
    @Request() req,
  ) {
    return await this.ticketsService.createAdminTicket(createTicketDto, req);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateTicket(
    @Param('id') id: number,
    @Body() updateTicketDto: UpdateTicketsDto,
    @Request() req
  ) {
    return this.ticketsService.updateTicketsRoleWise(id, updateTicketDto, req);
  }

  // @Get()
  // @HttpCode(HttpStatus.OK)
  // async getAllTickets(@Request() req) {
  //   return this.ticketsService.getAll(req);
  // }

  @Get('listCategories')
  @HttpCode(HttpStatus.OK)
  async listCategories(@Request() req) {
    return this.ticketsService.listCategories(req);
  }

  @Get(':categoryId/desks')
  async getDesksByCategory(@Param('categoryId') categoryId: number) {
    const desks = await this.ticketsService.listDesks(categoryId);
    if (!desks.length) {
      throw new NotFoundException(`No desks found for category ID ${categoryId}`);
    }
    return desks;
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  async searchTickets(
    @Query('search') search: string,
    @Query() query: PaginationDto,
    @Request() req: any,
  ) {
    return this.ticketsService.searchTicketsRoleWise(req,query,search);
  }

  @Post('listTickets')
  @HttpCode(HttpStatus.OK)
  async listTickets(
    @Request() req: any,
    @Query() query: PaginationDto,
    @Body() body: ApplyListFilterSortColumnDto,
  ): Promise<any> {
    return this.ticketsService.listTickets(req, query, body);
  }

  @Post('clientTickets/:id')
  @HttpCode(HttpStatus.OK)
  async clientTickets(
    @Request() req: any,
    @Query() query: PaginationDto,
    @Body() body: ApplyListFilterSortColumnDto,
    @Param('id') id: number,
  ): Promise<any> {
    return this.ticketsService.clientTickets(req, query, body, id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getTicketById(
    @Param('id') ticketId: number,
    @Request() req,
    @Query() query: PaginationDto,
  ) {
    return this.ticketsService.getTicketDetailsRoleWise(ticketId, req, query);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteTicket(
    @Param('id') ticketId: number,
    @Request() req
  ) {
    return this.ticketsService.deleteTicketRoleWise(ticketId, req);
  }

  @Post(':id/replyTicket')
  replyTicket(
    @Param('id') ticketId: number,
    @Body() replyTicketDto: ReplyTicketsDto,
    @Request() req,
  ) {
   try {
     return this.ticketsService.postReplyRoleWise(ticketId, replyTicketDto, req);
   } catch (error) {
    console.log('error: ', error);
    throw error
   }
  }

  @Get('created-for/:id/ticket-history')
  @HttpCode(HttpStatus.OK)
  async getTicketHistory(
    @Param('id') createdForId: number,
    @Request() req,) {
   try {
     const tickets = await this.ticketsService.getTicketHistory(createdForId,req);
     return {statusCode: 200, message:'Tickets fetched successfully', data:tickets}
   } catch (error) {
    throw error
   }
  }

  @Post('merge')
  @HttpCode(HttpStatus.OK)
  async mergeTickets(
    @Body() dto: MergeTicketsDto,
    @Request() req,
  ) {
    return this.ticketsService.mergeTicketsRoleWise(dto, req);
  }

  @Get('merge-tickets/:id')
  @HttpCode(HttpStatus.OK)
  async getMergeTickets(
    @Param('id') ticketId: number,
    @Request() req,
  ) {
   try {
     return this.ticketsService.getMergeTickets(ticketId,req);
   } catch (error) {
    throw error
   }
  }

  @Get('cron/auto-close-tickets')
  @HttpCode(HttpStatus.OK)
  async autoCloseTicket()
    {
   try {
     const tickets = await this.ticketsService.autoCloseResolvedTickets();
     return {statusCode: 200, message:'Tickets closed successfully', data:tickets}
   } catch (error) {
    throw error
   }
  }

  @Get('cron/auto-permanently-close-tickets')
  @HttpCode(HttpStatus.OK)
  async autoPermanentlyCloseTicket()
    {
   try {
     const tickets = await this.ticketsService.autoPermanentlyCloseTickets();
     return {statusCode: 200, message:'Tickets closed successfully', data:tickets}
   } catch (error) {
    throw error
   }
  }
}


@ApiBearerAuth()
@Roles(
  RoleEnum.client,
  RoleEnum.super_admin
)
@UseGuards(AuthGuard('jwt'),
  RolesGuard
)
@ApiTags('Client Tickets')
@Controller({
  path: 'client/tickets',
  version: '1',
})
export class ClientTicketsController {
  constructor(private readonly ticketsService: TicketsService, private readonly otpService: OtpService) { }

  @Post('create')
  async create(
    @Body() createClientTicketsDto: CreateClientTicketsDto,
    @Request() req,
  ) {
    return await this.ticketsService.createClientTicket(createClientTicketsDto, req);
  }
//elm acc deletion
  @Post('delete-account-request')
  @HttpCode(HttpStatus.OK)
  async requestAccountDeletion(
    @Body() body: DeleteAccountTicketDto,
    @Request() req,
  ) {
    await this.otpService.isOTPisVerifiedinTimeSpan({
    verificationId: body.verificationId,
    email: req.user?.email ?? "",
    type: OtpTypes.verify_account_deletion, 
  });

  return this.ticketsService.createAccountDeletionTicket(body.reasons || [], req);
  }

  @Delete('cancel-deletion-request/:id')
  async cancelDeletion(@Param('id') id: number, @Request() req): Promise<any> {
  return this.ticketsService.cancelDeletionRequest(+id, req);
}

@Get('account-deletion-request-status')
@HttpCode(HttpStatus.OK)
async hasExistingAccountDeletionRequest(@Request() req) {
  return this.ticketsService.checkOpenAccountDeletionTicket(req.user.id);
}
  // @Patch(':id')
  // @HttpCode(HttpStatus.OK)
  // async updateTicket(
  //   @Param('id') id: number,
  //   @Body() updateTicketDto: UpdateTicketsDto,
  //   @Request() req
  // ) {
  //   return this.ticketsService.updateClientTicket(id, updateTicketDto, req);
  // }

  @Get('tickets-list')
  async getAllTickets(
    @Query() query: TicketPaginationFilterDto,
    @Request() req,
  ): Promise<any> {
    return this.ticketsService.getAllClientTickets(query, req);
  }

  @Get('listCategories')
  @HttpCode(HttpStatus.OK)
  async listCategories(@Request() req) {
    return this.ticketsService.listCategories(req);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getTicketById(
    @Param('id') ticketId: number,
    @Request() req,
  ) {
    return this.ticketsService.getOneClientTicket(ticketId, req);
  }

  // @Delete(':id')
  // @HttpCode(HttpStatus.OK)
  // async deleteTicket(
  //   @Param('id') ticketId: number,
  //   @Request() req
  // ) {
  //   return this.ticketsService.deletClientTicket(ticketId, req);
  // }

  @Post(':id/replyTicket')
  replyTicket(
    @Param('id') ticketId: number,
    @Body() replyClientTicketsDto: ReplyClientTicketsDto,
    @Request() req,
  ) {
    return this.ticketsService.replyClientTicket(ticketId, replyClientTicketsDto, req);
  }

  // @Patch(':id/notes')
  // async addComment(
  //   @Param('id') ticketId: number,
  //   @Body() addCommentDto: AddCommentDto,
  //   @Request() req
  // ) {
  //   return this.ticketsService.addComment(ticketId, addCommentDto, req);
  // }
}

@ApiTags('Support Tickets')
@UseGuards(ServiceAuthGuard)
@Controller({
  path: 'support/tickets',
  version: '1',
})
export class SupportTicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post(':id')
  async create(
    @Body() createClientTicketsDto: CreateClientTicketsDto,
    @Param('id') userId: number,
  ) {
    try {
      return await this.ticketsService.createClientTicket(createClientTicketsDto,null,userId,createClientTicketsDto?.email)
    } catch (error) {
      throw error
    }
  }

  @Post(':id/replyTicket')
  replyTicket(
    @Param('id') ticketId: number,
    @Body() replyClientTicketsDto: ReplyClientTicketsDto,
  ) {
   try {
     const userId = replyClientTicketsDto?.userId
     const email = replyClientTicketsDto?.email
     return this.ticketsService.replyClientTicket(ticketId, replyClientTicketsDto,null,userId,email);
   } catch (error) {
    throw error
   }
  }

  @Post('create-operator-ticket/:id')

  async createOperatorTicket(
    @Param('id') userId: number,
    @Body() createTicketDto: CreateTicketsDto,

  ) {
    try {
      return await this.ticketsService.createAdminTicket(createTicketDto, null, userId,createTicketDto?.email);
    } catch (error) {
      throw error
    }
  }

  @Post(':id/reply-operator-ticket')
  replyOperatorTicket(
    @Param('id') ticketId: number,
    @Body() replyTicketDto: ReplyTicketsDto,
  ) {
   try {
    const userId = replyTicketDto?.userId
     return this.ticketsService.postReplyRoleWise(ticketId, replyTicketDto, null, userId,replyTicketDto?.email);
   } catch (error) {
    console.log('error: ', error);
    throw error
   }
  }


}