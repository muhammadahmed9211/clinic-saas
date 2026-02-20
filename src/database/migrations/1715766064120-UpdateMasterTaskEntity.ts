import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateMasterTaskEntity1715766064120 implements MigrationInterface {
  name = 'UpdateMasterTaskEntity1715766064120';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "master_task" ADD "isDeleted" bit NOT NULL CONSTRAINT "DF_ae4fe13db0b58222a2a8b65c050" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" DROP CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" ADD CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61" DEFAULT getdate() FOR "dateTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" DROP CONSTRAINT "DF_67e240b054dcdf765c0277588ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" ADD CONSTRAINT "DF_67e240b054dcdf765c0277588ad" DEFAULT getdate() FOR "dateTime"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "crm_task" DROP CONSTRAINT "DF_67e240b054dcdf765c0277588ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" ADD CONSTRAINT "DF_67e240b054dcdf765c0277588ad" DEFAULT 1715759881584. FOR "dateTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" DROP CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" ADD CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61" DEFAULT 1715759879522. FOR "dateTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_task" DROP CONSTRAINT "DF_ae4fe13db0b58222a2a8b65c050"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_task" DROP COLUMN "isDeleted"`,
    );
  }
}
