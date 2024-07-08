import { IsOptional, IsString, IsEmail, IsNumber, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetUsersFilterDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Filter by username' })
  username?: string;

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({ description: 'Filter by email' })
  email?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @ApiPropertyOptional({ description: 'Page number', minimum: 1 })
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @ApiPropertyOptional({ description: 'Limit of items per page', minimum: 1 })
  limit?: number;
}
