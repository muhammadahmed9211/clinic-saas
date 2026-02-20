import { MigrationInterface, QueryRunner } from "typeorm";

export class RegulationUpdate1740186790473 implements MigrationInterface {
    name = 'RegulationUpdate1740186790473'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "regulations" ADD "domain" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "regulations" ADD "clientportal_url" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "regulations" ADD "smtp_host" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "regulations" ADD "smtp_port" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "regulations" ADD "smtp_username" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "regulations" ADD "smtp_password" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "regulations" ADD "smtp_secure" bit CONSTRAINT "DF_f0e33ad0bbf76ddcd3f91e350b1" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "regulations" ADD "from_email" nvarchar(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "regulations" DROP COLUMN "from_email"`);
        await queryRunner.query(`ALTER TABLE "regulations" DROP CONSTRAINT "DF_f0e33ad0bbf76ddcd3f91e350b1"`);
        await queryRunner.query(`ALTER TABLE "regulations" DROP COLUMN "smtp_secure"`);
        await queryRunner.query(`ALTER TABLE "regulations" DROP COLUMN "smtp_password"`);
        await queryRunner.query(`ALTER TABLE "regulations" DROP COLUMN "smtp_username"`);
        await queryRunner.query(`ALTER TABLE "regulations" DROP COLUMN "smtp_port"`);
        await queryRunner.query(`ALTER TABLE "regulations" DROP COLUMN "smtp_host"`);
        await queryRunner.query(`ALTER TABLE "regulations" DROP COLUMN "clientportal_url"`);
        await queryRunner.query(`ALTER TABLE "regulations" DROP COLUMN "domain"`);
    }

}
