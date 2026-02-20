import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { LeadQuestionRepository } from './repositories/question.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadAnswer } from '../leads/entities/lead-answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LeadAnswer])],
  controllers: [QuestionsController],
  providers: [QuestionsService, LeadQuestionRepository],
})
export class QuestionsModule {}
