import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsOptional, IsArray, IsInt, IsNumber, ArrayMinSize, ArrayNotEmpty, ArrayMaxSize, IsEmail } from 'class-validator';

export enum TicketPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
}

export enum CreatedFor {
    CLIENT = 'CLIENT',
    OPERATOR = 'OPERATOR',
}

export enum TicketStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    RESOLVED = 'RESOLVED',
    CLOSED = 'CLOSED',
    PENDING = 'PENDING',
    WAITING_ON_CUSTOMER = 'WAITING_ON_CUSTOMER',
    WAITING_ON_THIRD_PARTY = 'WAITING_ON_THIRD_PARTY',
    WAITING_ON_PAYMENTS = 'WAITING_ON_PAYMENTS',
    WAITING_FOR_IB_CREATION = 'WAITING_FOR_IB_CREATION',
    WAITING_FOR_APPROVAL = 'WAITING_FOR_APPROVAL',
    WAITING_ON_RETENTION = 'WAITING_ON_RETENTION',
}

export enum TicketEmails {
    TICKET_CREATE_CLIENT = 'TICKET_CREATE_CLIENT',
    TICKET_RESOLUTION_CLIENT = 'TICKET_RESOLUTION_CLIENT',
    TICKET_REPLY_CLIENT_VIA_OPERATOR = 'TICKET_REPLY_CLIENT_VIA_OPERATOR',
    TICKET_REPLY_CLIENT_TO_OPERATOR = 'TICKET_REPLY_CLIENT_TO_OPERATOR',
    TICKET_REPLY_OPERATOR = 'TICKET_REPLY_OPERATOR',
    TICKET_CREATE_OPERATOR = 'TICKET_CREATE_OPERATOR',
    TICKET_ASSIGN_DESK = 'TICKET_ASSIGN_DESK',
    TICKET_ASSIGN_OPERATOR = 'TICKET_ASSIGN_OPERATOR',
    TICKET_ASSIGN_COLLABORATOR = 'TICKET_ASSIGN_COLLABORATOR',
    TICKET_RESOLVED_OPERATOR = 'TICKET_RESOLVED_OPERATOR',
    TICKET_CLOSE_CLIENT = 'TICKET_CLOSE_CLIENT',
    TICKET_CLOSE_OPERATOR = 'TICKET_CLOSE_OPERATOR',
    TICKET_PERMANENT_CLOSE_OPERATOR = 'TICKET_PERMANENT_CLOSE_OPERATOR',
    TICKET_MERGE_OPERATOR = 'TICKET_MERGE_OPERATOR',
}

export enum TicketEmailSubjects {
    TICKET_CREATE_CLIENT_ENGLISH = 'Ticket Creation Notification',
    TICKET_CREATE_CLIENT_ARABIC = 'إشعار إنشاء تذكرة',
    TICKET_RESOLUTION_CLIENT_ENGLISH = 'Ticket Resolution Notification',
    TICKET_RESOLUTION_CLIENT_ARABIC = 'إشعار معالجة التذكرة ',
    TICKET_REPLY_CLIENT_TO_OPERATOR = 'New Reply Received',
    TICKET_REPLY_CLIENT_VIA_OPERATOR_ENGLISH = 'Ticket Reply Notification',
    TICKET_REPLY_CLIENT_VIA_OPERATOR_ARABIC = 'إشعار رد التذكرة',
    TICKET_CREATE_OPERATOR = 'Ticket Assigned for you',
    TICKET_ASSIGN_DESK = 'Ticket Assigned to Desk',
    TICKET_ASSIGN_OPERATOR = 'Ticket Assignment',
    TICKET_ASSIGN_COLLABORATOR = 'Ticket Collaboration',
    TICKET_REPLY_OPERATOR = 'New Reply on Ticket',
    TICKET_RESOLVED_OPERATOR = 'Ticket Resolved',
    TICKET_CLOSE_CLIENT_ENGLISH = 'Ticket Closed Notification',
    TICKET_CLOSE_CLIENT_ARABIC = 'إشعار إغلاق التذكرة',
    TICKET_CLOSE_OPERATOR = 'Support Ticket Closed',
    TICKET_PERMANENT_CLOSE_OPERATOR = 'Support Ticket Closed',
    TICKET_MERGE_OPERATOR = 'Support Ticket Merged & Closed',
}

export class CreateTicketsDto {
    @ApiProperty({
        example: 'Passport Renewal',
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'I am unable to access the dashboard after logging in.' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        example: ['FB23433E-F36B-1410-8F7A-001268AAE5F5', 'FB23433E-F36B-1410-8F7A-001268AAE5F5'],
        description: 'An array of string IDs.',
        required: false,
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    attachments?: string[];

    @ApiProperty({
        description: 'Ticket category',
        type: Number,
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    category_id: number;

    @ApiProperty({
        description: 'Ticket category',
        type: Number,
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    deskId: number | undefined;

    @ApiProperty({
        enum: TicketPriority,
        enumName: 'TicketPriority',
        description: 'High Medium Low',
    })
    @IsNotEmpty()
    @IsEnum(TicketPriority)
    priority: TicketPriority;

    // @ApiProperty({
    //     description: 'Requested by',
    //     type: Number,
    //     example: 1,
    // })
    // @IsOptional()
    // @IsNumber()
    // requestedBy: number;

    @ApiProperty({
        enum: CreatedFor,
        enumName: 'CreatedFor',
        description: 'Lead Client Operator',
    })
    @IsNotEmpty()
    @IsEnum(CreatedFor)
    createdFor: CreatedFor;


    @ApiProperty({
        description: 'Created For ticket id',
        type: Number,
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    createdForId: number;

    @ApiProperty({
        description: 'Array of collaborator IDs assigned to the ticket',
        example: [1, 2, 3],
        type: [Number],
      })
      @IsOptional()
      @IsArray()
      @IsInt({ each: true })
      collaboratorIds?: number[];

    @ApiProperty({
        description: 'ID of the assignee assigned to the ticket',
        example: 1,
        type: Number,
    })
    @IsInt()
    @IsOptional()
    assigneeId?: number;

    userId?: number;
    email?:string;

    @ApiProperty({ example: 'admin@example.com' })
    @IsString()
    @IsOptional()
    fromEmail?: string;

    @ApiProperty({
        example: ['admin@example.com','admin2@example.com']
    })
    @IsOptional()
    @IsArray()
    @ArrayMinSize(1, { message: 'At least one value must be provided' })
    cc?: string[];


    @ApiProperty({
        example: ['admin@example.com','admin2@example.com']
    })
    @IsOptional()
    @IsArray()
    @ArrayMinSize(1, { message: 'At least one value must be provided' })
    bcc?: string[];
}

export class CreateClientTicketsDto {
    @ApiProperty({
        example: 'Passport Renewal',
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'I am unable to access the dashboard after logging in.' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        example: ['FB23433E-F36B-1410-8F7A-001268AAE5F5', 'FB23433E-F36B-1410-8F7A-001268AAE5F5'],
        description: 'An array of string IDs.',
        required: false,
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    attachments?: string[];

    @ApiProperty({
        description: 'Ticket category',
        type: Number,
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    category_id: number;

    email?: string;

    @ApiProperty({ example: 'admin@example.com' })
    @IsString()
    @IsOptional()
    fromEmail?: string;

    // @ApiProperty({
    //     enum: TicketPriority,
    //     enumName: 'TicketPriority',
    //     description: 'High Medium Low',
    // })
    // @IsOptional()
    // @IsEnum(TicketPriority)
    // priority: TicketPriority;



    // @ApiProperty({
    //     description: 'ID of the collaborator assigned to the ticket',
    //     example: 1,
    //     type: Number,
    // })
    // @IsOptional()
    // @IsInt()
    // collaboratorId?: number;

    // @ApiProperty({
    //     description: 'ID of the assignee assigned to the ticket',
    //     example: 1,
    //     type: Number,
    // })
    // @IsOptional()
    // @IsInt()
    // assigneeId?: number;
}
export class ReplyTicketsDto {
    @ApiProperty({
        example: 'Passport Renewal',
    })
    @IsString()
    @IsOptional()
    title: string;

    @ApiProperty({
        example: 'admin@example.com'
    })
    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1, { message: 'At least one value must be provided' })
    to: string[];


    @ApiProperty({
        example: ['admin@example.com','admin2@example.com']
    })
    @IsOptional()
    @IsArray()
    @ArrayMinSize(1, { message: 'At least one value must be provided' })
    cc?: string[];


    @ApiProperty({
        example: ['admin@example.com','admin2@example.com']
    })
    @IsOptional()
    @IsArray()
    @ArrayMinSize(1, { message: 'At least one value must be provided' })
    bcc?: string[];
    

    @ApiProperty({
        example: 'admin@example.com'
    })
    @IsNotEmpty()
    @IsString()
    from: string;
    
    @ApiProperty({
        example: 'This is a reply message'
    })
    @IsNotEmpty()
    @IsString()
    message: string;

    @ApiProperty({
        example: ['FB23433E-F36B-1410-8F7A-001268AAE5F5', 'FB23433E-F36B-1410-8F7A-001268AAE5F5'],
        description: 'An array of string IDs.',
        required: false,
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    attachments?: string[];

    platform?: string;
    userId?: number;
    
    messageId?: string;
    email?:string;
}

export class ReplyClientTicketsDto {
    @ApiProperty({
        example: 'Passport Renewal',
    })
    @IsString()
    @IsOptional()
    title: string;

    @ApiProperty({
        example: 'This is a reply message'
    })
    @IsNotEmpty()
    @IsString()
    message: string;

    @ApiProperty({
        example: ['FB23433E-F36B-1410-8F7A-001268AAE5F5', 'FB23433E-F36B-1410-8F7A-001268AAE5F5'],
        description: 'An array of string IDs.',
        required: false,
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    attachments?: string[];

    userId?: number;
    to?: string[];
    from?: string;
    cc?: string[];
    bcc?: string[];
    platform?: string;
    email?: string;
    messageId?: string;
}

export class UpdateTicketsDto {
    @ApiProperty({
        enum: TicketStatus,
        enumName: 'TicketStatus',
        description: 'Open In_Progress Resolved Closed',
    })
    @IsOptional()
    @IsEnum(TicketStatus)
    status: TicketStatus;

    @ApiProperty({
        enum: TicketPriority,
        enumName: 'TicketPriority',
        description: 'High Medium Low',
    })
    @IsOptional()
    @IsEnum(TicketPriority)
    priority: TicketPriority;

    @ApiProperty({
        description: 'Ticket category',
        type: Number,
        example: 1,
    })
    @IsOptional()
    @IsNumber()
    category_id: number;

    @ApiProperty({
        description: 'Ticket desk',
        type: Number,
        example: 1,
    })
    @IsOptional()
    @IsNumber()
    desk_id: number;

    @ApiProperty({
        description: 'Ticket Assignee',
        type: Number,
        example: 1,
    })
    @IsOptional()
    @IsNumber()
    assignedTo: number;

    @ApiProperty({
        description: 'Array of collaborator IDs assigned to the ticket',
        example: [1, 2, 3],
        type: [Number],
      })
      @IsOptional()
      @IsArray()
      @IsInt({ each: true })
      collaboratorIds?: number[];

}

export class AddCommentDto {
    @ApiProperty({
        example: 'This is a comment'
    })
    @IsString()
    @IsNotEmpty()
    comments: string;
}

export class MergeTicketsDto {
    @ApiProperty({ example: 101, description: 'Primary Ticket ID' })
    @IsNumber()
    @IsNotEmpty()
    primaryTicketId: number;
  
    @ApiProperty({ example: [102, 103], description: 'Array of secondary ticket IDs to merge' })
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMaxSize(5)
    @IsNumber({}, { each: true })
    secondaryTicketIds: number[];
}
export class DeleteAccountTicketDto {
  @ApiProperty({
    example: ["I no longer need the service", "The app is difficult to use or understand"],
    description: 'Array of reasons for account deletion',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  reasons?: string[];
  
    @ApiProperty({
    example: 12345,
    description: 'Otp Verification Id',
  })
  @IsNotEmpty()
  verificationId: number;
}