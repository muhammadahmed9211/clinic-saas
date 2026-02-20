import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedJoinWithExchangeAndBankAccountInPsp1739881161201 implements MigrationInterface {
    name = 'AddedJoinWithExchangeAndBankAccountInPsp1739881161201'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "psp" ADD "exchangeId" int`);
        await queryRunner.query(`ALTER TABLE "psp" ADD "bankAccountId" int`);
        await queryRunner.query(`ALTER TABLE "psp" ADD CONSTRAINT "FK_18ec489e785318bc4c399a3e5b4" FOREIGN KEY ("exchangeId") REFERENCES "exchange"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "psp" ADD CONSTRAINT "FK_400a43234e76d3191d3bad41a82" FOREIGN KEY ("bankAccountId") REFERENCES "bank_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "psp" DROP COLUMN "bankAccountId"`);
        await queryRunner.query(`ALTER TABLE "psp" DROP COLUMN "exchangeId"`);
        await queryRunner.query(`ALTER TABLE "psp" DROP CONSTRAINT "FK_400a43234e76d3191d3bad41a82"`);
        await queryRunner.query(`ALTER TABLE "psp" DROP CONSTRAINT "FK_18ec489e785318bc4c399a3e5b4"`);
    }

}
