import { Body, Controller, Get, Post } from '@nestjs/common';
import { EventCreateDto } from './dto/create-event.dto';
import { EventService } from './event.service';
import { ApiTags } from '@nestjs/swagger';
import { Event } from './entities/events.entity';

@ApiTags('Event')
@Controller({ path: 'event', version: '1' })
export class EventController {
  constructor(private readonly eventService: EventService) {}
  @Post()
  async create(@Body() body: EventCreateDto) {
    return await this.eventService.create(body);
  }

  @Get()
  async getAll(): Promise<Event[] | []> {
    return await this.eventService.getAll();
  }
}
