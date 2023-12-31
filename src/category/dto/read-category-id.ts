import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class ReadCategoryIDDto {
  @ApiProperty({
    description: 'Category ID',
    type: Number,
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  readonly id: number;
}

export default ReadCategoryIDDto;
