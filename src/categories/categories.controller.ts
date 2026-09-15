import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseUUIDPipe,
	Post,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
	constructor(private readonly categoriesService: CategoriesService) { }

	@Get()
	findAll(): Promise<Category[]> {
		return this.categoriesService.findAll();
	}
	@Post()
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
