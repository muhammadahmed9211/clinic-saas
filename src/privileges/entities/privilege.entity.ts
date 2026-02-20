import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsBoolean, IsString } from 'class-validator';
import { EntityHelper } from '../../utils/entity-helper';

// @Entity()
export class Privilege extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Allow()
  @ApiProperty({ example: 'getme' })
  @Column()
  @IsString()
  name?: string;

  @Allow()
  @ApiProperty({ example: false })
  @Column()
  @IsBoolean()
  isScreen?: boolean;

  @Allow()
  @ApiProperty({ example: 'GET' })
  @Column()
  @IsString()
  method?: string;

  @Allow()
  @ApiProperty({ example: '/api/v1/getme' })
  @Column()
  @IsString()
  api?: string;

  @Allow()
  @ApiProperty({ example: 'client/dashboard' })
  @Column()
  @IsString()
  screen?: string;

  @Allow()
  @ApiProperty()
  @Column()
  @IsString()
  description?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
