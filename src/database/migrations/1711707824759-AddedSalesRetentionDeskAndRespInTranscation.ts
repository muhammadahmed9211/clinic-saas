import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedSalesRetentionDeskAndRespInTranscation1711707824759
  implements MigrationInterface
{
  name = 'AddedSalesRetentionDeskAndRespInTranscation1711707824759';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "salesRep"`);
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "salesDesk"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "retentionRep"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "retentionDesk"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "salesRepId" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "salesDeskId" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "retentionRepId" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "retentionDeskId" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_ecd7ffc6e69e97a63ed800a8098" FOREIGN KEY ("salesRepId") REFERENCES "operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_47ac8b13f1030ebe4c2da54a8f8" FOREIGN KEY ("salesDeskId") REFERENCES "desk"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_3b1df296984a6576ac81fe29521" FOREIGN KEY ("retentionRepId") REFERENCES "operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_e00bea01c73ff8dc7af159722fe" FOREIGN KEY ("retentionDeskId") REFERENCES "desk"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_e00bea01c73ff8dc7af159722fe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_3b1df296984a6576ac81fe29521"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_47ac8b13f1030ebe4c2da54a8f8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_ecd7ffc6e69e97a63ed800a8098"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" DROP CONSTRAINT "DF_67e240b054dcdf765c0277588ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" ADD CONSTRAINT "DF_67e240b054dcdf765c0277588ad" DEFAULT 1711624987013. FOR "dateTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" DROP CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" ADD CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61" DEFAULT 1711624986898. FOR "dateTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "retentionDeskId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "retentionRepId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "salesDeskId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "salesRepId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "retentionDesk" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "retentionRep" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "salesDesk" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "salesRep" varchar(255)`,
    );
  }
}
