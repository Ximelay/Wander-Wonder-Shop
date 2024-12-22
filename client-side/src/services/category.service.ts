import { axiosClassic, axiosWithAuth } from '../api/api.interceptors'; // Импортируем экземпляры Axios
import { API_URL } from '../config/api.config'; // Импортируем базовый URL API
import { ICategory, ICategoryInput } from '../shared/types/category.interface'; // Импортируем интерфейсы для категорий

class CategoryService {
    // Получаем категории по ID магазина
    async getByStoreId(id: string) {
        const { data } = await axiosWithAuth<ICategory[]>({
            url: API_URL.categories(`/by-storeId/${id}`),
            method: 'GET'
        });

        return data; // Возвращаем данные категорий
    }

    // Получаем категорию по ID
    async getById(id: string) {
        const { data } = await axiosClassic<ICategory>({
            url: API_URL.categories(`/by-id/${id}`),
            method: 'GET'
        });

        return data; // Возвращаем данные категории
    }

    // Создаем новую категорию
    async create(data: ICategoryInput, storeId: string) {
        const { data: createdCategory } = await axiosWithAuth<ICategory>({
            url: API_URL.categories(`/${storeId}`),
            method: 'POST',
            data
        });

        return createdCategory; // Возвращаем созданную категорию
    }

    // Обновляем категорию
    async update(id: string, data: ICategoryInput) {
        const { data: updatedCategory } = await axiosWithAuth<ICategory>({
            url: API_URL.categories(`/${id}`),
            method: 'PUT',
            data
        });

        return updatedCategory; // Возвращаем обновленную категорию
    }

    // Удаляем категорию
    async delete(id: string) {
        const { data: deletedCategory } = await axiosWithAuth<ICategory>({
            url: API_URL.categories(`/${id}`),
            method: 'DELETE'
        });

        return deletedCategory; // Возвращаем удаленную категорию
    }
}

export const categoryService = new CategoryService(); // Экспортируем экземпляр CategoryService
