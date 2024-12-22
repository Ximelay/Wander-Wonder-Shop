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
import { ColorService } from './color.service'; // Импортируем ColorService
import { ColorDto } from './dto/color.dto'; // Импортируем DTO для цветов

@Controller('colors') // Указываем базовый путь для контроллера
export class ColorController {
    constructor(private readonly colorService: ColorService) {} // Инъекция ColorService

    @Auth() // Защищаем маршрут аутентификацией
    @Get('by-storeId/:storeId') // Указываем путь для получения цветов по ID магазина
    async getByStoreId(@Param('storeId') storeId: string) {
        return this.colorService.getByStoreId(storeId); // Вызов метода сервиса
    }

    @Auth() // Защищаем маршрут аутентификацией
    @Get('by-id/:id') // Указываем путь для получения цвета по ID
    async getById(@Param('id') id: string) {
        return this.colorService.getById(id); // Вызов метода сервиса
    }

    @UsePipes(new ValidationPipe()) // Используем ValidationPipe для валидации данных
    @HttpCode(200) // Устанавливаем код ответа
    @Auth() // Защищаем маршрут аутентификацией
    @Post(':storeId') // Указываем путь для создания цвета
    async create(@Param('storeId') storeId: string, @Body() dto: ColorDto) {
        return this.colorService.create(storeId, dto); // Вызов метода сервиса
    }

    @UsePipes(new ValidationPipe()) // Используем ValidationPipe для валидации данных
    @HttpCode(200) // Устанавливаем код ответа
    @Auth() // Защищаем маршрут аутентификацией
    @Put(':id') // Указываем путь для обновления цвета
    async update(@Param('id') id: string, @Body() dto: ColorDto) {
        return this.colorService.update(id, dto); // Вызов метода сервиса
    }

    @HttpCode(200) // Устанавливаем код ответа
    @Auth() // Защищаем маршрут аутентификацией
    @Delete(':id') // Указываем путь для удаления цвета
    async delete(@Param('id') id: string) {
        return this.colorService.delete(id); // Вызов метода сервиса
    }
}
