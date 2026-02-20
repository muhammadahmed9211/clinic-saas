import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyRegulationConfig1734350251618 implements MigrationInterface {
  name = 'ModifyRegulationConfig1734350251618';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "regulation_event" ADD "createdById" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "regulation_rule" ADD "createdById" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "regulation_event" ADD CONSTRAINT "FK_3e717c89d5091a05dbdfcef6896" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "regulation_rule" ADD CONSTRAINT "FK_a6a34b2e356e065f189fd4a2a09" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "regulation_rule" DROP CONSTRAINT "FK_a6a34b2e356e065f189fd4a2a09"`,
    );
    await queryRunner.query(
      `ALTER TABLE "regulation_event" DROP CONSTRAINT "FK_3e717c89d5091a05dbdfcef6896"`,
    );
    await queryRunner.query(
      `ALTER TABLE "regulation_rule" DROP COLUMN "createdById"`,
    );
    await queryRunner.query(
      `ALTER TABLE "regulation_event" DROP COLUMN "createdById"`,
    );
  }
}
