import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateIbProfile1747979506241 implements MigrationInterface {
    name = 'UpdateIbProfile1747979506241'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ib_commission_profile" DROP CONSTRAINT "UQ_1a62e5bef82f79bac0e54086ec8"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE "ib_commission_profile" ADD CONSTRAINT "UQ_1a62e5bef82f79bac0e54086ec8" UNIQUE ("name")`);
    }

}
