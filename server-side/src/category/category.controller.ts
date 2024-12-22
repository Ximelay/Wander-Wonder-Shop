import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Put,
    UsePipes,
    ValidationPipe
} from '@nestjs/common'; // Импортируем необходимые декораторы и классы из NestJS
import { Auth } from 'src/auth/decorators/auth.decorator'; // Импортируем декоратор аутентификации
import { CategoryService } from './category.service'; // Импортируем CategoryService
import { CategoryDto } from './dto/category.dto'; // Импортируем DTO для категорий

@Controller('categories') // Указываем базовый путь для контроллера
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {} // Инъекция CategoryService

    @Auth() // Защищаем маршрут аутентификацией
    @Get('by-storeId/:storeId') // Указываем путь для получения категорий по ID магазина
    async getByStoreId(@Param('storeId') storeId: string) {
        return this.categoryService.getByStoreId(storeId); // Вызов метода сервиса
    }

    @Get('by-id/:id') // Указываем путь для получения категории по ID
    async getById(@Param('id') id: string) {
        return this.categoryService.getById(id); // Вызов метода сервиса
    }

    @UsePipes(new ValidationPipe()) // Используем ValidationPipe для валидации данных
    @HttpCode(200) // Устанавливаем код ответа
    @Auth() // Защищаем маршрут аутентификацией
    @Post(':storeId') // Указываем путь для создания категории
    async create(@Param('storeId') storeId: string, @Body() dto: CategoryDto) {
        return this.categoryService.create(storeId, dto); // Вызов метода сервиса
    }

    @UsePipes(new ValidationPipe()) // Используем ValidationPipe для валидации данных
    @HttpCode(200) // Устанавливаем код ответа
    @Auth() // Защищаем маршрут аутентификацией
    @Put(':id') // Указываем путь для обновления категории
    async update(@Param('id') id: string, @Body() dto: CategoryDto) {
        return this.categoryService.update(id, dto); // Вызов метода сервиса
    }

    @HttpCode(200) // Устанавливаем код ответа
    @Auth() // Защищаем маршрут аутентификацией
    @Delete(':id') // Указываем путь для удаления категории
    async delete(@Param('id') id: string) {
        return this.categoryService.delete(id); // Вызов метода сервиса
    }
}
