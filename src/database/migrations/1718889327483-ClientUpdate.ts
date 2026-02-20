import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClientUpdate1718889327483 implements MigrationInterface {
  name = 'ClientUpdate1718889327483';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" ADD "pu" bit NOT NULL CONSTRAINT "DF_5679985dd779dc2458de3118ab2" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_5679985dd779dc2458de3118ab2"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "pu"`);
  }
}
