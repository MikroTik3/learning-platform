import { IsString } from 'class-validator'

export class TelegramValidator {
	@IsString()
	public MANAGER_BOT_TOKEN: string

	@IsString()
	public OWNER_BOT_TOKEN: string

	@IsString()
	public OWNER_ID: string
}
