import { IsString, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { Level } from '../schema/timetable.schema';

export class CreateTimetableDto {
  @IsString()
  readonly course_id: string;

  @IsEnum(Level)
  readonly level: Level;

  @IsString()
  @IsOptional()
  readonly shift?: string;

  @IsBoolean()
  @IsOptional()
  readonly is_archived?: boolean;

  @IsString()
  @IsOptional()
  pdf_url?: string;
}
