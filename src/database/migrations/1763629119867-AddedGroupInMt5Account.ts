import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedGroupInMt5Account1763629119867 implements MigrationInterface {
    name = 'AddedGroupInMt5Account1763629119867'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mt5_account" ADD "groupId" int`);
        await queryRunner.query(`ALTER TABLE "mt5_account" ADD CONSTRAINT "FK_7197f88929ad850d09a57bd517a" FOREIGN KEY ("groupId") REFERENCES "trading_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
