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
import { CurrentUser } from 'src/user/decorators/user.decorator'; // Импортируем декоратор для получения текущего пользователя
import { CreateStoreDto } from './dto/create-store.dto'; // Импортируем DTO для создания магазина
import { UpdateStoreDto } from './dto/update-store.dto'; // Импортируем DTO для обновления магазина
import { StoreService } from './store.service'; // Импортируем StoreService

@Controller('stores') // Указываем базовый путь для контроллера
export class StoreController {
    constructor(private readonly storeService: StoreService) {} // Инъекция StoreService

    @Auth() // Защищаем маршрут аутентификацией
    @Get('by-id/:id') // Указываем путь для получения магазина по ID
    async getById(
        @Param('id') storeId: string, // Получаем ID магазина
        @CurrentUser('id') userId: string // Получаем ID текущего пользователя
    ) {
        return this.storeService.getById(storeId, userId); // Вызов метода сервиса
    }

    @UsePipes(new ValidationPipe()) // Используем ValidationPipe для валидации данных
    @HttpCode(200) // Устанавливаем код ответа
    @Auth() // Защищаем маршрут аутентификацией
    @Post() // Указываем путь для создания магазина
    async create(
        @CurrentUser('id') userId: string, // Получаем ID текущего пользователя
        @Body() dto: CreateStoreDto // Получаем данные для создания магазина
    ) {
        return this.storeService.create(userId, dto); // Вызов метода сервиса
    }

    @UsePipes(new ValidationPipe()) // Используем ValidationPipe для валидации данных
    @HttpCode(200) // Устанавливаем код ответа
    @Auth() // Защищаем маршрут аутентификацией
    @Put(':id') // Указываем путь для обновления магазина
    async update(
        @Param('id') storeId: string, // Получаем ID магазина
        @CurrentUser('id') userId: string, // Получаем ID текущего пользователя
        @Body() dto: UpdateStoreDto // Получаем данные для обновления магазина
    ) {
        return this.storeService.update(storeId, userId, dto); // Вызов метода сервиса
    }

    @HttpCode(200) // Устанавливаем код ответа
    @Auth() // Защищаем маршрут аутентификацией
    @Delete(':id') // Указываем путь для удаления магазина
    async delete(
        @Param('id') storeId: string, // Получаем ID магазина
        @CurrentUser('id') userId: string // Получаем ID текущего пользователя
    ) {
        return this.storeService.delete(storeId, userId); // Вызов метода сервиса
    }
}
