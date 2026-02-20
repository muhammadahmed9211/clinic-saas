import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterFile1710159877122 implements MigrationInterface {
  name = 'AlterFile1710159877122';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "file" ADD "status" nvarchar(255) NOT NULL CONSTRAINT "DF_c8a0a024eae62e2c40cd2ffa15e" DEFAULT 'active'`,
    );
    await queryRunner.query(
      `ALTER TABLE "file" ADD "created_at" datetime2 NOT NULL CONSTRAINT "DF_65c3df160e1b596e1e22b56abdb" DEFAULT getdate()`,
    );
    await queryRunner.query(
      `ALTER TABLE "file" ADD "updated_at" datetime2 NOT NULL CONSTRAINT "DF_9f8c4068e243c7e669bf6fdad38" DEFAULT getdate()`,
    );
    await queryRunner.query(`ALTER TABLE "file" ADD "deleted_at" datetime2`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "deleted_at"`);
    await queryRunner.query(
      `ALTER TABLE "file" DROP CONSTRAINT "DF_9f8c4068e243c7e669bf6fdad38"`,
    );
    await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "updated_at"`);
    await queryRunner.query(
      `ALTER TABLE "file" DROP CONSTRAINT "DF_65c3df160e1b596e1e22b56abdb"`,
    );
    await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "created_at"`);
    await queryRunner.query(
      `ALTER TABLE "file" DROP CONSTRAINT "DF_c8a0a024eae62e2c40cd2ffa15e"`,
    );
    await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "status"`);
  }
}
