import {
  Get,
  Post,
  Put,
  Delete,
  Request,
  Res,
  Query,
  Param,
  Controller,
  HttpException,
  UseGuards,
  StreamableFile,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiProperty } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';
import { Response } from 'express';
import { lookup } from 'mime-types';
import FileEntity from '@file/models/file.model';
import FileService from '@file/services/file.service';
import ResponseObject from '@response/class/response-object';
import ResponseList from '@response/class/response-list';
import ReadFileIDDto from '@file/dto/read-file-id';
import ReadFileNameDto from '@file/dto/read-file-name';
import JwtAuthGuard from '@auth/guard/jwt.guard';
import RolesGuard from '@user/guard/roles.guard';
import Roles from '@user/guard/roles.decorator';
import UserRole from '@user/enum/user-role';
import AuthRequest from '@auth/interface/auth-request';
import StorageType from '@storage/enum/storage-type';

@Controller('file')
class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiProperty({ description: 'Get All Files' })
  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllFiles(@Request() req: AuthRequest) {
    try {
      const { user } = req;
      const adminId = user.id;

      const files = await this.fileService.getAllFiles(adminId);

      return new ResponseList<FileEntity>('Files fetched successfully', files);
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Render File' })
  @Get(':id')
  async renderFile(
    @Param() param: ReadFileIDDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { id } = param;

      const [buffer, mimetype] = await this.fileService.render(id);
      res.set({
        'Content-Type': mimetype,
      });

      return new StreamableFile(buffer);
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Stream File' })
  @Get(':id')
  async streamFile(
    @Param() param: ReadFileIDDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { id } = param;

      const [buffer, mimetype] = await this.fileService.stream(id);
      res.set({
        'Content-Type': mimetype,
      });

      return new StreamableFile(buffer);
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Search Files by Query' })
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getFilesByName(
    @Request() req: AuthRequest,
    @Query() query: ReadFileNameDto,
  ) {
    try {
      const { user } = req;
      const { name } = query;
      const adminId = user.id;

      const files = await this.fileService.searchFilesByName(
        name,
        StorageType.IMAGE,
        adminId,
      );

      return new ResponseList<FileEntity>('Files searched successfully', files);
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Create File' })
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async createFile(
    @Request() req: AuthRequest,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: lookup('.png') as string }),
        ],
        fileIsRequired: true,
      }),
    )
    content: Express.Multer.File,
  ) {
    try {
      const { user } = req;
      const adminId = user.id;

      const file = await this.fileService.create(
        adminId,
        StorageType.IMAGE,
        content,
      );

      return new ResponseObject<FileEntity>('File created successfully', file);
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Update File' })
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async updateFile(
    @Request() req: AuthRequest,
    @Param() param: ReadFileIDDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: lookup('.png') as string }),
        ],
        fileIsRequired: true,
      }),
    )
    content: Express.Multer.File,
  ) {
    try {
      const { user } = req;
      const { id } = param;
      const adminId = user.id;

      const file = await this.fileService.edit(
        id,
        adminId,
        StorageType.IMAGE,
        content,
      );

      return new ResponseObject<FileEntity>('File edited successfully', file);
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Delete File' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async DeleteFileDto(
    @Request() req: AuthRequest,
    @Param() param: ReadFileIDDto,
  ) {
    try {
      const { user } = req;
      const { id } = param;
      const adminId = user.id;

      const file = await this.fileService.delete(
        id,
        adminId,
        StorageType.IMAGE,
      );

      return new ResponseObject<FileEntity>('File deleted successfully', file);
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }
}

export default FileController;
