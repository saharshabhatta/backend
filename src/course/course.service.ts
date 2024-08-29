import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from './schema/course.schema';
import { Model, Types } from 'mongoose';
import { CourseCreateDto } from './dto/course-create.dto';
import { UserRole } from 'src/users/types/types';
import { UsersService } from 'src/users/users.service';
import { CourseDetailDto } from './dto/course-detail.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
    private usersService: UsersService,
  ) {}

  async create(
    createCourseDto: CourseCreateDto,
    requestUserId: Types.ObjectId,
  ): Promise<CourseDetailDto> {
    await this.validateUser(createCourseDto.leader, UserRole.STAFF);

    try {
      const courseCreated = await this.courseModel.create({
        ...createCourseDto,
        staff_id: requestUserId,
      });
      return this.mapCourseToDto(courseCreated);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(
    isArchived?: boolean,
    search?: string,
  ): Promise<CourseDetailDto[]> {
    const filter: any = {};

    if (isArchived !== undefined) {
      filter.isArchived = isArchived;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { course_id: search },
      ];
    }

    const courses = await this.courseModel.find(filter).exec();
    return courses.map((course) => this.mapCourseToDto(course));
  }

  async findById(courseId: string): Promise<CourseDetailDto> {
    const course = await this.courseModel
      .findOne({ course_id: courseId })
      .exec();
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }
    return this.mapCourseToDto(course);
  }

  async update(
    courseId: string,
    updateCourseDto: Partial<CourseCreateDto>,
    requestUserId: Types.ObjectId,
  ): Promise<CourseDetailDto> {
    const course = await this.courseModel
      .findOne({ course_id: courseId })
      .exec();
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    if (updateCourseDto.leader) {
      await this.validateUser(updateCourseDto.leader, UserRole.STAFF);
    }

    Object.assign(course, updateCourseDto, { staff_id: requestUserId });

    try {
      const updatedCourse = await course.save();
      return this.mapCourseToDto(updatedCourse);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(courseId: string): Promise<void> {
    try {
      const course = await this.courseModel
        .findOneAndDelete({ course_id: courseId })
        .exec();
      if (!course) {
        throw new NotFoundException(`Course with ID ${courseId} not found`);
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async archive(courseId: string): Promise<CourseDetailDto> {
    const course = await this.courseModel
      .findOne({ course_id: courseId })
      .exec();
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    course.isArchived = true;

    try {
      const archivedCourse = await course.save();
      return this.mapCourseToDto(archivedCourse);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async unarchive(courseId: string): Promise<CourseDetailDto> {
    const course = await this.courseModel
      .findOne({ course_id: courseId })
      .exec();
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    course.isArchived = false;

    try {
      const unarchivedCourse = await course.save();
      return this.mapCourseToDto(unarchivedCourse);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  private async validateUser(
    userId: Types.ObjectId,
    role: string,
  ): Promise<void> {
    const user = await this.usersService.findOne(userId.toString());
    if (!user) {
      throw new NotFoundException(`${role} with ID ${userId} not found`);
    }
  }

  private mapCourseToDto(course: Course): CourseDetailDto {
    return {
      course_id: course.course_id,
      name: course.name,
      description: course.description,
      leader: course.leader.toString(),
      staff_id: course.staff_id.toString(),
      isArchived: course.isArchived,
    };
  }
}
