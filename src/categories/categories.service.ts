import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
	constructor(
		@InjectRepository(Category)
		private readonly categoriesRepository: Repository<Category>,
	) { }

	async findAll(): Promise<Category[]> {
		return this.categoriesRepository.find();
	}

	async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
		const existingCategory = await this.categoriesRepository.findOneBy({
			name: createCategoryDto.name,
		});

		if (existingCategory) {
			throw new ConflictException(
				`Category with name "${createCategoryDto.name}" already exists`,
			);
		}

		const category = this.categoriesRepository.create(createCategoryDto);
		return this.categoriesRepository.save(category);
	}

	async findOneWithProducts(id: string): Promise<Category> {
		const category = await this.categoriesRepository.findOne({
			where: { id },
			relations: { products: true },
		});

		if (!category) {
			throw new NotFoundException(`Category with ID ${id} not found`);
		}

		return category;
	}

	async remove(id: string): Promise<{ message: string }> {
		const category = await this.categoriesRepository.findOneBy({ id });

		if (!category) {
			throw new NotFoundException(`Category with ID ${id} not found`);
		}

		await this.categoriesRepository.delete(category.id);

		return {
			message: 'Category deleted successfully',
		};
	}
}
