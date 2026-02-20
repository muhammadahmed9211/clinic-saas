import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserLog1715759839500 implements MigrationInterface {
  name = 'UpdateUserLog1715759839500';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_task" DROP CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" ADD CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61" DEFAULT 1715759879522 FOR "dateTime"`,
    );
    await queryRunner.query(`ALTER TABLE "user_log" DROP COLUMN "leftValue"`);
    await queryRunner.query(
      `ALTER TABLE "user_log" ADD "leftValue" nvarchar(MAX) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user_log" DROP COLUMN "rightValue"`);
    await queryRunner.query(
      `ALTER TABLE "user_log" ADD "rightValue" nvarchar(MAX) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" DROP CONSTRAINT "DF_67e240b054dcdf765c0277588ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" ADD CONSTRAINT "DF_67e240b054dcdf765c0277588ad" DEFAULT 1715759881584 FOR "dateTime"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "crm_task" DROP CONSTRAINT "DF_67e240b054dcdf765c0277588ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" ADD CONSTRAINT "DF_67e240b054dcdf765c0277588ad" DEFAULT 1715687347932. FOR "dateTime"`,
    );
    await queryRunner.query(`ALTER TABLE "user_log" DROP COLUMN "rightValue"`);
    await queryRunner.query(
      `ALTER TABLE "user_log" ADD "rightValue" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user_log" DROP COLUMN "leftValue"`);
    await queryRunner.query(
      `ALTER TABLE "user_log" ADD "leftValue" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" DROP CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" ADD CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61" DEFAULT 1715687346351. FOR "dateTime"`,
    );
  }
}
