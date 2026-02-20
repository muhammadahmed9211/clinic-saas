import { MigrationInterface, QueryRunner } from "typeorm";

export class IsCopyTrading1751273102646 implements MigrationInterface {
    name = 'IsCopyTrading1751273102646'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" ADD "isCopyTrading" bit NOT NULL CONSTRAINT "DF_4ff239d5dfb194f50bdffc18c9e" DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "isCopyTrading"`);
    }

}
