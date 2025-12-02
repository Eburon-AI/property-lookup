import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreatePropertyDto {
  @IsString()
  @MinLength(2)
  title: string;

  @IsString()
  @MinLength(4)
  description: string;

  @IsString()
  @MinLength(2)
  addressLine1: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  addressLine2?: string;

  @IsString()
  @MinLength(2)
  city: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  region?: string;

  @IsString()
  @MinLength(2)
  country: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @IsNumber()
  @Min(0)
  pricePerMonth: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsNumber()
  bedrooms: number;

  @IsNumber()
  bathrooms: number;

  @IsOptional()
  @IsNumber()
  areaSqm?: number;

  @IsArray()
  @IsString({ each: true })
  amenities: string[];

  @IsArray()
  @IsString({ each: true })
  images: string[];
}
