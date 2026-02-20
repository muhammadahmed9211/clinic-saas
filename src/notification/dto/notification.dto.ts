import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class UpdateNotificationLabelDto {
@ApiProperty({example: 1,required:false})
@IsOptional()
@IsNumber()
titleId: number;

@ApiProperty({example: 1,required:false})
@IsOptional()
@IsNumber()
descriptionId: number;
}