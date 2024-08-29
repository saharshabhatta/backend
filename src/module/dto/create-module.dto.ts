import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateModuleDto {
  @ApiProperty({
    description: 'Unique identifier for the module',
    example: 'module123',
  })
  @IsNotEmpty()
  @IsString()
  module_code: string;

  @ApiProperty({
    description: 'Identifier for the course to which the module belongs',
    example: 'course123',
  })
  @IsNotEmpty()
  @IsString()
  course_id: string;

  @ApiProperty({
    description: 'Name of the module',
    example: 'Module 1: Basics of Programming',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of the module',
    example:
      'This module covers the basics of programming including variables, loops, and functions.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;
}
