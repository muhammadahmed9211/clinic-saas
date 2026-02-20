import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KafkaService } from 'src/kafka/kafka.service';
import { AccountService } from '../account/account.service';
import { ClientTopics } from 'src/kafka/topics/mt5/client.topics.enum';
import { CreateClientRequest } from './dto/create-client.dto';
import { BindAccountRequest } from './dto/bind-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'src/users/entities/client.entity';
import { IsNull, Repository } from 'typeorm';
import { IClientCreateResponse } from 'src/utils/interface/mt5/client/create-client-response.interface';
import { Mt5RetCode } from 'src/utils/enums/mt5/response-codes.enum.';
import { HttpStatusCode } from 'axios';
import { GetAccountLoginsDto } from './dto/get-accounts-logins.dto';
import { GetClientByExternalIdDto } from './dto/get-client-by-external-id.dto';
import { Mt5Account } from '../entities/mt5-account.entity';
import { UpdateAccountRequest } from '../account/dto/update-account.dto';
import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';
import { GetAccountsRequest } from './dto/get-account.dto';
import { promises } from 'fs';
import { Parser } from 'json2csv';

@Injectable()
export class ClientService {
  constructor(
    @Inject('MT5_SERVICE') private readonly mt5Client: ClientKafka,
    private readonly kafka: KafkaService,
    private readonly accountService: AccountService,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Mt5Account)
    private readonly mt5AccountRepository: Repository<Mt5Account>,
  ) {}

  async createClient(
    createClientDto: CreateClientRequest,
  ): Promise<IClientCreateResponse> {
    try {
      const client = await this.findClientByUserIdAndNullClientId(
        createClientDto.ClientExternalID,
      );
      if (!client) {
        throw new NotFoundException('CRM client already exisits');
      }

      const res: IClientCreateResponse = await this.kafka.SendMessage(
        this.mt5Client,
        ClientTopics.createClient,
        createClientDto,
      );

      if (res.result.retcode !== Mt5RetCode.SUCCESS)
        throw new HttpException(res.result, HttpStatusCode.InternalServerError);

      await this.updateClientWithClientId(client, res.result.answer[0].id);

      return res;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatusCode.NotFound);
      } else {
        throw new HttpException(
          'Internal server error',
          HttpStatusCode.InternalServerError,
        );
      }
    }
  }

  async getAccountLogins(getAccountLoginsDto: GetAccountLoginsDto) {
    if (!getAccountLoginsDto.client) return [];
    return this.kafka.SendMessage(
      this.mt5Client,
      ClientTopics.getAccountLogins,
      getAccountLoginsDto,
    );
  }

  // async getAllAccounts(
  //   getAllAccountsDto: GetAccountsRequest,
  //   getMargin: boolean = false,
  //   demo: boolean = false,
  // ): Promise<any> {
  //   if (demo) {
  //     const accounts = await this.mt5AccountRepository.findBy({
  //       user: { id: +getAllAccountsDto.userId },
  //     });

  //     if (!accounts)
  //       return {
  //         status: Status.SUCCESS,
  //         statusCode: HttpStatusCode.Ok,
  //         message: 'Demo accounts fetched successfully',
  //         result: [],
  //       };

  //     return this.accountService.getMultipleAccountsWithMargin(
  //       {
  //         login: accounts.map((account) => account.login).join(','),
  //       },
  //       true,
  //     );
  //   }
  //   const client = await this.clientRepository.findOne({
  //     where: { userId: +getAllAccountsDto.userId, clientId: Not(IsNull()) },
  //   });

  //   if (!client) throw new NotFoundException('Client not found');

  //   const logins: IAccountLoginsResponse = await this.getAccountLogins({
  //     client: client.clientId,
  //   });
  //   const ids = logins?.result?.answer[client.clientId].join(',');

  //   if (!ids)
  //     return {
  //       status: Status.SUCCESS,
  //       statusCode: HttpStatusCode.Ok,
  //       message: 'OK',
  //       result: [],
  //     };

  //   if (getMargin)
  //     return this.accountService.getMultipleAccountsWithMargin({
  //       login: ids,
  //     });
  //   return this.accountService.getMultipleAccounts({
  //     login: ids,
  //   });
  // }

  // async getAllAccountsByUserId(userId: number) {
  //   console.log('getAllAccountsByUserId id: ', userId);
  //   try {
  //     const live = await this.accountService.getLiveAccountsByUser(userId);
  //     const demo = await this.accountService.getDemoAccountsByUser(userId);
  //     return { live, demo };
  //   } catch (error) {
  //     throw new Error(error.message);
  //   }
  // }

  timeout = (promise: Promise<any>, ms: number) => {
    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), ms),
      ),
    ]);
  };

  async getAllAccountsByUserId(userId: number) {
    console.log('getAllAccountsByUserId id: ', userId);
    const TIMEOUT_MS = 20000; // 20 seconds timeout

    const promises = [
      this.timeout(
        this.accountService.getLiveAccountsByUser(userId, true),
        TIMEOUT_MS,
      ).catch((error) => ({
        error: true,
        message:
          error.message === 'Request timed out'
            ? 'Live accounts request timed out'
            : error.message || 'Failed to fetch live accounts',
        data: null,
      })),
      this.timeout(
        this.accountService.getDemoAccountsByUser(userId),
        TIMEOUT_MS,
      ).catch((error) => ({
        error: true,
        message:
          error.message === 'Request timed out'
            ? 'Demo accounts request timed out'
            : error.message || 'Failed to fetch demo accounts',
        data: null,
      })),
    ];

    const [liveResult, demoResult] = await Promise.all(promises);
    const mt5Acounts = await this.mt5AccountRepository.find({
      where:{
        user:{
          id:userId
        }
      },
      relations:{
        commissionProfile:{
          agentTradingGroup:true,
          tradingGroup:true,
          copyTradingGroup:true
        }
      }
    });

    const live = liveResult ? liveResult.map((l)=>{
      const login = l.login;
      const mt5Acount = mt5Acounts.find((m)=>Number(m.login) === Number(login));
      const commissionProfile = mt5Acount?.commissionProfile; 
      return {
        ...l,
        commissionProfile
      }
    }) : []

    const demo = demoResult ? demoResult.map((l)=>{
      const login = l.login;
      const mt5Acount = mt5Acounts.find((m)=>Number(m.login) === Number(login));
      const commissionProfile = mt5Acount?.commissionProfile; 
      return {
        ...l,
        commissionProfile
      }
    }) : []

    return {
      live: liveResult.error ? [] : live,
      demo: demoResult.error ? [] : demo,
    };
  }

  async bindAccount(bindAccountDto: BindAccountRequest[]) {
    return this.kafka.SendMessage(
      this.mt5Client,
      ClientTopics.bindAccount,
      bindAccountDto,
    );
  }

  async getClientAccountSummary(
    userId: number,
    login: string | undefined = '',
  ) {
    // const client = await this.clientRepository.findOne({
    //   where: { userId, clientId: Not(IsNull()) },
    // });

    // if (!client) throw new NotFoundException('Client not found');

    return this.kafka.SendMessage(
      this.mt5Client,
      ClientTopics.getClientAccountSummary,
      { login: login ? +login : undefined, userId },
    );
  }

  private async findClientByUserIdAndNullClientId(
    userId: string,
  ): Promise<Client | null> {
    return await this.clientRepository.findOne({
      where: {
        userId: +userId,
        clientId: IsNull(),
      },
    });
  }

  private async updateClientWithClientId(
    client: Client,
    clientId: number,
  ): Promise<Client> {
    client.clientId = clientId;
    return await this.clientRepository.save(client);
  }

  async getClientByExternalId(dto: GetClientByExternalIdDto) {
    return this.kafka.SendMessage(
      this.mt5Client,
      ClientTopics.getClientByExternalId,
      dto,
    );
  }

  // async syncClients() {
  //   const clients = await this.clientRepository
  //     .find({ where: { clientId: IsNull() } })
  //     .then((res) =>
  //       res.map((client) => {
  //         return { clientId: client.clientId, userId: client.user.id };
  //       }),
  //     );
  //   const clients = [];
  //   return this.kafka.SendMessage(
  //     this.mt5Client,
  //     ClientTopics.syncClients,
  //     {
  //       clients,
  //     },
  //     'live',
  //   );
  //   for await(const client of clients){
  //     const this.
  //     // await this.accountService.updateAccount
  //   }
  //   await this.accountService.updateAccount({

  //   })
  // }

  async syncOneClient(dto: GetAccountsRequest) {
    const mt5Account = await this.mt5AccountRepository.find({
      where: { user: { id: +dto.userId } },
      relations: ['user'],
    });
    //11930;
    if (!mt5Account) {
      console.log(`account not found for: ${dto.userId}`);
    }

    console.log(`${mt5Account.length} accounts found for: ${dto.userId}`);

    const updatedAccounts: any[] = [];
    const csvData: any[] = [];
    let successCount = 0;
    let group;

    for (const account of mt5Account) {
      console.log('login: ', account.login);
      const currentAccount = await this.accountService.getOneAccount({
        login: account.login,
      });
      console.log('Account res: ', currentAccount);
      if (currentAccount.result?.answer) {
        group = currentAccount.result?.answer?.Group;
        csvData.push({
          login: currentAccount.result?.answer?.Login,
          balance: currentAccount.result?.answer?.Balance,
          group: currentAccount.result?.answer?.Group,
          client: currentAccount.result?.answer?.ClientID,
          userId: dto.userId,
        });
      }
      const updatedAccount = await this.accountService.updateAccount(
        account.login,
        {
          ClientID: account?.user?.id?.toString(),
          Group: group,
        } as UpdateAccountRequest,
      );

      if (
        updatedAccount?.result?.answer?.ClientID ==
        account?.user?.id?.toString()
      ) {
        successCount++;
      }
      updatedAccounts.push(updatedAccount);

      console.log('updatedAccount', updatedAccount);
    }

    const csvFields = ['login', 'balance', 'group', 'client', 'userId']; // Specify the fields you want in the CSV
    const json2csvParser = new Parser({ fields: csvFields });
    const csv = json2csvParser.parse(csvData);

    // Save CSV to a file
    const filePath = `src/account_data_${dto.userId}.csv`;
    await promises.writeFile(filePath, csv);
    console.log(`CSV file saved at: ${filePath}`);

    return `Found ${mt5Account.length} accounts. Updated ${successCount} accounts updated successfully`;
  }

  async syncClients() {
    const BATCH_SIZE = 50; // Define your batch size
    let skip = 0;
    let hasMore = true;
    let totalAccounts = 0;
    let successCount = 0;
    const updatedAccounts: any[] = [];

    while (hasMore) {
      // Fetch a batch of accounts
      const [mt5AccountBatch] = await this.mt5AccountRepository.findAndCount({
        relations: ['user'],
        skip,
        take: BATCH_SIZE,
      });

      // Check if there are no more accounts to process
      if (mt5AccountBatch.length === 0) {
        hasMore = false;
        break;
      }

      totalAccounts += mt5AccountBatch.length;
      skip += BATCH_SIZE;

      // Process the batch
      const batchPromises = mt5AccountBatch.map(async (account) => {
        console.log('Processing account:', account);
        const updatedAccount = await this.accountService.updateAccount(
          account.login,
          { ClientID: account?.user?.id?.toString() } as UpdateAccountRequest,
        );

        if (
          updatedAccount?.result?.answer?.ClientID ===
          account?.user?.id?.toString()
        ) {
          successCount++;
        }
        updatedAccounts.push(updatedAccount);

        console.log('Updated account:', updatedAccount);
      });

      await Promise.all(batchPromises); // Wait for the batch to complete
    }

    return `Found ${totalAccounts} accounts. Updated ${successCount} accounts successfully`;
  }

  async updateGroupsUtil(login: string = '') {
    const BATCH_SIZE = 50; // Define your batch size
    let skip = 0;
    let hasMore = true;
    let totalAccounts = 0;
    let successCount = 0;
    const updatedAccounts: any[] = [];
    const mt5AccountArray: any[] = [];

    // Read and parse the CSV file
    const filePath = path.join('src/wallet-data-new.csv');

    const readCSV = () => {
      return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (data) => mt5AccountArray.push(data))
          .on('end', () => resolve(mt5AccountArray))
          .on('error', (error) => reject(error));
      });
    };

    await readCSV();

    if (login) {
      // Find and update only the account with the provided login
      const account = mt5AccountArray.find(
        (acc) => acc.trading_account === login,
      );

      if (account) {
        console.log('Processing account:', account);

        const currentAccount = await this.accountService.getOneAccount({
          login: account.trading_account,
        });

        if (
          currentAccount.result?.answer?.Group !== account?.correct?.toString()
        ) {
          const updatedAccount = await this.accountService.updateAccount(
            account.trading_account,
            {
              Group: account.correct.toString(),
            } as UpdateAccountRequest,
          );

          if (
            updatedAccount?.result?.answer?.Group ===
            account?.correct?.toString()
          ) {
            successCount++;
          }
          updatedAccounts.push(updatedAccount);

          console.log('Updated account:', updatedAccount);
          totalAccounts = 1; // Since we're only updating one account
        } else {
          console.log(`Account ${login} already has the correct group`);
          totalAccounts = 1; // Since we're only updating one account
        }
      } else {
        console.log(`No account found with login: ${login}`);
      }
    } else {
      while (hasMore) {
        // Fetch a batch of accounts from the array
        const mt5AccountBatch = mt5AccountArray.slice(skip, skip + BATCH_SIZE);

        // Check if there are no more accounts to process
        if (mt5AccountBatch.length === 0) {
          hasMore = false;
          break;
        }

        totalAccounts += mt5AccountBatch.length;
        skip += BATCH_SIZE;

        // Process the batch
        const batchPromises = mt5AccountBatch.map(async (account) => {
          console.log('Processing account:', account);
          const currentAccount = await this.accountService.getOneAccount({
            login: account.trading_account,
          });
          if (currentAccount?.result?.answer?.Group == account?.wrong) {
            const updatedAccount = await this.accountService.updateAccount(
              account.trading_account,
              {
                Group: account.correct.toString(),
              } as UpdateAccountRequest,
            );
            if (
              updatedAccount?.result?.answer?.Group ===
              account?.correct?.toString()
            ) {
              successCount++;
            }
            updatedAccounts.push(updatedAccount);
            console.log('Updated account:', updatedAccount);
          } else {
            console.log(
              'Skipping account:',
              account.trading_account,
              currentAccount?.result?.answer?.Group,
            );
          }
        });

        await Promise.all(batchPromises); // Wait for the batch to complete
      }
    }

    return `Found ${totalAccounts} accounts. Updated ${successCount} accounts successfully`;
  }
}
