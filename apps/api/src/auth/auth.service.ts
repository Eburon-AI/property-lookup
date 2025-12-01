import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { getSafeUser } from 'src/helpers/safeUser';
import { SafeUserType } from 'src/types/safeUserType';
import { generateAccessToken } from 'src/helpers/jwt';
@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; user: SafeUserType }> {
    const candidate = await this.prisma.user.findFirst({
      where: { email: loginDto.email },
    });

    if (!candidate) throw new BadRequestException('Invalid credentials');

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      candidate.password,
    );
    if (!isValidPassword) throw new BadRequestException('Invalid credentials');

    const safeUser = getSafeUser({ ...candidate });
    const accessToken = generateAccessToken(safeUser);

    if (!accessToken)
      throw new BadRequestException('Could not generate access token');

    return { accessToken, user: safeUser };
  }
}
