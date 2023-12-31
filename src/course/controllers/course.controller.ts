import {
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  Param,
  Controller,
  HttpException,
  UseGuards,
  Request,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';
import { FileInterceptor } from '@nestjs/platform-express';
import { lookup } from 'mime-types';
import CourseService from '@course/services/course.service';
import ResponseObject from '@response/class/response-object';
import ResponsePagination from '@response/class/response-pagination';
import CreateCourseDto from '@course/dto/create-course';
import ReadCategoryIDDto from '@category/dto/read-category-id';
import UpdateCourseContentDto from '@course/dto/update-course-content';
import ReadCourseIDDto from '@course/dto/read-course-id';
import FetchCourseDto from '@course/dto/fetch-course';
import CourseEntity from '@course/models/course.model';
import JwtAuthGuard from '@auth/guard/jwt.guard';
import Roles from '@user/guard/roles.decorator';
import UserRole from '@user/enum/user-role';
import AuthRequest from '@auth/interface/auth-request';
import RolesGuard from '@user/guard/roles.guard';

@Controller('course')
class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @ApiProperty({ description: 'Fetch Courses' })
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async fetchCourse(
    @Request() req: AuthRequest,
    @Query() query: FetchCourseDto,
  ) {
    try {
      const { user } = req;
      const { categoryIDs, title, difficulty, limit, page, subscribed } = query;
      const adminId =
        user !== undefined
          ? user.role === UserRole.ADMIN
            ? user.id
            : undefined
          : undefined;
      const studentId =
        user !== undefined
          ? user.role === UserRole.STUDENT
            ? user.id
            : undefined
          : undefined;

      const { courses, count, currentPage, totalPage } =
        await this.courseService.fetchCourse(
          categoryIDs,
          title,
          difficulty,
          subscribed,
          adminId,
          studentId,
          limit,
          page,
        );

      return new ResponsePagination<CourseEntity>(
        'Courses fetched successfully',
        courses,
        count,
        currentPage,
        totalPage,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Fetch Courses for Visitor' })
  @Get('visitor')
  async fetchCourseVisitor(@Query() query: FetchCourseDto) {
    try {
      const { categoryIDs, title, difficulty, limit, page } = query;

      const { courses, count, currentPage, totalPage } =
        await this.courseService.fetchCourse(
          categoryIDs,
          title,
          difficulty,
          false,
          undefined,
          undefined,
          limit,
          page,
        );

      return new ResponsePagination<CourseEntity>(
        'Courses fetched successfully',
        courses,
        count,
        currentPage,
        totalPage,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Get One Course' })
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STUDENT)
  async fetchCourseById(
    @Request() req: AuthRequest,
    @Param() params: ReadCourseIDDto,
  ) {
    try {
      const { user } = req;
      const { id } = params;
      const adminId = user.role === UserRole.ADMIN ? user.id : undefined;

      const course = await this.courseService.getCourseById(id, adminId);

      return new ResponseObject<CourseEntity>(
        'Course fetched successfully',
        course,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Create A Course' })
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async createCourse(
    @Request() req: AuthRequest,
    @Body() createCourseDto: CreateCourseDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: lookup('.png') as string }),
        ],
        fileIsRequired: false,
      }),
    )
    content?: Express.Multer.File,
  ) {
    try {
      const { user } = req;
      const { title, description, difficulty, status, categoryIDs } =
        createCourseDto;
      const adminId = user.id;

      const course = await this.courseService.create(
        title,
        description,
        difficulty,
        status,
        categoryIDs,
        adminId,
        content,
      );

      return new ResponseObject<CourseEntity>(
        'Course created successfully',
        course,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Update Course' })
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async updateCourse(
    @Request() req: AuthRequest,
    @Param() params: ReadCategoryIDDto,
    @Body() updateCourseDto: UpdateCourseContentDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: lookup('.png') as string }),
        ],
        fileIsRequired: false,
      }),
    )
    content?: Express.Multer.File,
  ) {
    try {
      const { user } = req;
      const { id } = params;
      const { title, description, difficulty, status, categoryIDs } =
        updateCourseDto;
      const adminId = user.id;

      const course = await this.courseService.update(
        id,
        title,
        description,
        difficulty,
        status,
        categoryIDs,
        adminId,
        content,
      );

      return new ResponseObject<CourseEntity>(
        'Course updated successfully',
        course,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Delete Course' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteCourse(
    @Request() req: AuthRequest,
    @Param() params: ReadCategoryIDDto,
  ) {
    try {
      const { user } = req;
      const { id } = params;
      const adminId = user.id;

      const course = await this.courseService.delete(id, adminId);

      return new ResponseObject<CourseEntity>(
        'Course deleted successfully',
        course,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }
}

export default CourseController;
