import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass, plainToInstance } from 'class-transformer';
import { validate, validateOrReject } from 'class-validator';
import * as csv from 'csv-parse';
import { AuthService } from 'src/auth/auth.service';
import { AuthRegisterQueryDto } from 'src/auth/dto/auth-register-login.dto';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { ListNames } from 'src/list-item/dto/create-list-item.dto';
import { ClientsService } from 'src/users/clients.service';
import { Client } from 'src/users/entities/client.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UploadDataDto } from './dto/upload-data.dto';
import { DataUploadRepository } from './repositries/data-upload.repositries';
import { FilterOperation } from 'src/database/base-repository/dto/advance-search.dto';
@Injectable()
export class FileUploadService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private dataUploadRepository: DataUploadRepository,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private clientsService: ClientsService,
    private authService: AuthService,
  ) {}
  async validateCsvData(file, userId, userName, verificationId): Promise<any> {
    const uploadedClients: number = 0;
    const csvContent = file.buffer;
    const counter: number = 0;
    const parsedData: any = await new Promise((resolve, reject) => {
      csv.parse(
        csvContent,
        {
          columns: true,
          relax_quotes: true,
          skip_empty_lines: true,
          cast: true,
          trim: true,
          bom: true,
        },
        (err, records) => {
          if (err) {
            reject(err);
            return { error: true, message: 'Unable to parse file' };
          }
          records.forEach((record) => {
            Object.keys(record).forEach((key) => {
              if (record[key] === '') {
                record[key] = undefined;
              }
            });
          });
          resolve(records);
        },
      );
    });

    const errors: string[] = [];
    if (!parsedData.length) {
      errors.push('Empty File Provided');
      return {
        error: true,
        message: 'File Validation Failed',
        errorsArray: errors,
      };
    }
    // for await (const [rowData] of parsedData.entries()) {
    //   if (
    //     rowData.firstName === undefined ||
    //     rowData.lastName === undefined ||
    //     rowData.country === undefined ||
    //     rowData.language === undefined ||
    //     rowData.email === undefined ||
    //     rowData.telephone === undefined ||
    //     rowData.telephonePrefix === undefined
    //   ) {
    //     throw new HttpException(
    //       {
    //         status: HttpStatus.BAD_REQUEST,
    //         error: {
    //           msg: 'Firstname,Lastname,telephone,telephone prefix,email,country and language column cannot be empty in your csv file.',
    //         },
    //       },
    //       HttpStatus.BAD_REQUEST,
    //     );
    //   } else {
    //     return;
    //   }
    // }
    return {
      error: false,
      length: parsedData?.length,
      data: parsedData,
      userId,
      counter,
      userName,
      uploadedClients,
      verificationId,
    };
  }
  async uploadingTheLead(
    parsedData: any,
    userId: number,
    counter: number,
    userName: string,
    uploadedClients: number,
    verificationId: string,
  ) {
    let uploadDataParentPayload: any = {
      records: parsedData.length,
      userId,
      uploadedRecords: 0,
      failure: 0,
      progress: 0,
      type: 'client',
      status: 'active',
      operator: userName,
      isCancelled: false,
    };
    const parentUploadedData = await this.saveUploadFileData(
      uploadDataParentPayload,
    );

    const validationErrorsArray: any = [];

    //validate All Rows

    for await (const [index, rowData] of parsedData.entries()) {
      const uploadedDataForCancel: any =
        await this.dataUploadRepository.findOne({
          where: { id: parentUploadedData.id },
        });

      if (!uploadedDataForCancel.isCancelled) {
        const validationErrors = await this.validateFileRow(index, rowData);
        //if row's validation failed than create an array of errors
        if (validationErrors.length) {
          validationErrors.forEach((data) => {
            validationErrorsArray.push(data);
          });
        }
        //run the procedure if the row is validated successfully
        if (!validationErrors.length) {
          const {
            id,
            firstName,
            lastName,
            email,
            telephone,
            telephonePrefix,
            language,
            country,
            affid,
            p1,
            p2,
            source,
            partnerUuid,
            internalSalesStatus,
            isBlockEmails,
            ...rest
          } = rowData;
          const campaignQuestions = JSON.stringify(rest);

          const payload = {
            id: id,
            firstName: firstName,
            lastName: lastName,
            email: email,
            telephone: telephone?.toString(),
            telephonePrefix: telephonePrefix?.toString(),
            languageIso: language,
            verificationId: 1,
            countryIso: country,
            // partnerTypeId: null,
            demo: false,
            sc: source,
            status: 1,
            affid: affid?.toString(),
            p1: p1,
            p2: p2,
            isBroker: false,
            id2: '657aa94dd779947f58947212',
            userType: 2,
            partner_uuid: partnerUuid?.toString(),
            internalSalesStatus,
            isBlockEmails: isBlockEmails === 'TRUE' ? true : false,
            campaignQuestions,
            source,
            isCopyTrading: false,
          };
          const authRegisterQueryDto = await this.transformToDto(
            AuthRegisterQueryDto,
            { key: verificationId.toString() },
          );
          //register data in user and client table table
          try {
            await this.authService.register(payload, authRegisterQueryDto);
            uploadedClients = uploadedClients + 1;

            counter = counter + 1;

            if (counter == 10) {
              const uploadedData: any = await this.dataUploadRepository.findOne(
                {
                  where: { id: parentUploadedData.id },
                },
              );

              const progress = (uploadedClients / uploadedData.records) * 100;
              uploadDataParentPayload = { uploadedRecords: counter, progress };
              await this.dataUploadRepository.update(parentUploadedData.id, {
                ...uploadDataParentPayload,
                errors: JSON.stringify(validationErrorsArray),
              });

              counter = 0;
              // await sleep(3000);
            }
          } catch (error) {
            console.error('new error', error);

            const errorMessage = {
              errorMessage: `User with this email already exists by catch.`,
              data: { ...rowData },
            };
            validationErrorsArray.push(errorMessage);
          }
        }
      } else {
        const progress = (uploadedClients / parsedData.length) * 100;
        uploadDataParentPayload = {
          uploadedRecords: uploadedClients,
          failure: parsedData.length - uploadedClients,
          status: 'sleep',
          progress,
          errors: JSON.stringify(validationErrorsArray),
        };
        await this.dataUploadRepository.update(
          parentUploadedData.id,
          uploadDataParentPayload,
        );
        return { error: false, length: parsedData?.length, data: parsedData };
      }
    }

    const progress = (uploadedClients / parsedData.length) * 100;
    uploadDataParentPayload = {
      uploadedRecords: uploadedClients,
      failure: parsedData.length - uploadedClients,
      status: 'sleep',
      progress,
      errors: JSON.stringify(validationErrorsArray),
    };
    await this.dataUploadRepository.update(
      parentUploadedData.id,
      uploadDataParentPayload,
    );
  }
  //function that validates all rows of csv
  async validateFileRow(index, rowData) {
    const errors: any[] = [];
    const csvDto = plainToInstance(UploadDataDto, rowData);

    const validationErrors = await validate(csvDto);

    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => {
        const { property } = error;
        const { constraints } = error;
        if (
          constraints &&
          (typeof constraints.isString === 'string' ||
            typeof constraints.isEmail === 'string' ||
            typeof constraints.isNumber === 'string')
        ) {
          const errorMessage = {
            errorMessage: `${property} ${Object.values(constraints).join(
              ', ',
            )}`,
            data: { ...rowData },
          };
          errors.push(errorMessage);
        }
      });
    }
    return errors;
  }

  //function to save records in uploaded data table

  async saveUploadFileData(uploadDataParentPayload): Promise<any> {
    const uploadData = this.dataUploadRepository.create(
      uploadDataParentPayload,
    );
    return this.dataUploadRepository.save(uploadData);
  }

  async updateUploadFileData(id: number, isCancelled: boolean): Promise<any> {
    try {
      await this.dataUploadRepository.update(id, {
        isCancelled,
      });
      return await this.dataUploadRepository.findOne({
        where: { id },
      });
    } catch (error) {
      return error;
    }
  }

  //to fetch data from upload table

  async getProcessesList(payload: {
    userId: number;
    limit: number;
    page: number;
    dto: ApplyListFilterSortColumnDto;
  }) {
    const { userId, limit, page, dto } = payload;
    const filters = [
      {
        name: 'userId',
        operation: FilterOperation.EQUALS,
        value: [userId],
      },
    ];
    const processes = await this.dataUploadRepository.advanceFilters({
      listName: ListNames.PROCESS,
      userId,
      limit,
      page,
      filterList: dto?.filters || undefined,
      sortList: dto.sort || undefined,
      defaultSortKey: 'createdAt',
      listViewId: dto.listViewId,
      filters,
    });
    return processes;
  }
  async transformToDto<T extends object>(
    cls: new () => T,
    plain: object,
  ): Promise<T> {
    const instance = plainToClass(cls, plain);
    await validateOrReject(instance);
    return instance;
  }
}
