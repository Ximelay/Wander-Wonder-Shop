import { Injectable } from '@nestjs/common'; // Импортируем необходимые классы из NestJS
import { path } from 'app-root-path'; // Импортируем путь к корню приложения
import { ensureDir, writeFile } from 'fs-extra'; // Импортируем функции для работы с файловой системой
import { FileResponse } from './file.interface'; // Импортируем интерфейс для ответа с файлами

@Injectable()
export class FileService {
    // Метод для сохранения файлов
    async saveFiles(files: Express.Multer.File[], folder: string = 'products') {
        const uploadedFolder = `${path}/uploads/${folder}`; // Путь к папке для загрузки файлов

        await ensureDir(uploadedFolder); // Убедимся, что папка существует

        const response: FileResponse[] = await Promise.all(
            files.map(async file => {
                const originalName = `${Date.now()}-${file.originalname}`; // Генерируем уникальное имя файла

                await writeFile(
                    `${uploadedFolder}/${originalName}`, // Путь для сохранения файла
                    file.buffer // Содержимое файла
                );

                return {
                    url: `/uploads/${folder}/${originalName}`, // URL для доступа к файлу
                    name: originalName // Имя файла
                };
            })
        );

        return response; // Возвращаем массив с информацией о загруженных файлах
    }
}
