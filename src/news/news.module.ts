import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { NewsHttpService } from './http/news-http.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [NewsController],
  providers: [NewsService, NewsHttpService],
})
export class NewsModule {}
