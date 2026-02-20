import { MigrationInterface, QueryRunner } from 'typeorm';

export class CallResultEnum1717595605509 implements MigrationInterface {
  name = 'CallResultEnum1717595605509';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "custom_status" DROP CONSTRAINT "CHK_4d01051d27eb96806c83ccf9af_ENUM"`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_status" ADD CONSTRAINT "CHK_afde42b43eae64c2b888535a92_ENUM" CHECK (type IN ('sales','retention','client_potential','audit_status','kyc_status','system','regulations','client_type','call_results'))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "custom_status" ADD CONSTRAINT "CHK_4d01051d27eb96806c83ccf9af_ENUM" CHECK (type IN ('sales','retention','client_potential','audit_status','kyc_status','system','regulations','client_type'))`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_status" DROP CONSTRAINT "CHK_afde42b43eae64c2b888535a92_ENUM"`,
    );
  }
}
