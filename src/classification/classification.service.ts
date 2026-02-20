import { Injectable } from '@nestjs/common';
import { Classification } from './entities/classification.entity';
import { FindOptionsRelations, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class ClassificationService {
  constructor(@InjectRepository(Classification)
  private readonly classificationRepository: Repository<Classification>) { }

  findAll(withKeyFeaturesAndEligibility = false) {
    const relations: FindOptionsRelations<Classification> = {
      title: {
        labelTranslation: true
      }
    };

    if (withKeyFeaturesAndEligibility) {
      relations.eligibility = true;
      relations.keyFeatures = true;
    }
    return this.classificationRepository.find({
      where: { isActive: true },
      relations,
    })
  }

  findOne(id: number) {
    return this.classificationRepository.findOne({
      where: { isActive: true, id }, relations: {
        title: {
          labelTranslation: true
        }
      }
    })
  }
}
