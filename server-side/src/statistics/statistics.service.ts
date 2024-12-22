import { Injectable } from '@nestjs/common'; // Импортируем необходимые классы из NestJS
import * as dayjs from 'dayjs'; // Импортируем библиотеку dayjs для работы с датами
import 'dayjs/locale/ru'; // Импортируем русскую локализацию для dayjs
import { PrismaService } from 'src/prisma.service'; // Импортируем PrismaService для работы с базой данных

dayjs.locale('ru'); // Устанавливаем русскую локализацию

const monthNames = [ // Массив названий месяцев на русском
    'янв',
    'фев',
    'мар',
    'апр',
    'мая',
    'июн',
    'июл',
    'авг',
    'сен',
    'окт',
    'ноя',
    'дек'
];

@Injectable()
export class StatisticsService {
    constructor(private prisma: PrismaService) {} // Инъекция PrismaService

    // Метод для получения основной статистики
    async getMainStatistics(storeId: string) {
        const totalRevenue = await this.calculateTotalRevenue(storeId); // Получаем общую выручку

        const productsCount = await this.countProducts(storeId); // Получаем количество продуктов
        const categoriesCount = await this.countCategories(storeId); // Получаем количество категорий

        const averageRating = await this.calculateAverageRating(storeId); // Получаем средний рейтинг

        return [
            { id: 1, name: 'Выручка', value: totalRevenue }, // Возвращаем выручку
            { id: 2, name: 'Товары', value: productsCount }, // Возвращаем количество товаров
            { id: 3, name: 'Категории', value: categoriesCount }, // Возвращаем количество категорий
            { id: 4, name: 'Средний рейтинг', value: averageRating || 0 } // Возвращаем средний рейтинг
        ];
    }

    // Метод для получения средней статистики
    async getMiddleStatistics(storeId: string) {
        const monthlySales = await this.calculateMonthlySales(storeId); // Получаем месячные продажи

        const lastUsers = await this.getLastUsers(storeId); // Получаем последних пользователей

        return { monthlySales, lastUsers }; // Возвращаем месячные продажи и последних пользователей
    }

    // Метод для расчета общей выручки
    private async calculateTotalRevenue(storeId: string) {
        const orders = await this.prisma.order.findMany({
            where: {
                items: {
                    some: {
                        store: { id: storeId } // Условие для поиска заказов по ID магазина
                    }
                }
            },
            include: {
                items: {
                    where: { storeId } // Включаем элементы заказа
                }
            }
        });

        const totalRevenue = orders.reduce((acc, order) => {
            const total = order.items.reduce((itemAcc, item) => {
                return itemAcc + item.price * item.quantity; // Считаем общую сумму заказа
            }, 0);
            return acc + total; // Суммируем общую выручку
        }, 0);

        return totalRevenue; // Возвращаем общую выручку
    }

    // Метод для подсчета количества продуктов
    private async countProducts(storeId: string) {
        const productsCount = await this.prisma.product.count({
            where: { storeId } // Условие для подсчета продуктов по ID магазина
        });
        return productsCount; // Возвращаем количество продуктов
    }

    // Метод для подсчета количества категорий
    private async countCategories(storeId: string) {
        const categoriesCount = await this.prisma.category.count({
            where: { storeId } // Условие для подсчета категорий по ID магазина
        });
        return categoriesCount; // Возвращаем количество категорий
    }

    // Метод для расчета среднего рейтинга
    private async calculateAverageRating(storeId: string) {
        const averageRating = await this.prisma.review.aggregate({
            where: { storeId }, // Условие для подсчета среднего рейтинга по ID магазина
            _avg: { rating: true } // Подсчет среднего значения рейтинга
        });
        return averageRating._avg.rating; // Возвращаем средний рейтинг
    }

    // Метод для расчета месячных продаж
    private async calculateMonthlySales(storeId: string) {
        const startDate = dayjs().subtract(30, 'days').startOf('day').toDate(); // Начальная дата
        const endDate = dayjs().endOf('day').toDate(); // Конечная дата

        const salesRaw = await this.prisma.order.findMany({
            where: {
                createdAt: {
                    gte: startDate, // Условие для начала периода
                    lte: endDate // Условие для конца периода
                },
                items: {
                    some: { storeId } // Условие для поиска по ID магазина
                }
            },
            include: {
                items: true // Включаем элементы заказа
            }
        });

        const formatDate = (date: Date): string => {
            return `${date.getDate()} ${monthNames[date.getMonth()]}`; // Форматируем дату
        };

        const salesByDate = new Map<string, number>(); // Создаем карту для хранения продаж по датам

        salesRaw.forEach(order => {
            const formattedDate = formatDate(new Date(order.createdAt)); // Форматируем дату заказа

            const total = order.items.reduce((total, item) => {
                return total + item.price * item.quantity; // Считаем общую сумму заказа
            }, 0);

            if (salesByDate.has(formattedDate)) {
                salesByDate.set(
                    formattedDate,
                    salesByDate.get(formattedDate)! + total // Обновляем сумму продаж по дате
                );
            } else {
                salesByDate.set(formattedDate, total); // Устанавливаем сумму продаж по дате
            }
        });

        const monthlySales = Array.from(salesByDate, ([date, value]) => ({
            date,
            value
        })); // Преобразуем карту в массив

        return monthlySales; // Возвращаем месячные продажи
    }

    // Метод для получения последних пользователей
    private async getLastUsers(storeId: string) {
        const lastUsers = await this.prisma.user.findMany({
            where: {
                orders: {
                    some: {
                        items: { some: { storeId } } // Условие для поиска пользователей по ID магазина
                    }
                }
            },
            orderBy: { createdAt: 'desc' }, // Сортируем по дате создания
            take: 5, // Ограничиваем количество возвращаемых пользователей
            include: {
                orders: {
                    where: {
                        items: { some: { storeId } } // Условие для поиска заказов по ID магазина
                    },
                    include: {
                        items: {
                            where: { storeId }, // Включаем элементы заказа
                            select: { price: true } // Выбираем только цену
                        }
                    }
                }
            }
        });

        return lastUsers.map(user => {
            const lastOrder = user.orders[user.orders.length - 1]; // Получаем последний заказ пользователя

            const total = lastOrder.items.reduce((total, item) => {
                return total + item.price; // Считаем общую сумму последнего заказа
            }, 0);

            return {
                id: user.id, // ID пользователя
                name: user.name, // Имя пользователя
                email: user.email, // Email пользователя
                picture: user.picture, // Изображение пользователя
                total // Общая сумма последнего заказа
            };
        });
    }
}
