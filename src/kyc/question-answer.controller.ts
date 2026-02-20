import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Delete,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { QuestionService } from './question-answer.service';
import { NewQuestionDTO, QuestionDTO } from './dto/create-question.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeaders,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateQuestionDTO } from './dto/update-question.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Questions')
@Controller({
  path: 'questions',
  version: '1',
})
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiBody({ type: QuestionDTO })
  @ApiResponse({
    status: 201,
    description: 'The question has been created successfully.',
  })
  @Post()
  async createQuestionWithAnswers(@Body() data: QuestionDTO): Promise<any> {
    return await this.questionService.saveQuestion(data);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @ApiBody({ type: UpdateQuestionDTO })
  @ApiResponse({
    status: 200,
    description: 'The question has been updated successfully.',
  })
  async updateQuestion(
    @Param('id') id: number,
    @Body() data: UpdateQuestionDTO,
  ): Promise<any> {
    return await this.questionService.updateQuestion(id, data);
  }

  @ApiHeaders([
    { name: 'x_custom_lang', schema: { type: 'string', default: 'en' } },
  ])
  @Get()
  async getAllQuestions(
    @Query() query: NewQuestionDTO,
  ): Promise<any> {
    return await this.questionService.getQuestions(query.isNew === 'true' ? true : false);
  }
  
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'The question has been deleted successfully.',
  })
  async softDeleteQuestion(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    return await this.questionService.softDeleteQuestion(id);
  }
}
