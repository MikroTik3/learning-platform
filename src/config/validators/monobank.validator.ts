import { IsString } from 'class-validator'

export class MonobankValidator {
	@IsString()
	public MONOBANK_API_KEY: string
}
