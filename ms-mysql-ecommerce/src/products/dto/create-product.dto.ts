import { IsString, IsNumber, IsOptional, IsBoolean, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CategoryDto {
  @IsString()
  name: string;
}

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price: number;

  @IsNumber()
  stock: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsObject()
  @ValidateNested()
  @Type(() => CategoryDto)
  category: CategoryDto;
}
