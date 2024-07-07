import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'The username of the user' })
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @ApiProperty({ description: 'The email of the user' })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  readonly email: string;

  @ApiProperty({ description: 'The password of the user' })
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;

  @ApiProperty({ description: 'The full name of the user' })
  @IsNotEmpty()
  @IsString()
  readonly fullName: string;

  @IsString()
  readonly roles?: string[];
}

