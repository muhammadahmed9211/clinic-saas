import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class ZoomParticipantDto {
    @ApiProperty({ description: 'Duration of the meeting in seconds', example: '0' })
    @IsOptional()
    duration?: string;

    @ApiProperty({ description: 'Email of the participant', example: 'john.doe@example.com' })
    @IsOptional()
    email?: string;

    @ApiProperty({ description: 'Unique identifier for the participant', example: '83311658919' })
    @IsOptional()
    id?: number;

    @ApiProperty({ description: 'Join time in ISO format', example: '2025-02-25T14:29:09Z' })
    @IsOptional()
    join_time?: string;

    @ApiProperty({ description: 'Unique participant ID', example: 'L5zUp430QiCAEL8HQMJ8wg' })
    @IsOptional()
    participant_id?: string;

    @ApiProperty({ description: 'Participant user ID', example: 'L5zUp430QiCAEL8HQMJ8wg' })
    @IsOptional()
    participant_user_id?: string;

    @ApiProperty({ description: 'Participant UUID', example: '9B44463E-43A7-E5FF-FA3A-2B022A70C23F' })
    @IsOptional()
    participant_uuid?: string;

    @ApiProperty({ description: 'Public IP address of the participant', example: '134.224.146.216' })
    @IsOptional()
    public_ip?: string;

    @ApiProperty({ description: 'Start time in ISO format', example: '2025-02-25T14:23:57Z' })
    @IsOptional()
    start_time?: string;

    @ApiProperty({ description: 'Timezone of the participant', example: '' })
    @IsOptional()
    timezone?: string;

    @ApiProperty({ description: 'Topic of the meeting', example: 'Tech Zoom Meeting' })
    @IsOptional()
    topic?: string;

    @ApiProperty({ description: 'User ID of the participant in Zoom', example: '16780288' })
    @IsOptional()
    user_id?: string;

    @ApiProperty({ description: 'User name of the participant', example: 'Saad Ahmed' })
    @IsOptional()
    user_name?: string;
}