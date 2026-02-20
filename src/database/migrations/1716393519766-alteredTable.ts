import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlteredTable1716393519766 implements MigrationInterface {
  name = 'AlteredTable1716393519766';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP CONSTRAINT "FK_0e422048945ac49071b029c86f0"`,
    );
    await queryRunner.query(`ALTER TABLE "admin_task" DROP COLUMN "entity"`);
    await queryRunner.query(`ALTER TABLE "admin_task" DROP COLUMN "entityId"`);
    await queryRunner.query(`ALTER TABLE "admin_task" DROP COLUMN "title"`);
    await queryRunner.query(`ALTER TABLE "admin_task" DROP COLUMN "daysAfter"`);
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP COLUMN "specificDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP COLUMN "contactName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP COLUMN "assigneeId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" ADD "relatedTo" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" ADD "relatedToId" int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" ADD "subject" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "admin_task" ADD "after" int`);
    await queryRunner.query(`ALTER TABLE "admin_task" ADD "on" date`);
    await queryRunner.query(`ALTER TABLE "admin_task" ADD "assignToId" int`);
    await queryRunner.query(`ALTER TABLE "admin_task" ADD "contactId" int`);
    await queryRunner.query(
      `ALTER TABLE "admin_task" ADD CONSTRAINT "FK_06ed203057ce574fec5a08c8601" FOREIGN KEY ("assignToId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" ADD CONSTRAINT "FK_b630c0b6d0d25ffb74e9870a853" FOREIGN KEY ("contactId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP CONSTRAINT "FK_b630c0b6d0d25ffb74e9870a853"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP CONSTRAINT "FK_06ed203057ce574fec5a08c8601"`,
    );
    await queryRunner.query(`ALTER TABLE "admin_task" DROP COLUMN "contactId"`);
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP COLUMN "assignToId"`,
    );
    await queryRunner.query(`ALTER TABLE "admin_task" DROP COLUMN "on"`);
    await queryRunner.query(`ALTER TABLE "admin_task" DROP COLUMN "after"`);
    await queryRunner.query(`ALTER TABLE "admin_task" DROP COLUMN "subject"`);
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP COLUMN "relatedToId"`,
    );
    await queryRunner.query(`ALTER TABLE "admin_task" DROP COLUMN "relatedTo"`);
    await queryRunner.query(`ALTER TABLE "admin_task" ADD "assigneeId" int`);
    await queryRunner.query(
      `ALTER TABLE "admin_task" ADD "contactName" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "admin_task" ADD "specificDate" date`);
    await queryRunner.query(`ALTER TABLE "admin_task" ADD "daysAfter" int`);
    await queryRunner.query(
      `ALTER TABLE "admin_task" ADD "title" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" ADD "entityId" int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" ADD "entity" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" ADD CONSTRAINT "FK_0e422048945ac49071b029c86f0" FOREIGN KEY ("assigneeId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
