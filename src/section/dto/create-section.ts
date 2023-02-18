import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import SectionType from '@section/enum/section-type';
import IsSectionType from '@section/validator/section-validator';

/* Create class Create Section DTO based on the model */
class CreateSectionDto {
  @ApiProperty({
    description: 'Section title',
    required: true,
  })
  @IsString()
  @Type(() => String)
  title: string;

  @ApiProperty({
    description: 'Section objective',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  objective?: string;

  @ApiProperty({
    description: 'Section duration',
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  duration: number;

  @ApiProperty({
    description: 'Section type',
    required: true,
  })
  @IsSectionType()
  @Type(() => String)
  type: SectionType;

  @ApiProperty({
    description: 'Section content',
    required: true,
  })
  @IsString()
  @Type(() => String)
  markdown: string;

  @ApiProperty({
    description: 'Section parent',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  parent?: number;
}

export default CreateSectionDto;
