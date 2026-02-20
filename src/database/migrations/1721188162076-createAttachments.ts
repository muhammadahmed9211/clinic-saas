import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAttachments1721188162076 implements MigrationInterface {
  name = 'CreateAttachments1721188162076';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "attachments" ("id" int NOT NULL IDENTITY(1,1), "fileId" uniqueidentifier NOT NULL, "isPublic" bit NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_59ae1036d9869d21146e87a1b3d" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_13c9254f132c350d85c7f72564b" DEFAULT getdate(), "deleted_at" datetime2, "opportunityId" int, "attachedBy" int, "leadId" int, CONSTRAINT "PK_5e1f050bcff31e3084a1d662412" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0d9a24d95631f208603c2bb12f" ON "attachments" ("fileId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "attachments" ADD CONSTRAINT "FK_9280d296e10ca844210d50435b6" FOREIGN KEY ("opportunityId") REFERENCES "opportunity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachments" ADD CONSTRAINT "FK_3268fee82fd3a3c9e58c20cd02f" FOREIGN KEY ("attachedBy") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachments" ADD CONSTRAINT "FK_58759ae11d403ec1ceb76153a5c" FOREIGN KEY ("leadId") REFERENCES "lead"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachments" ADD CONSTRAINT "FK_0d9a24d95631f208603c2bb12f3" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "attachments" DROP CONSTRAINT "FK_0d9a24d95631f208603c2bb12f3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachments" DROP CONSTRAINT "FK_58759ae11d403ec1ceb76153a5c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachments" DROP CONSTRAINT "FK_3268fee82fd3a3c9e58c20cd02f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachments" DROP CONSTRAINT "FK_9280d296e10ca844210d50435b6"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_0d9a24d95631f208603c2bb12f" ON "attachments"`,
    );
    await queryRunner.query(`DROP TABLE "attachments"`);
  }
}
