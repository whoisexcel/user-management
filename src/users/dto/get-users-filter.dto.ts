// src/users/dto/get-users-filter.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class GetUsersFilterDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  email?: string;
}
