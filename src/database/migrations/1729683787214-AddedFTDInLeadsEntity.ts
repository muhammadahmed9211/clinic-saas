import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedFTDInLeadsEntity1729683787214 implements MigrationInterface {
    name = 'AddedFTDInLeadsEntity1729683787214'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lead" ADD "FTD" bit CONSTRAINT "DF_2eeada57fc86f92427eac5ac2f6" DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lead" DROP CONSTRAINT "DF_2eeada57fc86f92427eac5ac2f6"`);
        await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "FTD"`); 
    }

}
