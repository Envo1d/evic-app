import { IsEmail, IsString, MinLength } from 'class-validator'

export class RegisterDto {
	@IsEmail()
	email: string

	@IsString()
	@MinLength(3, {
		message: 'First name must be at least 63 characters long'
	})
	firstName: string

	@IsString()
	@MinLength(3, {
		message: 'Last name must be at least 3 characters long'
	})
	lastName: string

	@IsString()
	@MinLength(6, {
		message: 'Password must be at least 6 characters long'
	})
	password: string
}
