import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterEnumCustomStatus1717248361981 implements MigrationInterface {
  name = 'AlterEnumCustomStatus1717248361981';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "custom_status" DROP CONSTRAINT "CHK_b7f0b79f277884045de6a024ab_ENUM"`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_status" ADD CONSTRAINT "CHK_4d01051d27eb96806c83ccf9af_ENUM" CHECK (type IN ('sales','retention','client_potential','audit_status','kyc_status','system','regulations','client_type'))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "custom_status" ADD CONSTRAINT "CHK_b7f0b79f277884045de6a024ab_ENUM" CHECK (type IN ('sales','retention','client_potential','audit_status','kyc_status','system'))`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_status" DROP CONSTRAINT "CHK_4d01051d27eb96806c83ccf9af_ENUM"`,
    );
  }
}
