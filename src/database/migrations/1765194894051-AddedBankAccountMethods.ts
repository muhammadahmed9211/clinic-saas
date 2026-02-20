import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedBankAccountMethods1765194894051 implements MigrationInterface {
    name = 'AddedBankAccountMethods1765194894051';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create bank_account_methods table
        await queryRunner.query(`
            CREATE TABLE "bank_account_methods" (
                "id" int NOT NULL IDENTITY(1,1),
                "logoId" uniqueidentifier NOT NULL,
                "createdAt" datetime NOT NULL CONSTRAINT "DF_d155128dfc866fd32e610ac8004" DEFAULT getdate(),
                "deletedAt" datetime2,
                "updatedAt" datetime NOT NULL CONSTRAINT "DF_9abdd72569c1628415ec5f96c42" DEFAULT getdate(),
                "bankAccountId" int NOT NULL,
                CONSTRAINT "PK_70f813a7321ccc138312fe39c5a" PRIMARY KEY ("id")
            )
        `);

        // Alter bank_account table
        await queryRunner.query(`ALTER TABLE "bank_account" ADD "zipCode" varchar(100)`);
        await queryRunner.query(`
            ALTER TABLE "bank_account" 
            ADD "isLocalMethodsEnable" bit NOT NULL CONSTRAINT "DF_763922f055f7c5e8807f19a45c1" DEFAULT 0
        `);
        await queryRunner.query(`
            ALTER TABLE "bank_account" 
            ADD "conversionRate" float NOT NULL CONSTRAINT "DF_7db101882d4abd32f8cc6304256" DEFAULT 1
        `);
        await queryRunner.query(`
            ALTER TABLE "bank_account" 
            ADD "conversionCurrency" nvarchar(255) NOT NULL CONSTRAINT "DF_38bd697e55abff03a673464139d" DEFAULT 'USD'
        `);

        // Add foreign key constraints
        await queryRunner.query(`
            ALTER TABLE "bank_account_methods" 
            ADD CONSTRAINT "FK_1ab180303e0ba32a8ba42122b8c" FOREIGN KEY ("bankAccountId") 
            REFERENCES "bank_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "bank_account_methods" 
            ADD CONSTRAINT "FK_ad1c148edeaa385ab16090f1483" FOREIGN KEY ("logoId") 
            REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        // Create currencies table
        await queryRunner.query(`
            CREATE TABLE currencies (
                id int IDENTITY(1,1) NOT NULL,
                currency varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
                iso varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
                symbol nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
                countryId int NULL,
                createdAt datetime DEFAULT getdate() NOT NULL,
                deletedAt datetime2 NULL,
                updatedAt datetime DEFAULT getdate() NOT NULL,
                isActive bit DEFAULT 1 NOT NULL,
                CONSTRAINT PK_d528c54860c4182db13548e08c4 PRIMARY KEY (id),
                CONSTRAINT FK_99092b1a218e208bfda45824b0b FOREIGN KEY (countryId) REFERENCES countries(id)
            )
        `);

        // Insert default currencies
        await queryRunner.query(`
            INSERT INTO currencies (currency, iso, symbol)
            VALUES
                ('Dirham', 'AED', N'د.إ'),
                ('Euro', 'EUR', N'€'),
                ('Pound Sterling', 'GBP', N'£'),
                ('Pakistan Rupee', 'PKR', N'₨'),
                ('US Dollar', 'USD', N'$'),
                ('Rand', 'ZAR', 'R'),
                ('Indian Rupee', 'INR', N'₹'),
                ('Saudi Riyal', 'SAR', N'﷼')
        `);

        // Insert list columns metadata
        await queryRunner.query(`
            DECLARE @listId INT = (SELECT id FROM list_name WHERE name = 'COMPANY_BANK_ACCOUNT');
            DECLARE @groupId INT = (SELECT id FROM list_columns_group WHERE listId = @listId);

            INSERT INTO list_columns_meta (name, label, listId, groupId, [type], isVisible)
            VALUES
                ('swift', 'Swift', @listId, @groupId, 'STRING', 1),
                ('bankAddress', 'Bank Address', @listId, @groupId, 'STRING', 1),
                ('companyAddress', 'Company Address', @listId, @groupId, 'STRING', 1),
                ('additionalInformation', 'Additional Information', @listId, @groupId, 'STRING', 1),
                ('intermediateBankName', 'Intermediate Bank Name', @listId, @groupId, 'STRING', 1),
                ('branchCode', 'Branch Code', @listId, @groupId, 'STRING', 1),
                ('reference', 'Reference', @listId, @groupId, 'STRING', 1),
                ('zipCode', 'Zip Code', @listId, @groupId, 'STRING', 1),
                ('isLocalMethodsEnable', 'Is Local Methods Enable', @listId, @groupId, 'BOOLEAN', 1),
                ('methodsIds', 'Methods Ids', @listId, @groupId, 'STRING', 1),
                ('currency.conversionRate', 'Conversion Rate', @listId, @groupId, 'NUMBER', 1)
                
            UPDATE list_columns_meta
            SET name=N'currency.iso'
            WHERE label=N'Account Currency' AND listId = @listId AND groupId = @groupId
        `);
        await queryRunner.query(`
            DECLARE @listId INT = (SELECT id FROM list_name WHERE name = 'BONUS');
            DECLARE @groupId INT = (SELECT id FROM list_columns_group WHERE listId = @listId);

            INSERT INTO list_columns_meta (name, label, listId, groupId, [type], isVisible)
            VALUES('currency.iso', 'Currency', @listId, @groupId, 'STRING', 1)
        `);
        await queryRunner.query(`ALTER TABLE "currencies" ADD "conversionRate" float NOT NULL`);
        await queryRunner.query(`ALTER TABLE "currencies" ADD "conversionCurrency" nvarchar(100) NOT NULL CONSTRAINT "DF_86401f32d8bb19cf40cb2047d28" DEFAULT 'USD'`);
        await queryRunner.query(`
      ALTER TABLE "bank_account"
      DROP CONSTRAINT "DF_38bd697e55abff03a673464139d"
    `);

    await queryRunner.query(`
      ALTER TABLE "bank_account"
      DROP COLUMN "conversionCurrency"
    `);

    await queryRunner.query(`
      ALTER TABLE "bank_account"
      DROP CONSTRAINT "DF_7db101882d4abd32f8cc6304256"
    `);

    await queryRunner.query(`
      ALTER TABLE "bank_account"
      DROP COLUMN "conversionRate"
    `);

    await queryRunner.query(`
      ALTER TABLE "bank_account"
      ADD "currencyId" INT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "bank_account"
      ADD CONSTRAINT "FK_f3223f8f2a8381de5561e77dd11"
      FOREIGN KEY ("currencyId")
      REFERENCES "currencies"("id")
    `);

    await queryRunner.query(`
      UPDATE ba
      SET ba.currencyId = c.id
      FROM bank_account ba
      JOIN currencies c ON ba.currency = c.iso
    `);

    await queryRunner.query(`
      ALTER TABLE "bank_account"
      ALTER COLUMN "currencyId" INT NOT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "bank_account"
      DROP COLUMN "currency"
    `);

    await queryRunner.query(`
      ALTER TABLE "bonus"
      ADD "currencyId" INT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "bonus"
      ADD CONSTRAINT "FK_b629c644657d677428778e57bc7"
      FOREIGN KEY ("currencyId")
      REFERENCES "currencies"("id")
    `);

    await queryRunner.query(`
      DECLARE @currencyId INT;
      SELECT @currencyId = id FROM currencies WHERE iso = 'USD';

      UPDATE bonus
      SET currencyId = @currencyId
      WHERE currencyId IS NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "bonus"
      ALTER COLUMN "currencyId" INT NOT NULL
    `);

    await queryRunner.query(`ALTER TABLE "bonus_reward" ADD "convertedAmount" int NULL`);
    await queryRunner.query(`UPDATE bonus_reward SET convertedAmount = amount`)
    await queryRunner.query(`ALTER TABLE "bonus_reward"
      ALTER COLUMN "convertedAmount" INT NOT NULL`)
    await queryRunner.query(`CREATE TABLE "bonus_countries" ("id" int NOT NULL IDENTITY(1,1), "bonusId" int NOT NULL, "countryId" int NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_dc359a7b5c48c78be44d89e9138" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_c515995337b20c474c8ced2db55" DEFAULT getdate(), "deletedAt" datetime2, CONSTRAINT "PK_c959151bd6229d48ec28d2ac5da" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_bf443e79efd2dac95af216f745" ON "bonus_countries" ("bonusId", "countryId") `);
    await queryRunner.query(`ALTER TABLE "bonus_countries" ADD CONSTRAINT "FK_ac720a267ce3cf5ce5c001b511b" FOREIGN KEY ("bonusId") REFERENCES "bonus"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "bonus_countries" ADD CONSTRAINT "FK_f649f36a27dfd65a03991bcd4a3" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

    public async down(_: QueryRunner): Promise<void> {}
}
