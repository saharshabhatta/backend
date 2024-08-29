import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  saltOrRounds = 10;
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Password is incorrect');
    }

    const payload = { sub: user._id, email: user.email, role: user.role };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async singUp(payload: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      payload.password,
      this.saltOrRounds,
    );

    const data = {
      ...payload,
      password: hashedPassword,
    };

    const user = await this.usersService.create(data);

    return user;
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, this.saltOrRounds);

    const updatedUser = await this.usersService.updateUser(id, {
      password: hashedPassword,
    });

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
  }
}
