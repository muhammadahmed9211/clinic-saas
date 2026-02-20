import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  SerializeOptions,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { PaginationDto } from 'src/database/base-repository/dto/pagination.dto';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdateFileUploadDto, UploadFileDto } from './dto/upload-file.dto';
import { FileUploadService } from './file_upload.service';
import { JobService } from 'src/jobs-processor/job.service';
// import { WorldCheckService } from 'src/world-check/worldCheck.service';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({ path: 'files', version: '1' })
export class FileUploadController {
  constructor(
    private readonly appService: FileUploadService,
    private readonly jobService: JobService,
    // private readonly worldCheckService: WorldCheckService,
  ) {}
  @ApiOperation({ summary: 'Upload CSV file Endpoint' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        verificationId: {
          type: 'string',
        },
      },
    },
  })
  @Post('/upload-lead-file')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { files: 1, fileSize: 5000 * 5000 * 5 }, // 1 MB you can adjust size here
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['text/csv'];

        if (!allowedMimeTypes.includes(file.mimetype)) {
          cb(new BadRequestException('Invalid file type'), false);
        } else if (file?.size > 5000 * 5000 * 5) {
          // 1MB
          cb(
            new BadRequestException('Max File Size Reached. Max Allowed: 5MB'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadCsvFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadFileDto: UploadFileDto,
    @GetUser() user: User,
  ): Promise<any> {
    const userId = user?.id;
    const verificationId: string = uploadFileDto?.verificationId;
    const userName: string = user?.role?.name || '';
    if (!file) {
      throw new BadRequestException('File is required!');
    }
    try {
      const response: any = await this.appService.validateCsvData(
        file,
        userId,
        userName,
        verificationId,
      );
      await this.jobService.addDataUploadJobForClient(response);

      return {
        error: response?.error || false,
        statusCode: response?.status || HttpStatus.OK,
        message: response?.message || 'file uploaded successfully',
        data: response?.length || 0,
        errorsArray: response?.errorsArray || [],
      };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: {
            msg: e?.response?.error?.msg,
            userStatus: e?.response?.error?.status,
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  @SerializeOptions({
    groups: ['admin'],
  })
  @Post('admin/processes/list')
  @HttpCode(HttpStatus.OK)
  async findAllWithFilters(
    @Query() query: PaginationDto,
    @Body() body: ApplyListFilterSortColumnDto,
    @GetUser() user: User,
  ) {
    // await this.worldCheckService.sendTopicToWorldCheckService(
    //   { userId: 2946 },
    //   'check-user-compliance',
    // );

    const userId = user.id;

    return this.appService.getProcessesList({
      userId,
      limit: query.limit || 10,
      page: query.page || 1,
      dto: body,
    });
  }
  @Patch('admin/file-upload/cancel-upload/:id')
  @HttpCode(HttpStatus.OK)
  async cancelUploadFile(@Param() params: UpdateFileUploadDto) {
    const { id } = params;

    const response: any = await this.appService.updateUploadFileData(id, true);

    return {
      error: response?.error || false,
      statusCode: response?.status || HttpStatus.OK,
      message: response?.message || 'Process has been cancelled',
      data: response || [],
    };
  }
}
