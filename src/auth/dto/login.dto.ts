import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
	@ApiProperty({
		description: 'User email address used to sign in.',
		example: 'john.doe@example.com',
		format: 'email',
	})
	@Transform(({ value }) =>
		typeof value === 'string' ? value.trim().toLowerCase() : value,
	)
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty({
		description: 'User password for authentication.',
		example: 'SecurePass1@',
	})
	@IsString()
	@IsNotEmpty()
	password: string;
}
