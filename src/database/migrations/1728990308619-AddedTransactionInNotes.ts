import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedTransactionInNotes1728990308619
  implements MigrationInterface
{
  name = 'AddedTransactionInNotes1728990308619';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notes" ADD "transactionId" uniqueidentifier`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_5ec9cee10b2930f36f59fafbd82" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "FK_5ec9cee10b2930f36f59fafbd82"`,
    );
    await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "transactionId"`);
  }
}