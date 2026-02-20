import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateRegulationLead1729169439430 implements MigrationInterface {
  name = 'UpdateRegulationLead1729169439430';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lead" ADD "regulationId" int`);
    await queryRunner.query(
      `ALTER TABLE "lead" ADD CONSTRAINT "FK_d6e6381ddaf94314bb1f720e131" FOREIGN KEY ("regulationId") REFERENCES "regulations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lead" DROP CONSTRAINT "FK_d6e6381ddaf94314bb1f720e131"`,
    );
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "regulationId"`);
  }
}
