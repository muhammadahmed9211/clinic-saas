import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsDateString } from 'class-validator';
import { CreateLeadDto } from 'src/admin/leads/dto/create-lead.dto';
import { PartialType } from '@nestjs/swagger';

export class CreateEventRegistrationDto extends CreateLeadDto {
    @ApiProperty({ description: 'First name of the registrant', required: true })
    @IsString()
    firstName: string;

    @ApiProperty({ description: 'Last name of the registrant', required: true })
    @IsString()
    lastName: string;

    @ApiProperty({ description: 'Email address of the registrant', required: true })
    @IsEmail()
    email: string;

    // @ApiProperty({ description: 'Country of residence', required: false })
    // @IsOptional()
    // @IsString()
    // country?: string;

    // @ApiProperty({ description: 'Country ISO code', required: false })
    // @IsOptional()
    // @IsString()
    // countryIso?: string;

    // @ApiProperty({ description: 'Phone number', required: false })
    // @IsOptional()
    // @IsString()
    // phoneNumber?: string;

    // @ApiProperty({ description: 'Telephone number', required: false })
    // @IsOptional()
    // @IsString()
    // telePhone?: string;

    // @ApiProperty({ description: 'Telephone prefix', required: false })
    // @IsOptional()
    // @IsString()
    // telePhonePrefix?: string;

    @ApiProperty({ description: 'Type of event', required: false })
    @IsOptional()
    @IsString()
    eventType?: string;

    @ApiProperty({ description: 'Name of the event', required: false })
    @IsOptional()
    @IsString()
    eventName?: string;

    @ApiProperty({ description: 'Event start date', required: false })
    @IsOptional()
    @IsDateString()
    eventStartDate?: Date;

    @ApiProperty({ description: 'Event end date', required: false })
    @IsOptional()
    @IsDateString()
    eventEndDate?: Date;

    @ApiProperty({ description: 'Event start time', required: false })
    @IsOptional()
    @IsString()
    eventStartTime?: string;

    @ApiProperty({ description: 'Event end time', required: false })
    @IsOptional()
    @IsString()
    eventEndTime?: string;

    @ApiProperty({ description: 'Website | Zapier | Other', required: false })
    @IsOptional()
    @IsString()
    source?: string;

    @ApiProperty({ description: 'UTM source', required: false })
    @IsOptional()
    @IsString()
    utmSource?: string;

    @ApiProperty({ description: 'UTM campaign', required: false })
    @IsOptional()
    @IsString()
    utmCampaign?: string;

    @ApiProperty({ description: 'UTM content', required: false })
    @IsOptional()
    @IsString()
    utmContent?: string;

    @ApiProperty({ description: 'UTM medium', required: false })
    @IsOptional()
    @IsString()
    utmMedium?: string;

    @ApiProperty({ description: 'UTM term', required: false })
    @IsOptional()
    @IsString()
    utmTerm?: string;

    @ApiProperty({ description: 'Campaign ID', required: false })
    @IsOptional()
    @IsString()
    campaignId?: string;

    // @ApiProperty({ description: 'Questions data as JSON', required: false })
    // @IsOptional()
    // @IsString()
    // customQuestion?: string;

    @ApiProperty({ description: 'Language ISO', required: false })
    @IsOptional()
    @IsString()
    languageIso?: string;
}

export class UpdateEventRegistrationDto extends PartialType(CreateEventRegistrationDto) {
    @ApiProperty({ description: 'First name of the registrant', required: false })
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiProperty({ description: 'Last name of the registrant', required: false })
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiProperty({ description: 'Email address of the registrant', required: false })
    @IsOptional()
    @IsEmail()
    email?: string;
} 