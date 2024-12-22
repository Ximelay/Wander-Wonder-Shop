import { Injectable, NotFoundException } from '@nestjs/common'; // Импортируем необходимые классы из NestJS
import { PrismaService } from 'src/prisma.service'; // Импортируем PrismaService для работы с базой данных
import { ProductService } from 'src/product/product.service'; // Импортируем ProductService для работы с продуктами
import { ReviewDto } from './dto/review.dto'; // Импортируем DTO для отзывов

@Injectable()
export class ReviewService {
    constructor(
        private prisma: PrismaService, // Инъекция PrismaService
        private productService: ProductService // Инъекция ProductService
    ) {}

    // Метод для получения отзывов по ID магазина
    async getByStoreId(storeId: string) {
        return this.prisma.review.findMany({
            where: {
                storeId // Условие для поиска отзывов по ID магазина
            },
            include: {
                user: true // Включаем информацию о пользователе, оставившем отзыв
            }
        });
    }

    // Метод для получения отзыва по ID и ID пользователя
    async getById(id: string, userId: string) {
        const review = await this.prisma.review.findUnique({
            where: {
                id, // Условие для поиска отзыва по ID
                userId // Условие для проверки владельца отзыва
            },
            include: {
                user: true // Включаем информацию о пользователе
            }
        });

        if (!review)
            throw new NotFoundException(
                'Отзыв не найден или вы не являетесь его владельцем' // Если отзыв не найден, выбрасываем исключение
            );

        return review; // Возвращаем найденный отзыв
    }

    // Метод для создания нового отзыва
    async create(
        userId: string,
        productId: string,
        storeId: string,
        dto: ReviewDto // Данные отзыва
    ) {
        await this.productService.getById(productId); // Проверяем, существует ли продукт

        return this.prisma.review.create({
            data: {
                ...dto, // Данные отзыва
                product: {
                    connect: {
                        id: productId // Подключаем продукт по ID
                    }
                },
                user: {
                    connect: {
                        id: userId // Подключаем пользователя по ID
                    }
                },
                store: {
                    connect: {
                        id: storeId // Подключаем магазин по ID
                    }
                }
            }
        });
    }

    // Метод для удаления отзыва
    async delete(id: string, userId: string) {
        await this.getById(id, userId); // Проверяем, существует ли отзыв и принадлежит ли он пользователю

        return this.prisma.review.delete({
            where: {
                id // Условие для удаления отзыва по ID
            }
        });
    }
}
