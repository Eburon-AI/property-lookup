import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';
import { getSafeUser } from 'src/helpers/safeUser';
import { generateAccessToken } from 'src/helpers/jwt';
import { UpdateUserDto } from './dto/updateUser.dto';
@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllUsers() {
    try {
      const users = await this.prisma.user.findMany();
      return users;
    } catch (error) {
      throw new BadRequestException('Unable to fetch users', error);
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    const candidate = await this.prisma.user.findFirst({
      where: { email: createUserDto.email },
    });

    if (candidate)
      throw new BadRequestException('User with this email already exists');

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      Number(process.env.SALT_ROUNDS) || 10,
    );

    if (!hashedPassword)
      throw new BadRequestException('Error hashing password');

    const newUser = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    //todo: send invitation email to user

    if (!newUser) throw new BadRequestException('Error creating user');
    const safeUser = getSafeUser(newUser);
    const accessToken = generateAccessToken(safeUser);

    return { user: safeUser, accessToken };
  }

  async editUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: {
          ...updateUserDto,
        },
      });
    } catch {
      throw new BadRequestException('Error updating user');
    }
  }
}
