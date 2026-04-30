import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TelegrafModule } from 'nestjs-telegraf'

import type { AllConfigs } from '@/config/definitions'

import { StartCommand } from './commands/start.command'
import { ManagerBotService } from './manager.bot.service'

@Module({
	imports: [
		TelegrafModule.forRootAsync({
			imports: [ConfigModule],
			botName: 'manager',
			useFactory: (configService: ConfigService<AllConfigs>) => ({
				token: configService.get('telegram.managerToken', {
					infer: true
				})
			}),
			inject: [ConfigService]
		})
	],
	providers: [ManagerBotService, StartCommand],
	exports: [ManagerBotService]
})
export class ManagerBotModule {}
