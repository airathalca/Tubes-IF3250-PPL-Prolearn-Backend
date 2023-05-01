import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class RenderMaterialDto {
  @ApiProperty({
    description: 'Material ID',
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  readonly id: number;
}

export default RenderMaterialDto;