import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Staff } from './schema/staff.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UserRole } from 'src/users/types/types';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserStaffDto } from './dto/create-user-staff.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { StaffDetailDto } from './dto/staff-detail.dto';
import { UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { ObjectId } from 'mongodb';

@Injectable()
export class StaffService {
  constructor(
    @InjectModel(Staff.name) private staffModel: Model<Staff>,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  async create(createUserStaff: CreateUserStaffDto): Promise<StaffDetailDto> {
    const createUserDto: CreateUserDto = {
      email: createUserStaff.email,
      password: createUserStaff.password,
      role: UserRole.STAFF,
    };

    let savedUser;

    try {
      savedUser = await this.authService.singUp(createUserDto);
    } catch (error) {
      if (error.code && error.code === 11000) {
        throw new BadRequestException(`User with email exists`);
      }
      throw new BadRequestException(error.message);
    }

    const createStaffDto: CreateStaffDto = {
      user_id: savedUser._id.toString(),
      name: createUserStaff.name,
      dob: createUserStaff.dob,
      phone: createUserStaff.phone,
    };

    try {
      const staffCreated = await this.staffModel.create(createStaffDto);

      const staffCreatedDetails: StaffDetailDto = this.mapStaffToDto(
        savedUser,
        staffCreated,
      );

      return staffCreatedDetails;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(search?: string): Promise<StaffDetailDto[]> {
    const query = search
      ? {
          $or: [
            { name: new RegExp(search, 'i') },
            { email: new RegExp(search, 'i') },
          ],
        }
      : {};

    const staffs = await this.staffModel.find(query).exec();
    const staffDetails = await Promise.all(
      staffs.map(async (staff) => {
        const user = await this.usersService.findOne(staff.user_id.toString());
        return this.mapStaffToDto(user, staff);
      }),
    );
    return staffDetails;
  }

  async findOne(id: string): Promise<StaffDetailDto> {
    const staff = await this.staffModel.findOne({ user_id: id }).exec();
    if (!staff) {
      throw new NotFoundException(`Staff with ID ${id} not found`);
    }
    const user = await this.usersService.findOne(staff.user_id.toString());
    return this.mapStaffToDto(user, staff);
  }

  async update(
    id: string,
    updateStaffDto: Partial<CreateUserStaffDto>,
  ): Promise<StaffDetailDto> {
    const userId = new ObjectId(id);

    if (updateStaffDto.email) {
      try {
        await this.usersService.updateUser(userId.toString(), {
          email: updateStaffDto.email,
        });
      } catch (error) {
        if (error.code && error.code === 11000) {
          throw new BadRequestException(`User with email exists`);
        }
        throw new BadRequestException('Invalid email format');
      }
    }

    if (updateStaffDto.password) {
      await this.authService.updatePassword(
        userId.toString(),
        updateStaffDto.password,
      );
    }

    const updatedStaff = await this.staffModel
      .findOneAndUpdate({ user_id: id }, updateStaffDto, { new: true })
      .exec();

    const user = await this.usersService.findOne(userId.toString());
    return this.mapStaffToDto(user, updatedStaff);
  }

  async archive(id: string): Promise<StaffDetailDto> {
    const staff = await this.staffModel
      .findOneAndUpdate({ user_id: id }, { isArchived: true }, { new: true })
      .exec();
    if (!staff) {
      throw new NotFoundException(`Staff with ID ${id} not found`);
    }
    const updatedUser = await this.usersService.findOne(
      staff.user_id.toString(),
    );
    return this.mapStaffToDto(updatedUser, staff);
  }

  async unarchive(id: string): Promise<StaffDetailDto> {
    const staff = await this.staffModel
      .findOneAndUpdate({ user_id: id }, { isArchived: false }, { new: true })
      .exec();
    if (!staff) {
      throw new NotFoundException(`Staff with ID ${id} not found`);
    }
    const updatedUser = await this.usersService.findOne(
      staff.user_id.toString(),
    );
    return this.mapStaffToDto(updatedUser, staff);
  }

  private mapStaffToDto(user: UserDocument, staff: Staff): StaffDetailDto {
    return {
      user_id: user._id.toString(),
      email: user.email,
      name: staff.name,
      phone: staff.phone,
      dob: staff.dob,
      role: user.role,
      isArchived: staff.isArchived,
    };
  }
}
