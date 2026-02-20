import { MigrationInterface, QueryRunner } from "typeorm";

export class ClientTransferToRetention1741592117818 implements MigrationInterface {
    name = 'ClientTransferToRetention1741592117818'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" ADD "isTransferToRetention" bit NOT NULL CONSTRAINT "DF_8760db46f2a57184f35c36df3b1" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "lead" ADD "isTransferToRetention" bit NOT NULL CONSTRAINT "DF_c38d36aea077d9d3d594974baf7" DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "isTransferToRetention"`);
        await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "isTransferToRetention"`);
    }

}
    