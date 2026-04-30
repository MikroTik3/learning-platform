import { registerAs } from '@nestjs/config'

import { validateEnv } from '@/shared/utils/env'

import type { MonobankConfig } from '../definitions'
import { MonobankValidator } from '../validators'

export const monobankEnv = registerAs<MonobankConfig>('monobank', () => {
	validateEnv(process.env, MonobankValidator)

	return {
		apiKey: process.env.MONOBANK_API_KEY
	}
})
