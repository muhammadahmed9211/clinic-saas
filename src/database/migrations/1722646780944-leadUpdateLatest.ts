import { MigrationInterface, QueryRunner } from 'typeorm';

export class LeadUpdateLatest1722646780944 implements MigrationInterface {
  name = 'LeadUpdateLatest1722646780944';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lead" DROP CONSTRAINT "FK_3f9440381f9cb900b025b014cf7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" DROP CONSTRAINT "FK_e8575ccb228b30fdc1d9840b354"`,
    );
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "lead"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "sales"`);
    await queryRunner.query(
      `ALTER TABLE "lead" ADD "isActive" bit NOT NULL CONSTRAINT "DF_8bff26c7e4285e4fba5723dc195" DEFAULT 1`,
    );
    await queryRunner.query(`ALTER TABLE "lead" ADD "leadStatusId" int`);
    await queryRunner.query(`ALTER TABLE "lead" ADD "salesStatusId" int`);
    await queryRunner.query(
      `ALTER TABLE "lead" ADD CONSTRAINT "FK_99fa1c00c00eaaf6b704ce85762" FOREIGN KEY ("leadStatusId") REFERENCES "custom_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ADD CONSTRAINT "FK_ca61014c209fdf53e74fd7ce053" FOREIGN KEY ("salesStatusId") REFERENCES "custom_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lead" DROP CONSTRAINT "FK_ca61014c209fdf53e74fd7ce053"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" DROP CONSTRAINT "FK_99fa1c00c00eaaf6b704ce85762"`,
    );
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "salesStatusId"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "leadStatusId"`);
    await queryRunner.query(
      `ALTER TABLE "lead" DROP CONSTRAINT "DF_8bff26c7e4285e4fba5723dc195"`,
    );
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "isActive"`);
    await queryRunner.query(`ALTER TABLE "lead" ADD "sales" int`);
    await queryRunner.query(`ALTER TABLE "lead" ADD "lead" int`);
    await queryRunner.query(
      `ALTER TABLE "lead" ADD CONSTRAINT "FK_e8575ccb228b30fdc1d9840b354" FOREIGN KEY ("sales") REFERENCES "custom_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ADD CONSTRAINT "FK_3f9440381f9cb900b025b014cf7" FOREIGN KEY ("lead") REFERENCES "custom_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
