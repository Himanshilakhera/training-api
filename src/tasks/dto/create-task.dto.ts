import { IsEnum, IsISO8601, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { TaskPriority } from '../models/task.model';

export class CreateTaskDto {
  @IsString()
  @MinLength(3)
  @MaxLength(60)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @IsISO8601()
  dueDate: string;
}