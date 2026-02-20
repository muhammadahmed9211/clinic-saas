import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, SerializeOptions, UseGuards } from '@nestjs/common';
import { BonusService } from './bonus.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';
import { ValidateBonusDto } from './dto/validate-bonus.dto';
import { CreateBonusDto } from './dto/create-bonus.dto';
import { UpdateBonusDto } from './dto/update-bonus.dto';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { PaginationDto } from 'src/database/base-repository/dto/pagination.dto';
import { DepositType, AccountClassification } from './enum/bonus.enum';

@Controller({ path: 'bonus', version: '1' })
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class BonusController {
  constructor(private readonly bonusService: BonusService) {}

  // 🔹 Client Routes
  @SerializeOptions({ groups: [] })
  @Get('all')
  @ApiTags('Bonus Client')
  async getBonusList(@GetUser() user: User, @Query("method") method: string, @Query("version") version: string) {
    if(Number(version) === 2){
      return this.bonusService.getBonusList(user.id, method);
    }
    return this.bonusService.getBonusListV1(user.id , method)
  }

  @SerializeOptions({ groups: [] })
  @Post('validate')
  @ApiTags('Bonus Client')
  @ApiBody({ type: ValidateBonusDto })
  async validateBonusCode(
    @Body() dto: ValidateBonusDto,
    @GetUser() user: User,
    @Query("version") version: string
  ) {
    if(Number(version) === 2){
      return this.bonusService.validateBonusCode(user, dto);
    }
    return this.bonusService.validateBonusCodeV1(user, dto);
  }

  //Admin Routes

  @ApiTags('Bonus Program Admin')
 @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get filtered bonus list with pagination' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Bonus list retrieved successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async getFilteredBonusList(
    @Query() query: PaginationDto,
    @GetUser() user: User,
    @Body() body: ApplyListFilterSortColumnDto,
  ) {
    try {
      const result = await this.bonusService.getFilteredBonusList({
        paginationOptions: {
          page: query.page || 1,
          limit: query.limit || 10,
        },
        userId: user.id,
        dto: body,
      });
      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Get('enums')
  @ApiTags('Bonus Program Admin')
  getEnums() {
    return {
      depositTypes: Object.values(DepositType),
      AccountClassification: Object.values(AccountClassification),
    };
  }

  @Post('create')
  @ApiTags('Bonus Program Admin')
  @ApiBody({ type: CreateBonusDto })
  async createBonus(@Body() dto: CreateBonusDto, @GetUser() user: User) {
    return this.bonusService.createBonus(dto, user.id);
  }

  @Patch('/update/:id')
  @ApiTags('Bonus Program Admin')
  @ApiBody({ type: UpdateBonusDto })
  async updateBonus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBonusDto,
    @GetUser() user: User,
  ) {
    return this.bonusService.updateBonus(id, dto, user.id);
  }

  @Get(':id')
  @ApiTags('Bonus Program Admin')
  async getBonus(@Param('id') id: number) {
    return this.bonusService.getBonusById(id);
  }

  @Patch('statusToggle/:id')
  @ApiTags('Bonus Program Admin')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        isActive: { type: 'boolean', example: true },
      },
      required: ['isActive'],
    },
  })
  async toggleStatus(@Param('id') id: number, @Body('isActive') isActive: boolean) {
    return this.bonusService.updateStatus(id, isActive);
  }

  @Delete(':id')
  @ApiTags('Bonus Program Admin')
  async deleteBonus(@Param('id') id: number, @GetUser() user: User) {
    return this.bonusService.softDeleteBonus(id, user.id);
  }

}