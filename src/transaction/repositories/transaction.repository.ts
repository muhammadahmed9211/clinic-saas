import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { DataSource, FindManyOptions, FindOneOptions } from 'typeorm';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from '../entities/transaction.entity';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { RoleService } from 'src/roles/role.service';
import {
  Methods,
  MethodsMapper,
  TransactionMethod,
} from '../entities/transaction-method.entity';

interface IWidgetType {
  methodId: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
}

interface IMethodWidgetType {
  methodId: number;
  depositToday: number;
  depositThisWeek: number;
  depositThisMonth: number;
  withdrawToday: number;
  withdrawThisWeek: number;
  withdrawThisMonth: number;
}

export interface IMethodWidgetResponseType {
  method: string;
  deposit: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  withdraw: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
}

export interface PspData {
  pspId: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  psp: string;
}

type MethodPspWidgetData = {
  [key: string | number]: {
    psp: PspData[];
    method: string;
  };
};

interface IWidgetTypeWithPsp {
  methodId: number;
  pspId: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
}
export interface IWidgetResponseType {
  method: string;
  today: number;
  thisWeek: number;
  thisMonth: number;
}

export interface IWidgetMethodPspResponseType {
  method: string;
  psp: {
    psp: string;
    today: number;
    thisWeek: number;
    thisMonth: number;
  }[];
}

export interface Dictionary {
  [key: string | number]: string;
}

type PspAndBankQueryResp = [IWidgetTypeWithPsp[], any[]];

@Injectable()
export class TransactionRepository extends BaseRepository<Transaction> {
  constructor(
    dataSource: DataSource,
    listCacheService: ListCacheService,
    roleService: RoleService,
  ) {
    super(Transaction, dataSource, listCacheService, roleService);
  }

  async getWalletInfo(
    walletId: number,
  ): Promise<{ deposit: number; withdraw: number }> {
    const result = await this.createQueryBuilder('transaction')
      .select(
        `SUM(CASE WHEN transaction.type = '${TransactionType.DEPOSIT}' AND transaction.status = '${TransactionStatus.APPROVED}' THEN transaction.paidAmount ELSE 0 END)`,
        'deposit',
      )
      .addSelect(
        `SUM(CASE WHEN transaction.type = '${TransactionType.WITHDRAW}' AND transaction.status = '${TransactionStatus.APPROVED}' THEN transaction.paidAmount ELSE 0 END)`,
        'withdraw',
      )
      .where('transaction.walletId = :walletId', { walletId })
      .getRawOne();
    return {
      deposit: result.deposit || 0,
      withdraw: result.withdraw || 0,
    };
  }

  async getUserWalletInfo(
    userId: number,
  ): Promise<{ deposit: number; withdraw: number; walletId: number }[]> {
    const results = await this.createQueryBuilder('transaction')
      .select('transaction.walletId', 'walletId')
      .addSelect(
        `SUM(CASE WHEN transaction.type = '${TransactionType.DEPOSIT}' AND transaction.status = '${TransactionStatus.APPROVED}' THEN transaction.paidAmount ELSE 0 END)`,
        'deposit',
      )
      .addSelect(
        `SUM(CASE WHEN transaction.type = '${TransactionType.WITHDRAW}' AND transaction.status = '${TransactionStatus.APPROVED}' THEN transaction.paidAmount ELSE 0 END)`,
        'withdraw',
      )
      .innerJoin(Wallet, 'wallet', 'transaction.walletId = wallet.id')
      .where('wallet.userId = :userId', { userId })
      .groupBy('transaction.walletId')
      .getRawMany();

    return results;
  }

  public async find(query: FindManyOptions<Transaction>) {
    if (query.relations) {
      if (Array.isArray(query.relations)) {
        const isUserExist = query.relations.find((r) => r === 'user');
        if (!isUserExist) {
          query.relations.push('user');
        }
      } else {
        query.relations.user = true;
      }
    } else {
      query.relations = ['user'];
    }
    return this.table.find(query);
  }

  public async findOne(query: FindOneOptions<Transaction>) {
    if (query.relations) {
      if (Array.isArray(query.relations)) {
        const isUserExist = query.relations.find((r) => r === 'user');
        if (!isUserExist) {
          query.relations.push('user');
        }
      } else {
        query.relations.user = true;
      }
    } else {
      query.relations = ['user'];
    }
    return this.table.findOne(query);
  }

  public async getDepositSummaryByMethods(
    methods: TransactionMethod[],
    type: 'NET' | 'INITIATED',
  ) {
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const weekStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay(),
    );
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const amountKey = type === 'NET' ? 'paidAmount' : 'amount';

    const methodIds = methods.map(({ id }) => id);
    const queryBuilder = this.createQueryBuilder('transaction')
      .select('transaction.methodId', 'methodId')
      .addSelect(
        `SUM(CASE 
    WHEN transaction.type = :depositType 
    AND transaction.createdAt >= :todayStart 
    AND transaction.deletedAt IS NULL 
    AND transaction.status = :approveStatus 
    THEN transaction.${amountKey} ELSE 0 END)`,
        'today',
      )
      .addSelect(
        `SUM(CASE 
    WHEN transaction.type = :depositType 
    AND transaction.createdAt >= :weekStart 
    AND transaction.deletedAt IS NULL
    AND transaction.status = :approveStatus
    THEN transaction.${amountKey} ELSE 0 END)`,
        'thisWeek',
      )
      .addSelect(
        `SUM(CASE 
    WHEN transaction.type = :depositType 
    AND transaction.createdAt >= :monthStart 
    AND transaction.deletedAt IS NULL
    AND transaction.status = :approveStatus
    THEN transaction.${amountKey} ELSE 0 END)`,
        'thisMonth',
      )
      .where('transaction.type = :depositType')
      .andWhere('transaction.deletedAt IS NULL')
      .andWhere('transaction.methodId IN (:...methodIds)');

    const parameters: Record<string, any> = {
      depositType: TransactionType.DEPOSIT,
      approveStatus: TransactionStatus.APPROVED,
      todayStart,
      weekStart,
      monthStart,
      methodIds,
    };

    const methodSum: IWidgetType[] = await queryBuilder
      .setParameters(parameters)
      .groupBy('transaction.methodId')
      .getRawMany();

    const widgets: IWidgetResponseType[] = [];

    methods.forEach(({ method, id }) => {
      const isExist = methodSum.find((total) => total.methodId === id);
      const methodName = MethodsMapper[method];
      if (isExist) {
        const today = Number(isExist.today.toFixed(2));
        const thisWeek = Number(isExist.thisWeek.toFixed(2));
        const thisMonth = Number(isExist.thisMonth.toFixed(2));

        const widgetData = {
          method: methodName,
          today,
          thisMonth,
          thisWeek,
        };
        widgets.push(widgetData);
      } else {
        const today = 0;
        const thisWeek = 0;
        const thisMonth = 0;
        const widgetData = {
          method: methodName,
          today,
          thisMonth,
          thisWeek,
        };
        widgets.push(widgetData);
      }
    });
    return widgets;
  }

  public async getDepositSummaryByMethodsAndPsp(
    methods: TransactionMethod[],
    now: Date,
    clientFilter:string
  ) {
    const bankMethod = methods.find(({ method }) => method === Methods.WIRE);
    if (!bankMethod) {
      return [];
    }

    const allowedMethods = methods.filter((m)=>m.id !== bankMethod.id)
    const allowedMethodsId = allowedMethods.map((m)=>m.id)
    const widgets: IWidgetMethodPspResponseType[] = [];
    const query = await this.getDepositSummaryByMethodsAndPspQuery(now, bankMethod.id, allowedMethodsId, clientFilter);
    const data: MethodPspWidgetData = {};

    for (let i = 0; i < query.length; i++) {
      const element = query[i];
      const { methodId, pspId, ...methodData } = element;

      const isExist = methods.find(({ id }) => methodId === id);
      if (!isExist) {
        continue;
      }

      const today = Number(methodData.today.toFixed(2));
      const thisWeek = Number(methodData.thisWeek.toFixed(2));
      const thisMonth = Number(methodData.thisMonth.toFixed(2));
      const totalSum = today + thisWeek + thisMonth;

      const widgetData = {
        today,
        thisWeek,
        thisMonth,
        totalSum,
        pspId,
        psp: methodData.psp,
      };

      if (!data[methodId]) {
        data[methodId] = {
          psp: [],
          method: MethodsMapper[isExist.method],
        };
      }

      data[methodId].psp.push(widgetData);
    }

    Object.keys(data).forEach((methodId) => {
      const { method, psp } = data[methodId];
      widgets.push({ method, psp });
    });

    return widgets;
  }

  public async getDepositSummaryByMethodsAndPspQuery(
    date: Date | string, 
    bankMethodId: number, 
    allMethodIds: number[],
    clientFilter:string
  ) {
    const query = `DECLARE @CurrentDate DATE = CAST('${date}' AS DATE);
    DECLARE @WeekStart DATE = DATEADD(WEEK, DATEDIFF(WEEK, 0, @CurrentDate), 0);
    DECLARE @MonthStart DATE = DATEADD(MONTH, DATEDIFF(MONTH, 0, @CurrentDate), 0);
    
    SELECT
        t.methodId,
        CASE 
            WHEN t.methodId IN (${allMethodIds.join(',')}) THEN t.pspId 
            WHEN t.methodId = ${bankMethodId} THEN t.companyBankId 
        END AS pspId,
        CASE 
            WHEN t.methodId IN (${allMethodIds.join(',')}) THEN CONCAT(p.displayName, ' - ', p.aggregatorName)
            WHEN t.methodId = ${bankMethodId} THEN CONCAT(ba.bankName, ' - ', cur.iso)
        END AS psp,
        SUM(CASE
            WHEN t.type = 'DEPOSIT'
            AND t.createdAt >= @CurrentDate
            AND t.deletedAt IS NULL
            AND t.status = 'APPROVED'
            THEN t.paidAmount
            ELSE 0
        END) AS today,
        SUM(CASE
            WHEN t.type = 'DEPOSIT'
            AND t.createdAt >= @WeekStart
            AND t.deletedAt IS NULL
            AND MONTH(t.createdAt) = MONTH(@CurrentDate)
            AND YEAR(t.createdAt) = YEAR(@CurrentDate)
            AND t.status = 'APPROVED'
            THEN t.paidAmount
            ELSE 0
        END) AS thisWeek,
        SUM(CASE
            WHEN t.type = 'DEPOSIT'
            AND t.createdAt >= @MonthStart
            AND YEAR(t.createdAt) = YEAR(@CurrentDate)
            AND t.deletedAt IS NULL
            AND t.status = 'APPROVED'
            THEN t.paidAmount
            ELSE 0
        END) AS thisMonth
    FROM [transaction] t
    LEFT JOIN "client" "c" ON "t"."userId" = "c"."userId"
    LEFT JOIN [psp] p ON 
        t.methodId IN (${allMethodIds.join(',')}) 
        AND t.pspId = p.id
    LEFT JOIN [bank_account] ba ON 
        t.methodId = ${bankMethodId}
        AND t.companyBankId = ba.id
    LEFT JOIN [currencies] cur ON
        ba.currencyId = cur.id
    WHERE
        t.type = 'DEPOSIT'
        AND t.deletedAt IS NULL
        AND (
            (t.methodId IN (${allMethodIds.join(',')}) AND t.pspId IS NOT NULL)
            OR (t.methodId = ${bankMethodId} AND t.companyBankId IS NOT NULL)
        ) ${clientFilter}
    GROUP BY 
        t.methodId,
        CASE 
            WHEN t.methodId IN (${allMethodIds.join(',')}) THEN t.pspId 
            WHEN t.methodId = ${bankMethodId} THEN t.companyBankId 
        END,
        CASE 
            WHEN t.methodId IN (${allMethodIds.join(',')}) THEN CONCAT(p.displayName, ' - ', p.aggregatorName)
            WHEN t.methodId = ${bankMethodId} THEN CONCAT(ba.bankName, ' - ', cur.iso)
        END;`  
      return this.query(query);
  }

  public async getLatestTransaction() {
    const noOfRecords = 8;

    const select: FindManyOptions<Transaction>['select'] = {
      id: true,
      status: true,
      paidAmount: true,
      updatedAt: true,
      psp: {
        displayName: true,
      },
      user: {
        firstName: true,
        lastName: true,
        client: {
          firstName: true,
          lastName: true,
        },
      },
    };
    const order: FindManyOptions<Transaction>['order'] = {
      updatedAt: 'DESC',
    };

    const relations: FindManyOptions<Transaction>['relations'] = {
      psp: true,
    };

    const data = await this.find({
      take: noOfRecords,
      select,
      order,
      loadEagerRelations: false,
      relations,
    });

    const widgetsData = data.map((transaction) => {
      const { user = null, paidAmount, ...rest } = transaction;

      let client = '';

      const psp = rest?.psp?.displayName;

      if (user?.firstName) {
        client += user.firstName;
      }
      if (user?.lastName) {
        client += ` ${user.lastName}`;
      }

      const amount = Number(paidAmount.toFixed(2));

      return {
        ...rest,
        client,
        psp,
        amount,
      };
    });

    const widgets = widgetsData.filter((w) => {
      return w.client && w.psp;
    });

    return widgets;
  }

  public getDepositAndWithdrawSummaryByMethodsQuery(date: Date | string, methodIds:number[], clientFilter:string) {
    const query = `DECLARE @CurrentDate DATE = CAST('${date}' AS DATE);
DECLARE @WeekStart DATE = DATEADD(WEEK, DATEDIFF(WEEK, 0, @CurrentDate), 0);
DECLARE @MonthStart DATE = DATEADD(MONTH, DATEDIFF(MONTH, 0, @CurrentDate), 0); SELECT "transaction"."methodId" AS "methodId", SUM(CASE
      WHEN "transaction"."type" = 'DEPOSIT'
      AND "transaction"."createdAt" >= @CurrentDate
      AND "transaction"."deletedAt" IS NULL
      AND "transaction"."status" = 'APPROVED'
      THEN "transaction"."paidAmount" ELSE 0 END) AS "depositToday", SUM(CASE
      WHEN "transaction"."type" = 'DEPOSIT'
      AND "transaction"."createdAt" >= @WeekStart
      AND  MONTH("transaction"."createdAt") = MONTH(@CurrentDate)
      AND YEAR("transaction"."createdAt") = YEAR(@CurrentDate)
      AND "transaction"."deletedAt" IS NULL
      AND "transaction"."status" = 'APPROVED'
      THEN "transaction"."paidAmount" ELSE 0 END) AS "depositThisWeek", SUM(CASE
      WHEN "transaction"."type" = 'DEPOSIT'
      AND "transaction"."createdAt" >= @MonthStart
      AND  MONTH("transaction"."createdAt") = MONTH(@CurrentDate)
      AND YEAR("transaction"."createdAt") = YEAR(@CurrentDate)
      AND "transaction"."deletedAt" IS NULL
      AND "transaction"."status" = 'APPROVED'
      THEN "transaction"."paidAmount" ELSE 0 END) AS "depositThisMonth", SUM(CASE
      WHEN "transaction"."type" = 'WITHDRAW'
      AND "transaction"."createdAt" >=  @CurrentDate
      AND "transaction"."deletedAt" IS NULL
      AND "transaction"."status" = 'APPROVED'
      THEN "transaction"."paidAmount" ELSE 0 END) AS "withdrawToday", SUM(CASE
      WHEN "transaction"."type" = 'WITHDRAW'
      AND "transaction"."createdAt" >= @WeekStart
      AND  MONTH("transaction"."createdAt") = MONTH(@CurrentDate)
      AND YEAR("transaction"."createdAt") = YEAR(@CurrentDate)
      AND "transaction"."deletedAt" IS NULL
      AND "transaction"."status" = 'APPROVED'
      THEN "transaction"."paidAmount" ELSE 0 END) AS "withdrawThisWeek", SUM(CASE
      WHEN "transaction"."type" = 'WITHDRAW'
      AND "transaction"."createdAt" >= @MonthStart
      AND  MONTH("transaction"."createdAt") = MONTH(@CurrentDate)
      AND YEAR("transaction"."createdAt") = YEAR(@CurrentDate)
      AND "transaction"."deletedAt" IS NULL
      AND "transaction"."status" = 'APPROVED'
      THEN "transaction"."paidAmount" ELSE 0 END) AS "withdrawThisMonth" 
 FROM "transaction" "transaction" 
 LEFT JOIN "client" "c" ON "transaction"."userId" = "c"."userId"
 WHERE ( "transaction"."type" IN ('DEPOSIT', 'WITHDRAW') AND "transaction"."deletedAt" IS NULL AND "transaction"."methodId" IN (${methodIds.join(",")}) ${clientFilter}) GROUP BY "transaction"."methodId"`;
    return this.query(query);
  }

  public async getDepositAndWithdrawSummaryByMethods(
    methods: TransactionMethod[],
    now: Date,
    clientFilter:string
  ) {
    const widgets: IMethodWidgetResponseType[] = [];
    const methodIds = methods.map((m)=>m.id)
    const methodSum: IMethodWidgetType[] =
      await this.getDepositAndWithdrawSummaryByMethodsQuery(now, methodIds, clientFilter);

    methods.forEach(({ method, id }) => {
      const isExist = methodSum.find((total) => total.methodId === id);
      const methodName = MethodsMapper[method];

      if (isExist) {
        const depositToday = Number(isExist.depositToday.toFixed(2));
        const depositThisWeek = Number(isExist.depositThisWeek.toFixed(2));
        const depositThisMonth = Number(isExist.depositThisMonth.toFixed(2));
        const totalDepositSum =
          depositToday + depositThisWeek + depositThisMonth;

        const withdrawToday = Number(isExist.withdrawToday.toFixed(2));
        const withdrawThisWeek = Number(isExist.withdrawThisWeek.toFixed(2));
        const withdrawThisMonth = Number(isExist.withdrawThisMonth.toFixed(2));
        const totalWithdrawThisMonth =
          withdrawToday + withdrawThisWeek + withdrawThisMonth;

        const deposit = {
          today: depositToday,
          thisWeek: depositThisWeek,
          thisMonth: depositThisMonth,
          totalSum: totalDepositSum,
        };

        const withdraw = {
          today: withdrawToday,
          thisWeek: withdrawThisWeek,
          thisMonth: withdrawThisMonth,
          totalSum: totalWithdrawThisMonth,
        };

        const widgetData = {
          method: methodName,
          deposit,
          withdraw,
        };

        widgets.push(widgetData);
      } else {
        const today = 0;
        const thisWeek = 0;
        const thisMonth = 0;
        const totalSum = 0;

        const data = {
          today,
          thisMonth,
          thisWeek,
          totalSum,
        };
        const widgetData = {
          method: methodName,
          deposit: data,
          withdraw: data,
        };
        widgets.push(widgetData);
      }
    });
    return widgets;
  }

  public async getPspApprovedAndFailedDepositSummary(clientFilter:string) {
    const query = `SELECT 
    [transaction].pspId AS "pspId",
    psp.displayName AS "psp",
    SUM(CASE 
        WHEN [transaction].type = 'DEPOSIT' 
        AND [transaction].status = 'APPROVED' 
        THEN [transaction].paidAmount 
        ELSE 0 
    END) AS "approved",
    SUM(CASE 
        WHEN [transaction].type = 'DEPOSIT' 
        AND [transaction].status = 'NOT_PAID' 
        THEN [transaction].paidAmount 
        ELSE 0 
    END) AS "notPaid",
    SUM(CASE 
        WHEN [transaction].type = 'DEPOSIT' 
        AND [transaction].status IN ('FAILED', 'REJECTED') 
        THEN [transaction].paidAmount 
        ELSE 0 
    END) AS "failed"
FROM 
    [transaction]
LEFT JOIN 
    psp ON [transaction].pspId = psp.id
LEFT JOIN 
    client c ON [transaction].userId = c.userId
WHERE 
    [transaction].deletedAt IS NULL
    ${clientFilter}
GROUP BY 
    [transaction].pspId,
    psp.displayName
HAVING 
    psp.displayName IS NOT NULL;`
    const result = await this.query(query);
    
    const widgets = result.map((data) => {
      const psp = data.psp;
      const approved = Number(data.approved.toFixed(2));
      const failed = Number(data.failed.toFixed(2));
      const notPaid = Number(data.notPaid.toFixed(2));

      const totalSum = approved + failed + notPaid;

      return {
        psp,
        approved,
        failed,
        notPaid,
        totalSum,
      };
    });

    return widgets;
  }

  public async monthlyPspSettlementAmount(now: Date) {
    const query = `DECLARE @CurrentDate DATE = CAST('${now}' AS DATE);
    DECLARE @WeekStart DATE = DATEADD(WEEK, DATEDIFF(WEEK, 0, @CurrentDate), 0);
    DECLARE @MonthStart DATE = DATEADD(MONTH, DATEDIFF(MONTH, 0, @CurrentDate), 0);
    SELECT 
        psp.name AS "psp",
        ROUND(SUM(t.paidAmount) , 2) AS "deposit",
        ROUND((
            SUM(CASE 
                WHEN psp.depositCommissionType = 'AMOUNT' THEN t.paidAmount - psp.depositCommission 
                ELSE t.paidAmount - (t.paidAmount * (psp.depositCommission / 100)) 
            END) - 
            CASE 
                WHEN psp.rolloverType = 'PERCENTAGE' 
                THEN (SUM(CASE 
                        WHEN psp.depositCommissionType = 'AMOUNT' THEN t.paidAmount - psp.depositCommission 
                        ELSE t.paidAmount - (t.paidAmount * (psp.depositCommission / 100)) 
                    END) * (psp.rollover / 100))
                ELSE psp.rollover
            END
        ), 2) AS "netDeposit",
        CONCAT(
            psp.depositCommission,
            CASE WHEN psp.depositCommissionType = 'PERCENTAGE' THEN '%' ELSE '' END
        ) AS "depositFee",
        CONCAT(
            psp.withdrawalCommission,
            CASE WHEN psp.withdrawalCommissionType = 'PERCENTAGE' THEN '%' ELSE '' END
        ) AS "withdrawalFee",
        CONCAT(
            psp.rollover,
            CASE WHEN psp.rolloverType = 'PERCENTAGE' THEN '%' ELSE '' END
        ) AS "rollover"
    FROM [transaction] t
    LEFT JOIN psp psp ON t.pspId = psp.id
    WHERE t.type = 'DEPOSIT' AND t.status = 'APPROVED'
    AND t.createdAt >= @MonthStart
    AND MONTH(t.createdAt) = MONTH(@CurrentDate)
    AND YEAR(t.createdAt) = YEAR(@CurrentDate)
    GROUP BY 
        psp.id,
        psp.name,
        psp.depositCommission,
        psp.depositCommissionType,
        psp.rollover,
        psp.rolloverType,
        psp.withdrawalCommission,
        psp.withdrawalCommissionType
    ORDER BY (
        SUM(CASE 
            WHEN psp.depositCommissionType = 'AMOUNT' THEN t.paidAmount - psp.depositCommission 
            ELSE t.paidAmount - (t.paidAmount * psp.depositCommission) 
        END)
    ) DESC`;

    return this.query(query);
  }
}
