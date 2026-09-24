import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import {
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiTags,
} from '@nestjs/swagger';
import { ApiErrorResponse } from '../common/swagger/api-error-response';
import { ApiSuccessResponse } from '../common/swagger/api-success-response';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { DeleteTaskResponseDto, TaskResponseDto } from './dto/task-response.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TasksService } from './tasks.service';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
	constructor(private readonly tasksService: TasksService) {}

	@Get()
	@ApiOperation({
		summary: 'Get all tasks',
		description: 'Returns all tasks, with optional filtering by status, priority, or a text search term.',
	})
	@ApiQuery({
		name: 'status',
		required: false,
		enum: ['OPEN', 'IN_PROGRESS', 'DONE'],
		description: 'Filter tasks by status.',
		example: 'OPEN',
	})
	@ApiQuery({
		name: 'priority',
		required: false,
		enum: ['LOW', 'MEDIUM', 'HIGH'],
		description: 'Filter tasks by priority.',
		example: 'HIGH',
	})
	@ApiQuery({
		name: 'search',
		required: false,
		type: String,
		description: 'Search term used to match the task title or description.',
		example: 'sprint',
	})
	@ApiSuccessResponse(TaskResponseDto, {
		status: 200,
		description: 'Tasks retrieved successfully.',
		isArray: true,
	})
	@ApiErrorResponse(400, 'Validation failed for the query parameters.', 'Invalid task filter')
	getTasks(@Query() filterDto: GetTasksFilterDto) {
		return this.tasksService.getTasks(filterDto);
	}

	@Get(':id')
	@ApiOperation({
		summary: 'Get a task by ID',
		description: 'Returns a single task by its unique identifier.',
	})
	@ApiParam({
		name: 'id',
		description: 'Task identifier.',
		example: '1',
	})
	@ApiSuccessResponse(TaskResponseDto, {
		status: 200,
		description: 'Task retrieved successfully.',
	})
	@ApiErrorResponse(404, 'Task not found.', 'Task with ID 1 not found')
	getTaskById(@Param('id') id: string) {
		return this.tasksService.getTaskById(id);
	}

	@Post()
	@ApiOperation({
		summary: 'Create a task',
		description: 'Creates a new task with the supplied title, description, priority, and due date.',
	})
	@ApiSuccessResponse(TaskResponseDto, {
		status: 201,
		description: 'Task created successfully.',
	})
	@ApiErrorResponse(400, 'Validation failed for the task payload.', 'Invalid task payload')
	createTask(@Body() dto: CreateTaskDto) {
		return this.tasksService.createTask(dto);
	}

	@Patch(':id/status')
	@ApiOperation({
		summary: 'Update task status',
		description: 'Updates the status of an existing task.',
	})
	@ApiParam({
		name: 'id',
		description: 'Task identifier.',
		example: '1',
	})
	@ApiSuccessResponse(TaskResponseDto, {
		status: 200,
		description: 'Task status updated successfully.',
	})
	@ApiErrorResponse(400, 'Validation failed for the update payload.', 'Invalid task status')
	@ApiErrorResponse(404, 'Task not found.', 'Task with ID 1 not found')
	updateTaskStatus(
		@Param('id') id: string,
		@Body() dto: UpdateTaskStatusDto,
	) {
		return this.tasksService.updateTaskStatus(id, dto);
	}

	@Delete(':id')
	@ApiOperation({
		summary: 'Delete a task',
		description: 'Deletes an existing task by its unique identifier.',
	})
	@ApiParam({
		name: 'id',
		description: 'Task identifier.',
		example: '1',
	})
	@ApiSuccessResponse(DeleteTaskResponseDto, {
		status: 200,
		description: 'Task deleted successfully.',
	})
	@ApiErrorResponse(404, 'Task not found.', 'Task with ID 1 not found')
	deleteTask(@Param('id') id: string) {
		return this.tasksService.deleteTask(id);
	}
}
