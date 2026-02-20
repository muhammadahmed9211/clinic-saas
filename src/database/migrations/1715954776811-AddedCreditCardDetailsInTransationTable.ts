import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedCreditCardDetailsInTransationTable1715954776811
  implements MigrationInterface
{
  name = 'AddedCreditCardDetailsInTransationTable1715954776811';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "creditCardDetailsId" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_8df13733fb19829f2a5f44b463d" FOREIGN KEY ("creditCardDetailsId") REFERENCES "user_credit_card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_8df13733fb19829f2a5f44b463d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "creditCardDetailsId"`,
    );
  }
}
