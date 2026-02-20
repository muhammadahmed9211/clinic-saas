import { MigrationInterface, QueryRunner } from 'typeorm';

export class LeadsCustomStatus1721668985158 implements MigrationInterface {
  name = 'LeadsCustomStatus1721668985158';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP CONSTRAINT "CHK_1ae7d9b51f9910856be5091235"`,
    );
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "leadStatus"`);
    await queryRunner.query(`ALTER TABLE "lead" ADD "lead" int`);
    await queryRunner.query(`ALTER TABLE "lead" ADD "sales" int`);
    await queryRunner.query(
      `ALTER TABLE "custom_status" DROP CONSTRAINT "CHK_afde42b43eae64c2b888535a92_ENUM"`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_status" ADD CONSTRAINT "CHK_1e421f10a6ef7ea9c1ffc19990_ENUM" CHECK (type IN ('sales','retention','client_potential','audit_status','kyc_status','system','regulations','client_type','call_results','lead'))`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" ADD CONSTRAINT "CHK_e3af554009c9a3f1218db4b48e" CHECK ("entity" IN ('general','client','operator','partner', 'transaction', 'lead'))`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ADD CONSTRAINT "FK_3f9440381f9cb900b025b014cf7" FOREIGN KEY ("lead") REFERENCES "custom_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ADD CONSTRAINT "FK_e8575ccb228b30fdc1d9840b354" FOREIGN KEY ("sales") REFERENCES "custom_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lead" DROP CONSTRAINT "FK_e8575ccb228b30fdc1d9840b354"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" DROP CONSTRAINT "FK_3f9440381f9cb900b025b014cf7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP CONSTRAINT "CHK_e3af554009c9a3f1218db4b48e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_status" ADD CONSTRAINT "CHK_afde42b43eae64c2b888535a92_ENUM" CHECK (type IN ('sales','retention','client_potential','audit_status','kyc_status','system','regulations','client_type','call_results'))`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_status" DROP CONSTRAINT "CHK_1e421f10a6ef7ea9c1ffc19990_ENUM"`,
    );
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "sales"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "lead"`);
    await queryRunner.query(`ALTER TABLE "lead" ADD "leadStatus" varchar(255)`);
    await queryRunner.query(
      `ALTER TABLE "admin_task" ADD CONSTRAINT "CHK_1ae7d9b51f9910856be5091235" CHECK (([entity]='transaction' OR [entity]='partner' OR [entity]='operator' OR [entity]='client' OR [entity]='general'))`,
    );
  }
}
