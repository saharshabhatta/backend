import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CourseDetailDto {
  @ApiProperty({
    description: 'Unique identifier for the course',
    example: 'course123',
  })
  @IsString()
  readonly course_id: string;

  @ApiProperty({
    description: 'Name of the course',
    example: 'Introduction to Programming',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    description: 'Description of the course',
    example: 'A basic course on programming fundamentals',
  })
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiProperty({
    description: 'ID of the course leader',
    type: String,
    example: 'leader123',
  })
  @IsString()
  readonly leader: string;

  @ApiProperty({
    description: 'Staff who added the course',
    type: String,
    example: 'staff456',
  })
  readonly staff_id: string;

  @ApiProperty({
    description: 'Indicates if the course is archived',
    example: false,
  })
  @IsBoolean()
  readonly isArchived: boolean;
}
