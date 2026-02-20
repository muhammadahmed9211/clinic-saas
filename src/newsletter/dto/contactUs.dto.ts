import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { FileEntity } from "src/files/entities/file.entity";
import { IsExist } from "src/utils/validators/is-exists.validator";

export class ContactUsDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail({}, { message: 'Please provide a valid email address for the from field' })
    @IsNotEmpty({ message: 'From field is required' })
    from: string;

    @ApiProperty({ example: 'admin@example.com' })
    @IsEmail({}, { message: 'Please provide a valid email address for the to field' })
    @IsNotEmpty({ message: 'To field is required' })
    to: string;

    @ApiProperty({ example: 'Hello, how are you?' })
    @IsString()
    @IsNotEmpty({ message: 'Text field is required' })
    text: string;

    @ApiProperty({ type: () => FileEntity })
    @IsOptional()
    @Validate(IsExist, ['FileEntity', 'id'], {
        message: 'imageNotExists',
    })
    file?: FileEntity;
}