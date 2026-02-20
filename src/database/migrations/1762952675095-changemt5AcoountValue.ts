import { MigrationInterface, QueryRunner } from "typeorm";

export class Changemt5AcoountValue1762952675095 implements MigrationInterface {
    name = 'Changemt5AcoountValue1762952675095'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mt5_account" DROP CONSTRAINT "DF_37ba0a7071561bef7dfc6183c03"`);
        await queryRunner.query(`ALTER TABLE "mt5_account" ADD CONSTRAINT "DF_37ba0a7071561bef7dfc6183c03" DEFAULT 1 FOR "calculateCommission"`);
         }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mt5_account" DROP CONSTRAINT "DF_37ba0a7071561bef7dfc6183c03"`);
        await queryRunner.query(`ALTER TABLE "mt5_account" ADD CONSTRAINT "DF_37ba0a7071561bef7dfc6183c03" DEFAULT 0 FOR "calculateCommission"`);
         }

}
