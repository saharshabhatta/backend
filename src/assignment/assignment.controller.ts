import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  HttpStatus,
  UseGuards,
  Patch,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { AssignmentService } from './assignment.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { AssignmentDetailDto } from './dto/assignment-detail.dto';
import { IsAuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { StaffGuard } from 'src/auth/guards/staff.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@UseGuards(IsAuthenticatedGuard)
@ApiTags('assignments')
@Controller('assignments')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @UseGuards(StaffGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('assignment_file', {
      storage: diskStorage({
        destination: './uploads/assignments', // directory to store uploaded files
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  @ApiOperation({ summary: 'Create a new assignment' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create Assignment DTO with file upload',
    type: CreateAssignmentDto,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The assignment has been successfully created.',
    type: AssignmentDetailDto,
  })
  async create(
    @Body() createAssignmentDto: CreateAssignmentDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<AssignmentDetailDto> {
    const assignmentUrl = `/uploads/assignments/${file.filename}`;
    return this.assignmentService.create(createAssignmentDto, assignmentUrl);
  }

  @Get()
  @ApiOperation({ summary: 'Get all assignments with optional search' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all assignments, sorted by closest deadline first',
    type: [AssignmentDetailDto],
  })
  async findAll(
    @Query('search') search?: string,
  ): Promise<AssignmentDetailDto[]> {
    return this.assignmentService.findAll(search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get assignment by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Details of the assignment',
    type: AssignmentDetailDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Assignment not found',
  })
  async findOne(@Param('id') id: string): Promise<AssignmentDetailDto> {
    return this.assignmentService.findOne(id);
  }

  // @UseGuards(StaffGuard)
  // @Patch(':id')
  // @UseInterceptors(
  //   FileInterceptor('assignment_file', {
  //     storage: diskStorage({
  //       destination: './uploads/assignments',
  //       filename: (req, file, callback) => {
  //         const uniqueSuffix =
  //           Date.now() + '-' + Math.round(Math.random() * 1e9);
  //         const ext = extname(file.originalname);
  //         callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  //       },
  //     }),
  //   }),
  // )
  // @ApiOperation({ summary: 'Update an assignment' })
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   description: 'Update Assignment DTO with file upload',
  //   type: CreateAssignmentDto,
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'The assignment has been successfully updated.',
  //   type: AssignmentDetailDto,
  // })
  // @ApiResponse({
  //   status: HttpStatus.NOT_FOUND,
  //   description: 'Assignment not found',
  // })
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateAssignmentDto: Partial<CreateAssignmentDto>,
  //   @UploadedFile() file?: Express.Multer.File,
  // ): Promise<AssignmentDetailDto> {
  //   let assignmentUrl: string | undefined;
  //   if (file) {
  //     assignmentUrl = `/uploads/assignments/${file.filename}`;
  //   }
  //   return this.assignmentService.update(
  //     id,
  //     updateAssignmentDto,
  //     assignmentUrl,
  //   );
  // }

  @UseGuards(StaffGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an assignment' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The assignment has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Assignment not found',
  })
  async delete(@Param('id') id: string): Promise<void> {
    return this.assignmentService.delete(id);
  }

  @UseGuards(StaffGuard)
  @Patch(':id/archive')
  @ApiOperation({ summary: 'Archive an assignment' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The assignment has been successfully archived.',
    type: AssignmentDetailDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Assignment not found',
  })
  async archive(@Param('id') id: string): Promise<AssignmentDetailDto> {
    return this.assignmentService.archive(id);
  }

  @UseGuards(StaffGuard)
  @Patch(':id/unarchive')
  @ApiOperation({ summary: 'Unarchive an assignment' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The assignment has been successfully unarchived.',
    type: AssignmentDetailDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Assignment not found',
  })
  async unarchive(@Param('id') id: string): Promise<AssignmentDetailDto> {
    return this.assignmentService.unarchive(id);
  }
}
