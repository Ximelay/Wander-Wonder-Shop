import {
    Body,
    Controller,
    Get,
    HttpCode,
    Post,
    Req,
    Res,
    UnauthorizedException,
    UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common'; // Импортируем необходимые декораторы и классы из NestJS
import { AuthGuard } from '@nestjs/passport'; // Импортируем AuthGuard для аутентификации
import { Request, Response } from 'express'; // Импортируем типы Request и Response из Express
import { AuthService } from './auth.service'; // Импортируем AuthService
import { AuthDto } from './dto/auth.dto'; // Импортируем DTO для аутентификации

@Controller('auth') // Указываем базовый путь для контроллера
export class AuthController {
    constructor(private readonly authService: AuthService) {} // Инъекция AuthService

    @UsePipes(new ValidationPipe()) // Используем ValidationPipe для валидации данных
    @HttpCode(200) // Устанавливаем код ответа
    @Post('login') // Указываем путь для метода входа
    async login(
        @Body() dto: AuthDto, // Получаем данные из тела запроса
        @Res({ passthrough: true }) res: Response // Получаем объект Response
    ) {
        const { refreshToken, ...response } = await this.authService.login(dto); // Вызов метода входа

        this.authService.addRefreshTokenToResponse(res, refreshToken); // Добавляем refresh токен в ответ

        return response; // Возвращаем ответ
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post('register') // Указываем путь для метода регистрации
    async register(
        @Body() dto: AuthDto,
        @Res({ passthrough: true }) res: Response
    ) {
        const { refreshToken, ...response } = await this.authService.register(dto); // Вызов метода регистрации

        this.authService.addRefreshTokenToResponse(res, refreshToken); // Добавляем refresh токен в ответ

        return response; // Возвращаем ответ
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post('login/access-token') // Указываем путь для получения новых токенов
    async getNewTokens(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response
    ) {
        const refreshTokenFromCookies = req.cookies[this.authService.REFRESH_TOKEN_NAME]; // Получаем refresh токен из куки

        if (!refreshTokenFromCookies) {
            this.authService.removeRefreshTokenFromResponse(res); // Удаляем refresh токен из ответа
            throw new UnauthorizedException('Refresh токен не прошел'); // Выбрасываем исключение
        }

        const { refreshToken, ...response } = await this.authService.getNewTokens(refreshTokenFromCookies); // Получаем новые токены

        this.authService.addRefreshTokenToResponse(res, refreshToken); // Добавляем refresh токен в ответ

        return response; // Возвращаем ответ
    }

    @HttpCode(200)
    @Post('logout') // Указываем путь для выхода
    async logout(@Res({ passthrough: true }) res: Response) {
        this.authService.removeRefreshTokenFromResponse(res); // Удаляем refresh токен из ответа
        return true; // Возвращаем успешный ответ
    }

    @Get('google') // Указываем путь для аутентификации через Google
    @UseGuards(AuthGuard('google')) // Используем AuthGuard для Google
    async googleAuth(@Req() req) {}

    @Get('google/callback') // Указываем путь для обратного вызова Google
    @UseGuards(AuthGuard('google')) // Используем AuthGuard для Google
    async googleAuthCallback(
        @Req() req,
        @Res({ passthrough: true }) res: Response
    ) {
        const { refreshToken, ...response } = await this.authService.validateOAuthLogin(req); // Валидация OAuth входа

        this.authService.addRefreshTokenToResponse(res, refreshToken); // Добавляем refresh токен в ответ

        return res.redirect(
            `${process.env['CLIENT_URL']}/dashboard?accessToken=${response.accessToken}` // Перенаправляем на клиент
        );
    }

    @Get('yandex') // Указываем путь для аутентификации через Yandex
    @UseGuards(AuthGuard('yandex')) // Используем AuthGuard для Yandex
    async yandexAuth(@Req() req) {}

    @Get('yandex/callback') // Указываем путь для обратного вызова Yandex
    @UseGuards(AuthGuard('yandex')) // Используем AuthGuard для Yandex
    async yandexAuthCallback(
        @Req() req,
        @Res({ passthrough: true }) res: Response
    ) {
        const { refreshToken, ...response } = await this.authService.validateOAuthLogin(req); // Валидация OAuth входа

        this.authService.addRefreshTokenToResponse(res, refreshToken); // Добавляем refresh токен в ответ

        return res.redirect(
            `${process.env['CLIENT_URL']}/dashboard?accessToken=${response.accessToken}` // Перенаправляем на клиент
        );
    }
}
