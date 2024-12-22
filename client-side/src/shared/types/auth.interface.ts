import { IUser } from './user.interface'; // Импортируем интерфейс IUser

// Интерфейс для формы аутентификации
export interface IAuthForm {
    name: string; // Имя пользователя
    email: string; // Email пользователя
    password: string; // Пароль пользователя
}

// Интерфейс для ответа аутентификации
export interface IAuthResponse {
    user: IUser; // Пользователь, полученный в ответе
    accessToken: string; // Токен доступа
    refreshToken: string; // Токен обновления
}
