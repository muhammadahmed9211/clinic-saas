import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IbMigrationService } from './ib-migration.service';
import { IsArray, ArrayMinSize, IsInt, IsNotEmpty, IsString } from "class-validator";

export class KeyDTO {
  @IsNotEmpty()
  @IsString()
  key: string;
}

export class CreateIBCommissionProfiles extends KeyDTO {
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  ids: number[];
}


@Controller('ib-migration')
export class IbMigrationController {
  constructor(private readonly ibMigrationService: IbMigrationService) { }

  @Post('add-commission-profiles')
  create(@Body() createIbMigrationDto: CreateIBCommissionProfiles) {
    return this.ibMigrationService.addProfiles(createIbMigrationDto);
  }

}
