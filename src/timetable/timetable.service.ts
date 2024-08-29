import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Timetable, TimetableDocument } from './schema/timetable.schema';
import { CreateTimetableDto } from './dto/create-timetable.dto';
import { CourseService } from 'src/course/course.service';
import { RetrieveTimetableDto } from './dto/timetable-detail.dto';

@Injectable()
export class TimetableService {
  constructor(
    @InjectModel(Timetable.name)
    private readonly timetableModel: Model<Timetable>,
    private readonly courseService: CourseService,
  ) {}
  async create(
    createTimetableDto: CreateTimetableDto,
  ): Promise<RetrieveTimetableDto> {
    if (!(await this.courseService.findById(createTimetableDto.course_id))) {
      throw new NotFoundException(
        `Course with ID ${createTimetableDto.course_id} not found`,
      );
    }
    const shift_1 = createTimetableDto.shift === 'shift_1';
    const shift_2 = createTimetableDto.shift === 'shift_2';

    const newTimetable = new this.timetableModel({
      ...createTimetableDto,
      shift_1: shift_1,
      shift_2: shift_2,
    });
    const savedTimetable = await newTimetable.save();
    return this.mapToRetriveTimeTableDto(savedTimetable);
  }

  async findAll(): Promise<RetrieveTimetableDto[]> {
    const timetables = await this.timetableModel.find().exec();
    return timetables.map(this.mapToRetriveTimeTableDto);
  }

  async findOne(id: string): Promise<RetrieveTimetableDto> {
    const timetable = await this.timetableModel.findById(id).exec();
    if (!timetable) {
      throw new NotFoundException(`Timetable with ID ${id} not found`);
    }
    return this.mapToRetriveTimeTableDto(timetable);
  }

  async update(
    id: string,
    updateTimetableDto: CreateTimetableDto,
  ): Promise<RetrieveTimetableDto> {
    if (
      updateTimetableDto.course_id &&
      !(await this.courseService.findById(updateTimetableDto.course_id))
    ) {
      throw new NotFoundException(
        `Course with ID ${updateTimetableDto.course_id} not found`,
      );
    }
    const updatedTimetable = await this.timetableModel
      .findByIdAndUpdate(id, updateTimetableDto, { new: true })
      .exec();
    if (!updatedTimetable) {
      throw new NotFoundException(`Timetable with ID ${id} not found`);
    }
    return this.mapToRetriveTimeTableDto(updatedTimetable);
  }

  async delete(id: string): Promise<void> {
    const result = await this.timetableModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Timetable with ID ${id} not found`);
    }
  }

  async archive(id: string): Promise<RetrieveTimetableDto> {
    const timetable = await this.timetableModel
      .findByIdAndUpdate(id, { is_archived: true }, { new: true })
      .exec();
    if (!timetable) {
      throw new NotFoundException(`Timetable with ID ${id} not found`);
    }
    return this.mapToRetriveTimeTableDto(timetable);
  }

  async unarchive(id: string): Promise<RetrieveTimetableDto> {
    const timetable = await this.timetableModel
      .findByIdAndUpdate(id, { is_archived: false }, { new: true })
      .exec();
    if (!timetable) {
      throw new NotFoundException(`Timetable with ID ${id} not found`);
    }
    return this.mapToRetriveTimeTableDto(timetable);
  }

  private mapToRetriveTimeTableDto(
    timetable: TimetableDocument,
  ): RetrieveTimetableDto {
    return {
      _id: timetable._id.toString(),
      course_id: timetable.course_id,
      level: timetable.level,
      shift_1: timetable.shift_1,
      shift_2: timetable.shift_2,
      is_archived: timetable.is_archived,
      pdf_url: timetable.pdf_url,
    };
  }
}
