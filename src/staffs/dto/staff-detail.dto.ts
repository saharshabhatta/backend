import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/users/types/types';

export class StaffDetailDto {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: 'user123',
  })
  user_id: string;

  @ApiProperty({
    description: 'Email of the staff member',
    example: 'staff@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Name of the staff member',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'Phone number of the staff member',
    example: '+1234567890',
  })
  phone: string;

  @ApiProperty({
    description: 'Date of birth of the staff member',
    example: '1990-01-01',
  })
  dob: string;

  @ApiProperty({
    description: 'Role of the staff member',
    example: 'admin',
  })
  role: UserRole;

  @ApiProperty({
    description: 'Indicates if the staff member is archived',
    example: false,
  })
  isArchived: boolean;
}
