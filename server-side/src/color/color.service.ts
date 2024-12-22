import { Injectable, NotFoundException } from '@nestjs/common'; // Импортируем необходимые классы из NestJS
import { PrismaService } from 'src/prisma.service'; // Импортируем PrismaService для работы с базой данных
import { ColorDto } from './dto/color.dto'; // Импортируем DTO для цветов

@Injectable()
export class ColorService {
    constructor(private prisma: PrismaService) {} // Инъекция PrismaService

    // Метод для получения цветов по ID магазина
    async getByStoreId(storeId: string) {
        return this.prisma.color.findMany({
            where: {
                storeId // Условие для поиска цветов по ID магазина
            }
        });
    }

    // Метод для получения цвета по ID
    async getById(id: string) {
        const color = await this.prisma.color.findUnique({
            where: {
                id // Условие для поиска цвета по ID
            }
        });

        if (!color) throw new NotFoundException('Цвет не найден'); // Если цвет не найден, выбрасываем исключение

        return color; // Возвращаем найденный цвет
    }

    // Метод для создания нового цвета
    async create(storeId: string, dto: ColorDto) {
        return this.prisma.color.create({
            data: {
                name: dto.name, // Имя цвета
                value: dto.value, // Значение цвета
                storeId // ID магазина
            }
        });
    }

    // Метод для обновления цвета
    async update(id: string, dto: ColorDto) {
        await this.getById(id); // Проверяем, существует ли цвет

        return this.prisma.color.update({
            where: { id }, // Условие для обновления цвета по ID
            data: dto // Данные для обновления
        });
    }

    // Метод для удаления цвета
    async delete(id: string) {
        await this.getById(id); // Проверяем, существует ли цвет

        return this.prisma.color.delete({
            where: { id } // Условие для удаления цвета по ID
        });
    }
}
