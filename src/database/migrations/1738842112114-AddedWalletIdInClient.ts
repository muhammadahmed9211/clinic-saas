import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedWalletIdInClient1738842112114 implements MigrationInterface {
    name = 'AddedWalletIdInClient1738842112114'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" ADD "walletId" int`);
        await queryRunner.query(`CREATE INDEX "IDX_da10ccdd3e24e1d559f8f32af0" ON "client" ("walletId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_da10ccdd3e24e1d559f8f32af0" ON "client" ("walletId") WHERE "walletId" IS NOT NULL`);
        await queryRunner.query(`ALTER TABLE "client" ADD CONSTRAINT "FK_da10ccdd3e24e1d559f8f32af0a" FOREIGN KEY ("walletId") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_da10ccdd3e24e1d559f8f32af0" ON "client"`);
        await queryRunner.query(`ALTER TABLE "client" DROP CONSTRAINT "FK_da10ccdd3e24e1d559f8f32af0a"`);
        await queryRunner.query(`DROP INDEX "REL_da10ccdd3e24e1d559f8f32af0" ON "client"`);
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "walletId"`);
    }

}
