import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MonobankModule } from 'nestjs-monobank'

import { ManagerBotModule } from '@/bots/manager/manager.bot.module'
import { ManagerBotService } from '@/bots/manager/manager.bot.service'
import { getLiqpayConfig, getMonobankConfig } from '@/config'
import { LiqpayModule } from '@/libs/liqpay/liqpay.module'

import { PaymentController } from './payment.controller'
import { PaymentService } from './payment.service'
import { WebhookModule } from './webhook/webhook.module'

@Module({
	imports: [
		MonobankModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getMonobankConfig,
			inject: [ConfigService]
		}),

		WebhookModule,
		ManagerBotModule
	],
	controllers: [PaymentController],
	providers: [PaymentService, ManagerBotService]
})
export class PaymentModule {}
