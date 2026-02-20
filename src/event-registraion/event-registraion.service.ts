import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventRegistration } from './entities/event-registration.entity';
import { CreateEventRegistrationDto, UpdateEventRegistrationDto } from './dto/create-event-registration.dto';
import { Lead } from 'src/admin/leads/entities/lead.entity';
import { LeadsService } from 'src/admin/leads/leads.service';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { FilterOperation } from 'src/database/base-repository/dto/advance-search.dto';
import { ListNames } from 'src/list-item/dto/create-list-item.dto';
import { EventRegistrationRepository } from './repositories/event-registration.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventTypes } from 'src/common/services/event.type';
import { entityType } from 'src/admin/active-log/active-log.type';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class EventRegistraionService {
    constructor(
        private readonly eventRegistrationRepo: EventRegistrationRepository,
        @InjectRepository(Lead)
        private readonly leadRepo: Repository<Lead>,
        private readonly leadsService: LeadsService,
        private readonly eventEmitter: EventEmitter2,
    ) { }

    async checkLeadExistsByEmail(email: string): Promise<Lead | null> {
        if (!email) return null;

        return await this.leadRepo.findOne({
            where: { email, isActive: true },
            select: ['id', 'firstName', 'lastName', 'email', 'phoneNumber', 'createdAt']
        });
    }

    async create(createEventRegistrationDto: CreateEventRegistrationDto): Promise<{
        success: boolean,
        eventRegistration: EventRegistration,
        lead: Lead | null,
        leadCreated: boolean,
        error?: string
    }> {
        console.log(createEventRegistrationDto, "createEventRegistrationDto");

        try {
            // Step 1: Create event registration first
            const saveObject = {
                ...createEventRegistrationDto,
                phoneNumber: createEventRegistrationDto.telephonePrefix && createEventRegistrationDto.telephone
                    ? `${createEventRegistrationDto.telephonePrefix}${createEventRegistrationDto.telephone}`
                    : '',
                question: JSON.stringify(createEventRegistrationDto.customQuestion),
                source: createEventRegistrationDto.source || "Website",
            }

            const eventRegistration = this.eventRegistrationRepo.create(saveObject);
            const savedEventRegistration = await this.eventRegistrationRepo.save(eventRegistration);
            console.log("Event registration created successfully");

            // Step 2: Check if lead exists with this email
            let existingLead = await this.checkLeadExistsByEmail(createEventRegistrationDto.email);
            let leadCreated = false;

            if (existingLead) {
                console.log(`Existing lead found with email ${createEventRegistrationDto.email}:`, existingLead);
            } else {
                console.log(`No lead found with email ${createEventRegistrationDto.email}, creating new lead...`);

                // Step 3: Create new lead using existing LeadsService.create method
                try {
                    // Use existing LeadsService.create method (same as auth controller)
                    existingLead = await this.leadsService.create(createEventRegistrationDto, undefined, false); // no email sending
                    leadCreated = true;
                    console.log("New lead created successfully:", existingLead);
                } catch (leadError) {
                    console.error("Error creating lead:", leadError);
                    // Event registration was successful, but lead creation failed
                    return {
                        success: true, // Event registration was successful
                        eventRegistration: savedEventRegistration,
                        lead: null,
                        leadCreated: false,
                        error: `Event registered successfully, but failed to create lead: ${leadError.message}`
                    };
                }
            }

            return {
                success: true,
                eventRegistration: savedEventRegistration,
                lead: existingLead,
                leadCreated: leadCreated
            };

        } catch (error) {
            console.error("Error in event registration process:", error);
            throw error; // Re-throw to be handled by controller
        }
    }

    async findOne(id: number): Promise<EventRegistration | null> {
        try {
            const eventRegistration = await this.eventRegistrationRepo.findOne({
                where: { id, isActive: true },
            });

            if (!eventRegistration) {
                return null;
            }

            // Parse the question field back to object if it exists
            if (eventRegistration.question) {
                try {
                    eventRegistration.question = JSON.parse(eventRegistration.question as string);
                } catch (parseError) {
                    console.error("Error parsing question field:", parseError);
                    // Keep the original string value if parsing fails
                }
            }

            return eventRegistration;
        } catch (error) {
            console.error("Error finding event registration:", error);
            throw error;
        }
    }

    async update(id: number, updateEventRegistrationDto: UpdateEventRegistrationDto, userId: number): Promise<EventRegistration> {
        // First, get the existing event registration
        const existingEventRegistration = await this.eventRegistrationRepo.findOne({
            where: { id, isActive: true },
        });

        if (!existingEventRegistration) {
            throw new BadRequestException('Event registration not found');
        }
        // Parse the existing question field for comparison
        let existingParsedQuestion = null;
        if (existingEventRegistration.question) {
            try {
                existingParsedQuestion = JSON.parse(existingEventRegistration.question as string);
            } catch (parseError) {
                console.error("Error parsing existing question field:", parseError);
            }
        }

        // Create a copy of existing data for activity log
        const oldData = {
            ...existingEventRegistration,
            question: existingParsedQuestion
        };

        try {
            // Prepare update data - exclude fields that don't map directly to entity
            const { customQuestion, ...directFields } = updateEventRegistrationDto;

            const updateData: any = {
                ...directFields,
                updatedAt: new Date(),
            };

            // Handle phone number concatenation if telephone fields are provided
            if (updateEventRegistrationDto.telephonePrefix && updateEventRegistrationDto.telephone) {
                updateData.phoneNumber = `${updateEventRegistrationDto.telephonePrefix}${updateEventRegistrationDto.telephone}`;
            }
            // Handle custom question JSON stringification
            if (customQuestion) {
                updateData.question = JSON.stringify(customQuestion);
            }

            // Update the event registration
            await this.eventRegistrationRepo.update(id, updateData);

            // Get the updated event registration
            const updatedEventRegistration = await this.eventRegistrationRepo.findOne({
                where: { id },
            });

            if (!updatedEventRegistration) {
                throw new BadRequestException('Failed to retrieve updated event registration');
            }

            // Parse the updated question field for activity log
            let updatedParsedQuestion = null;
            if (updatedEventRegistration.question) {
                try {
                    updatedParsedQuestion = JSON.parse(updatedEventRegistration.question as string);
                } catch (parseError) {
                    console.error("Error parsing updated question field:", parseError);
                }
            }

            // Prepare new data for activity log
            const newData = {
                ...updatedEventRegistration,
                question: updatedParsedQuestion
            };

            // Emit activity log event
            this.eventEmitter.emit(EventTypes.USER_LOG, {
                newData: newData,
                oldData: oldData,
                entityId: id,
                entityType: entityType.EVENT_REGISTRATION,
                performerId: userId,
                performerType: 'Operator',
                field: 'Update Event Registration',
            });

            // Return the updated event registration with parsed question
            const result = { ...updatedEventRegistration };
            if (updatedParsedQuestion !== null) {
                result.question = updatedParsedQuestion;
            }
            return result;

        } catch (error) {
            console.error("Error updating event registration:", error);
            throw error;
        }
    }

    async getEventRegistrationList(payload: {
        userId: number;
        limit: number;
        page: number;
        dto: ApplyListFilterSortColumnDto;
    }) {
        const { userId, limit, page, dto } = payload;
        const filters = [
            {
                name: 'isActive',
                operation: FilterOperation.EQUALS,
                value: [true],
            },
        ];
        return this.eventRegistrationRepo.advanceFilters({
            listName: ListNames.EVENT_REGISTRATION,
            userId,
            limit,
            page,
            filters,
            relations: [],
            filterList: dto?.filters || undefined,
            sortList: dto.sort || undefined,
            defaultSortKey: 'createdAt',
            listViewId: dto.listViewId,
            overrideFilters: true,
            orList: dto.or,
        });
    }
}
