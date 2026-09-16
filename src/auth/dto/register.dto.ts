import { Transform } from 'class-transformer';
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	Matches,
	MinLength,
} from 'class-validator';

export class RegisterDto {
	@Transform(({ value }) =>
		typeof value === 'string' ? value.trim().toLowerCase() : value,
	)
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	@Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#]).+$/, {
		message:
			'password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&#)',
	})
	password: string;
}
