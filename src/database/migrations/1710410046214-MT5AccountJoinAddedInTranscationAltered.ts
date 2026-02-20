import { MigrationInterface, QueryRunner } from 'typeorm';

export class MT5AccountJoinAddedInTranscationAltered1710410046214
  implements MigrationInterface
{
  name = 'MT5AccountJoinAddedInTranscationAltered1710410046214';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "login"`);
    await queryRunner.query(`ALTER TABLE "transaction" ADD "mt5AccountId" int`);
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_c19716441f3738ab6019cd3d9dc" FOREIGN KEY ("mt5AccountId") REFERENCES "mt5_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_c19716441f3738ab6019cd3d9dc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "mt5AccountId"`,
    );
  }
}
