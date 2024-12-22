import { Injectable, NotFoundException } from '@nestjs/common'; // Импортируем необходимые классы из NestJS
import { PrismaService } from 'src/prisma.service'; // Импортируем PrismaService для работы с базой данных
import { ProductDto } from './dto/product.dto'; // Импортируем DTO для продуктов

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) {} // Инъекция PrismaService

    // Метод для получения всех продуктов
    async getAll(searchTerm?: string) {
        if (searchTerm) return this.getSearchTermFilter(searchTerm); // Если есть поисковый термин, используем фильтр

        return this.prisma.product.findMany({
            orderBy: {
                createdAt: 'desc' // Сортируем по дате создания
            },
            include: {
                category: true // Включаем информацию о категории
            }
        });
    }

    // Метод для фильтрации продуктов по поисковому термину
    private async getSearchTermFilter(searchTerm: string) {
        return this.prisma.product.findMany({
            where: {
                OR: [
                    {
                        title: {
                            contains: searchTerm,
                            mode: 'insensitive' // Игнорируем регистр
                        }
                    },
                    {
                        description: {
                            contains: searchTerm,
                            mode: 'insensitive' // Игнорируем регистр
                        }
                    }
                ]
            },
            include: {
                category: true // Включаем информацию о категории
            }
        });
    }

    // Метод для получения продуктов по ID магазина
    async getByStoreId(storeId: string) {
        return this.prisma.product.findMany({
            where: {
                storeId // Условие для поиска продуктов по ID магазина
            },
            include: {
                category: true, // Включаем информацию о категории
                color: true // Включаем информацию о цвете
            }
        });
    }

    // Метод для получения продукта по ID
    async getById(id: string) {
        const product = await this.prisma.product.findUnique({
            where: {
                id // Условие для поиска продукта по ID
            },
            include: {
                category: true, // Включаем информацию о категории
                color: true, // Включаем информацию о цвете
                reviews: {
                    include: {
                        user: true // Включаем информацию о пользователе, оставившем отзыв
                    }
                }
            }
        });

        if (!product) throw new NotFoundException('Товар не найден'); // Если товар не найден, выбрасываем исключение

        return product; // Возвращаем найденный продукт
    }

    // Метод для получения продуктов по ID категории
    async getByCategory(categoryId: string) {
        const products = await this.prisma.product.findMany({
            where: {
                category: {
                    id: categoryId // Условие для поиска продуктов по ID категории
                }
            },
            include: {
                category: true // Включаем информацию о категории
            }
        });

        if (!products) throw new NotFoundException('Товары не найдены'); // Если товары не найдены, выбрасываем исключение

        return products; // Возвращаем найденные товары
    }

    // Метод для получения самых популярных продуктов
    async getMostPopular() {
        const mostPopularProducts = await this.prisma.orderItem.groupBy({
            by: ['productId'], // Группируем по ID продукта
            _count: {
                id: true // Считаем количество заказов
            },
            orderBy: {
                _count: {
                    id: 'desc' // Сортируем по количеству заказов
                }
            }
        });

        const productIds = mostPopularProducts.map(item => item.productId); // Извлекаем ID популярных продуктов

        const products = await this.prisma.product.findMany({
            where: {
                id: {
                    in: productIds // Условие для поиска популярных продуктов
                }
            },
            include: {
                category: true // Включаем информацию о категории
            }
        });

        return products; // Возвращаем найденные популярные продукты
    }

    // Метод для получения похожих продуктов
    async getSimilar(id: string) {
        const currentProduct = await this.getById(id); // Получаем текущий продукт

        if (!currentProduct) throw new NotFoundException('Текущий товар не найден'); // Если текущий товар не найден, выбрасываем исключение

        const products = await this.prisma.product.findMany({
            where: {
                category: {
                    title: currentProduct.category.title // Условие для поиска по той же категории
                },
                NOT: {
                    id: currentProduct.id // Исключаем текущий продукт
                }
            },
            orderBy: {
                createdAt: 'desc' // Сортируем по дате создания
            },
            include: {
                category: true // Включаем информацию о категории
            }
        });

        return products; // Возвращаем найденные похожие продукты
    }

    // Метод для создания нового продукта
    async create(storeId: string, dto: ProductDto) {
        return this.prisma.product.create({
            data: {
                title: dto.title, // Заголовок продукта
                description: dto.description, // Описание продукта
                price: dto.price, // Цена продукта
                images: dto.images, // Изображения продукта
                categoryId: dto.categoryId, // ID категории
                colorId: dto.colorId, // ID цвета
                storeId // ID магазина
            }
        });
    }

    // Метод для обновления продукта
    async update(id: string, dto: ProductDto) {
        await this.getById(id); // Проверяем, существует ли продукт

        return this.prisma.product.update({
            where: { id }, // Условие для обновления продукта по ID
            data: dto // Данные для обновления
        });
    }

    // Метод для удаления продукта
    async delete(id: string) {
        await this.getById(id); // Проверяем, существует ли продукт

        return this.prisma.product.delete({
            where: { id } // Условие для удаления продукта по ID
        });
    }
}
