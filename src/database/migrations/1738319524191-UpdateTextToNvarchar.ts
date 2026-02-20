import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTextToNvarchar1712345678900 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE client ALTER COLUMN p1 NVARCHAR(MAX)`);
        await queryRunner.query(`ALTER TABLE client ALTER COLUMN p2 NVARCHAR(MAX)`);
        await queryRunner.query(`ALTER TABLE client ALTER COLUMN p3 NVARCHAR(MAX)`);
        await queryRunner.query(`ALTER TABLE client ALTER COLUMN p4 NVARCHAR(MAX)`);
        await queryRunner.query(`ALTER TABLE client ALTER COLUMN p5 NVARCHAR(MAX)`);
        await queryRunner.query(`ALTER TABLE client ALTER COLUMN p6 NVARCHAR(MAX)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE client ALTER COLUMN p1 TEXT`);
        await queryRunner.query(`ALTER TABLE client ALTER COLUMN p2 TEXT`);
        await queryRunner.query(`ALTER TABLE client ALTER COLUMN p3 TEXT`);
        await queryRunner.query(`ALTER TABLE client ALTER COLUMN p4 TEXT`);
        await queryRunner.query(`ALTER TABLE client ALTER COLUMN p5 TEXT`);
        await queryRunner.query(`ALTER TABLE client ALTER COLUMN p6 TEXT`);
    }
}
