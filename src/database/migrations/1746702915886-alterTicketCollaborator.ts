import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTicketCollaborator1746702915886 implements MigrationInterface {
    name = 'AlterTicketCollaborator1746702915886'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket_collaborators" ADD "createdAt" datetime2 NOT NULL CONSTRAINT "DF_3ea41e9b6c79a2b714a30d09cbe" DEFAULT getdate()`);
        await queryRunner.query(`ALTER TABLE "ticket_collaborators" ADD "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_90a9b64213346aa63f9046afa1e" DEFAULT getdate()`);
        await queryRunner.query(`ALTER TABLE "ticket_collaborators" ADD "deletedAt" datetime2`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket_collaborators" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "ticket_collaborators" DROP CONSTRAINT "DF_90a9b64213346aa63f9046afa1e"`);
        await queryRunner.query(`ALTER TABLE "ticket_collaborators" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "ticket_collaborators" DROP CONSTRAINT "DF_3ea41e9b6c79a2b714a30d09cbe"`);
        await queryRunner.query(`ALTER TABLE "ticket_collaborators" DROP COLUMN "createdAt"`);
    }

}
