import { IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAssignmentDto {
  @ApiProperty({ description: 'Code of the module this assignment belongs to' })
  @IsString()
  @IsNotEmpty()
  module_code: string;

  @ApiProperty({ description: 'Brief description of the assignment' })
  @IsString()
  @IsNotEmpty()
  assignment_brief: string;

  @ApiProperty({
    description: 'Deadline for the assignment',
    example: '2024-08-30T23:59:59Z',
  })
  @IsDateString()
  @IsNotEmpty()
  assignment_deadline: string;
}
