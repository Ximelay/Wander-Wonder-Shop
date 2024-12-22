import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    UsePipes,
    ValidationPipe
} from '@nestjs/common'; // Импортируем необходимые декораторы и классы из NestJS
import { Auth } from 'src/auth/decorators/auth.decorator'; // Импортируем декоратор аутентификации
import { CurrentUser } from 'src/user/decorators/user.decorator'; // Импортируем декоратор для получения текущего пользователя
import { ReviewDto } from './dto/review.dto'; // Импортируем DTO для отзывов
import { ReviewService } from './review.service'; // Импортируем ReviewService

@Controller('reviews') // Указываем базовый путь для контроллера
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {} // Инъекция ReviewService

    @Auth() // Защищаем маршрут аутентификацией
    @Get('by-storeId/:storeId') // Указываем путь для получения отзывов по ID магазина
    async getByStoreId(@Param('storeId') storeId: string) {
        return this.reviewService.getByStoreId(storeId); // Вызов метода сервиса
    }

    @UsePipes(new ValidationPipe()) // Используем ValidationPipe для валидации данных
    @HttpCode(200) // Устанавливаем код ответа
    @Auth() // Защищаем маршрут аутентификацией
    @Post(':productId/:storeId') // Указываем путь для создания отзыва
    async create(
        @CurrentUser('id') userId: string, // Получаем ID текущего пользователя
        @Param('productId') productId: string, // Получаем ID продукта
        @Param('storeId') storeId: string, // Получаем ID магазина
        @Body() dto: ReviewDto // Получаем данные отзыва
    ) {
        return this.reviewService.create(userId, productId, storeId, dto); // Вызов метода сервиса
    }

    @HttpCode(200) // Устанавливаем код ответа
    @Auth() // Защищаем маршрут аутентификацией
    @Delete(':id') // Указываем путь для удаления отзыва
    async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
        return this.reviewService.delete(id, userId); // Вызов метода сервиса
    }
}
