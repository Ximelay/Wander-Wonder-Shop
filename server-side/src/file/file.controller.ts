import {
    Controller,
    HttpCode,
    Post,
    Query,
    UploadedFiles,
    UseInterceptors
} from '@nestjs/common'; // Импортируем необходимые декораторы и классы из NestJS
import { FilesInterceptor } from '@nestjs/platform-express'; // Импортируем интерсептор для работы с файлами
import { Auth } from 'src/auth/decorators/auth.decorator'; // Импортируем декоратор аутентификации
import { FileService } from './file.service'; // Импортируем FileService

@Controller('files') // Указываем базовый путь для контроллера
export class FileController {
    constructor(private readonly fileService: FileService) {} // Инъекция FileService

    @HttpCode(200) // Устанавливаем код ответа
    @UseInterceptors(FilesInterceptor('files')) // Используем интерсептор для обработки загружаемых файлов
    @Auth() // Защищаем маршрут аутентификацией
    @Post() // Указываем путь для загрузки файлов
    async saveFiles(
        @UploadedFiles() files: Express.Multer.File[], // Получаем загруженные файлы
        @Query('folder') folder?: string // Получаем имя папки из параметров запроса
    ) {
        return this.fileService.saveFiles(files, folder); // Вызов метода сервиса для сохранения файлов
    }
}
