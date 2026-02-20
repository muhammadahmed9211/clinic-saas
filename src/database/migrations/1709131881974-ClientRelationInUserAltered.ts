import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClientRelationInUserAltered1709131881974
  implements MigrationInterface
{
  name = 'ClientRelationInUserAltered1709131881974';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_9e1108ee3efd720d820decd201d"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "clientUserId"`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "FK_ad3b4bf8dd18a1d467c5c0fc13a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "FK_ad3b4bf8dd18a1d467c5c0fc13a"`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "clientUserId" int`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_9e1108ee3efd720d820decd201d" FOREIGN KEY ("clientUserId") REFERENCES "client"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
