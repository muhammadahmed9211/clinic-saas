import { Body, Controller, Post, Query, UseGuards, Get, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventRegistraionService } from './event-registraion.service';
import { CreateEventRegistrationDto, UpdateEventRegistrationDto } from './dto/create-event-registration.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/entities/user.entity';
import { PaginationDto } from 'src/database/base-repository/dto/pagination.dto';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { ResponseWrapper } from 'src/utils/interface/mt5/base-response.interface';

@ApiTags('Event Registration')
@Controller({ path: 'event-registration', version: '1' })
export class EventRegistraionController {
    constructor(
        private readonly eventRegistrationService: EventRegistraionService,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Create new event registration' })
    @ApiResponse({ status: 201, description: 'The event registration has been successfully created.' })
    @ApiResponse({ status: 400, description: 'Bad request - validation failed.' })
    async create(@Body() createEventRegistrationDto: CreateEventRegistrationDto) {
        try {
            const data = await this.eventRegistrationService.create(createEventRegistrationDto);
            return ResponseWrapper.wrap({
                status: 0,
                statusCode: 201,
                statusText: 'Event registration created successfully',
                data,
            });
        } catch (error) {
            return ResponseWrapper.wrap({
                status: 1,
                statusCode: 400,
                statusText: 'Event registration failed',
                data: error.message,
            });
        }
    }

    @Get(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Get single event registration by ID' })
    @ApiResponse({ status: 200, description: 'Returns the event registration' })
    @ApiResponse({ status: 404, description: 'Event registration not found' })
    @ApiResponse({ status: 400, description: 'Invalid ID parameter' })
    async findOne(@Param('id') id: number) {
        try {
            const eventRegistration = await this.eventRegistrationService.findOne(id);

            if (!eventRegistration) {
                return ResponseWrapper.wrap({
                    status: 1,
                    statusCode: 404,
                    statusText: 'Event registration not found',
                    data: null,
                });
            }

            return ResponseWrapper.wrap({
                status: 0,
                statusCode: 200,
                statusText: 'Event registration retrieved successfully',
                data: eventRegistration,
            });
        } catch (error) {
            return ResponseWrapper.wrap({
                status: 1,
                statusCode: 400,
                statusText: 'Failed to retrieve event registration',
                data: error.message,
            });
        }
    }

    @Patch(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Update an event registration' })
    @ApiResponse({ status: 200, description: 'The event registration has been successfully updated.' })
    @ApiResponse({ status: 400, description: 'Event registration not found' })
    @ApiResponse({ status: 404, description: 'Event registration not found' })
    async update(
        @Param('id') id: number,
        @Body() updateEventRegistrationDto: UpdateEventRegistrationDto,
        @GetUser() user: User,
    ) {
        const data = await this.eventRegistrationService.update(id, updateEventRegistrationDto, user.id);

        return ResponseWrapper.wrap({
            status: 0,
            statusCode: 200,
            statusText: 'Event registration updated successfully',
            data,
        });
    }

    @Post('list')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Get event registration list with pagination and filters' })
    @ApiResponse({ status: 200, description: 'Returns event registration list with pagination' })
    async getList(
        @Query() pagination: PaginationDto,
        @Body() dto: ApplyListFilterSortColumnDto,
        @GetUser() user: User,
    ) {
        const limit = pagination.limit || 10;
        const page = pagination.page || 1;

        return await this.eventRegistrationService.getEventRegistrationList({
            userId: user.id,
            limit,
            page,
            dto,
        });
    }
}
