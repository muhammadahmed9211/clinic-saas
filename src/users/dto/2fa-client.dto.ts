import {
    IsNotEmpty,
   
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TokenByEmailDTO {
    @ApiProperty({ example: '123456' })
    @IsNotEmpty()
    token: string;

    @ApiProperty({ example: 'abc@example.com' })
    @IsNotEmpty()
    email: string;
}
