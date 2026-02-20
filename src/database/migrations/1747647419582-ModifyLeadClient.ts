import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyLeadClient1747647419582 implements MigrationInterface {
  name = 'ModifyLeadClient1747647419582';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "DF_6796cc2df7a5503680c2c941909" DEFAULT 'New' FOR "systemStatus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ADD CONSTRAINT "DF_017bc7b4f9b545d73503ff38f04" DEFAULT 'New' FOR "systemStatus"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lead" DROP CONSTRAINT "DF_017bc7b4f9b545d73503ff38f04"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_6796cc2df7a5503680c2c941909"`,
    );
  }
}
