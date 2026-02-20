import { Controller, Get, Param, NotFoundException, HttpStatus } from '@nestjs/common';
import { StaticDataService } from './static-data.service';
import { ApiTags } from '@nestjs/swagger';
import { ResponseWrapper } from 'src/utils/interface/mt5/base-response.interface';
import { Status } from 'src/utils/enums/mt5/response-status.enum';

@ApiTags('Static Data')
@Controller({ path: 'static-data', version: '1' })
export class StaticDataController {
  constructor(private readonly staticDataService: StaticDataService) {}

@Get(':key')
async getStaticData(@Param('key') key: string) {
  const result = await this.staticDataService.getByKey(key);
  if (!result) {
    throw new NotFoundException(`Static data for key "${key}" not found`);
  }
  let parsedData: any;
  try {
    parsedData = JSON.parse(result.data);
  } catch (e) {
    throw new Error('Invalid JSON format in static_data.data column');
  }
  return {
    status: Status.SUCCESS,
    statusCode: HttpStatus.OK,
    message: 'OK',
    result: {
      key: result.key,
      data: parsedData,
    },
  };
}
}