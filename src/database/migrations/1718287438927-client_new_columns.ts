import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClientNewColumns1718287438927 implements MigrationInterface {
  name = 'ClientNewColumns1718287438927';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_8dbf6eb21a214263c680b85b01" ON "client"`,
    );
    await queryRunner.query(
      `EXEC sp_rename "client.orignalEmail", "originalEmail"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "originalEmail"`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "originalEmail" nvarchar(255)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_35425d1c0b78094f35cbba0d83" ON "client" ("originalEmail") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_35425d1c0b78094f35cbba0d83" ON "client"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "originalEmail"`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "originalEmail" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `EXEC sp_rename "client.originalEmail", "orignalEmail"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8dbf6eb21a214263c680b85b01" ON "client" ("orignalEmail") `,
    );
  }
}
