import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PropertiesModule } from 'src/properties/properties.module';

@Module({
  imports: [PrismaModule, PropertiesModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
