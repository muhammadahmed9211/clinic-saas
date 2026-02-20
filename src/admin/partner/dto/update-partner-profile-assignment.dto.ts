import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, Min } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class UpdatePartnerProfileAssignmentDto {
    @ApiProperty({ example: 1 })
    @IsOptional()
    @IsNumber({}, { message: "Partner level must be a number" })
    @Min(1, { message: "Partner level must be greater than 0" })
    partnerLevel?: number;

    @ApiProperty({ example: [1, 2, 3] })
    @IsOptional()
    @IsArray({ message: 'Commission profile must be an array' })
    @IsInt({ each: true, message: 'Each commission profile ID must be an integer' })
    commissionProfiles?: number[];

    @ApiProperty({ example: 1 })
    @IsOptional()
    @IsNumber({}, { message: "Master IB ID must be a number" })
    masterIbId?: number;

    @ApiProperty({ example: true })
    @IsOptional()
    @IsBoolean()
    calculateCommission?: boolean;

}
