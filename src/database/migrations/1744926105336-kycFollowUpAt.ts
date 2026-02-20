import { MigrationInterface, QueryRunner } from "typeorm";

export class KycFollowUpAt1744926105336 implements MigrationInterface {
    name = 'KycFollowUpAt1744926105336'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" ADD "kycFollowUpAt" datetime`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "kycFollowUpAt"`);
    }

}
