import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStaffDto {
  @ApiProperty({
    description: 'Name of the staff member',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'User ID associated with the staff member',
    example: 'user123',
  })
  @IsString()
  @IsNotEmpty()
  user_id: string;

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
