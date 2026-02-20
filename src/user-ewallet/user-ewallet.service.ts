import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEWallet } from './entities/user-ewallet.entity';
import { IncrementType } from 'src/user-credit-cards/user-credit-cards.service';
import { CreateUserEWalletDto } from './dto/create-user-ewallet.dto';

@Injectable()
export class UserEWalletService {
  constructor(
    @InjectRepository(UserEWallet)
    private readonly userEWalletRepository: Repository<UserEWallet>,
  ) {}
  isEWalletPayment(data: any): boolean {
    const isEWalletTransaction =
      data?.charge?.attributes?.payment_method === 'apm';
    return isEWalletTransaction;
  }

  getEWalletPayload(data: any): CreateUserEWalletDto {
    const name = data.psp_name;
    const eWalletId =
      data?.charge?.attributes?.customer?.extra_data?.payer_email;
    const title = data?.charge?.attributes?.source?.name;

    return {
      title,
      name,
      eWalletId,
    };
  }
  async create(data: CreateUserEWalletDto, userId: number) {
    const isExist = await this.userEWalletRepository.findOneBy({
      user: {
        id: userId,
      },
      name: data.name,
      eWalletId: data.eWalletId,
    });
    if (!isExist) {
      return await this.userEWalletRepository.save({
        ...data,
        user: { id: userId },
      });
    }
    return isExist;
  }

  public async increment(
    id: UserEWallet['id'],
    amount: number,
    type: IncrementType,
  ) {
    return this.userEWalletRepository.increment({ id }, type, amount);
  }

  async findAllByUserId(id: number) {
    const entities = this.userEWalletRepository.findBy({ user: { id } });
    return entities;
  }

  async findOne(id: number, userId: number) {
    const entity = this.userEWalletRepository.findOneBy({
      user: { id: userId },
      id,
    });
    return entity;
  }
}
