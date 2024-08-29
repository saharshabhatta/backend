import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { Gender, Level } from '../schema/student.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserStudentDto {
  @ApiProperty({
    description: 'Email address of the student',
    example: 'student@example.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password for the student account',
    example: 'StrongPassword123!',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Unique identifier for the student (university ID)',
    example: 'U123456789',
  })
  @IsString()
  @IsNotEmpty()
  unid: string;

  @ApiProperty({
    description: 'Academic level of the student',
    enum: Level,
    example: Level.L5,
  })
  @IsEnum(Level)
  level: Level;

  @ApiProperty({
    description: 'Full name of the student',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Identifier for the course the student is enrolled in',
    example: 'CSE101',
  })
  @IsString()
  @IsNotEmpty()
  course_id: string;

  @ApiProperty({
    description: 'Date of birth of the student',
    example: '2000-01-01',
  })
  @IsNotEmpty()
  @IsString()
  dob: string;

  @ApiProperty({
    description: 'Gender of the student',
    enum: Gender,
    example: Gender.MALE,
  })
  @IsEnum(Gender)
  gender: Gender;
}
