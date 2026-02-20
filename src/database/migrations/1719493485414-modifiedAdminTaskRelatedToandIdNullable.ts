import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifiedAdminTaskRelatedToandIdNullable1719493485414
  implements MigrationInterface
{
  name = 'ModifiedAdminTaskRelatedToandIdNullable1719493485414';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admin_task" ALTER COLUMN "relatedTo" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" ALTER COLUMN "relatedToId" int`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admin_task" ALTER COLUMN "relatedToId" int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" ALTER COLUMN "relatedTo" nvarchar(255) NOT NULL`,
    );
  }
}
