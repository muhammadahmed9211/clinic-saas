import { MigrationInterface, QueryRunner } from "typeorm";

export class MergedTicket1744374432678 implements MigrationInterface {
    name = 'MergedTicket1744374432678'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "merged_tickets" ("id" int NOT NULL IDENTITY(1,1), "merge_group_id" uniqueidentifier NOT NULL, "ticket_id" int NOT NULL, "status" nvarchar(255) CONSTRAINT CHK_a1863c1229419ef16188ee7203_ENUM CHECK(status IN ('PRIMARY','SECONDARY')) NOT NULL, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_3f9c64aadf90dd05519b0f66936" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_11e7865783319bfd767d18c2f01" DEFAULT getdate(), "deletedAt" datetime2, CONSTRAINT "PK_169086c7489c4454e56faa3ede4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0cd59375c6dd1f8c02cfce2952" ON "merged_tickets" ("merge_group_id") `);
        await queryRunner.query(`ALTER TABLE "merged_tickets" ADD CONSTRAINT "FK_2e777c95c7ad48fdd5111f1f16d" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "merged_tickets" DROP CONSTRAINT "FK_2e777c95c7ad48fdd5111f1f16d"`);
        await queryRunner.query(`DROP INDEX "IDX_0cd59375c6dd1f8c02cfce2952" ON "merged_tickets"`);
        await queryRunner.query(`DROP TABLE "merged_tickets"`);
    }

}
