import { Injectable } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';
import { Privilege } from 'src/privileges/entities/privilege.entity';
import { RolePrivilege } from 'src/privileges/entities/role-privilege.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PrivilegeSeedService {
  constructor(
    @InjectRepository(Privilege)
    private privilegeRepository: Repository<Privilege>,
    @InjectRepository(RolePrivilege)
    private rolePrivilegeRepository: Repository<RolePrivilege>,
  ) {}

  async run() {
    const app = await NestFactory.create(AppModule);
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder().build(),
    );

    for (const path in document.paths) {
      for (const method in document.paths[path]) {
        const operation = document.paths[path][method];
        const action = operation.operationId;

        const isExist = await this.privilegeRepository.findOneBy({
          api: `/api/v1${path}`,
          method: method.toUpperCase(),
        });

        if (!isExist) {
          const privileges = await this.privilegeRepository.save({
            api: `/api/v1${path}`,
            method: method.toUpperCase(),
            name: action,
            isScreen: false,
            screen: '',
            description: '',
          });

          await this.rolePrivilegeRepository.save({
            role: { id: 1 },
            privilege: { id: privileges.id },
          });
        }
      }
    }
    await app.close();
  }
}
