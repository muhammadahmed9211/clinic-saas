import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/default_questions.entity';
import { Answer } from './entities/default_answers.entity';
import { QuestionService } from './question-answer.service';
import { QuestionController } from './question-answer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Answer])],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {}
