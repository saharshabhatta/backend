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
import { StaffService } from './staff.service';
import { CreateUserStaffDto } from './dto/create-user-staff.dto';
import { StaffDetailDto } from './dto/staff-detail.dto';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { IsAuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { IsAdminOrOwnerGuard } from 'src/auth/guards/is-admin-or-owner.guard';
import { Entity } from 'src/auth/decorators/roles.decorator';

@ApiTags('staffs')
@Controller('staffs')
@UseGuards(IsAuthenticatedGuard)
export class StaffController {
  constructor(private staffService: StaffService) {}

  @Post()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Create a new staff member' })
  @ApiBody({ type: CreateUserStaffDto })
  @ApiResponse({
    status: 201,
    description: 'Staff created successfully',
    type: StaffDetailDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  create(@Body() createUserStaff: CreateUserStaffDto): Promise<StaffDetailDto> {
    return this.staffService.create(createUserStaff);
  }

  @Get()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Retrieve a list of all staff members' })
  @ApiResponse({
    status: 200,
    description: 'List of staff members retrieved successfully',
    type: [StaffDetailDto],
  })
  async findAll(@Query('search') search: string): Promise<StaffDetailDto[]> {
    return this.staffService.findAll(search);
  }

  @Get(':id')
  @UseGuards(IsAdminOrOwnerGuard)
  @Entity('User')
  @ApiOperation({ summary: 'Retrieve a staff member by ID' })
  @ApiParam({ name: 'id', description: 'User Id' })
  @ApiResponse({
    status: 200,
    description: 'Staff details retrieved successfully',
    type: StaffDetailDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Staff not found',
  })
  async findOne(@Param('id') id: string): Promise<StaffDetailDto> {
    return this.staffService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update a staff member by ID' })
  @ApiParam({ name: 'id', description: 'User Id' })
  @ApiBody({ type: CreateUserStaffDto, required: false })
  @ApiResponse({
    status: 200,
    description: 'Staff updated successfully',
    type: StaffDetailDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Staff not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateStaffDto: Partial<CreateUserStaffDto>,
  ): Promise<StaffDetailDto> {
    return this.staffService.update(id, updateStaffDto);
  }

  @Patch(':id/archive')
  @UseGuards(AdminGuard)
  async archive(@Param('id') id: string): Promise<StaffDetailDto> {
    return this.staffService.archive(id);
  }

  @Patch(':id/unarchive')
  @UseGuards(AdminGuard)
  async unarchive(@Param('id') id: string): Promise<StaffDetailDto> {
    return this.staffService.unarchive(id);
  }
}
