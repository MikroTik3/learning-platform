import { ConfigService } from '@nestjs/config'
import {
	DiscordProvider,
	GithubProvider,
	GitlabProfile,
	GitlabProvider,
	GoogleProvider,
	SentinelOptions,
	YandexProvider
} from '@teacoder/sentinel'

import type { AllConfigs } from '../definitions'

export function getOAuthConfig(
	configService: ConfigService<AllConfigs>
): SentinelOptions {
	return {
		baseUrl: configService.get('hosts.rest', { infer: true }),
		services: [
			new GoogleProvider({
				clientId: configService.get(
					'sentinel.google.clientId',
					{
						infer: true
					}
				),
				clientSecret: configService.get(
					'sentinel.google.clientSecret',
					{
						infer: true
					}
				),
				scopes: ['email', 'profile']
			}),
			new DiscordProvider({
				clientId: configService.get(
					'sentinel.discord.clientId',
					{
						infer: true
					}
				),
				clientSecret: configService.get(
					'sentinel.discord.clientSecret',
					{
						infer: true
					}
				),
				scopes: ['identify', 'email']
			})
		]
	}
}
