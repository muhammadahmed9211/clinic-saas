import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedIsDepositSelectInCryptoTables1740740282381 implements MigrationInterface {
    name = 'AddedIsDepositSelectInCryptoTables1740740282381'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "supported_crypto" ADD "isDepositSupported" bit NOT NULL CONSTRAINT "DF_9f8158af84a764122b43f43379b" DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE "crypto_network" ADD "isDepositSupported" bit NOT NULL CONSTRAINT "DF_ca34fc58d2eaeeee72e34a2fbc8" DEFAULT 1`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "crypto_network" DROP CONSTRAINT "DF_ca34fc58d2eaeeee72e34a2fbc8"`);
        await queryRunner.query(`ALTER TABLE "crypto_network" DROP COLUMN "isDepositSupported"`);
        await queryRunner.query(`ALTER TABLE "supported_crypto" DROP CONSTRAINT "DF_9f8158af84a764122b43f43379b"`);
        await queryRunner.query(`ALTER TABLE "supported_crypto" DROP COLUMN "isDepositSupported"`);
    }

}
