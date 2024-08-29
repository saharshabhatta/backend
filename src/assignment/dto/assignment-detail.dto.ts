import { ApiProperty } from '@nestjs/swagger';

export class AssignmentDetailDto {
  @ApiProperty({ description: 'Unique identifier for the assignment' })
  readonly id: string;

  @ApiProperty({ description: 'Code of the module this assignment belongs to' })
  readonly module_code: string;

  @ApiProperty({ description: 'Brief description of the assignment' })
  readonly assignment_brief: string;

  @ApiProperty({ description: 'Deadline for the assignment' })
  readonly assignment_deadline: Date;

  @ApiProperty({ description: 'Indicates if the assignment is archived' })
  readonly isArchived: boolean;

  @ApiProperty({ description: 'URL of the assignment brief file' })
  readonly assignment_url: string;
}
