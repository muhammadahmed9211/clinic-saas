// updateClientAnswers.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateClientAnswersDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  questionId: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  answerId?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  answerText?: string;
}

export class UpdateClientPasswordDto {
  @ApiProperty({ example: 'examplepassword' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
