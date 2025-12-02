import { CreateUserDto } from './dto/createUser.dto';
import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { UserRole } from '@eburon/db';
import { CreatePropertyDto } from '../properties/dto/createProperty.dto';
import { PropertiesService } from 'src/properties/properties.service';

@Controller('admin')
@UseGuards(new JwtAuthGuard([UserRole.ADMIN]))
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly propertyService: PropertiesService,
  ) {}

  @Get('users')
  async getAllUsers() {
    return await this.adminService.findAllUsers();
  }

  @Post('users')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.adminService.createUser(createUserDto);
  }

  @Post('properties')
  async createProperty(@Body() createPropertyDto: CreatePropertyDto) {
    return await this.propertyService.createProperty(createPropertyDto);
  }

  @Patch('users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.adminService.editUser(id, updateUserDto);
  }
}
