import { useQuery } from '@tanstack/react-query'; // Импортируем хук useQuery из библиотеки react-query
import { userService } from '../services/user.service'; // Импортируем сервис пользователя

// Хук для получения профиля пользователя
export function useProfile() {
    const { data: user, isLoading } = useQuery({
        queryKey: ['profile'], // Ключ для кэширования запроса
        queryFn: () => userService.getProfile() // Функция для получения профиля
    });

    return { user, isLoading }; // Возвращаем данные пользователя и состояние загрузки
}
