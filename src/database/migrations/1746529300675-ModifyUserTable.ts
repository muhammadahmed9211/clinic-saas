import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyUserTable1746529300675 implements MigrationInterface {
  name = 'ModifyUserTable1746529300675';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `EXEC sp_rename "user.fullName", "isLongTokenEnabled"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "isLongTokenEnabled"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isLongTokenEnabled" bit NOT NULL CONSTRAINT "DF_84fd8fc29aa2c99a88bba11158a" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "isLongTokenEnabled"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isLongTokenEnabled" nvarchar(255)`,
    );
    await queryRunner.query(
      `EXEC sp_rename "user.isLongTokenEnabled", "fullName"`,
    );
  }
}
