import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { ApiModule } from './api/api.module'
import { BotModule } from './bots/bot.module'
import {
	appEnv,
	hostsEnv,
	kinescopeEnv,
	mailerEnv,
	queueEnv,
	redisEnv,
	sentinelEnv,
	storageEnv,
	telegramEnv,
	turnstileEnv,
	webauthnEnv
} from './config'
import { InfraModule } from './infra/infra.module'
import { LibsModule } from './libs/libs.module'
import { IS_DEV_ENV } from './shared/utils'

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: !IS_DEV_ENV,
			isGlobal: true,
			load: [
				appEnv,
				hostsEnv,
				kinescopeEnv,
				mailerEnv,
				queueEnv,
				redisEnv,
				sentinelEnv,
				storageEnv,
				telegramEnv,
				turnstileEnv,
				webauthnEnv
			]
		}),
		ApiModule,
		InfraModule,
		LibsModule,
		BotModule
	]
})
export class AppModule {}
