import { Injectable, NotFoundException } from '@nestjs/common'; // Импортируем необходимые классы из NestJS
import { PrismaService } from 'src/prisma.service'; // Импортируем PrismaService для работы с базой данных
import { CategoryDto } from './dto/category.dto'; // Импортируем DTO для категорий

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) {} // Инъекция PrismaService

    // Метод для получения категорий по ID магазина
    async getByStoreId(storeId: string) {
        return this.prisma.category.findMany({
            where: {
                storeId // Условие для поиска категорий по ID магазина
            }
        });
    }

    // Метод для получения категории по ID
    async getById(id: string) {
        const category = await this.prisma.category.findUnique({
            where: {
                id // Условие для поиска категории по ID
            }
        });

        if (!category) throw new NotFoundException('Категория не найдена'); // Если категория не найдена, выбрасываем исключение

        return category; // Возвращаем найденную категорию
    }

    // Метод для создания новой категории
    async create(storeId: string, dto: CategoryDto) {
        return this.prisma.category.create({
            data: {
                title: dto.title, // Заголовок категории
                description: dto.description, // Описание категории
                storeId // ID магазина
            }
        });
    }

    // Метод для обновления категории
    async update(id: string, dto: CategoryDto) {
        await this.getById(id); // Проверяем, существует ли категория

        return this.prisma.category.update({
            where: { id }, // Условие для обновления категории по ID
            data: dto // Данные для обновления
        });
    }

    // Метод для удаления категории
    async delete(id: string) {
        await this.getById(id); // Проверяем, существует ли категория

        return this.prisma.category.delete({
            where: { id } // Условие для удаления категории по ID
        });
    }
}
