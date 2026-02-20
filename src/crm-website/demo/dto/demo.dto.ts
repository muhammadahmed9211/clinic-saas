import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class CreateDemoFormDto {
  @ApiProperty({ example: 'Hello, this is a message', required: true })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  message: string;

  @ApiProperty({ example: 'Subject', required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  firstName: string;

  @ApiProperty({ example: 'Subject', required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  lastName: string;

  @ApiProperty({ example: 12345, required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  email: string;

  @ApiProperty({ example: 12345, required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  country: string;

  @ApiProperty({ example: 12345, required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  phoneNumber: string;
}

export enum DemoFormEmail {
    DEMO_REQUEST_FORM = 'DEMO_REQUEST_FORM',
}

export enum DemoFormEmailSubject {
    DEMO_REQUEST_FORM = 'Demo Request Form',
}