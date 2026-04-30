import { ConfigService } from '@nestjs/config'
import type { MonobankModuleOptions } from 'nestjs-monobank'

import { AllConfigs } from '../definitions'

export function getMonobankConfig(
	configService: ConfigService<AllConfigs>
): MonobankModuleOptions {
	return {
		apiKey: configService.get('monobank.apiKey', { infer: true })
	}
}
