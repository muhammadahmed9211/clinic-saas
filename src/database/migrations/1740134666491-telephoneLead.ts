import { MigrationInterface, QueryRunner } from "typeorm";

export class TelephoneLead1740134666491 implements MigrationInterface {
    name = 'TelephoneLead1740134666491'

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE "lead" ADD "telephonePrefix" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "lead" ADD "telephone" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "regulations_countries" ADD "telephonePrefix" int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    
        await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "telephone"`);
        await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "telephonePrefix"`);
        await queryRunner.query(`ALTER TABLE "regulations_countries" DROP COLUMN "telephonePrefix"`);
    }

}
