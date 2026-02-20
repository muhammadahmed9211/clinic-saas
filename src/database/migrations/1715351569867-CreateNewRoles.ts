import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNewRoles1715351569867 implements MigrationInterface {
  name = 'CreateNewRoles1715351569867';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "role_filter" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_8cf9257bb87ae0a08ccbc5bbf4c" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_eec63f84438bd693786071b9005" DEFAULT getdate(), CONSTRAINT "PK_62571bc316834f2f88e4077be0a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "role_filter_rel" ("id" int NOT NULL IDENTITY(1,1), "createdAt" datetime2 NOT NULL CONSTRAINT "DF_1a35b1c09794ecd8e8b66f6122b" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_c8d9b45295489f661e7467b94ba" DEFAULT getdate(), "roleId" int, "roleFilterId" int, CONSTRAINT "PK_f52a99854aae01db6a90d666aae" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD "appName" nvarchar(255) NOT NULL CONSTRAINT "DF_39e936340b65dd69b3e49a116ea" DEFAULT 'crm'`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD "description" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD "isReadOnly" bit NOT NULL CONSTRAINT "DF_7c97c3702c94416a90e957c61fe" DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD "departmentId" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD "isHidden" bit NOT NULL CONSTRAINT "DF_fd479a3feea9fd43b94cebcb94f" DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD "canSeeEmail" bit NOT NULL CONSTRAINT "DF_1a0bf96cf0dc4b89c6d4cdb5171" DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD "canSeePhoneNumber" bit NOT NULL CONSTRAINT "DF_9186364ec81ad565cbb45e7ab10" DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD "seeOtherConfidentialData" bit NOT NULL CONSTRAINT "DF_31dc4faab6417629c26a71e2864" DEFAULT 1`,
    );
    await queryRunner.query(`ALTER TABLE "role" ADD "clonedFrom" int`);
    await queryRunner.query(
      `ALTER TABLE "role" ADD "isActive" bit NOT NULL CONSTRAINT "DF_c5f75cd3367769b6f22b298d292" DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD "createdAt" datetime NOT NULL CONSTRAINT "DF_3c39bd046f5e69d37f0e4fe7688" DEFAULT getdate()`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD "updatedAt" datetime NOT NULL CONSTRAINT "DF_824e186a844b0ca85bb8e6a14e5" DEFAULT getdate()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" DROP CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" ADD CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61" DEFAULT 1715351574321 FOR "dateTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" DROP CONSTRAINT "DF_67e240b054dcdf765c0277588ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" ADD CONSTRAINT "DF_67e240b054dcdf765c0277588ad" DEFAULT 1715351575793 FOR "dateTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_filter_rel" ADD CONSTRAINT "FK_338f5e500089957bdf009396178" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_filter_rel" ADD CONSTRAINT "FK_2d91869afb2eaa75d9b5eecebff" FOREIGN KEY ("roleFilterId") REFERENCES "role_filter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role_filter_rel" DROP CONSTRAINT "FK_2d91869afb2eaa75d9b5eecebff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_filter_rel" DROP CONSTRAINT "FK_338f5e500089957bdf009396178"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" DROP CONSTRAINT "DF_67e240b054dcdf765c0277588ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" ADD CONSTRAINT "DF_67e240b054dcdf765c0277588ad" DEFAULT 1715351252877. FOR "dateTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" DROP CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" ADD CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61" DEFAULT 1715351251630. FOR "dateTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" DROP CONSTRAINT "DF_824e186a844b0ca85bb8e6a14e5"`,
    );
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "role" DROP CONSTRAINT "DF_3c39bd046f5e69d37f0e4fe7688"`,
    );
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "role" DROP CONSTRAINT "DF_c5f75cd3367769b6f22b298d292"`,
    );
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "isActive"`);
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "clonedFrom"`);
    await queryRunner.query(
      `ALTER TABLE "role" DROP CONSTRAINT "DF_31dc4faab6417629c26a71e2864"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" DROP COLUMN "seeOtherConfidentialData"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" DROP CONSTRAINT "DF_9186364ec81ad565cbb45e7ab10"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" DROP COLUMN "canSeePhoneNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" DROP CONSTRAINT "DF_1a0bf96cf0dc4b89c6d4cdb5171"`,
    );
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "canSeeEmail"`);
    await queryRunner.query(
      `ALTER TABLE "role" DROP CONSTRAINT "DF_fd479a3feea9fd43b94cebcb94f"`,
    );
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "isHidden"`);
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "departmentId"`);
    await queryRunner.query(
      `ALTER TABLE "role" DROP CONSTRAINT "DF_7c97c3702c94416a90e957c61fe"`,
    );
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "isReadOnly"`);
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "description"`);
    await queryRunner.query(
      `ALTER TABLE "role" DROP CONSTRAINT "DF_39e936340b65dd69b3e49a116ea"`,
    );
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "appName"`);
    await queryRunner.query(`DROP TABLE "role_filter_rel"`);
    await queryRunner.query(`DROP TABLE "role_filter"`);
  }
}
