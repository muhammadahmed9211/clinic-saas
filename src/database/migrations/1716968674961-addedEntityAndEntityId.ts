import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedEntityAndEntityId1716968674961 implements MigrationInterface {
  name = 'AddedEntityAndEntityId1716968674961';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP CONSTRAINT "FK_86c29887c6c29f6287f476fbd10"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP COLUMN "createdForId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" ADD "entity" varchar(255) NOT NULL CONSTRAINT "DF_68d609fb9facd8a832183ab7adc" DEFAULT 'general'`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" ADD "entityId" int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" ADD CONSTRAINT "CHK_bbba937a1801d0e1a22fe044fa" CHECK ("entity" IN ('general','client','operator','partner'))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP CONSTRAINT "CHK_bbba937a1801d0e1a22fe044fa"`,
    );
    await queryRunner.query(`ALTER TABLE "admin_task" DROP COLUMN "entityId"`);
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP CONSTRAINT "DF_68d609fb9facd8a832183ab7adc"`,
    );
    await queryRunner.query(`ALTER TABLE "admin_task" DROP COLUMN "entity"`);
    await queryRunner.query(`ALTER TABLE "admin_task" ADD "createdForId" int`);
    await queryRunner.query(
      `ALTER TABLE "admin_task" ADD CONSTRAINT "FK_86c29887c6c29f6287f476fbd10" FOREIGN KEY ("createdForId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
