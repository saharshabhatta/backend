import { IsString, IsEnum, IsBoolean } from 'class-validator';
import { Level } from '../schema/timetable.schema';

export class RetrieveTimetableDto {
  @IsString()
  readonly _id: string;

  @IsString()
  readonly course_id: string;

  @IsEnum(Level)
  readonly level: Level;

  @IsBoolean()
  readonly shift_1: boolean;

  @IsBoolean()
  readonly shift_2: boolean;

  @IsBoolean()
  readonly is_archived: boolean;

  @IsString()
  pdf_url: string;
}
