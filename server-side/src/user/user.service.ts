import { Injectable } from '@nestjs/common'; // Импортируем необходимые классы из NestJS
import { PrismaService } from 'src/prisma.service'; // Импортируем PrismaService для работы с базой данных
import { hash } from 'argon2'; // Импортируем функцию для хеширования паролей
import { AuthDto } from 'src/auth/dto/auth.dto'; // Импортируем DTO для аутентификации

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {} // Инъекция PrismaService

    // Метод для получения пользователя по ID
    async getById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id // Условие для поиска пользователя по ID
            },
            include: {
                stores: true, // Включаем информацию о магазинах
                favorites: {
                    include: {
                        category: true // Включаем информацию о категориях избранных товаров
                    }
                },
                orders: true // Включаем информацию о заказах
            }
        });

        return user; // Возвращаем найденного пользователя
    }

    // Метод для получения пользователя по email
    async getByEmail(email: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                email // Условие для поиска пользователя по email
            },
            include: {
                stores: true, // Включаем информацию о магазинах
                favorites: true, // Включаем информацию о избранных товарах
                orders: true // Включаем информацию о заказах
            }
        });

        return user; // Возвращаем найденного пользователя
    }

    // Метод для добавления/удаления товара в/из избранного
    async toggleFavorite(productId: string, userId: string) {
        const user = await this.getById(userId); // Получаем пользователя по ID

        const isExists = user.favorites.some(
            product => product.id === productId // Проверяем, есть ли товар в избранном
        );

        await this.prisma.user.update({
            where: {
                id: user.id // Условие для обновления пользователя по ID
            },
            data: {
                favorites: {
                    [isExists ? 'disconnect' : 'connect']: {
                        id: productId // Подключаем или отключаем товар по ID
                    }
                }
            }
        });

        return true; // Возвращаем успешный ответ
    }

    // Метод для создания нового пользователя
    async create(dto: AuthDto) {
        return this.prisma.user.create({
            data: {
                name: dto.name, // Имя пользователя
                email: dto.email, // Email пользователя
                password: await hash(dto.password) // Хешируем пароль перед сохранением
            }
        });
    }
}
