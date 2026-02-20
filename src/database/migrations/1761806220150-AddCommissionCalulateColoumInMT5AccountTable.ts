import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCommissionCalulateColoumInMT5AccountTable1761806220150 implements MigrationInterface {
    name = 'AddCommissionCalulateColoumInMT5AccountTable1761806220150'

    public async up(queryRunner: QueryRunner): Promise<void> {
    
        await queryRunner.query(`ALTER TABLE "mt5_account" ADD "calculateCommission" bit NOT NULL CONSTRAINT "DF_37ba0a7071561bef7dfc6183c03" DEFAULT 0`);
      }

    public async down(queryRunner: QueryRunner): Promise<void> {
      
        await queryRunner.query(`ALTER TABLE "mt5_account" DROP COLUMN "calculateCommission"`);
         }

}
