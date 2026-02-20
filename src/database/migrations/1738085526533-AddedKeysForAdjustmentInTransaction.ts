import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedKeysForAdjustmentInTransaction1738085526533 implements MigrationInterface {
    name = 'AddedKeysForAdjustmentInTransaction1738085526533'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "adjustmentType" varchar(255)`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "adjustmentAccountType" varchar(255)`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "isClientVisible" bit NOT NULL CONSTRAINT "DF_166e6cb5e4efcfb64c2a71d713d" DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "CHK_c47884d8d32ade91b34e31e7bc_ENUM"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "CHK_60304e3f247cba3fefc2f55240_ENUM" CHECK (type IN ('DEPOSIT','WITHDRAW','TRANSFER_IN','TRANSFER_OUT','CREDIT_IN','CREDIT_OUT','BONUS_IN','BONUS_OUT','FEE','ADJUSTMENT'))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "isClientVisible"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "adjustmentAccountType"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "adjustmentType"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "CHK_60304e3f247cba3fefc2f55240_ENUM"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "CHK_c47884d8d32ade91b34e31e7bc_ENUM" CHECK (type IN ('DEPOSIT','WITHDRAW','TRANSFER_IN','TRANSFER_OUT','CREDIT_IN','CREDIT_OUT','BONUS_IN','BONUS_OUT','FEE'))`);
    }

}
