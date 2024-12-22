import { PayloadAction, createSlice } from '@reduxjs/toolkit'; // Импортируем необходимые функции из Redux Toolkit
import type {
    IAddToCartPayload,
    ICartInitialState,
    IChangeQuantityPayload
} from './cart.types'; // Импортируем типы для работы с корзиной

// Начальное состояние корзины
const initialState: ICartInitialState = {
    items: [] // Массив для хранения элементов корзины
};

// Создаем срез для корзины
export const cartSlice = createSlice({
    name: 'cart', // Имя среза
    initialState, // Начальное состояние
    reducers: {
        // Редюсер для добавления товара в корзину
        addToCart: (state, action: PayloadAction<IAddToCartPayload>) => {
            const isExist = state.items.some(
                item => item.product.id === action.payload.product.id // Проверяем, существует ли товар в корзине
            );

            if (!isExist)
                state.items.push({ ...action.payload, id: state.items.length }); // Добавляем товар, если его нет в корзине
        },
        // Редюсер для удаления товара из корзины
        removeFromCart: (state, action: PayloadAction<{ id: number }>) => {
            state.items = state.items.filter(
                item => item.id !== action.payload.id // Фильтруем элементы корзины, исключая удаляемый
            );
        },
        // Редюсер для изменения количества товара в корзине
        changeQuantity: (
            state,
            action: PayloadAction<IChangeQuantityPayload>
        ) => {
            const { id, type } = action.payload; // Извлекаем id и тип изменения
            const item = state.items.find(item => item.id === id); // Находим товар по id
            if (item) type === 'plus' ? item.quantity++ : item.quantity--; // Увеличиваем или уменьшаем количество
        },
        // Редюсер для сброса корзины
        reset: state => {
            state.items = []; // Очищаем корзину
        }
    }
});
