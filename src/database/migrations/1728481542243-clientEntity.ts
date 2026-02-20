import { MigrationInterface, QueryRunner } from "typeorm";

export class ClientEntity1728481542243 implements MigrationInterface {
    name = 'ClientEntity1728481542243'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" ADD CONSTRAINT "DF_50ffba402a95d4a5948fd20135d" DEFAULT 1 FOR "isActive"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "DF_fde2ce12ab12b02ae583dd76c7c" DEFAULT 1 FOR "isActive"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP CONSTRAINT "DF_50ffba402a95d4a5948fd20135d"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_fde2ce12ab12b02ae583dd76c7c"`);
    }

}
