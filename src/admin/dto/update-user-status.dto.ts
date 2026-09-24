import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateUserStatusDto {
  @ApiProperty({
    description: 'Whether the user account should be active or inactive.',
    type: Boolean,
    example: true,
  })
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean({ message: 'isActive must be a boolean value' })
  @IsNotEmpty({ message: 'isActive is required' })
  isActive: boolean;
}
