import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { StaffGuard } from 'src/auth/guards/staff.guard';
import { Student } from './schema/student.schema';
import { StudentsService } from './students.service';
import { CreateUserStudentDto } from './dto/create-user-student.dto';
import { IsAuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { IsStaffOrOwnerGuard } from 'src/auth/guards/is-staff-or-owner.guard';
import { StudentDetailsDto } from './dto/student-details.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Entity } from 'src/auth/decorators/roles.decorator';

@ApiTags('students')
@Controller('students')
@UseGuards(IsAuthenticatedGuard)
export class StudentsController {
  constructor(private studentService: StudentsService) {}

  @Post('')
  @UseGuards(StaffGuard)
  @ApiOperation({ summary: 'Create a new student' })
  @ApiResponse({
    status: 201,
    description: 'Student created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  async create(@Body() payload: CreateUserStudentDto): Promise<Student> {
    return this.studentService.create(payload);
  }

  @Get()
  @UseGuards(StaffGuard)
  @ApiOperation({ summary: 'Retrieve a list of all students' })
  @ApiResponse({
    status: 200,
    description: 'List of students retrieved successfully',
    type: [StudentDetailsDto],
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string,
  ): Promise<StudentDetailsDto[]> {
    return this.studentService.findAll({ page, limit, search });
  }
  @Get(':id')
  @UseGuards(IsStaffOrOwnerGuard)
  @Entity('User')
  @ApiOperation({ summary: 'Retrieve a student by ID' })
  @ApiParam({ name: 'id', description: 'User Id' })
  @ApiResponse({
    status: 200,
    description: 'Student details retrieved successfully',
    type: StudentDetailsDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  async get(@Param('id') id: string): Promise<StudentDetailsDto> {
    return this.studentService.findById(id);
  }

  @Patch(':id')
  @UseGuards(StaffGuard)
  @ApiOperation({ summary: 'Update a student by ID' })
  @ApiParam({ name: 'id', description: 'User Id' })
  @ApiResponse({
    status: 200,
    description: 'Student updated successfully',
    type: StudentDetailsDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<StudentDetailsDto> {
    return this.studentService.update(id, updateStudentDto);
  }

  @Patch(':id/archive')
  @UseGuards(StaffGuard)
  @ApiOperation({ summary: 'Archive a student by ID' })
  @ApiParam({ name: 'id', description: 'User Id' })
  @ApiResponse({
    status: 200,
    description: 'Student archived successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  async archiveStudent(@Param('id') id: string) {
    return this.studentService.archiveStudent(id);
  }

  @Patch(':id/unarchive')
  @UseGuards(StaffGuard)
  @ApiOperation({ summary: 'Unarchive a student by ID' })
  @ApiParam({ name: 'id', description: 'User Id' })
  @ApiResponse({
    status: 200,
    description: 'Student unarchived successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  async unarchiveStudent(@Param('id') id: string) {
    return this.studentService.unarchiveStudent(id);
  }
}
