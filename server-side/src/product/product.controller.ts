import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Put,
    Query,
    UsePipes,
    ValidationPipe
} from '@nestjs/common'; // Импортируем необходимые декораторы и классы из NestJS
import { Auth } from 'src/auth/decorators/auth.decorator'; // Импортируем декоратор аутентификации

import { ProductDto } from './dto/product.dto'; // Импортируем DTO для продуктов
import { ProductService } from './product.service'; // Импортируем ProductService

@Controller('products') // Указываем базовый путь для контроллера
export class ProductController {
    constructor(private readonly productService: ProductService) {} // Инъекция ProductService

	@Get('by-category/:categoryId') // Указываем путь для получения продуктов по ID категории
	async getbyCategory(@Param('categoryId') categoryId: string) {
		return this.productService.getByCategory(categoryId); // Вызов метода сервиса
	}

    @Get() // Указываем путь для получения всех продуктов
    async getAll(@Query('searchTerm') searchTerm?: string) {
        return this.productService.getAll(searchTerm); // Вызов метода сервиса
    }

    @Auth() // Защищаем маршрут аутентификацией
    @Get('by-storeId/:storeId') // Указываем путь для получения продуктов по ID магазина
    async getByStoreId(@Param('storeId') storeId: string) {
        return this.productService.getByStoreId(storeId); // Вызов метода сервиса
    }

    @Get('by-id/:id') // Указываем путь для получения продукта по ID
    async getById(@Param('id') id: string) {
        return this.productService.getById(id); // Вызов метода сервиса
    }



    @Get('most-popular') // Указываем путь для получения самых популярных продуктов
    async getMostPopular() {
        return this.productService.getMostPopular(); // Вызов метода сервиса
    }

    @Get('similar/:id') // Указываем путь для получения похожих продуктов
    async getSimilar(@Param('id') id: string) {
        return this.productService.getSimilar(id); // Вызов метода сервиса
    }

    @UsePipes(new ValidationPipe()) // Используем ValidationPipe для валидации данных
    @HttpCode(200) // Устанавливаем код ответа
    @Auth() // Защищаем маршрут аутентификацией
    @Post(':storeId') // Указываем путь для создания продукта
    async create(@Param('storeId') storeId: string, @Body() dto: ProductDto) {
        return this.productService.create(storeId, dto); // Вызов метода сервиса
    }

    @UsePipes(new ValidationPipe()) // Используем ValidationPipe для валидации данных
    @HttpCode(200) // Устанавливаем код ответа
    @Auth() // Защищаем маршрут аутентификацией
    @Put(':id') // Указываем путь для обновления продукта
    async update(@Param('id') id: string, @Body() dto: ProductDto) {
        return this.productService.update(id, dto); // Вызов метода сервиса
    }

    @HttpCode(200) // Устанавливаем код ответа
    @Auth() // Защищаем маршрут аутентификацией
    @Delete(':id') // Указываем путь для удаления продукта
    async delete(@Param('id') id: string) {
        return this.productService.delete(id); // Вызов метода сервиса
    }
}
