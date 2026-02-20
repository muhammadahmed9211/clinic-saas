import {
  Controller,
  Get,
  Param,
  Post,
  Response,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Delete,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FilesService } from './files.service';
import { FileResponseDto } from './dto/fileResponseDto.dto';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { OperatorRole, Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import { Throttle } from '@nestjs/throttler';
import { StrictThrottle, ModerateThrottle, HourlyThrottle } from './decorators/throttle.decorator';

@ApiTags('Admin Files')
@Controller({
  path: 'admin/files',
  version: '1',
})
export class AdminFilesController {
  constructor(private readonly filesService: FilesService) { }
  @ApiBearerAuth()
  @Post('upload')
  @OperatorRole()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File | Express.MulterS3.File,
    @Request() req: any,
  ): Promise<FileResponseDto> {
    const userId = Number(req.user.id);
    const roleId = req.user.role.id;
    const data = await this.filesService.uploadFile(file, +userId, +roleId);
    return {
      path: data.path,
      fileType: data.fileType,
      fileName: data.fileName,
      fileSize: data.fileSize,
      userId: data?.user?.id ?? null,
      operatorId: data?.operator?.id ?? null,
      id: data.id,
      status: data.status,
      url: await this.filesService.getSignedUrl(data.id),
    };
  }


}

@ApiTags('Client Files')
@Controller({
  path: 'client/files',
  version: '1',
})
export class ClientFilesController {
  constructor(private readonly filesService: FilesService) { }
  @ApiBearerAuth()
  @Post('upload')
  @Roles(RoleEnum.client)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File | Express.MulterS3.File,
    @Request() req: any,
  ): Promise<FileResponseDto> {
    const userId = Number(req.user.id);
    const roleId = req.user.role.id;
    const data = await this.filesService.uploadFile(file, +userId, +roleId);
    return {
      path: data.path,
      fileType: data.fileType,
      fileName: data.fileName,
      fileSize: data.fileSize,
      userId: data?.user?.id ?? null,
      operatorId: data?.operator?.id ?? null,
      id: data.id,
      status: data.status,
      url: await this.filesService.getSignedUrl(data.id),
    };
  }


}

@ApiTags('Files')
@Controller({
  path: 'files',
  version: '1',
})
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  //to be removed
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File | Express.MulterS3.File,
    @Request() req: any,
  ): Promise<FileResponseDto> {
    const userId = Number(req.user.id);
    const roleId = req.user.role.id;
    const data = await this.filesService.uploadFile(file, +userId, +roleId);
    return {
      path: data.path,
      fileType: data.fileType,
      fileName: data.fileName,
      fileSize: data.fileSize,
      userId: data?.user?.id ?? null,
      operatorId: data?.operator?.id ?? null,
      id: data.id,
      status: data.status,
      url: await this.filesService.getSignedUrl(data.id),
    };
  }

  @Get(':path')
  download(@Param('path') path, @Response() response) {
    return response.sendFile(path, { root: './files' });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteFile(@Param('id') id: string): Promise<void> {
    const data = await this.filesService.deleteFile(id);
    return { message: 'File deleted successfully', data: data } as any;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('share')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async share(@UploadedFile() file, @GetUser() user: any) {
    const userId = Number(user.id);
    const roleId = user.role.id;
    const data = await this.filesService.uploadFile(file, +userId, +roleId);
    return this.filesService.getSignedUrl(data.id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('upload/chat-file')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async chatFileUpload(
    @UploadedFile() file: Express.Multer.File | Express.MulterS3.File,
    @Request() req: any,
  ): Promise<FileResponseDto> {
    const userId = Number(req.user.id);
    const roleId = req.user.role.id;
    const data = await this.filesService.uploadFile(file, +userId, +roleId);
    return {
      path: data.path,
      fileType: data.fileType,
      fileName: data.fileName,
      fileSize: data.fileSize,
      userId: data?.user?.id ?? null,
      operatorId: data?.operator?.id ?? null,
      id: data.id,
      status: data.status,
      url: await this.filesService.getSignedUrl(data.id),
    };
  }

  // Public file upload endpoint for non-registered users with STRICT rate limiting
  @Post('/public/upload')
  @StrictThrottle() // Uses custom decorator: 2 requests per minute
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async publicFileUpload(@UploadedFile() file): Promise<FileResponseDto> {
    const data = await this.filesService.anonymousUploadFile(file);
    return {
      path: data.path,
      fileType: data.fileType,
      fileName: data.fileName,
      fileSize: data.fileSize,
      userId: null as any,
      operatorId: null as any,
      id: data.id,
      status: data.status,
      url: await this.filesService.getSignedUrl(data.id),
    };
  }
  
  @Post('/contact/file-upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async contactUsFileUpload(@UploadedFile() file) {
    const data = await this.filesService.contactUploadFile(file);
    return {
      path: data.path,
      fileType: data.fileType,
      fileName: data.fileName,
      fileSize: data.fileSize,
      id: data.id,
      status: data.status,
      url: await this.filesService.getContactUsSignedUrl(data.id),
    };
  }
}