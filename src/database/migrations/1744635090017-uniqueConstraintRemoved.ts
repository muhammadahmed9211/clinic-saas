import { MigrationInterface, QueryRunner } from "typeorm";

export class UniqueConstraintRemoved1744635090017 implements MigrationInterface {
    name = 'UniqueConstraintRemoved1744635090017'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_attachments" DROP CONSTRAINT "FK_f782ba00e93088a4a73a01ed28a"`);
        await queryRunner.query(`ALTER TABLE "inbox_email" DROP CONSTRAINT "UQ_d97c9340ddf52ef741bddc8a0d7"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inbox_email" ADD CONSTRAINT "UQ_d97c9340ddf52ef741bddc8a0d7" UNIQUE ("messageId")`);
        await queryRunner.query(`ALTER TABLE "email_attachments" ADD CONSTRAINT "FK_f782ba00e93088a4a73a01ed28a" FOREIGN KEY ("messageId") REFERENCES "inbox_email"("messageId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
