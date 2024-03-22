import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'
import { PomodoroSettingsDto } from './pomodoro.dto'

export class UserDto extends PomodoroSettingsDto {
	@IsEmail()
	@IsOptional()
	email?: string

	@IsString()
	@IsOptional()
	@MinLength(3, {
		message: 'First name must be at least 63 characters long'
	})
	firstName?: string

	@IsString()
	@IsOptional()
	@MinLength(3, {
		message: 'Last name must be at least 3 characters long'
	})
	lastName?: string

	@IsString()
	@IsOptional()
	@MinLength(3, {
		message: 'Nickname must be at least 3 characters long'
	})
	nickname?: string

	@IsString()
	@IsOptional()
	@MinLength(6, {
		message: 'Password must be at least 6 characters long'
	})
	password?: string
}
