import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { AdminFilesController, ClientFilesController, FilesController } from './files.controller';
import { Request } from 'express';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { FilesService } from './files.service';
import { AllConfigType } from 'src/config/config.type';
import { I18nContext } from 'nestjs-i18n';
import { EmailAttachments } from 'src/mail/entities/emailAttachments.entity';
import { ShuftiModule } from 'src/kyc-shufti/shufti.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity,EmailAttachments]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>) => {
        const i18n = I18nContext.current();
        const storages = {
          local: () =>
            diskStorage({
              destination: './files',
              filename: (request, file, callback) => {
                callback(
                  null,
                  `${randomStringGenerator()}.${file.originalname
                    .split('.')
                    .pop()
                    ?.toLowerCase()}`,
                );
              },
            }),
          s3: () => {
            const s3 = new S3Client({
              region: configService.get('file.awsS3Region', { infer: true }),
              credentials: {
                accessKeyId: configService.getOrThrow('file.accessKeyId', {
                  infer: true,
                }),
                secretAccessKey: configService.getOrThrow(
                  'file.secretAccessKey',
                  { infer: true },
                ),
              },
            });

            return multerS3({
              s3: s3,
              bucket: configService.getOrThrow('file.awsDefaultS3Bucket', {
                infer: true,
              }),
              // acl: 'public-read',
              contentType: multerS3.AUTO_CONTENT_TYPE,
              key: (request: Request, file, callback) => {
                const isSharedFile = request.url.includes('share');
                const isContactUsFileUpload = request.url.includes('contact/file-upload');
                const isPublicUpload = request.url.includes('public/upload');
                const isChatFileUpload = request.url.includes('upload/chat-file');
                let generatedFileName = `${randomStringGenerator()}.${file.originalname
                  .split('.')
                  .pop()
                  ?.toLowerCase()}`;
                if (isSharedFile) {
                  const sharedFolder = configService.getOrThrow(
                    'file.sharedBucketDirectory',
                    {
                      infer: true,
                    },
                  );
                  generatedFileName = `${sharedFolder}/${generatedFileName}`;
                } else if (isContactUsFileUpload) {
                  const contactUsFolder = configService.getOrThrow(
                    'file.contactUsBucketDirectory',
                    {
                      infer: true,
                    },
                  );
                  generatedFileName = `${contactUsFolder}/${generatedFileName}`;
                } else if (isPublicUpload) {
                  const chatFolder = configService.get(
                    'file.chatBucketDirectory',
                    {
                      infer: true,
                    },
                  ) ?? 'Chat';
                  generatedFileName = `${chatFolder}/${generatedFileName}`;
                } else if (isChatFileUpload) {
                  const chatFolder = configService.get(
                    'file.chatBucketDirectory',
                    {
                      infer: true,
                    },
                  ) ?? 'Chat';
                  generatedFileName = `${chatFolder}/${generatedFileName}`;
                } else {
                  const baseFolder = configService.getOrThrow(
                    'file.defaultBucketDirectory',
                    {
                      infer: true,
                    },
                  );
                  generatedFileName = `${baseFolder}/${generatedFileName}`;
                }
                callback(null, generatedFileName);
              },
            });
          },
        };
        const message = i18n?.t('errors.auth.fileNotFound');

        return {
          fileFilter: (request, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf|doc|docx|xls|xlsx|mp3|mp4)$/i)) {
              return callback(
                new HttpException(
                  {
                    status: HttpStatus.UNPROCESSABLE_ENTITY,
                    error: {
                      msg: message,
                    },
                  },
                  HttpStatus.UNPROCESSABLE_ENTITY,
                ),
                false,
              );
            }

            callback(null, true);
          },
          storage:
            storages[
              configService.getOrThrow('file.driver', { infer: true })
            ](),
          limits: {
            fileSize: configService.get('file.maxFileSize', { infer: true }),
          },
        };
      },
    }),
  ],
  controllers: [FilesController, ClientFilesController, AdminFilesController],
  providers: [ConfigModule, ConfigService, FilesService],
  exports: [FilesService],
})
export class FilesModule { }
