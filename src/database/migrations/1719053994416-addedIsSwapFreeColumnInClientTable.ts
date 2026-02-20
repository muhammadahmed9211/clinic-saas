import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedIsSwapFreeColumnInClientTable1719053994416
  implements MigrationInterface
{
  name = 'AddedIsSwapFreeColumnInClientTable1719053994416';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" ADD "isSwapFree" bit NOT NULL CONSTRAINT "DF_982fe4ccd8f786242bc2e739d09" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_982fe4ccd8f786242bc2e739d09"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "isSwapFree"`);
  }
}
