import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserCreditCardDto } from './dto/create-user-credit-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCreditCard } from './entities/user-credit-card.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

export enum IncrementType {
  DEPOSIT = 'totalDeposit',
  WITHDRAW = 'totalWithdrawal',
}
@Injectable()
export class UserCreditCardsService {
  constructor(
    @InjectRepository(UserCreditCard)
    private readonly userCreditCardRepository: Repository<UserCreditCard>,
  ) {}
  public isCardPayment(obj: any): boolean {
    const isCreditCardPayment =
      obj?.charge?.attributes?.payment_method === 'credit_card';
    return isCreditCardPayment;
  }

  public getCardPayload(obj: any): CreateUserCreditCardDto {
    const data = obj?.charge?.attributes;
    return {
      number: data?.card_masked_number,
      expiration: data?.card_expiration,
      type: data?.card_brand,
      holderName: data?.card_holder_name,
    };
  }

  public async create(dto: CreateUserCreditCardDto, userId: User['id']) {
    const number = dto.number.slice(-4);
    const isExist = await this.userCreditCardRepository.findOneBy({
      user: {
        id: userId,
      },
      number,
      type: dto.type,
    });
    if (isExist) {
      return isExist;
    }
    const newCard = this.userCreditCardRepository.create({
      ...dto,
      user: {
        id: userId,
      },
      number,
    });
    return await this.userCreditCardRepository.save(newCard);
  }

  public async increment(
    id: UserCreditCard['id'],
    amount: number,
    type: IncrementType,
  ) {
    return this.userCreditCardRepository.increment({ id }, type, amount);
  }

  findAllByUserId(userId: User['id']) {
    const entities = this.userCreditCardRepository.findBy({
      user: {
        id: userId,
      },
    });
    return entities;
  }

  async findOne(cardId: UserCreditCard['id'], userId: User['id']) {
    const entity = await this.userCreditCardRepository.findOneBy({
      user: {
        id: userId,
      },
      id: cardId,
    });
    if (!entity) {
      throw new NotFoundException('Card not found');
    }
    return entity;
  }
}
