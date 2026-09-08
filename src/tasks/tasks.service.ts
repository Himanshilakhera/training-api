import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task, TaskStatus } from './models/task.model';

@Injectable()
export class TasksService {
    
    private readonly logger = new Logger(TasksService.name);
    private readonly tasks: Task[] = [];
    private nextId = 1;

    getTasks(filterDto: GetTasksFilterDto = {}): Task[] {
        const { status, priority, search } = filterDto;
        const normalizedSearch = search?.toLowerCase();

        return this.tasks.filter(
            (task) =>
                (!status || task.status === status) &&
                (!priority || task.priority === priority) &&
                (!normalizedSearch ||
                    task.title.toLowerCase().includes(normalizedSearch) ||
                    task.description.toLowerCase().includes(normalizedSearch)),
        );
    }

    getTaskById(id: string): Task {
        const task = this.tasks.find((item) => item.id === id);

        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }

        return task;
    }

    createTask(dto: CreateTaskDto): Task {
        const timestamp = new Date();
        const task: Task = {
            id: String(this.nextId++),
            title: dto.title,
            description: dto.description ?? '',
            priority: dto.priority,
            dueDate: dto.dueDate,
            status: TaskStatus.OPEN,
            createdAt: timestamp,
            updatedAt: timestamp,
        };

        this.tasks.push(task);
        return task;
    }

    updateTaskStatus(id: string, dto: UpdateTaskStatusDto): Task {
        const task = this.getTaskById(id);
        task.status = dto.status;
        task.updatedAt = new Date();
        return task;
    }

    deleteTask(id: string) {
        const taskIndex = this.tasks.findIndex((task) => task.id === id);

        if (taskIndex === -1) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }

        this.tasks.splice(taskIndex, 1);
        this.logger.log(`Task deleted: ${id}`);
        return {
            message: 'Task deleted successfully',
        };
    }
}
