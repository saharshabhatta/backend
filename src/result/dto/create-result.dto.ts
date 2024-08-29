import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateResultDto {
  @ApiProperty({ description: 'ID of the student' })
  @IsMongoId()
  @IsNotEmpty()
  student_id: string;

  @ApiProperty({ description: 'Code of the module' })
  @IsString()
  @IsNotEmpty()
  module_code: string;

  @ApiProperty({ description: 'Grade assigned' })
  @IsString()
  @IsNotEmpty()
  grade: string;

  @ApiProperty({ description: 'Feedback for the student', required: false })
  @IsString()
  @IsOptional()
  feedback?: string;
}
