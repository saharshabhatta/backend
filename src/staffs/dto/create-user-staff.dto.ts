import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserStaffDto {
  @ApiProperty({
    description: 'Email of the user',
    example: 'staff@example.com',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password for the user account',
    example: 'StrongPassword123!',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Name of the staff member',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Date of birth of the staff member',
    example: '1990-01-01',
  })
  @IsString()
  @IsNotEmpty()
  dob: string;

  @ApiProperty({
    description: 'Phone number of the staff member',
    example: '+1234567890',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;
}
