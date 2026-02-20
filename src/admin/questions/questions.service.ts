import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { User } from 'src/users/entities/user.entity';
import { ResponseWrapper } from 'src/utils/interface/mt5/base-response.interface';
import { Status } from 'src/utils/enums/mt5/response-status.enum';
import { LeadQuestionRepository } from './repositories/question.repository';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { ListNames } from 'src/list-item/dto/create-list-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LeadAnswer } from '../leads/entities/lead-answer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionsService {
  constructor(
    private questionRepository: LeadQuestionRepository,
    @InjectRepository(LeadAnswer)
    private leadAnswerRepository: Repository<LeadAnswer>,
  ) {}
  async create(createQuestionDto: CreateQuestionDto, user: User) {
    const keyExists = await this.questionRepository.count({
      where: {
        key: createQuestionDto.key,
      },
    });
    if (keyExists) throw new BadRequestException('Question key already exists');
    return ResponseWrapper.wrap({
      status: Status.SUCCESS,
      statusCode: 201,
      statusText: 'Question created successfully',
      data: await this.questionRepository.save(
        this.questionRepository.create({
          ...createQuestionDto,
          createdBy: user,
        }),
      ),
    });
  }

  async findAll({
    paginationOptions,
    userId,
    body,
  }: {
    paginationOptions: IPaginationOptions;
    userId: number;
    body?: ApplyListFilterSortColumnDto;
  }) {
    const filterParams = {
      ...paginationOptions,
      relations: ['createdBy'],
      listName: ListNames.LEAD_QUESTIONS,
      userId: userId,
      filterList: body?.filters || undefined,
      sortList: body?.sort || undefined,
      defaultSortKey: 'createdAt',
      listViewId: body?.listViewId,
    };

    return ResponseWrapper.wrap({
      status: Status.SUCCESS,
      statusCode: 200,
      statusText: 'Questions fecthed successfully',
      data: await this.questionRepository.advanceFilters(filterParams),
    });
  }

  async findOne(id: number) {
    return ResponseWrapper.wrap({
      status: Status.SUCCESS,
      statusCode: 200,
      statusText: 'Question fecthed successfully',
      data: await this.questionRepository.findOneBy({ id }),
    });
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    const question = await this.questionRepository.findOneBy({ id });
    if (!question) throw new NotFoundException('Question not found');
    return ResponseWrapper.wrap({
      status: Status.SUCCESS,
      statusCode: 200,
      statusText: 'Question updated successfully',
      data: await this.questionRepository.save({
        ...question,
        ...updateQuestionDto,
      }),
    });
  }

  async remove(id: number) {
    const question = await this.questionRepository.findOneBy({ id });
    if (!question) throw new NotFoundException('Question not found');

    const removed = await this.questionRepository.softDelete({ id });
    if (removed.affected === 1) {
      await this.leadAnswerRepository.softDelete({ question: { id } });
    }

    return ResponseWrapper.wrap({
      status: Status.SUCCESS,
      statusCode: 200,
      statusText: 'Question deleted successfully',
      data: { isDeleted: true },
    });
  }
}
