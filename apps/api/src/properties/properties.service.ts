import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePropertyDto } from './dto/createProperty.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SearchPropertyDto } from './dto/searchProperty.dto';

@Injectable()
export class PropertiesService {
  constructor(private readonly prisma: PrismaService) {}
  async createProperty(createPropertyDto: CreatePropertyDto) {
    const createdProperty = await this.prisma.property.create({
      data: {
        ...createPropertyDto,
      },
    });

    if (!createdProperty)
      throw new BadRequestException('Could not create property');

    return createdProperty;
  }

  async findAll(query: SearchPropertyDto) {
    const {
      q,
      city,
      minPrice,
      maxPrice,
      bedrooms,
      page = 1,
      limit = 20,
    } = query;

    const where: any = {};
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { city: { contains: q, mode: 'insensitive' } },
        { country: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (city) {
      where.city = { equals: city, mode: 'insensitive' };
    }

    if (minPrice !== undefined) {
      where.pricePerMonth.gte = minPrice;
    }
    if (maxPrice !== undefined) {
      where.pricePerMonth.lte = maxPrice;
    }

    if (bedrooms !== undefined) {
      where.bedrooms = bedrooms;
    }
    const skip = (page - 1) * limit;
    const take = limit;

    const properties = await this.prisma.property.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });

    return {
      page,
      limit,
      total: properties.length,
      results: properties,
    };
  }

  async findOne(id: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
    });

    if (!property) throw new BadRequestException('Property not found');

    return property;
  }
}
