import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { DataSource } from 'typeorm';
import { DataUpload } from 'src/users/entities/data_upload.entity';
import { ListCacheService } from 'src/list-cache/list-cache-service';
@Injectable()
export class DataUploadRepository extends BaseRepository<DataUpload> {
  constructor(dataSource: DataSource, listCacheService: ListCacheService) {
    super(DataUpload, dataSource, listCacheService);
  }
}
