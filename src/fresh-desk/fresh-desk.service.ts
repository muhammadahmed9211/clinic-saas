import axios from 'axios';
import FormData from 'form-data';
import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTicketDTO, ReplyTicketDTO } from './dto/create-tickets.dto';
import { PaginationFilterDto } from './dto/pagination-filter.dto';
import qs from 'qs';
import { AllConfigType } from 'src/config/config.type';
import { ConfigService } from '@nestjs/config';
import { I18nContext } from 'nestjs-i18n';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import { FreshDeskLogs } from './entities/freshdesk-logs.entity';
import * as flatted from 'flatted';

@Injectable()
export class FreshDeskService {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(FreshDeskLogs)
    private readonly freshDeskLogsRepository: Repository<FreshDeskLogs>,    
  ) { }

  get baseUrl() {
    const apiUrl = this.configService.get('freshdesk.FRESHDESK_API_URL', {
      infer: true,
    });
    return apiUrl;
  }

  get apiKey(): string {
    const key = this.configService.get('freshdesk.FRESHDESK_API_KEY', {
      infer: true,
    });
    if (key) {
      return key;
    } else {
      throw new Error('API key not found in configuration.');
    }
  }

  get password(): string {
    const password = this.configService.get('freshdesk.FRESHDESK_PASSWORD', {
      infer: true,
    });
    if (password) {
      return password;
    } else {
      throw new Error('Password not found in configuration.');
    }
  }

  get groupId(): number {
    const groupId = this.configService.get('freshdesk.FRESHDESK_GROUP_ID', {
      infer: true,
    });
    if (groupId) {
      return groupId;
    } else {
      throw new Error('Group not found in configuration.');
    }
  }

  async openTicket(
    createTicketDTO: CreateTicketDTO,
    file: Express.Multer.File | Express.MulterS3.File,
    req: any,
  ): Promise<any> {

    const userId = req.user.id
    const userData = await this.userRepository.findOne({ where: { id: userId } })

    if (!userData) {
      throw new BadRequestException("User not found")
    }
    const { message, subject, type } = createTicketDTO;
    const email = req.user.email;
    const fullName = `${userData.firstName} ${userData.lastName}`;
    const i18n = I18nContext.current();

    const formData = new FormData();
    formData.append('name', fullName);
    formData.append('email', email);
    formData.append('subject', subject);
    formData.append('description', message);
    formData.append('type', type);
    formData.append('status', '2');
    formData.append('priority', '3');
    formData.append('group_id', this.groupId);
    if (file && file.buffer) {
      formData.append('attachments[]', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });
    }

    try {
      const url = `${this.baseUrl}/tickets`;
      const response = await axios.post(url, formData, {
        auth: {
          username: this.apiKey,
          password: this.password,
        },
        headers: {
          ...formData.getHeaders(),
        },
      });

      const payload = flatted.stringify(response); 
        
        const freshdeskLog = this.freshDeskLogsRepository.create({
          userId: req.user.id,
          user_email: email,
          payload_res: payload, 
          actions: 'ticketCreated',
        });
    
        await this.freshDeskLogsRepository.save(freshdeskLog);

      return response.data;
    } catch (err) {
      const message = await i18n?.t('errors.auth.creatingTicket');
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: {
            msg: message,
          },
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async replyToTicket(
    replyTicketDTO: ReplyTicketDTO,
    file: Express.Multer.File | Express.MulterS3.File,
    req: any,
    id: number,
  ): Promise<any> {
    const { message } = replyTicketDTO;
    const userEmail = req.user.email;
    const i18n = I18nContext.current();

    const ticketDetails = await axios.get(`${this.baseUrl}/tickets/${id}`, {
      auth: { username: this.apiKey, password: this.password },
    });

    const requesterId = ticketDetails.data.requester_id;

    const requesterDetails = await axios.get(`${this.baseUrl}/contacts/${requesterId}`, {
      auth: { username: this.apiKey, password: this.password },
    });

    const requesterEmail = requesterDetails.data.email;

    if (requesterEmail !== userEmail) {
      throw new HttpException(
        { status: HttpStatus.FORBIDDEN, error: { msg: 'Unauthorized access' } },
        HttpStatus.FORBIDDEN,
      );
    }

    const formData = new FormData();
    formData.append('body', message);
    formData.append('user_id', requesterId.toString());
    if (file && file.buffer) {
      formData.append('attachments[]', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });
    }

    try {
      const url = `${this.baseUrl}/tickets/${id}/reply`;
      const response = await axios.post(url, formData, {
        auth: { username: this.apiKey, password: this.password },
        headers: { ...formData.getHeaders() },
      });

      const payload = flatted.stringify(response); 
      const freshdeskLog = this.freshDeskLogsRepository.create({
        userId: req.user.id,
        user_email: requesterEmail,
        payload_res: payload, 
        actions: 'ticketReplied',
      });

      await this.freshDeskLogsRepository.save(freshdeskLog);

      return response.data;
    } catch (err) {
      const errorMessage = await i18n?.t('errors.auth.replyingToTicket');
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: {
            msg: errorMessage,
          },
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }


  async listAllTicket(params: PaginationFilterDto, req: any): Promise<any> {
    const email = req.user.email;
    const i18n = I18nContext.current();

    const statusString =
      params.status !== undefined ? String(params.status) : '';
    const statusNumber = parseInt(statusString);

    try {
      const query = qs.stringify({
        email,
      });

      const url = `${this.baseUrl}/tickets`;
      const response = await axios.get(`${url}?${query}&per_page=100`, {
        auth: {
          username: this.apiKey,
          password: this.password,
        },
      });

      const count = response.data.length;

      const paginatedResponse = await axios.get(
        `${url}?${query}&page=${params.page}&per_page=${params.limit}`,
        {
          auth: {
            username: this.apiKey,
            password: this.password,
          },
        },
      );

      const result = paginatedResponse.data;

      const filteredResults = response.data.filter(
        (ticket) => ticket.status === statusNumber,
      );
      const filteredResultsCount = filteredResults.length;
      const paginatedResults = paginate(
        filteredResults,
        params.page || 1,
        params.limit || 10,
      );

      const payload = flatted.stringify(response); 
      const freshdeskLog = this.freshDeskLogsRepository.create({
        userId: req.user.id, 
        user_email: email,
        payload_res: payload, 
        actions: 'FetchedAllTicketsResponse',
      });
      await this.freshDeskLogsRepository.save(freshdeskLog);

      if (response.status === 400) {
        return { count: 0, result: [] };
      } else if (count === 0) {
        return { count: 0, result: [] };
      } else {
        if (isNaN(statusNumber) || statusNumber === undefined) {
          return { result, count };
        } else {
          return { result: paginatedResults, count: filteredResultsCount };
        }
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        return { count: 0, result: [] };
      } else {
        const message = i18n?.t('errors.auth.fetchingTicket');
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            error: {
              msg: message,
            },
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
  }

  async listSingleTicket(id: number, req: any): Promise<any> {
    const i18n = I18nContext.current();
    const userEmail = req.user.email;

    try {
      // Fetch ticket details
      const ticketUrl = `${this.baseUrl}/tickets/${id}?include=conversations`;
      const ticketDetails = await axios.get(ticketUrl, {
        auth: {
          username: this.apiKey,
          password: this.password,
        },
      });

      const ticketData = ticketDetails.data;

      // if the ticket is marked as deleted
      if (ticketData.deleted === true) {
        const message = i18n?.t('errors.auth.ticketIdNotFound');
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: { msg: `${message} ${id}` },
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // Fetch requester's details using requester_id
      const requesterId = ticketData.requester_id;
      const requesterDetails = await axios.get(`${this.baseUrl}/contacts/${requesterId}`, {
        auth: {
          username: this.apiKey,
          password: this.password,
        },
      });

      const requesterEmail = requesterDetails.data.email;

      // Compare requester's email with authenticated user's email
      if (requesterEmail !== userEmail) {
        const message = i18n?.t('errors.auth.unauthorizedAccess');
        throw new HttpException(
          { status: HttpStatus.FORBIDDEN, error: { msg: message } },
          HttpStatus.FORBIDDEN,
        );
      }
      const payload = flatted.stringify(ticketData); 
      const freshdeskLog = this.freshDeskLogsRepository.create({
        userId: req.user.id, 
        user_email: requesterEmail,
        payload_res: payload, 
        actions: 'FetchedSingleTicketsResponse',
      });
      await this.freshDeskLogsRepository.save(freshdeskLog);

      // Return ticket data if authorized
      return ticketData;
    } catch (err) {
      if (
        (err.response && err.response.status === 405) ||
        err.response.status === 404
      ) {
        const message = i18n?.t('errors.auth.ticketNotFound');
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: {
              msg: message,
            },
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        const message = i18n?.t('errors.auth.fetchingTicket');
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            error: {
              msg: message,
            },
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
  }

  async deleteTicket(ticketId: number, req: any): Promise<any> {
    const i18n = I18nContext.current();
    const userEmail = req.user.email;

    try {
      // First, fetch the ticket details to check ownership
      const ticketUrl = `${this.baseUrl}/tickets/${ticketId}`;
      const ticketDetails = await axios.get(ticketUrl, {
        auth: {
          username: this.apiKey,
          password: this.password,
        },
      });

      const ticketData = ticketDetails.data;

      // Check if ticket is already deleted
      if (ticketData.deleted === true) {
        const message = i18n?.t('errors.auth.ticketIdNotFound');
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: { msg: `${message} ${ticketId}` },
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // Fetch requester's details using requester_id
      const requesterId = ticketData.requester_id;
      const requesterDetails = await axios.get(`${this.baseUrl}/contacts/${requesterId}`, {
        auth: {
          username: this.apiKey,
          password: this.password,
        },
      });

      const requesterEmail = requesterDetails.data.email;

      // if the authenticated user owns the ticket
      if (requesterEmail !== userEmail) {
        const message = i18n?.t('errors.auth.deletingUnauthorizedTicket');
        throw new HttpException(
          { status: HttpStatus.FORBIDDEN, error: { msg: message } },
          HttpStatus.FORBIDDEN,
        );
      }

      // If authorized, proceed with deletion
      const response = await axios.delete(ticketUrl, {
        auth: {
          username: this.apiKey,
          password: this.password,
        },
      });

      const payload = flatted.stringify(ticketData); 
      const freshdeskLog = this.freshDeskLogsRepository.create({
        userId: req.user.id, 
        user_email: requesterEmail,
        payload_res: payload, 
        actions: 'TicketDeleted',
      });
      await this.freshDeskLogsRepository.save(freshdeskLog);

      return {
        message: 'Ticket deleted successfully',
        statusCode: HttpStatus.OK,
      };


    } catch (err) {
      if (
        (err.response && err.response.status === 405) ||
        err.response.status === 404
      ) {
        const message = await i18n?.t('errors.auth.ticketNotFound');
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: {
              msg: message,
            },
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        const message = await i18n?.t('errors.auth.deletingUnauthorizedTicket');
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            error: {
              msg: message,
            },
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
  }
}

function paginate(array: any[], page: number, limit: number): any[] {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  return array.slice(startIndex, endIndex);
}
