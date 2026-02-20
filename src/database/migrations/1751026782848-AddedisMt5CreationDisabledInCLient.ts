import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedisMt5CreationDisabledInCLient1751026782848 implements MigrationInterface {
    name = 'AddedisMt5CreationDisabledInCLient1751026782848'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP CONSTRAINT "DF_4b33f104927a0cdca5116f26ed6"`);
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "isClientAndAccountsDisabled"`);
        await queryRunner.query(`ALTER TABLE "client" ADD "isMt5CreationDisabled" bit NOT NULL CONSTRAINT "DF_e2b80ee53ca3e588be956291253" DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    
        await queryRunner.query(`ALTER TABLE "client" DROP CONSTRAINT "DF_e2b80ee53ca3e588be956291253"`);
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "isMt5CreationDisabled"`);
        await queryRunner.query(`ALTER TABLE "client" ADD "isClientAndAccountsDisabled" bit NOT NULL`);
        await queryRunner.query(`ALTER TABLE "client" ADD CONSTRAINT "DF_4b33f104927a0cdca5116f26ed6" DEFAULT 0 FOR "isClientAndAccountsDisabled"`);
    }

}
