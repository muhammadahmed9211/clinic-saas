import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { DataSource } from 'typeorm';
import { AdminTask } from '../entities/task.entity';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { RoleService } from 'src/roles/role.service';
@Injectable()
export class AdminTaskRepository extends BaseRepository<AdminTask> {
  constructor(
    dataSource: DataSource,
    listCacheService: ListCacheService,
    roleService: RoleService,
  ) {
    super(AdminTask, dataSource, listCacheService, roleService);
  }

  // async save<T extends DeepPartial<AdminTask>>(
  //   entityOrEntities: T | T[],
  //   options?: SaveOptions,
  // ): Promise<T | T[]> {
  //   console.log('entityOrEntities', entityOrEntities);

  //   const isArray = Array.isArray(entityOrEntities);
  //   const queryRunner = this.dataSource.createQueryRunner();

  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     const result = await queryRunner.manager.save(
  //       isArray ? entityOrEntities : [entityOrEntities],
  //       options,
  //     );

  //     console.log('resukt====', result);

  //     for (const entity of isArray ? entityOrEntities : [entityOrEntities]) {
  //       console.log('entity===', entity);
  //       if (entity.entity === TaskEntityType.CLIENT && entity.entityId) {
  //         const client = await queryRunner.manager
  //           .createQueryBuilder(Client, 'client')
  //           .select()
  //           .where('client.userId = :id', { id: entity.entityId })
  //           .getOne();

  //         console.log('client=============', client);

  //         if (client) {
  //           await queryRunner.manager
  //             .createQueryBuilder(Client, 'client')
  //             .update()
  //             .set({ recentTask: entity })
  //             .where({ userId: +entity.entityId })
  //             .execute();
  //         } else {
  //           throw new Error('Client not found');
  //         }
  //       }
  //     }

  //     await queryRunner.commitTransaction();
  //     return result;
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction();
  //     throw new Error(error.message);
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  // async saveWithClientUpdate(){

  // }
}
