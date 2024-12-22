import { Injectable, NotFoundException } from '@nestjs/common'; // Импортируем необходимые классы из NestJS
import { PrismaService } from 'src/prisma.service'; // Импортируем PrismaService для работы с базой данных
import { CreateStoreDto } from './dto/create-store.dto'; // Импортируем DTO для создания магазина
import { UpdateStoreDto } from './dto/update-store.dto'; // Импортируем DTO для обновления магазина

@Injectable()
export class StoreService {
    constructor(private prisma: PrismaService) {} // Инъекция PrismaService

    // Метод для получения магазина по ID и ID пользователя
    async getById(storeId: string, userId: string) {
        const store = await this.prisma.store.findUnique({
            where: {
                id: storeId, // Условие для поиска магазина по ID
                userId // Условие для проверки владельца магазина
            }
        });

        if (!store)
            throw new NotFoundException(
                'Магазин не найден или вы не являетесь его владельцем' // Если магазин не найден, выбрасываем исключение
            );

        return store; // Возвращаем найденный магазин
    }

    // Метод для создания нового магазина
    async create(userId: string, dto: CreateStoreDto) {
        return this.prisma.store.create({
            data: {
                title: dto.title, // Заголовок магазина
                userId // ID владельца магазина
            }
        });
    }

    // Метод для обновления магазина
    async update(storeId: string, userId: string, dto: UpdateStoreDto) {
        await this.getById(storeId, userId); // Проверяем, существует ли магазин

        return this.prisma.store.update({
            where: { id: storeId }, // Условие для обновления магазина по ID
            data: {
                ...dto, // Данные для обновления
                userId // ID владельца магазина
            }
        });
    }

    // Метод для удаления магазина
    async delete(storeId: string, userId: string) {
        await this.getById(storeId, userId); // Проверяем, существует ли магазин

        return this.prisma.store.delete({
            where: { id: storeId } // Условие для удаления магазина по ID
        });
    }
}
