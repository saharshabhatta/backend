import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ModuleDetailDto {
  @ApiProperty({
    description: 'Unique identifier for the module',
    example: 'module123',
  })
  @IsString()
  readonly module_code: string;

  @ApiProperty({
    description: 'Identifier for the course',
    example: 'course123',
  })
  @IsString()
  readonly course_id: string;

  @ApiProperty({
    description: 'Name of the module',
    example: 'Module 1: Basics of Programming',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    description: 'Description of the module',
    example:
      'This module covers the basics of programming including variables, loops, and functions.',
  })
  @IsString()
  readonly description: string;

  @ApiProperty({
    description: 'Indicates if the module is archived',
    example: false,
  })
  @IsBoolean()
  readonly isArchived: boolean;
}
