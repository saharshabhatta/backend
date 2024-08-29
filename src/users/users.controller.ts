import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { StaffGuard } from 'src/auth/guards/staff.guard';
import { IsAuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@ApiTags('users')
@Controller('users')
@UseGuards(IsAuthenticatedGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('')
  @UseGuards(StaffGuard)
  @ApiOperation({ summary: 'Retrieve a list of all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully',
    type: [User],
  })
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async delete(@Param('id') id: string) {
    const user = await this.usersService.delete(id);
    return user;
  }
}
