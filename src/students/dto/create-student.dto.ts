import { IsString, IsNotEmpty, IsEnum, IsMongoId } from 'class-validator';
import { Gender, Level } from '../schema/student.schema';
import { ObjectId } from 'mongodb';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: '64f1c8e53f799b1a6f123456',
  })
  @IsMongoId()
  @IsNotEmpty()
  user_id: ObjectId; // Use string for ObjectId in DTOs

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
  @IsNotEmpty()
  gender: Gender;
}
