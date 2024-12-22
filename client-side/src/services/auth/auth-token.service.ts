import Cookies from 'js-cookie'; // Импортируем библиотеку для работы с куками

// Перечисление для токенов
export enum EnumTokens {
    'ACCESS_TOKEN' = 'accessToken', // Токен доступа
    'REFRESH_TOKEN' = 'refreshToken' // Токен обновления
}

// Функция для получения токена доступа
export const getAccessToken = () => {
    const accessToken = Cookies.get(EnumTokens.ACCESS_TOKEN); // Получаем токен из куки
    return accessToken || null; // Возвращаем токен или null, если он отсутствует
}

// Функция для сохранения токена доступа в куки
export const saveTokenStorage = (accessToken: string) => {
    Cookies.set(EnumTokens.ACCESS_TOKEN, accessToken, {
        domain: process.env.APP_DOMAIN, // Устанавливаем домен
        sameSite: 'strict', // Устанавливаем политику SameSite
        expires: 1 // Устанавливаем срок действия токена (1 день)
    });
}

// Функция для удаления токена доступа из куки
export const removeFromStorage = () => {
    Cookies.remove(EnumTokens.ACCESS_TOKEN); // Удаляем токен из куки
}
