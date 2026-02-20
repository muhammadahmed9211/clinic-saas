import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterUserKycDocumentsRelations1717197130661
  implements MigrationInterface
{
  name = 'AlterUserKycDocumentsRelations1717197130661';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "office" ADD "manager" bigint`);
    await queryRunner.query(`ALTER TABLE "desk" ADD "manager" bigint`);
    await queryRunner.query(`ALTER TABLE "file" ADD "operatorId" bigint`);
    await queryRunner.query(
      `ALTER TABLE "office" ADD CONSTRAINT "FK_afc39988f2939b1847a6c3f4125" FOREIGN KEY ("manager") REFERENCES "operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "desk" ADD CONSTRAINT "FK_ff17070f6e68165d07bd9983849" FOREIGN KEY ("manager") REFERENCES "operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_kyc_documents" ADD CONSTRAINT "FK_0162eda41660358a4a5641efdde" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_kyc_documents" ADD CONSTRAINT "FK_72d484cdf856cf5617706f212a4" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "file" ADD CONSTRAINT "FK_ece81c87c4b6fd44511dfa7f996" FOREIGN KEY ("operatorId") REFERENCES "operator"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "file" DROP CONSTRAINT "FK_ece81c87c4b6fd44511dfa7f996"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_kyc_documents" DROP CONSTRAINT "FK_72d484cdf856cf5617706f212a4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_kyc_documents" DROP CONSTRAINT "FK_0162eda41660358a4a5641efdde"`,
    );
    await queryRunner.query(
      `ALTER TABLE "desk" DROP CONSTRAINT "FK_ff17070f6e68165d07bd9983849"`,
    );
    await queryRunner.query(
      `ALTER TABLE "office" DROP CONSTRAINT "FK_afc39988f2939b1847a6c3f4125"`,
    );
    await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "operatorId"`);
    await queryRunner.query(`ALTER TABLE "desk" DROP COLUMN "manager"`);
    await queryRunner.query(`ALTER TABLE "office" DROP COLUMN "manager"`);
  }
}
