import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRolePermissionRel1716291641424
  implements MigrationInterface
{
  name = 'CreateRolePermissionRel1716291641424';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "permission_role_rel" ("id" int NOT NULL IDENTITY(1,1), "createdAt" datetime2 NOT NULL CONSTRAINT "DF_448901e38c7230f368c60a43d92" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_8a902a119096104e07e1f178c97" DEFAULT getdate(), "permissionId" int, "roleId" int, CONSTRAINT "PK_f7f63273fb986bc9979bdef9414" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission_role_rel" ADD CONSTRAINT "FK_0c3d84aa1fff7379a6d69cc9b04" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission_role_rel" ADD CONSTRAINT "FK_622d5aaf713a8507373d9571b4b" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "permission_role_rel" DROP CONSTRAINT "FK_622d5aaf713a8507373d9571b4b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission_role_rel" DROP CONSTRAINT "FK_0c3d84aa1fff7379a6d69cc9b04"`,
    );
    await queryRunner.query(`DROP TABLE "permission_role_rel"`);
  }
}
