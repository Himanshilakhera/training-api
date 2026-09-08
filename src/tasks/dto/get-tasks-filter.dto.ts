import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskPriority, TaskStatus } from '../models/task.model';

export class GetTasksFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsString()
  search?: string;
}