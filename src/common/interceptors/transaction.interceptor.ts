import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Scope,
} from '@nestjs/common';
import { Observable, catchError, concatMap, finalize } from 'rxjs';
import EntityManagerService from 'src/database/entity-manager/entity-manager.service';

@Injectable({ scope: Scope.REQUEST })
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly entityManager: EntityManagerService) {}
  async intercept(
    _: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const queryRunner = await this.entityManager.initialize();

    return next.handle().pipe(
      concatMap(async (data) => {
        if (queryRunner) {
          await queryRunner.commitTransaction();
        }
        return data;
      }),
      catchError(async (e) => {
        if (queryRunner) {
          await queryRunner.rollbackTransaction();
        }
        throw e;
      }),
      finalize(async () => {
        if (queryRunner) {
          await queryRunner.release();
        }
      }),
    );
  }
}
