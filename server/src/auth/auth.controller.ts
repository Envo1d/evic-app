import {
	Body,
	Controller,
	HttpCode,
	Post,
	Req,
	Res,
	UnauthorizedException,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { Auth } from './decorators/auth.decorator'
import { AuthDto } from './dto/auth.dto'

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
		const { refreshToken, ...response } = await this.authService.login(dto)
		this.authService.addCookie(res, refreshToken)

		return response
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('register')
	async register(
		@Body() dto: AuthDto,
		@Res({ passthrough: true }) res: Response
	) {
		const { refreshToken, ...response } = await this.authService.register(dto)
		this.authService.addCookie(res, refreshToken)

		return response
	}

	@Auth()
	@HttpCode(200)
	@Post('logout')
	async logout(@Res({ passthrough: true }) res: Response) {
		this.authService.removeCookie(res)

		return true
	}

	@Auth()
	@HttpCode(200)
	@Post('refresh-tokens')
	async getNewToken(
		@Res({ passthrough: true }) res: Response,
		@Req() req: Request
	) {
		const token = req.cookies[this.authService.REFRESH_TOKEN_NAME]

		if (!token) {
			this.authService.removeCookie(res)
			throw new UnauthorizedException('Refresh token not passed')
		}

		const { refreshToken, ...response } =
			await this.authService.getNewTokens(token)

		return response
	}
}
