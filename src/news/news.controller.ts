import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsDetailDto, NewsHotDto, NewsListDto } from './dtos/news.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@ApiTags('News')
@Controller({
  path: 'news',
  version: '1',
})
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get('list')
  getList(@Query() query: NewsListDto): Promise<any> {
    return this.newsService.getList(query);
  }

  @Get('detail')
  getDetail(@Query() query: NewsDetailDto): Promise<any> {
    return this.newsService.getDetail(query);
  }

  @Get('hot-news')
  getHotNews(@Query() query: NewsHotDto): Promise<any> {
    return this.newsService.getHot(query);
  }
}
