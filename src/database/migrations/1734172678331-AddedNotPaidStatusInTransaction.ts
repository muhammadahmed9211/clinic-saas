import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedNotPaidStatusInTransaction1734172678331 implements MigrationInterface {
    name = 'AddedNotPaidStatusInTransaction1734172678331'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "CHK_364d8e83f2db923c9b66b5cf80_ENUM"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "CHK_50bb420ac7fe5fbf2effd3d51d_ENUM" CHECK (status IN ('Initialized Not Paid','APPROVED','FAILED','REJECTED','NOT_PAID','IDLE','NEW','INITIALIZED','RECEIVED','PENDING','PROCESSED','APPROVED_ON_HOLD','CANCELLED','COMPLETED'))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "CHK_364d8e83f2db923c9b66b5cf80_ENUM" CHECK (status IN ('IDLE','NEW','INITIALIZED','Initialized Not Paid','APPROVED','FAILED','REJECTED','RECEIVED','PENDING','PROCESSED','APPROVED_ON_HOLD','CANCELLED','COMPLETED'))`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "CHK_50bb420ac7fe5fbf2effd3d51d_ENUM"`);
    }

}
