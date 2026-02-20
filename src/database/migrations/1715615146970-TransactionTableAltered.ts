import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionTableAltered1715615146970
  implements MigrationInterface
{
  name = 'TransactionTableAltered1715615146970';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "companyBankId" int`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" ADD "userBankId" int`);
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_f466d05813754249e28d3e6760d" FOREIGN KEY ("companyBankId") REFERENCES "bank_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_de52b456ac559c8c5368c2fe4ef" FOREIGN KEY ("userBankId") REFERENCES "bank_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_de52b456ac559c8c5368c2fe4ef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_f466d05813754249e28d3e6760d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "userBankId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "companyBankId"`,
    );
  }
}
