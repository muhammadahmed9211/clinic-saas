import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { AllConfigType } from './config/config.type';
import { I18nService, i18nValidationErrorFactory } from 'nestjs-i18n';
import apm from 'elastic-apm-node';
import { GlobalExceptionFilter } from './common/interceptors/exception.interceptor';
import { RoleBasedMaskingInterceptor } from './common/interceptors/role-based-masking.interceptor';
import { MaskDataService } from './roles/maskData/maskData.service';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MobileAppInterceptor } from './common/interceptors/mobile-app-responses.interceptor';
import { json, urlencoded } from 'express';

// Only start APM when a server URL is set and not explicitly disabled (e.g. EC2 without APM server).
const apmUrl = process.env.ELASTIC_APM_SERVER_URL?.trim();
const apmDisabled = ['false', '0', 'no'].includes(
  (process.env.ENABLE_APM ?? process.env.ELASTIC_APM_DISABLED ?? '').toLowerCase(),
);
if (apmUrl && !apmDisabled) {
  apm.start({
    serviceName: process.env.ELASTIC_APM_SERVICE_NAME || 'crm-rest-api',
    serverUrl: apmUrl,
    captureBody: 'all',
    active: true,
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Capture raw JSON safely without consuming the stream
  app.use(
    json({
      limit: '10mb',
      verify: (req: any, _res, buf: Buffer) => {
        req.rawBody = buf.toString('utf8');
      },
    }),
  );
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService<AllConfigType>);

  app.enableShutdownHooks();
  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    { exclude: ['/'] },
  );

  app.enableVersioning({ type: VersioningType.URI });

  app.useGlobalPipes(
    new ValidationPipe({ exceptionFactory: i18nValidationErrorFactory }),
  );

  // Global interceptors
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new MobileAppInterceptor());
  app.useGlobalInterceptors(
    new RoleBasedMaskingInterceptor(
      app.get(MaskDataService),
      app.get(Reflector),
    ),
  );

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter(app.get(I18nService)));

  // Kafka microservice (enable ssl for MSK TLS port 9094)
  const kafkaConfig = configService.getOrThrow('kafka');
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: kafkaConfig.kafkaBrokers,
        ...(kafkaConfig.sslEnabled && { ssl: true }),
      },
      consumer: {
        groupId: kafkaConfig.restApiKafkaGroupId,
      },
    },
  });

  // Swagger setup
  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .addGlobalParameters({
      in: 'header',
      name: 'user_time_zone',
      description: 'Timezone in IANA format (e.g., Asia/Karachi)',
      schema: { type: 'string', default: 'Asia/Karachi' },
    })
    .addGlobalParameters({
      in: 'header',
      name: 'x-channel-id',
      description: '001 for Web, 002 for Mobile',
      schema: { type: 'string', default: '001' },
    })
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.startAllMicroservices();
  await app.listen(configService.getOrThrow('app.port', { infer: true }));
}

void bootstrap();
