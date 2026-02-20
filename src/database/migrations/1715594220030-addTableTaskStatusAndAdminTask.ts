import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTableTaskStatusAndAdminTask1715594220030
  implements MigrationInterface
{
  name = 'AddTableTaskStatusAndAdminTask1715594220030';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "admin_task" ("id" int NOT NULL IDENTITY(1,1), "entity" nvarchar(255) NOT NULL, "entityId" int NOT NULL, "createdBy" int NOT NULL, "status" nvarchar(255) NOT NULL, "previousStatus" nvarchar(255) NOT NULL, "title" nvarchar(255) NOT NULL, "description" nvarchar(255) NOT NULL, "isCompleted" bit NOT NULL CONSTRAINT "DF_6f619ddde43e312302386ad8bdc" DEFAULT 0, "dueDate" datetime NOT NULL, "priority" nvarchar(255) NOT NULL, "reminder" datetime, "repeatIntervalType" nvarchar(255), "daysAfter" int, "specificDate" date, "contactName" nvarchar(255) NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_ea3ad9e5d164991c83d78e149b7" DEFAULT getdate(), "deletedAt" datetime2, "updatedAt" datetime NOT NULL CONSTRAINT "DF_cace532241eb32d2f22dbd7a6aa" DEFAULT getdate(), "assigneeId" int, CONSTRAINT "PK_8064eb85d138a33a3568a82cf83" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "task_status" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_e5ef9a3aaf78c03689b5e9163ed" DEFAULT getdate(), "deletedAt" datetime2, "updatedAt" datetime NOT NULL CONSTRAINT "DF_ab37642f4ba08f13068fa0c4c9a" DEFAULT getdate(), CONSTRAINT "PK_b8747cc6a41b6cef4639babf61d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" ADD CONSTRAINT "FK_0e422048945ac49071b029c86f0" FOREIGN KEY ("assigneeId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP CONSTRAINT "FK_0e422048945ac49071b029c86f0"`,
    );
    await queryRunner.query(`DROP TABLE "task_status"`);
    await queryRunner.query(`DROP TABLE "admin_task"`);
  }
}
