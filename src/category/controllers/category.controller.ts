import {
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  Param,
  Res,
  Controller,
  HttpException,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import CategoryService from '@category/services/category.service';
import ResponseService from '@response/services/response.service';
import CreateCategoryDto from '@category/dto/create-category';
import DeleteCategoryDto from '@category/dto/delete-category';
import UpdateCategoryIDDto from '@category/dto/update-category-id';
import UpdateCategoryTitleDto from '@category/dto/update-category-title';
import CategoryEntity from '@category/models/category.model';

@Controller('category')
class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly responseService: ResponseService,
  ) {
    this.responseService = new ResponseService();
  }

  @ApiProperty({ description: 'Get all categories' })
  @Get('list')
  async getAllCategories(@Res() res: Response) {
    try {
      const categories = await this.categoryService.getAllCategories();
      this.responseService.json<CategoryEntity[]>(
        res,
        StatusCodes.OK,
        'Categories fetched successfully',
        categories,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Get categories using query' })
  @Get()
  async getCategoriesByTitle(
    @Query('title') title: string,
    @Res() res: Response,
  ) {
    try {
      const categories = await this.categoryService.getCategoriesByTitle(title);
      this.responseService.json<CategoryEntity[]>(
        res,
        StatusCodes.OK,
        'Search result fetched successfully',
        categories,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Create category' })
  @Post()
  async createCategory(@Body() body: CreateCategoryDto, @Res() res: Response) {
    try {
      const isExist = await this.categoryService.getCategoryByTitle(
        body.title,
      );
      if (isExist) {
        throw new HttpException(
          'Category already exists',
          StatusCodes.BAD_REQUEST,
        );
      }
      const category = await this.categoryService.create(body);
      this.responseService.json<CategoryEntity>(
        res,
        StatusCodes.CREATED,
        'Category created successfully',
        category,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Delete category' })
  @Delete(':id')
  async deleteCategory(
    @Param() params: DeleteCategoryDto,
    @Res() res: Response,
  ) {
    try {
      const category = await this.categoryService.delete(params);
      this.responseService.json<CategoryEntity>(
        res,
        StatusCodes.OK,
        'Category deleted successfully',
        category,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Update category' })
  @Put(':id')
  async updateCategory(
    @Param() params: UpdateCategoryIDDto,
    @Body() body: UpdateCategoryTitleDto,
    @Res() res: Response,
  ) {
    try {
      const category = await this.categoryService.update(params, body);
      this.responseService.json<CategoryEntity>(
        res,
        StatusCodes.OK,
        'Category updated successfully',
        category,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }
}

export default CategoryController;
