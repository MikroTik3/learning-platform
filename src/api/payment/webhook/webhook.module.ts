import { Module } from '@nestjs/common'

import { ManagerBotModule } from '@/bots/manager/manager.bot.module'

import { WebhookController } from './webhook.controller'
import { WebhookService } from './webhook.service'
import { WebhookValidator } from './webhook.validator'

@Module({
	imports: [ManagerBotModule],
	controllers: [WebhookController],
	providers: [WebhookService, WebhookValidator]
})
export class WebhookModule {}
