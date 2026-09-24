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
import {
	ApiBearerAuth,
	ApiOperation,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger';
import { ApiErrorResponse } from '../common/swagger/api-error-response';
import { ApiSuccessResponse } from '../common/swagger/api-success-response';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { DeleteCategoryResponseDto } from './dto/delete-category-response.dto';
import { CategoryProductsResponseDto } from '../products/dto/product-response.dto';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
	constructor(private readonly categoriesService: CategoriesService) { }

	@Get()
	@ApiOperation({
		summary: 'Get all categories',
		description: 'Returns every category in the system.',
	})
	@ApiSuccessResponse(CategoryResponseDto, {
		status: 200,
		description: 'Categories retrieved successfully.',
		isArray: true,
	})
	findAll(): Promise<CategoryResponseDto[]> {
		return this.categoriesService.findAll() as Promise<CategoryResponseDto[]>;
	}

	@Post()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN)
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({
		summary: 'Create a category',
		description:
			'Creates a new category. This endpoint requires authentication and the admin role.',
	})
	@ApiSuccessResponse(CategoryResponseDto, {
		status: 201,
		description: 'Category created successfully.',
	})
	@ApiErrorResponse(400, 'Validation failed for the category payload.', 'Invalid category payload')
	@ApiErrorResponse(401, 'Authentication is missing or invalid.', 'Unauthorized')
	@ApiErrorResponse(403, 'The current user does not have admin privileges.', 'Forbidden resource')
	@ApiErrorResponse(409, 'A category with this name already exists.', 'Category name is already registered')

	create(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
		return this.categoriesService.create(createCategoryDto) as Promise<CategoryResponseDto>;
	}

	@Get(':id/products')
	@ApiOperation({
		summary: 'Get a category with its products',
		description:
			'Returns a category and all products associated with it by the category ID.',
	})
	@ApiParam({
		name: 'id',
		description: 'The category ID.',
		type: String,
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@ApiSuccessResponse(CategoryProductsResponseDto, {
		status: 200,
		description: 'Category retrieved successfully.',
	})
	@ApiErrorResponse(404, 'Category not found.', 'Category not found')
	findOneWithProducts(@Param('id') id: string): Promise<CategoryProductsResponseDto> {
		return this.categoriesService.findOneWithProducts(id) as Promise<CategoryProductsResponseDto>;
	}

	@Delete(':id')
	@ApiOperation({
		summary: 'Delete a category',
		description: 'Deletes an existing category by its unique identifier.',
	})
	@ApiParam({
		name: 'id',
		description: 'The category ID to delete.',
		type: String,
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@ApiSuccessResponse(DeleteCategoryResponseDto, {
		status: 200,
		description: 'Category deleted successfully.',
	})
	@ApiErrorResponse(400, 'The category ID is not a valid UUID.', 'Invalid UUID format')
	@ApiErrorResponse(404, 'Category not found.', 'Category not found')
	remove(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<DeleteCategoryResponseDto> {
		return this.categoriesService.remove(id) as Promise<DeleteCategoryResponseDto>;
	}
}
