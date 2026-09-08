import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
	constructor(private readonly tasksService: TasksService) {}

	@Get()
	getTasks(@Query() filterDto: GetTasksFilterDto) {
		return this.tasksService.getTasks(filterDto);
	}

	@Get(':id')
	getTaskById(@Param('id') id: string) {
		return this.tasksService.getTaskById(id);
	}

	@Post()
	createTask(@Body() dto: CreateTaskDto) {
		return this.tasksService.createTask(dto);
	}

	@Patch(':id/status')
	updateTaskStatus(
		@Param('id') id: string,
		@Body() dto: UpdateTaskStatusDto,
	) {
		return this.tasksService.updateTaskStatus(id, dto);
	}

	@Delete(':id')
	// @HttpCode(HttpStatus.NO_CONTENT)
	deleteTask(@Param('id') id: string) {
		return this.tasksService.deleteTask(id);
	}
}
