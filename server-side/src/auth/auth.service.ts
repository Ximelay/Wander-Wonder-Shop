import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common'; // Импортируем необходимые исключения из NestJS
import { ConfigService } from '@nestjs/config'; // Импортируем сервис конфигурации
import { JwtService } from '@nestjs/jwt'; // Импортируем сервис JWT
import { Response } from 'express'; // Импортируем тип Response из Express
import { PrismaService } from 'src/prisma.service'; // Импортируем PrismaService для работы с базой данных
import { UserService } from 'src/user/user.service'; // Импортируем UserService для работы с пользователями
import { AuthDto } from './dto/auth.dto'; // Импортируем DTO для аутентификации

@Injectable()
export class AuthService {
    EXPIRE_DAY_REFRESH_TOKEN = 1; // Срок действия refresh токена в днях
    REFRESH_TOKEN_NAME = 'refreshToken'; // Имя для refresh токена

    constructor(
        private jwt: JwtService, // Инъекция JwtService
        private userService: UserService, // Инъекция UserService
        private prisma: PrismaService, // Инъекция PrismaService
        private configService: ConfigService // Инъекция ConfigService
    ) {}

    // Метод для входа пользователя
    async login(dto: AuthDto) {
        const user = await this.validateUser(dto); // Проверяем пользователя

        const tokens = this.issueTokens(user.id); // Генерируем токены

        return { user, ...tokens }; // Возвращаем пользователя и токены
    }

    // Метод для регистрации пользователя
    async register(dto: AuthDto) {
        const oldUser = await this.userService.getByEmail(dto.email); // Проверяем, существует ли пользователь

        if (oldUser)
            throw new BadRequestException('Пользователь уже существует'); // Если существует, выбрасываем исключение

        const user = await this.userService.create(dto); // Создаем нового пользователя

        const tokens = this.issueTokens(user.id); // Генерируем токены

        return { user, ...tokens }; // Возвращаем пользователя и токены
    }

    // Метод для получения новых токенов
    async getNewTokens(refreshToken: string) {
        const result = await this.jwt.verifyAsync(refreshToken); // Проверяем refresh токен
        if (!result) throw new UnauthorizedException('Невалидный refresh токен'); // Если невалидный, выбрасываем исключение

        const user = await this.userService.getById(result.id); // Получаем пользователя по ID

        const tokens = this.issueTokens(user.id); // Генерируем токены

        return { user, ...tokens }; // Возвращаем пользователя и токены
    }

    // Метод для генерации токенов
    issueTokens(userId: string) {
        const data = { id: userId }; // Данные для токена

        const accessToken = this.jwt.sign(data, {
            expiresIn: '1h' // Срок действия access токена
        });

        const refreshToken = this.jwt.sign(data, {
            expiresIn: '7d' // Срок действия refresh токена
        });

        return { accessToken, refreshToken }; // Возвращаем токены
    }

    // Метод для валидации пользователя
    private async validateUser(dto: AuthDto) {
        const user = await this.userService.getByEmail(dto.email); // Получаем пользователя по email

        if (!user) throw new NotFoundException('Пользователь не найден'); // Если не найден, выбрасываем исключение

        return user; // Возвращаем пользователя
    }

    // Метод для валидации OAuth входа
    async validateOAuthLogin(req: any) {
        let user = await this.userService.getByEmail(req.user.email); // Получаем пользователя по email

        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    email: req.user.email,
                    name: req.user.name,
                    picture: req.user.picture
                },
                include: {
                    stores: true,
                    favorites: true,
                    orders: true
                }
            }); // Создаем нового пользователя, если не найден
        }

        const tokens = this.issueTokens(user.id); // Генерируем токены

        return { user, ...tokens }; // Возвращаем пользователя и токены
    }

    // Метод для добавления refresh токена в ответ
    addRefreshTokenToResponse(res: Response, refreshToken: string) {
        const expiresIn = new Date();
        expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN); // Устанавливаем срок действия

        res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
            httpOnly: true, // Доступ только через HTTP
            domain: this.configService.get('SERVER_DOMAIN'), // Устанавливаем домен
            expires: expiresIn, // Устанавливаем время истечения
            secure: true, // Использовать только по HTTPS
            sameSite: 'none' // Разрешаем кросс-доменные запросы
        });
    }

    // Метод для удаления refresh токена из ответа
    removeRefreshTokenFromResponse(res: Response) {
        res.cookie(this.REFRESH_TOKEN_NAME, '', {
            httpOnly: true,
            domain: this.configService.get('SERVER_DOMAIN'),
            expires: new Date(0), // Устанавливаем время истечения в прошлое
            secure: true,
            sameSite: 'none'
        });
    }
}
