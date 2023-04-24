import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class GetJobStatusDto {
  @ApiProperty({
    description: 'Job ID',
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  readonly id: number;
}

export default GetJobStatusDto;