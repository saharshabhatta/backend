import { ObjectId } from 'mongodb';
import { ApiProperty } from '@nestjs/swagger';

export class StudentDetailsDto {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: '64f1c8e53f799b1a6f123456',
  })
  user_id: ObjectId;

  @ApiProperty({
    description: 'Email address of the student',
    example: 'student@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Full name of the student',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'Date of birth of the student',
    example: '2000-01-01',
  })
  dob: string;

  @ApiProperty({
    description: 'Academic level of the student',
    example: 'UNDERGRADUATE',
  })
  level: string;

  @ApiProperty({
    description: 'Identifier for the course the student is enrolled in',
    example: 'CSE101',
  })
  course_id: string;

  @ApiProperty({
    description: 'Gender of the student',
    example: 'MALE',
  })
  gender: string;

  @ApiProperty({
    description: 'Unique identifier for the student (university ID)',
    example: 'U123456789',
  })
  unid: string;

  @ApiProperty({
    description: 'Role of the student in the system',
    example: 'student',
  })
  role: string;

  @ApiProperty({
    description: 'Indicates if the student is archived',
    example: false,
  })
  isArchived: boolean;
}
