import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { Repository } from 'typeorm';
import { AllConfigType } from 'src/config/config.type';
import AWS from 'aws-sdk';
import { I18nContext } from 'nestjs-i18n';
import { Workbook } from 'exceljs';
import { EmailAttachments } from 'src/mail/entities/emailAttachments.entity';
import { RedisCoreService } from 'src/redis/redis.service';
@Injectable()
export class FilesService implements OnModuleInit {
  private s3: AWS.S3;
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    @InjectRepository(EmailAttachments)
    private readonly emailAttachments: Repository<EmailAttachments>,
    private readonly redis: RedisCoreService,
  ) {}

  async uploadFile(
    file: Express.Multer.File | Express.MulterS3.File,
    userId: number,
    roleId: number,
  ): Promise<FileEntity> {
    const i18n = I18nContext.current();
    if (!file) {
      const message = await i18n?.t('errors.auth.selectFile ');
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: message,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const path = {
      local: `/${this.configService.get('app.apiPrefix', {
        infer: true,
      })}/v1/files/${file.filename || file.originalname}`, // ✅ safe fallback
      s3: (file as Express.MulterS3.File).key,
    };
    const fileSizeKB = `${(file.size / 1024).toFixed(2)} KB`;
    if (roleId == 2) {
      const fileEntity = this.fileRepository.create({
        path: path[
          this.configService.getOrThrow('file.driver', { infer: true })
        ],
        user: { id: userId },
        fileType: file.mimetype,
        fileName: file.filename ? file.filename : file.originalname,
        fileSize: fileSizeKB.toString(),
      } as Partial<FileEntity>);

      const data = await this.fileRepository.save(fileEntity);

      return data;
    } else {
      const fileEntity = this.fileRepository.create({
        path: path[
          this.configService.getOrThrow('file.driver', { infer: true })
        ],
        operator: { id: userId },
        fileType: file.mimetype,
        fileName: file.filename ? file.filename : file.originalname,
        fileSize: fileSizeKB.toString(),
      } as Partial<FileEntity>);

      const data = await this.fileRepository.save(fileEntity);

      return data;
    }
  }

  // contact us form file upload public service
  async contactUploadFile(
    file: Express.Multer.File | Express.MulterS3.File,
  ): Promise<FileEntity> {
    const i18n = I18nContext.current();
    if (!file) {
      const message = await i18n?.t('errors.auth.selectFile ');
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: message,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const path = {
      local: `/${this.configService.get('app.apiPrefix', {
        infer: true,
      })}/v1/files/${file.filename}`,
      s3: (file as Express.MulterS3.File).key,
    };
    const fileSizeKB = `${(file.size / 1024).toFixed(2)} KB`;
    const fileEntity = this.fileRepository.create({
      path: path[
        this.configService.getOrThrow('file.driver', { infer: true })
      ],
      fileType: file.mimetype,
      fileName: file.filename ? file.filename : file.originalname,
      fileSize: fileSizeKB.toString(),
    } as Partial<FileEntity>);
    const data = await this.fileRepository.save(fileEntity);
    return data;
  }

  async getCacheSignedUrl(id: string, fileType: boolean = false): Promise<any> {
    const isExist = await this.redis.get({key:`FILE:${id}`});
    if(!isExist){
      return this.getSignedUrl(id, fileType, true)
    }
    return isExist
  }

  async getSignedUrl(id: string, fileType: boolean = false, shouldCache=false): Promise<any> {
    const data = await this.fileRepository.findOne({
      where: {
        id: id,
      },
    });

    const data2 = await this.emailAttachments.findOne({
      where: {
        id
      }
    });

    const myBucket = this.configService.get('file.awsDefaultS3Bucket', {
      infer: true,
    });
    const myKey = data?.path;
    const newKey = data2?.path;
    const signedUrlExpireSeconds = this.configService.get(
      'file.awss3SignedUrlTimeout',
      {
        infer: true,
      },
    );

    const fileInfo = data || data2;
    const filePath = myKey || newKey;

    const isOfficeDocument = filePath?.match(/\.(doc|docx|xls|xlsx|ppt|pptx)$/i);
    const fileName = fileInfo?.fileName || 'document';
    const mimeType = fileInfo?.fileType;

    const urlParams: any = {
      Bucket: myBucket,
      Key: filePath,
      Expires: signedUrlExpireSeconds,
    };

    if (isOfficeDocument) {
      urlParams.ResponseContentDisposition = `attachment; filename="${fileName}"`;
      if (mimeType) {
        urlParams.ResponseContentType = mimeType;
      }
    }

    const url = await this.s3.getSignedUrl('getObject', urlParams);
    if(shouldCache){
      const expirySeconds = signedUrlExpireSeconds ? signedUrlExpireSeconds : 86400
      await this.redis.set({ key: `FILE:${id}`, value: url , ttl:Math.floor(expirySeconds/2)})
    }
    if (fileType) {
      return {
        url,
        fileType: fileInfo?.fileType
      };
    }

    return url;
  }

  async getContactUsSignedUrl(id: string): Promise<any> {
    const data = await this.fileRepository.findOne({
      where: {
        id: id,
      },
    });

    const myBucket = this.configService.get('file.awsDefaultS3Bucket', {
      infer: true,
    });
    const myKey = data?.path;
    const signedUrlExpireSeconds = Number(
      this.configService.get('file.contactUsSignedUrlTimeout', {
        infer: true,
      }),
    );

    const url = await this.s3.getSignedUrl('getObject', {
      Bucket: myBucket,
      Key: myKey,
      Expires: signedUrlExpireSeconds,
    });

    return url;
  }

  async getSignedUrlAdName(id: string): Promise<any> {
    const data = await this.fileRepository.findOne({
      where: {
        id: id,
      },
    });

    const data2 = await this.emailAttachments.findOne({
      where: {
        id
      }
    })

    const myBucket = this.configService.get('file.awsDefaultS3Bucket', {
      infer: true,
    });
    const myKey = data?.path;
    const newKey = data2?.path;
    const signedUrlExpireSeconds = this.configService.get(
      'file.awss3SignedUrlTimeout',
      {
        infer: true,
      },
    );

    const url = await this.s3.getSignedUrl('getObject', {
      Bucket: myBucket,
      Key: myKey ? myKey: newKey,
      Expires: signedUrlExpireSeconds,
    });

    const name = data?.fileName ?? '';

    return [url, name];
  }

  async deleteFile(id: string): Promise<void> {
    const data = await this.fileRepository.findOne({
      where: {
        id: id,
        status: 'active',
      },
    });
    if (!data) {
      throw new Error(`File with ID ${id} not found.`);
    }
    // const myBucket = this.configService.get('file.awsDefaultS3Bucket', {
    //   infer: true,
    // });
    // const myKey = data.path;
    // await this.s3.deleteObject({ Bucket: myBucket!, Key: myKey }).promise();
    await this.fileRepository.update(id, {
      status: 'inactive',
    });
    await this.fileRepository.softDelete(id);
  }

  async isExist(id: string): Promise<boolean> {
    const data = await this.fileRepository.findOne({
      where: {
        id,
      },
    });
    if (!data) {
      throw new Error(`File with ID ${id} not found.`);
    }
    return true;
  }

  onModuleInit() {
    AWS.config.update({
      accessKeyId: this.configService.get('file.accessKeyId', { infer: true }),
      secretAccessKey: this.configService.get('file.secretAccessKey', {
        infer: true,
      }),
      region: this.configService.get('file.awsS3Region', { infer: true }),
    });

    const s3 = new AWS.S3();
    this.s3 = s3;
  }

  async exportToXls(rowData: any) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Transactions');
    const columns = rowData.view.columns;
    const results = rowData.result;
    const rows: any[] = [];
    const dataRows: any[] = [];
    columns.forEach((col) => {
      const label = col?.listColumnsMeta?.label;
      const name = col?.listColumnsMeta?.name;
      if (name && label && col?.sequence) {
        const index = col.sequence - 1;
        rows[index] = { label, name };
      }
    });
    results.forEach((data) => {
      const row: any[] = [];
      rows.forEach((r) => {
        let val = null;
        const key = r.name.split('.');
        key.forEach((k) => {
          if (!val) {
            val = data[k];
          } else {
            val = val[k];
          }
        });
        row.push(val ? val : 'N/A');
      });
      dataRows.push(row);
    });
    const headers = rows.map((r) => r.label);

    // Add header row
    worksheet.addRow(headers);

    // Add data rows
    dataRows.forEach((tx) => {
      worksheet.addRow(tx);
    });

    // Write to buffer
    const buffer = await workbook.xlsx.writeBuffer();

    const fileName = `transactions-${Date.now()}.xlsx`;

    // Upload to S3
    const params = {
      Bucket: this.configService.getOrThrow('file.awsExcelSheetDirectory', {
        infer: true,
      }),
      Key: fileName,
      Body: buffer,
      ContentType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };

    const data = await this.s3.upload(params).promise();
    const path = {
      local: `/${this.configService.get('app.apiPrefix', {
        infer: true,
      })}/v1/files/${fileName}`,
      s3: data.Key,
    };
    const fileEntity = this.fileRepository.create({
      path: path[this.configService.getOrThrow('file.driver', { infer: true })],
      fileType: 'xlsx',
      fileName: fileName,
    } as Partial<FileEntity>);
    const entity = await this.fileRepository.save(fileEntity);
    const url = this.getSignedUrl(entity.id);
    return url;
  }

  // Anonymous file upload for non-registered users
  async anonymousUploadFile(
    file: Express.Multer.File | Express.MulterS3.File,
  ): Promise<FileEntity> {
    const i18n = I18nContext.current();
    if (!file) {
      const message = await i18n?.t('errors.auth.selectFile ');
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: message,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    // Validate file size (max 10MB for anonymous uploads)
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeBytes) {
      const message = await i18n?.t('errors.file.fileTooLarge');
      throw new HttpException(
        {
          status: HttpStatus.PAYLOAD_TOO_LARGE,
          error: {
            msg: message || 'File size exceeds maximum allowed size (10MB)',
          },
        },
        HttpStatus.PAYLOAD_TOO_LARGE,
      );
    }

    // Validate file type (only allow common file types)
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/doc',
      'application/docx',
      'application/xls',
      'application/xlsx',
      'application/csv',
      'application/ppt',
      'application/pptx',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      const message = await i18n?.t('errors.file.invalidFileType');
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: message || 'File type not allowed',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const path = {
      local: `/${this.configService.get('app.apiPrefix', {
        infer: true,
      })}/v1/files/${file.filename || file.originalname}`,
      s3: (file as Express.MulterS3.File).key,
    };

    const fileSizeKB = `${(file.size / 1024).toFixed(2)} KB`;

    const fileEntity = this.fileRepository.create({
      path: path[
        this.configService.getOrThrow('file.driver', { infer: true })
      ],
      fileType: file.mimetype,
      fileName: file.filename ? file.filename : file.originalname,
      fileSize: fileSizeKB.toString(),
      status: 'active', // Anonymous files are active by default
    } as Partial<FileEntity>);

    const data = await this.fileRepository.save(fileEntity);
    return data;
  }

  async updateToS3(
    file: Express.Multer.File,
    userId: number,
    roleId: number
  ): Promise<FileEntity> {
    try {

      if (!file || !file.buffer) {
        throw new Error('File buffer is missing');
      }
      const buffer = file.buffer;
      const safeOriginalName = file.originalname.replace(/\s+/g, '_');

      const bucket = this.configService.getOrThrow('file.awsDefaultS3Bucket', { infer: true });

      const params = {
        Bucket: bucket,
        Key: safeOriginalName,
        Body: buffer,
        ContentType: file.mimetype || 'application/octet-stream',
      };

      const data = await this.s3.upload(params).promise();
      console.log('S3 Upload Response:', JSON.stringify(data, null, 2));

      const fileEntity = this.fileRepository.create({
        path: data.Key,
        user: roleId === 2 ? { id: userId } : undefined,
        operator: roleId !== 2 ? { id: userId } : undefined,
        fileType: file.mimetype || 'application/octet-stream',
        fileName: file.filename,
        fileSize: `${(buffer.length / 1024).toFixed(2)} KB`,
      } as Partial<FileEntity>);
      const savedFile = await this.fileRepository.save(fileEntity);
      return savedFile;
    } catch (err: any) {
      console.error('❌ Upload error (full object):', JSON.stringify(err, null, 2));
      console.error('❌ Error stack:', err.stack);
      throw err;
    }
  }


}