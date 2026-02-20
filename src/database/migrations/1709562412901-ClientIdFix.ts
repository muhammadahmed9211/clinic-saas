import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClientIdFix1709562412901 implements MigrationInterface {
  name = 'ClientIdFix1709562412901';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "client" ADD "clientId" int`);
    await queryRunner.query(
      `CREATE INDEX "IDX_6ed9067942d7537ce359e172ff" ON "client" ("clientId") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_6ed9067942d7537ce359e172ff" ON "client"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "clientId"`);
  }
}
