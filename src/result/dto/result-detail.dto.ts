import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class ResultDetailDto {
  @ApiProperty({ description: 'ID of the result' })
  _id: Types.ObjectId;

  @ApiProperty({ description: 'ID of the student' })
  student_id: Types.ObjectId;

  @ApiProperty({ description: 'Code of the module' })
  module_code: string;

  @ApiProperty({ description: 'Grade assigned' })
  grade: string;

  @ApiProperty({ description: 'Feedback for the student' })
  feedback: string;

  @ApiProperty({ description: 'ID of the staff' })
  staff_id: Types.ObjectId;

  @ApiProperty({ description: 'Indicates if the result is archived' })
  isArchived: boolean;
}
