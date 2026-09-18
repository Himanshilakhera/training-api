import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseUUIDPipe,
	Post,
	UseGuards,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('categories')
export class CategoriesController {
	constructor(private readonly categoriesService: CategoriesService) { }

	@Get()
	findAll(): Promise<Category[]> {
		return this.categoriesService.findAll();
	}
	@Post()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN)
	create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
		return this.categoriesService.create(createCategoryDto);
	}

	@Get(':id/products')
	findOneWithProducts(@Param('id') id: string): Promise<Category> {
		return this.categoriesService.findOneWithProducts(id);
	}

	@Delete(':id')
	remove(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<{ message: string }> {
		return this.categoriesService.remove(id);
	}
}
