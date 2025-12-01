import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@eburon/db';
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    try {
      await this.$connect();
    } catch (err) {
      if (err instanceof Error) {
        console.error('Prisma connect failed:', err.message);
      } else {
        console.error('Prisma connect failed:', err);
      }
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
    } catch (err) {
      if (err instanceof Error) {
        console.error('Prisma disconnect failed:', err.message);
      } else {
        console.error('Prisma disconnect failed:', err);
      }
    }
  }
}
