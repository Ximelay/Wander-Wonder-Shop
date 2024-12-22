import { combineReducers, configureStore } from '@reduxjs/toolkit'; // Импортируем необходимые функции из Redux Toolkit
import {
    FLUSH,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    REHYDRATE,
    persistStore
} from 'redux-persist'; // Импортируем действия для работы с redux-persist
import storage from 'redux-persist/lib/storage'; // Импортируем стандартное хранилище для redux-persist

import { cartSlice } from './cart/cart.slice'; // Импортируем срез для корзины

// Конфигурация для хранения состояния
const persistConfig = {
    key: 'tea-shop', // Ключ для хранения
    storage, // Хранилище
    whiteList: ['cart'] // Список редьюсеров, которые будут сохраняться
};

const isClient = typeof window !== 'undefined'; // Проверяем, выполняется ли код на клиенте

// Объединяем редьюсеры
const combinedReducers = combineReducers({
    cart: cartSlice.reducer // Добавляем редьюсер корзины
});

let mainReducer = combinedReducers; // Изначально основной редьюсер равен объединенным редьюсерам

if (isClient) {
    const { persistReducer } = require('redux-persist'); // Импортируем persistReducer только на клиенте
    const storage = require('redux-persist/lib/storage'); // Импортируем хранилище

    mainReducer = persistReducer(persistConfig, combinedReducers); // Оборачиваем редьюсер в persistReducer
}

// Конфигурируем хранилище Redux
export const store = configureStore({
    reducer: mainReducer, // Устанавливаем основной редьюсер
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER // Игнорируем действия, связанные с персистентным хранилищем
                ]
            }
        })
});

// Создаем persistor для хранения состояния
export const persistor = persistStore(store);

// Тип для корневого состояния
export type TypeRootState = ReturnType<typeof mainReducer>;
