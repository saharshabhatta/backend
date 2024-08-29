import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseCreateDto } from './dto/course-create.dto';
import { CourseDetailDto } from './dto/course-detail.dto';
import { Request } from 'express';
import { IsAuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { StaffGuard } from 'src/auth/guards/staff.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Courses')
@ApiBearerAuth() // Indicates that Bearer Token is required
@UseGuards(IsAuthenticatedGuard)
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @UseGuards(StaffGuard)
  @ApiOperation({ summary: 'Create a new course' })
  @ApiResponse({
    status: 201,
    description: 'The course has been successfully created.',
    type: CourseDetailDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(
    @Body() createCourseDto: CourseCreateDto,
    @Req() req: Request,
  ): Promise<CourseDetailDto> {
    const requestUserId = req['user'].sub;
    return this.courseService.create(createCourseDto, requestUserId);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all courses' })
  @ApiQuery({
    name: 'isArchived',
    required: false,
    type: Boolean,
    description: 'Filter courses by archived status',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search courses by name or ID',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all courses matching the criteria.',
    type: [CourseDetailDto],
  })
  async findAll(
    @Query('isArchived') isArchived?: boolean,
    @Query('search') search?: string,
  ): Promise<CourseDetailDto[]> {
    return this.courseService.findAll(isArchived, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a course by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Course ID' })
  @ApiResponse({
    status: 200,
    description: 'The course details.',
    type: CourseDetailDto,
  })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  async findById(@Param('id') courseId: string): Promise<CourseDetailDto> {
    return this.courseService.findById(courseId);
  }

  @Patch(':id')
  @UseGuards(StaffGuard)
  @ApiOperation({ summary: 'Update a course by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Course ID' })
  @ApiResponse({
    status: 200,
    description: 'The updated course details.',
    type: CourseDetailDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  async update(
    @Param('id') courseId: string,
    @Body() updateCourseDto: Partial<CourseCreateDto>,
    @Req() req: Request,
  ): Promise<CourseDetailDto> {
    const requestUserId = req['user'].sub;
    return this.courseService.update(courseId, updateCourseDto, requestUserId);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Delete a course by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Course ID' })
  @ApiResponse({
    status: 204,
    description: 'The course has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  async delete(@Param('id') courseId: string): Promise<void> {
    return this.courseService.delete(courseId);
  }

  @Patch(':id/archive')
  @UseGuards(StaffGuard)
  @ApiOperation({ summary: 'Archive a course by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Course ID' })
  @ApiResponse({
    status: 200,
    description: 'The course has been successfully archived.',
    type: CourseDetailDto,
  })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  async archive(@Param('id') courseId: string): Promise<CourseDetailDto> {
    return this.courseService.archive(courseId);
  }

  @Patch(':id/unarchive')
  @UseGuards(StaffGuard)
  @ApiOperation({ summary: 'Unarchive a course by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Course ID' })
  @ApiResponse({
    status: 200,
    description: 'The course has been successfully unarchived.',
    type: CourseDetailDto,
  })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  async unarchive(@Param('id') courseId: string): Promise<CourseDetailDto> {
    return this.courseService.unarchive(courseId);
  }
}
