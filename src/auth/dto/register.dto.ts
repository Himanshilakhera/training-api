import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
	IsBoolean,
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
	MinLength,
} from 'class-validator';

export class RegisterDto {
	@ApiProperty({
		description: 'User email address. It must be a valid email format.',
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
		description:
			'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character from @$!%*?&#.',
		example: 'SecurePass1@',
		minLength: 8,
		pattern: '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&#]).+$',
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	@Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#]).+$/, {
		message:
			'password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&#)',
	})
	password: string;

	@ApiPropertyOptional({
		description: 'Whether the user should be registered as a vendor. When omitted or set to false, the user is registered with the CUSTOMER role.',
		example: true,
		type: Boolean,
	})
	@Transform(({ value }) => {
		if (value === 'true') return true;
		if (value === 'false') return false;
		return value;
	})
	@IsOptional()
	@IsBoolean({ message: 'isApprovedVendor must be a boolean value' })
	isApprovedVendor?: boolean;
}
