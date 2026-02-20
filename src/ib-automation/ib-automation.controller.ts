import { BadRequestException, Body, Controller, Post, UseGuards } from '@nestjs/common';
import { IbAutomationService } from './ib-automation.service';
import { User } from 'src/users/entities/user.entity';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { CreateIBAutomationDto } from './dto/create-ib-automation.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  version: "1",
  path: "ib-automation"
})
export class IbAutomationController {
  constructor(private readonly ibAutomationService: IbAutomationService) { }

  @Post()
  async create(@Body() body: CreateIBAutomationDto, @GetUser() user: User) {
    const isRegisteredAsIB =
      await this.ibAutomationService.setUserType(body, user.id);
    return this.ibAutomationService.setup(user.id, isRegisteredAsIB);
  }
}
