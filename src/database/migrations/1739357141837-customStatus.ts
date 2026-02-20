import { MigrationInterface, QueryRunner } from "typeorm";

export class CustomStatus1739357141837 implements MigrationInterface {
    name = 'CustomStatus1739357141837'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "custom_status" DROP CONSTRAINT "CHK_1e421f10a6ef7ea9c1ffc19990_ENUM"`);
        await queryRunner.query(`ALTER TABLE "custom_status" ADD CONSTRAINT "CHK_bb94aecad4ab572bdbb0bb6e0b_ENUM" CHECK (type IN ('sales','retention','client_potential','audit_status','kyc_status','system','regulations','client_type','call_results','lead','report_activity'))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "custom_status" ADD CONSTRAINT "CHK_1e421f10a6ef7ea9c1ffc19990_ENUM" CHECK (type IN ('sales','retention','client_potential','audit_status','kyc_status','system','regulations','client_type','call_results','lead'))`);
        await queryRunner.query(`ALTER TABLE "custom_status" DROP CONSTRAINT "CHK_bb94aecad4ab572bdbb0bb6e0b_ENUM"`);
}

}
