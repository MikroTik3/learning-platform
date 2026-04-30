import { Injectable, Logger } from '@nestjs/common'
import { PaymentMethod } from '@prisma/generated'

import { ManagerBotService } from '@/bots/manager/manager.bot.service'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { MailService } from '@/libs/mail/mail.service'

import { WebhookValidator } from './webhook.validator'

@Injectable()
export class WebhookService {
	private readonly logger = new Logger(WebhookService.name)

	private readonly paymentTypeMap: Record<string, PaymentMethod> = {
		bank_card: 'BANK_CARD',
		sbp: 'SBP',
		tinkoff_bank: 'T_PAY',
		yoo_money: 'YOOMONEY'
	}

	public constructor(
		private readonly prismaService: PrismaService,
		private readonly validator: WebhookValidator,
		private readonly mailService: MailService,
		private readonly botService: ManagerBotService
	) {}
}
