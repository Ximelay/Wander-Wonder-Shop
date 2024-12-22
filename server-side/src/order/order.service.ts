import { ICapturePayment, YooCheckout } from '@a2seven/yoo-checkout'; // Импортируем классы для работы с YooKassa
import { Injectable } from '@nestjs/common'; // Импортируем необходимые классы из NestJS
import { EnumOrderStatus } from '@prisma/client'; // Импортируем перечисление статусов заказа
import { PrismaService } from 'src/prisma.service'; // Импортируем PrismaService для работы с базой данных
import { OrderDto } from './dto/order.dto'; // Импортируем DTO для заказа
import { PaymentStatusDto } from './dto/payment-status.dto'; // Импортируем DTO для статуса платежа

const checkout = new YooCheckout({
    shopId: process.env['YOOKASSA_SHOP_ID'], // ID магазина
    secretKey: process.env['YOOKASSA_SECRET_KEY'] // Секретный ключ
});

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService) {} // Инъекция PrismaService

    // Метод для создания платежа
    async createPayment(dto: OrderDto, userId: string) {
        const orderItems = dto.items.map(item => ({
            quantity: item.quantity, // Количество товара
            price: item.price, // Цена товара
            product: {
                connect: {
                    id: item.productId // Подключаем товар по ID
                }
            },
            store: {
                connect: {
                    id: item.storeId // Подключаем магазин по ID
                }
            }
        }));

        const total = dto.items.reduce((acc, item) => {
            return acc + item.price * item.quantity; // Считаем общую сумму заказа
        }, 0);

        const order = await this.prisma.order.create({
            data: {
                status: dto.status, // Статус заказа
                items: {
                    create: orderItems // Создаем элементы заказа
                },
                total, // Общая сумма
                user: {
                    connect: {
                        id: userId // Подключаем пользователя по ID
                    }
                }
            }
        });

        const payment = await checkout.createPayment({
            amount: {
                value: total.toFixed(2), // Сумма платежа
                currency: 'RUB' // Валюта
            },
            payment_method_data: {
                type: 'bank_card' // Метод оплаты
            },
            confirmation: {
                type: 'redirect', // Тип подтверждения
                return_url: `${process.env.CLIENT_URL}/thanks` // URL для перенаправления после оплаты
            },
            description: `Оплата заказа в магазине TeaShop. Id платежи: #${order.id}` // Описание платежа
        });

        return payment; // Возвращаем информацию о платеже
    }

    // Метод для обновления статуса платежа
    async updateStatus(dto: PaymentStatusDto) {
        if (dto.event === 'payment.waiting_for_capture') {
            const capturePayment: ICapturePayment = {
                amount: {
                    value: dto.object.amount.value, // Сумма для захвата
                    currency: dto.object.amount.currency // Валюта
                }
            };

            return checkout.capturePayment(dto.object.id, capturePayment); // Захватываем платеж
        }

        if (dto.event === 'payment.succeeded') {
            const orderId = dto.object.description.split('#')[1]; // Извлекаем ID заказа из описания

            await this.prisma.order.update({
                where: {
                    id: orderId // Условие для обновления заказа по ID
                },
                data: {
                    status: EnumOrderStatus.PAYED // Обновляем статус заказа на "Оплачен"
                }
            });

            return true; // Возвращаем успешный ответ
        }

        return true; // Возвращаем успешный ответ
    }
}
