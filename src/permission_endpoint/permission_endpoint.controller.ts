import { Controller, Get } from '@nestjs/common';
import { PermissionEndpointService } from './permission_endpoint.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Permission Endpoint')
@Controller({ path: 'permission-endpoint', version: '1' })
export class PermissionEndpointController {
  constructor(private readonly service: PermissionEndpointService) {}

  @Get()
  async get() {
    return await this.service.getAll();
  }
}
