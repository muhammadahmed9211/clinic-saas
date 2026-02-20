import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SearchController } from './search.controller';
import { ElasticSearchService } from './elasticSearch.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { RoleModule } from 'src/roles/role.module';
import { RedisCoreModule } from 'src/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User]),
    RoleModule,
    RedisCoreModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        node: process.env.ELASTICSEARCH_NODE,
        maxRetries: 10,
        requestTimeout: 60000,
        pingTimeout: 30000,
        sniffOnStart: false,
        ssl: {
          rejectUnauthorized: false,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [SearchController],
  providers: [
    ElasticSearchService,
  ],
  exports: [ElasticSearchService],
})
export class SearchModule {}
