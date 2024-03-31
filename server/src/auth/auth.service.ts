import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { verify } from 'argon2'
import { Response } from 'express'
import { AppConfig, AuthConfig } from 'src/config/configuration.interface'
import { UserService } from '../user/user.service'
import { AuthDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
	private EXPIRE_DAY_REFRESH_TOKEN: number
	REFRESH_TOKEN_NAME: string

	constructor(
		private jwt: JwtService,
		private userService: UserService,
		private config: ConfigService
	) {
		this.EXPIRE_DAY_REFRESH_TOKEN =
			parseInt(
				config.get<AuthConfig>('auth').refresh_token_lifetime.replace('d', ''),
				10
			) || 7

		this.REFRESH_TOKEN_NAME = config.get<AuthConfig>('auth').refresh_token_name
	}

	async login(dto: AuthDto) {
		const { password, ...user } = await this.validateUser(dto)

		const tokens = this.issueTokens(user.id)

		return { user, ...tokens }
	}

	async register(dto: AuthDto) {
		const oldUser = await this.userService.isExist(dto.email)

		if (oldUser) throw new BadRequestException('Email already in use')

		const { password, ...user } = await this.userService.create(dto)

		const tokens = this.issueTokens(user.id)

		return { user, ...tokens }
	}

	private issueTokens(userId: string) {
		const data = { id: userId }

		const accessToken = this.jwt.sign(data, {
			expiresIn: this.config.get<AuthConfig>('auth').access_token_lifetime
		})

		const refreshToken = this.jwt.sign(data, {
			expiresIn: this.config.get<AuthConfig>('auth').refresh_token_lifetime
		})

		return {
			accessToken,
			refreshToken
		}
	}

	private async validateUser(dto: AuthDto) {
		const user = await this.userService.getByEmail(dto.email)

		if (!user) throw new NotFoundException('User not found')

		const isValid = await verify(user.password, dto.password)

		if (!isValid) throw new BadRequestException('Incorrect password')

		return user
	}

	async getNewTokens(refreshToken: string) {
		const res = await this.jwt.verifyAsync(refreshToken)

		if (!res) throw new UnauthorizedException('Invalid refresh token')

		const { password, ...user } = await this.userService.getById(res.id)

		const tokens = this.issueTokens(user.id)

		return { user, ...tokens }
	}

	addCookie(res: Response, refreshToken: string) {
		const expiresIn = new Date()
		expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)

		res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
			httpOnly: true,
			domain: this.config.get<AppConfig>('app').domain,
			expires: expiresIn,
			secure: this.config.get<AppConfig>('app').secure,
			sameSite: this.config.get<AppConfig>('app').cookie_same_site
		})
	}

	removeCookie(res: Response) {
		res.cookie(this.REFRESH_TOKEN_NAME, '', {
			httpOnly: true,
			domain: this.config.get<AppConfig>('app').domain,
			expires: new Date(0),
			secure: this.config.get<AppConfig>('app').secure,
			sameSite: this.config.get<AppConfig>('app').cookie_same_site
		})
	}
}
