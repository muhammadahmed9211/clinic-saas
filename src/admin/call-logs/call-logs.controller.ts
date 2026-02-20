import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CallLogsService } from './call-logs.service';
import { CreateCallLogDto } from './dto/create-call-log.dto';
import { UpdateCallLogDto } from './dto/update-call-log.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller({ path: 'admin/client', version: '1' })
@ApiTags('Call Logs')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class CallLogsController {
  constructor(private readonly callLogsService: CallLogsService) {}

  @Post(':id/call-logs')
  create(
    @Body() createCallLogDto: CreateCallLogDto,
    @Param('id') clientId: string,
  ) {
    return this.callLogsService.create(createCallLogDto, +clientId);
  }

  @Get(':id/call-logs')
  findAll(@Param('id') clientId: string) {
    return this.callLogsService.findAll(+clientId);
  }

  @Get('call-logs/:id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.callLogsService.findOne(+id);
  }

  @Patch('call-logs/:id')
  update(@Param('id') id: string, @Body() updateCallLogDto: UpdateCallLogDto) {
    return this.callLogsService.update(+id, updateCallLogDto);
  }

  @Delete('call-logs/:id')
  remove(@Param('id') id: string) {
    return this.callLogsService.remove(+id);
  }
}
