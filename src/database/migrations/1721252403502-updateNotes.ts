import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateNotes1721252403502 implements MigrationInterface {
  name = 'UpdateNotes1721252403502';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notes" ADD "opportunity_id" int`);
    await queryRunner.query(`ALTER TABLE "notes" ADD "lead_id" int`);
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_a392dc19064296e412a1de68b9a" FOREIGN KEY ("opportunity_id") REFERENCES "opportunity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_e2da26cfd97f7b99b7df5d6389e" FOREIGN KEY ("lead_id") REFERENCES "lead"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "FK_e2da26cfd97f7b99b7df5d6389e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "FK_a392dc19064296e412a1de68b9a"`,
    );
    await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "lead_id"`);
    await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "opportunity_id"`);
  }
}
