import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class CourseCreateDto {
  @ApiProperty({
    description: 'Unique identifier for the course',
    example: 'C123',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  course_id: string;

  @ApiProperty({
    description: 'Name of the course',
    example: 'Introduction to Computer Science',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Detailed description of the course',
    example: 'This course provides an overview of computer science principles.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Leader of the course, referenced by ObjectId',
    example: '5f8d0d55b54764421b7156c5',
    type: String,
  })
  @IsNotEmpty()
  leader: Types.ObjectId;
}
