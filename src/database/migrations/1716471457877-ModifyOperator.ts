import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyOperator1716471457877 implements MigrationInterface {
  name = 'ModifyOperator1716471457877';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "operator" DROP COLUMN "role"`);
    await queryRunner.query(`ALTER TABLE "operator" DROP COLUMN "role_id"`);
    await queryRunner.query(`ALTER TABLE "operator" ADD "roleId" int`);
    await queryRunner.query(
      `ALTER TABLE "operator" ADD CONSTRAINT "UQ_809228ed8520ca85998fe55165f" UNIQUE ("email")`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ADD CONSTRAINT "FK_6c951b4fe5f84a6000a741908ac" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "operator" DROP CONSTRAINT "FK_6c951b4fe5f84a6000a741908ac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" DROP CONSTRAINT "UQ_809228ed8520ca85998fe55165f"`,
    );
    await queryRunner.query(`ALTER TABLE "operator" DROP COLUMN "roleId"`);
    await queryRunner.query(`ALTER TABLE "operator" ADD "role_id" bigint`);
    await queryRunner.query(`ALTER TABLE "operator" ADD "role" int`);
  }
}
