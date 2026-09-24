import { ApiProperty } from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from '../models/task.model';

export class TaskResponseDto {
  @ApiProperty({
    description: 'Unique task identifier.',
    example: '1',
  })
  id: string;

  @ApiProperty({
    description: 'Task title.',
    example: 'Prepare sprint backlog',
  })
  title: string;

  @ApiProperty({
    description: 'Task description.',
    example: 'Review the backlog and confirm priorities for the upcoming sprint.',
  })
  description: string;

  @ApiProperty({
    description: 'Current task status.',
    enum: TaskStatus,
    example: TaskStatus.OPEN,
  })
  status: TaskStatus;

  @ApiProperty({
    description: 'Task priority level.',
    enum: TaskPriority,
    example: TaskPriority.HIGH,
  })
  priority: TaskPriority;

  @ApiProperty({
    description: 'Task due date in ISO 8601 format.',
    example: '2026-09-30T17:00:00.000Z',
  })
  dueDate: string;

  @ApiProperty({
    description: 'Date when the task was created.',
    example: '2026-09-24T08:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the task was last updated.',
    example: '2026-09-24T08:15:00.000Z',
    type: String,
    format: 'date-time',
  })
  updatedAt: Date;
}

export class DeleteTaskResponseDto {
  @ApiProperty({
    description: 'Status message returned after deleting a task.',
    example: 'Task deleted successfully',
  })
  message: string;
}
