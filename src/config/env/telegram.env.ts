import { registerAs } from '@nestjs/config'

import { validateEnv } from '@/shared/utils/env'

import type { TelegramConfig } from '../definitions'
import { TelegramValidator } from '../validators'

export const telegramEnv = registerAs<TelegramConfig>('telegram', () => {
	validateEnv(process.env, TelegramValidator)

	return {
		managerToken: process.env.MANAGER_BOT_TOKEN,
		ownerToken: process.env.OWNER_BOT_TOKEN,
		ownerId: process.env.OWNER_ID
	}
})
