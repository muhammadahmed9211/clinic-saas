import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class ThreecxQuery {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  email: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  number: string;
}
