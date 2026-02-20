import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedAssignemntPriorityAndAvailabilityInOperator1744877778170 implements MigrationInterface {
    name = 'AddedAssignemntPriorityAndAvailabilityInOperator1744877778170'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "operator" ADD "assignmentPriority" int NOT NULL CONSTRAINT "DF_dc19a27ca2483553122b1f91409" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "operator" ADD "availabilityStartTime" datetime`);
        await queryRunner.query(`ALTER TABLE "operator" ADD "availabilityEndTime" datetime`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "operator" DROP COLUMN "availabilityEndTime"`);
        await queryRunner.query(`ALTER TABLE "operator" DROP COLUMN "availabilityStartTime"`);
        await queryRunner.query(`ALTER TABLE "operator" DROP CONSTRAINT "DF_dc19a27ca2483553122b1f91409"`);
        await queryRunner.query(`ALTER TABLE "operator" DROP COLUMN "assignmentPriority"`);
    }

}
