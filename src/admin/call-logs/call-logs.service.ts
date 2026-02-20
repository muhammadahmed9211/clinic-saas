import { Injectable } from '@nestjs/common';
import { CreateCallLogDto } from './dto/create-call-log.dto';
import { UpdateCallLogDto } from './dto/update-call-log.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CallLog } from './entities/call-log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CallLogsService {
  constructor(
    @InjectRepository(CallLog)
    private readonly callLogsRepository: Repository<CallLog>,
  ) {}

  async create(createCallLogDto: CreateCallLogDto, clientId: number) {
    const duration = this.getDuration(
      createCallLogDto.callStartDateTime,
      createCallLogDto.callEndDateTime,
    );

    return await this.callLogsRepository.save({
      ...createCallLogDto,
      callResults: { id: createCallLogDto.callResults },
      user: { id: clientId },
      callDuration: duration,
    });
  }

  findAll(clientId: number) {
    return this.callLogsRepository.find({
      relations: { callResults: true },
      order: { updatedAt: 'DESC' },
      where: { user: { id: clientId } },
    });
  }

  async findOne(id: number) {
    return await this.callLogsRepository.findOne({
      order: { updatedAt: 'DESC' },
      where: { id },
      relations: { callResults: true, user: true },
      // loadRelationIds: true
    });
  }

  async update(id: number, updateCallLogDto: UpdateCallLogDto) {
    const duration = this.getDuration(
      updateCallLogDto.callStartDateTime,
      updateCallLogDto.callEndDateTime,
    );

    return await this.callLogsRepository.save({
      ...updateCallLogDto,
      id,
      callResults: { id: updateCallLogDto.callResults },
      callDuration: duration,
    });
  }

  async remove(id: number) {
    return await this.callLogsRepository.delete(id);
  }

  getDuration(start: Date, end: Date) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = endDate.getTime() - startDate.getTime();

    // let ms = diff % 1000;
    // let ss = Math.floor(diff / 1000) % 60;
    const mm = Math.floor(diff / 1000 / 60) % 60;
    const hh = Math.floor(diff / 1000 / 60 / 60);

    let duration = '';
    hh != 0 ? (duration += `${hh}hr`) : '';
    mm != 0 ? (duration += `, ${mm}min`) : '';
    // ss != 0 ?  duration += `, ${ss}sec`: ""

    return duration;
  }
}
