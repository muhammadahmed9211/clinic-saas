import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/default_questions.entity';
import { Answer } from './entities/default_answers.entity';
import { QuestionDTO } from './dto/create-question.dto';
import { UpdateQuestionDTO } from './dto/update-question.dto';
import { I18nContext } from 'nestjs-i18n';
import { LanguageType } from 'src/users/entities/user.entity';

export enum Select {
  Employed = 'Employed',
  SelfEmployed = 'Self Employed',
  Retired = 'Retired',
  Unemployed = 'Unemployed',
  Student = 'Student',
}

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
  ) {}

 async getTotalQuestionsCount(): Promise<number> {
    return await this.questionRepository.count({
      where: { languageIso: 'EN', isDeleted: false, isWeightedQuestion:true } as any,
    });
  }
  async saveQuestion(data: QuestionDTO): Promise<any> {
    const {
      group,
      name,
      title,
      desc,
      type,
      isHidden,
      isRequired,
      isEditable,
      answers,
      step,
      sort,
      languageIso,
    } = data;

    const createdQuestion = await this.questionRepository.create({
      group,
      name,
      title,
      desc,
      type,
      isHidden,
      isRequired,
      isEditable,
      step,
      sort,
      languageIso,
    });

    await this.questionRepository.save(createdQuestion);

    const answersToSave = answers.map((answerData) => {
      const answer = new Answer();
      answer.text = answerData.text;
      answer.sort = answerData.sort;
      answer.question = createdQuestion;
      return answer;
    });

    await this.answerRepository.save(answersToSave);

    return { message: 'Question created successfully' };
  }

  async updateQuestion(id: number, data: UpdateQuestionDTO): Promise<any> {
    const { answers } = data;
    const question = {
      group: data.group,
      name: data.name,
      title: data.title,
      desc: data.desc,
      type: data.type,
      isHidden: data.isHidden,
      isRequired: data.isRequired,
      isEditable: data.isEditable,
      languageIso: data.languageIso,
      step: data.step,
      sort: data.sort,
    };
    await this.questionRepository.update(id, question);
    await this.answerRepository.save(answers);
    return {
      message: 'Question updated successfully',
      data: question,
      answers: answers,
    };
  }

  async getQuestions(isNew?: boolean): Promise<any> {
    const i18n = I18nContext.current();
    const languageIso = i18n?.lang.toLocaleUpperCase() || 'EN';
    const questions = await this.questionRepository.find({
      where: {
        isDeleted: false,
        languageIso:
          languageIso === 'EN' ? LanguageType.English : LanguageType.Arabic,
      },
      relations: ['answers'],
    });

    let filteredQuestions = questions;

    if (!isNew) {
      filteredQuestions = filteredQuestions.filter(
        (question) =>
          question.name !== 'country' &&
          question.name !== 'phone' &&
          question.name !== 'birthCity',
      );
    }

    if (!filteredQuestions || filteredQuestions.length === 0) {
      return {
        message: 'No questions found.',
        questions: filteredQuestions,
      };
    }

    return filteredQuestions.map((question) => {
      return {
        id: question.id,
        group: question.group,
        name: question.name,
        title: question.title,
        desc: question.desc,
        type: question.type,
        isHidden: question.isHidden,
        isRequired: question.isRequired,
        isEditable: question.isEditable,
        step: question.step,
        subStep: question.subStep,
        sort: question.sort,
        languageIso: question.languageIso,
        shortTitle : question.shortTitle,
        answers: question.answers.map((answer) => ({
          id: answer.id,
          text: answer.text,
          sort: answer.sort,
        })),
      };
    });
  }

  async getQuestionById(id: number): Promise<any> {
    const i18n = I18nContext.current();
    const question = await this.questionRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['answers'],
    });
    if (!question) {
      const message = await i18n?.t('errors.kyc.questionNotFound');
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
    return {
      id: question.id,
      group: question.group,
      name: question.name,
      title: question.title,
      desc: question.desc,
      type: question.type,
      isHidden: question.isHidden,
      isRequired: question.isRequired,
      isEditable: question.isEditable,
      step: question.step,
      sort: question.sort,
      languageIso: question.languageIso,
      answers: question.answers.map((answer) => ({
        id: answer.id,
        text: answer.text,
        sort: answer.sort,
      })),
    };
  }

  async softDeleteQuestion(id: number): Promise<any> {
    const question = await this.questionRepository.findOneBy({ id });

    if (!question) {
      throw new Error('Question not found');
    }

    question.isDeleted = true;
    await this.questionRepository.save(question);

    return { message: 'Question deleted successfully' };
  }

  async getQuestionByWhere(where: any): Promise<any> {
    return await this.questionRepository.findOne({ where });
  }
}
