import { type NextRequest, NextResponse } from 'next/server'; // Импортируем типы для работы с запросами и ответами в Next.js
import { PUBLIC_URL } from './config/url.config'; // Импортируем публичные URL из конфигурации
import { EnumTokens } from './services/auth/auth-token.serice'; // Импортируем перечисление токенов для работы с аутентификацией

// Middleware функция для обработки запросов
export async function middleware(request: NextRequest) {
    const refreshToken = request.cookies.get(EnumTokens.REFRESH_TOKEN)?.value; // Получаем refresh токен из куки

    const isAuthPage = request.url.includes(PUBLIC_URL.auth()); // Проверяем, является ли текущая страница страницей аутентификации

    if (isAuthPage) {
        if (refreshToken) {
            // Если пользователь уже аутентифицирован, перенаправляем на главную страницу
            return NextResponse.redirect(
                new URL(PUBLIC_URL.home(), request.url)
            );
        }
        return NextResponse.next(); // Если токен отсутствует, продолжаем выполнение
    }

    if (refreshToken === undefined) {
        // Если refresh токен отсутствует, перенаправляем на страницу аутентификации
        return NextResponse.redirect(new URL(PUBLIC_URL.auth(), request.url));
    }

    return NextResponse.next(); // Если все проверки пройдены, продолжаем выполнение
}

// Конфигурация для middleware
export const config = {
    matcher: ['/dashboard/:path*', '/store/:path*', '/auth'] // Указываем пути, к которым будет применяться middleware
};
