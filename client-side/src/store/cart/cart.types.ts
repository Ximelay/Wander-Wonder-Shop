import type { ICartItem } from '../../shared/types/cart.interface'; // Импортируем интерфейс ICartItem

// Интерфейс для начального состояния корзины
export interface ICartInitialState {
    items: ICartItem[]; // Массив элементов корзины
}

// Интерфейс для добавления товара в корзину
export interface IAddToCartPayload extends Omit<ICartItem, 'id'> {}

// Интерфейс для изменения количества товара в корзине
export interface IChangeQuantityPayload extends Pick<ICartItem, 'id'> {
    type: 'minus' | 'plus'; // Тип изменения количества: уменьшение или увеличение
}
