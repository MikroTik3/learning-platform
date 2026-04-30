import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { SentinelModule } from '@teacoder/sentinel'

import { ManagerBotModule } from '@/bots/manager/manager.bot.module'
import { getOAuthConfig } from '@/config'

import { SsoController } from './sso.controller'
import { SsoService } from './sso.service'

@Module({
	imports: [
		SentinelModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getOAuthConfig,
			inject: [ConfigService]
		}),
		ManagerBotModule
	],
	controllers: [SsoController],
	providers: [SsoService]
})
export class SsoModule {}
