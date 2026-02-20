import { Global, Module } from '@nestjs/common';
import { ClassificationService } from './classification.service';
import { ClassificationController } from './classification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Classification } from './entities/classification.entity';

@Global()
@Module({
  imports:[TypeOrmModule.forFeature([Classification])],
  controllers: [ClassificationController],
  providers: [ClassificationService],
  exports:[ClassificationService]
})
export class ClassificationModule {}
