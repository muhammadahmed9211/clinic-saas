import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateClientRegulation1729164727872 implements MigrationInterface {
  name = 'UpdateClientRegulation1729164727872';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "client" ADD "regulationId" int`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "FK_3e1efd53a41e2d10ca08d6fff3c" FOREIGN KEY ("regulationId") REFERENCES "regulations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "FK_3e1efd53a41e2d10ca08d6fff3c"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "regulationId"`);
  }
}
