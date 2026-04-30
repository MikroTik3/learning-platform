import { Module } from '@nestjs/common'

import { PaymentController } from './payment.controller'
import { PaymentService } from './payment.service'
import { WebhookModule } from './webhook/webhook.module'

@Module({
	imports: [
		WebhookModule
	],
	controllers: [PaymentController],
	providers: [PaymentService]
})
export class PaymentModule {}
