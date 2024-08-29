import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  Res,
  HttpStatus,
  NotFoundException,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { TimetableService } from './timetable.service';
import { CreateTimetableDto } from './dto/create-timetable.dto';
import { RetrieveTimetableDto } from './dto/timetable-detail.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs';
import { Response } from 'express';
import { IsAuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { StaffGuard } from 'src/auth/guards/staff.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Controller('timetables')
@UseGuards(IsAuthenticatedGuard, StaffGuard)
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createTimetableDto: CreateTimetableDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<RetrieveTimetableDto> {
    if (file) {
      const filePath = path.join('uploads', file.filename);
      createTimetableDto.pdf_url = filePath;
    } else {
      throw new BadRequestException('No file provided');
    }

    const newTimetable = await this.timetableService.create(createTimetableDto);

    return newTimetable;
  }

  @Get()
  async findAll(): Promise<RetrieveTimetableDto[]> {
    return this.timetableService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<RetrieveTimetableDto> {
    const timetable = await this.timetableService.findOne(id);
    if (!timetable) {
      throw new NotFoundException(`Timetable with ID ${id} not found`);
    }
    return timetable;
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body() updateTimetableDto: CreateTimetableDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<RetrieveTimetableDto> {
    if (file) {
      const filePath = path.join('uploads', file.filename);
      updateTimetableDto.pdf_url = filePath;
    }

    const updatedTimetable = await this.timetableService.update(
      id,
      updateTimetableDto,
    );
    if (!updatedTimetable) {
      throw new NotFoundException(`Timetable with ID ${id} not found`);
    }
    return updatedTimetable;
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.timetableService.delete(id);
  }

  @Post(':id/archive')
  async archive(@Param('id') id: string): Promise<RetrieveTimetableDto> {
    const archivedTimetable = await this.timetableService.archive(id);
    if (!archivedTimetable) {
      throw new NotFoundException(`Timetable with ID ${id} not found`);
    }
    return archivedTimetable;
  }

  @Post(':id/unarchive')
  async unarchive(@Param('id') id: string): Promise<RetrieveTimetableDto> {
    const unarchivedTimetable = await this.timetableService.unarchive(id);
    if (!unarchivedTimetable) {
      throw new NotFoundException(`Timetable with ID ${id} not found`);
    }
    return unarchivedTimetable;
  }

  @Get('pdf/:filename')
  async getPdf(
    @Param('filename') filename: string,
    @Res() res: Response,
  ): Promise<void> {
    const filePath = path.join('uploads', filename);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath, { root: '.' });
    } else {
      res.status(HttpStatus.NOT_FOUND).send('File not found');
    }
  }
}
