import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateLabelTranslation1731339299232 implements MigrationInterface {
  name = 'UpdateLabelTranslation1731339299232';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "label_translation" ADD "regulationId" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "label_translation" ADD CONSTRAINT "FK_5b406dc433b4b52424188cd4a08" FOREIGN KEY ("regulationId") REFERENCES "regulations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "label_translation" DROP CONSTRAINT "FK_5b406dc433b4b52424188cd4a08"`,
    );
    await queryRunner.query(
      `ALTER TABLE "label_translation" DROP COLUMN "regulationId"`,
    );
  }
}
