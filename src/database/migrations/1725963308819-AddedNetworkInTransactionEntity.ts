import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedNetworkInTransactionEntity1725963308819
  implements MigrationInterface
{
  name = 'AddedNetworkInTransactionEntity1725963308819';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "network" varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "network"`);
  }
}
