import { IsOptional, IsEnum, IsString } from 'class-validator';
import { Level, Gender } from '../schema/student.schema';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStudentDto {
  @ApiProperty({
    description: 'Unique identifier for the student (university ID)',
    example: 'U123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  unid?: string;

  @ApiProperty({
    description: 'Email address of the student',
    example: 'student@example.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    description: 'Password for the student account',
    example: 'NewStrongPassword123!',
    required: false,
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({
    description: 'Academic level of the student',
    enum: Level,
    example: Level.L5,
    required: false,
  })
  @IsOptional()
  @IsEnum(Level)
  level?: Level;

  @ApiProperty({
    description: 'Full name of the student',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Identifier for the course the student is enrolled in',
    example: 'CSE101',
    required: false,
  })
  @IsOptional()
  @IsString()
  course_id?: string;

  @ApiProperty({
    description: 'Date of birth of the student',
    example: '2000-01-01',
    required: false,
  })
  @IsOptional()
  @IsString()
  dob?: string;

  @ApiProperty({
    description: 'Gender of the student',
    enum: Gender,
    example: Gender.MALE,
    required: false,
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
}
