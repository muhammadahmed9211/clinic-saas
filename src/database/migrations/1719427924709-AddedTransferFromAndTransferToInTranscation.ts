import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedTransferFromAndTransferToInTranscation1719427924709
  implements MigrationInterface
{
  name = 'AddedTransferFromAndTransferToInTranscation1719427924709';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "transferFrom" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "transferTo" varchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "transferTo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "transferFrom"`,
    );
  }
}
