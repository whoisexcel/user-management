import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'The email of the user' })
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @ApiProperty({ description: 'The full name of the user' })
  @IsOptional()
  @IsString()
  readonly fullName?: string;

  @IsOptional()
  @IsString()
  readonly role?: string;
}
