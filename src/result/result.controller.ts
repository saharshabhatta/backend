import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ResultService } from './result.service';
import { CreateResultDto } from './dto/create-result.dto';
import { ResultDetailDto } from './dto/result-detail.dto';
import { IsAuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { StaffGuard } from 'src/auth/guards/staff.guard';
import { IsStaffOrOwnerGuard } from 'src/auth/guards/is-staff-or-owner.guard';
import { Entity } from 'src/auth/decorators/roles.decorator';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@ApiTags('results')
@UseGuards(IsAuthenticatedGuard)
@Controller('results')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new result' })
  @ApiResponse({
    status: 201,
    description: 'The result has been successfully created.',
    type: ResultDetailDto,
  })
  @ApiResponse({ status: 404, description: 'Student or module not found.' })
  @ApiBody({ type: CreateResultDto })
  @UseGuards(StaffGuard)
  async createResult(
    @Body() createResultDto: CreateResultDto,
    @Req() req: Request,
  ): Promise<ResultDetailDto> {
    return this.resultService.createResult(createResultDto, req);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all results' })
  @ApiResponse({
    status: 200,
    description: 'List of results',
    type: [ResultDetailDto],
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by module code',
  })
  @UseGuards(StaffGuard)
  async findAll(@Query('search') search?: string): Promise<ResultDetailDto[]> {
    return this.resultService.findAll(search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific result by ID' })
  @ApiResponse({
    status: 200,
    description: 'Result found',
    type: ResultDetailDto,
  })
  @ApiResponse({ status: 404, description: 'Result not found.' })
  @ApiParam({ name: 'id', description: 'Result ID' })
  @UseGuards(IsStaffOrOwnerGuard)
  @Entity('User')
  async findOne(@Param('id') id: string): Promise<ResultDetailDto> {
    return this.resultService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific result by ID' })
  @ApiResponse({
    status: 200,
    description: 'Result has been updated.',
    type: ResultDetailDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Student, module, or result not found.',
  })
  @ApiParam({ name: 'id', description: 'Result ID' })
  @ApiBody({ type: CreateResultDto })
  @UseGuards(StaffGuard)
  async updateResult(
    @Param('id') id: string,
    @Body() updateResultDto: Partial<CreateResultDto>,
    @Req() req: Request,
  ): Promise<ResultDetailDto> {
    return this.resultService.updateResult(id, updateResultDto, req);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a result by ID' })
  @ApiResponse({
    status: 200,
    description: 'Result has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Result not found.' })
  @ApiParam({ name: 'id', description: 'Result ID' })
  @UseGuards(AdminGuard)
  async deleteResult(@Param('id') id: string): Promise<void> {
    await this.resultService.deleteResult(id);
  }

  @Patch(':id/archive')
  @ApiOperation({ summary: 'Archive a specific result by ID' })
  @ApiResponse({
    status: 200,
    description: 'Result has been archived.',
    type: ResultDetailDto,
  })
  @ApiResponse({ status: 404, description: 'Result not found.' })
  @ApiParam({ name: 'id', description: 'Result ID' })
  @UseGuards(StaffGuard)
  async archiveResult(@Param('id') id: string): Promise<ResultDetailDto> {
    return this.resultService.archiveResult(id);
  }

  @Patch(':id/unarchive')
  @ApiOperation({ summary: 'Unarchive a specific result by ID' })
  @ApiResponse({
    status: 200,
    description: 'Result has been unarchived.',
    type: ResultDetailDto,
  })
  @ApiResponse({ status: 404, description: 'Result not found.' })
  @ApiParam({ name: 'id', description: 'Result ID' })
  @UseGuards(StaffGuard)
  async unarchiveResult(@Param('id') id: string): Promise<ResultDetailDto> {
    return this.resultService.unarchiveResult(id);
  }
}
