import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { verify } from 'argon2'
import { Response } from 'express'
import { UserService } from '../user/user.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
	private EXPIRE_DAY_REFRESH_TOKEN = 7
	REFRESH_TOKEN_NAME = 'refreshToken'

	constructor(
		private jwt: JwtService,
		private userService: UserService
	) {}

	async login(dto: LoginDto) {
		const { password, ...user } = await this.validateUser(dto)

		const tokens = this.issueTokens(user.id)

		return { user, ...tokens }
	}

	async register(dto: RegisterDto) {
		const oldUser = await this.userService.isExist(dto.email)

		if (oldUser) throw new BadRequestException('Email already in use')

		const { password, ...user } = await this.userService.create(dto)

		const tokens = this.issueTokens(user.id)

		return { user, ...tokens }
	}

	private issueTokens(userId: string) {
		const data = { id: userId }

		const accessToken = this.jwt.sign(data, {
			expiresIn: '1h'
		})

		const refreshToken = this.jwt.sign(data, {
			expiresIn: '7d'
		})

		return {
			accessToken,
			refreshToken
		}
	}

	private async validateUser(dto: LoginDto) {
		const user = await this.userService.getByEmail(dto.email)

		if (!user) throw new NotFoundException('User not found')

		const isValid = await verify(user.password, dto.password)

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
			domain: 'localhost',
			expires: expiresIn,
			secure: true,
			sameSite: 'none'
		})
	}

	removeCookie(res: Response) {
		res.cookie(this.REFRESH_TOKEN_NAME, '', {
			httpOnly: true,
			domain: 'localhost',
			expires: new Date(0),
			secure: true,
			sameSite: 'none'
		})
	}
}
