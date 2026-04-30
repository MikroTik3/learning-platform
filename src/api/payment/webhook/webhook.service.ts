import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { PaymentStatus } from '@prisma/generated'
import { MonobankService } from 'nestjs-monobank'

import { ManagerBotService } from '@/bots/manager/manager.bot.service'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { LiqpayService } from '@/libs/liqpay/liqpay.service'
import { MailService } from '@/libs/mail/mail.service'

import { WebhookValidator } from './webhook.validator'

@Injectable()
export class WebhookService {
	private readonly logger = new Logger(WebhookService.name)

	public constructor(
		private readonly monobankService: MonobankService,
		private readonly liqpayService: LiqpayService,
		private readonly mailService: MailService,
		private readonly botService: ManagerBotService,
		private readonly prismaService: PrismaService,
		private readonly validator: WebhookValidator
	) {}

	public async handleMonobank({
		rawBody,
		signature,
		payload,
		ip
	}: {
		rawBody: string
		signature: string
		payload: any
		ip: string
	}) {
		this.logger.log(`Received Monobank webhook: ${payload.reference}`)

		this.validator.validatorMonobank(ip)

		const isValid =
			await this.monobankService.webhook.verifyWebhookSignature(
				Buffer.from(rawBody),
				signature
			)
		if (!isValid) {
			this.logger.warn(
				`Invalid Monobank webhook signature for reference: ${payload.reference}`
			)
			throw new BadRequestException('Invalid signature')
		}

		if (payload.status === 'created') {
			this.logger.warn(`Payment created: ${payload.reference}`)
			return await this.updateStatus(
				payload.reference,
				PaymentStatus.
			)
		} else if (payload.status === 'processing') {
			this.logger.warn(`Payment processing: ${payload.reference}`)
			return await this.updateStatus(
				payload.reference,
				PaymentStatus.PROCESSING
			)
		} else if (payload.status === 'hold') {
			this.logger.warn(`Payment hold: ${payload.reference}`)
			return await this.updateStatus(
				payload.reference,
				PaymentStatus.HOLD
			)
		} else if (payload.status === 'success') {
			this.logger.log(`Payment succeeded: ${payload.invoiceId}`)

			return await this.processPayment({
				provider: 'monobank',
				paymentId: payload.reference
			})
		} else if (payload.status === 'failure') {
			this.logger.warn(`Payment failure: ${payload.reference}`)
			return await this.updateStatus(
				payload.reference,
				PaymentStatus.FAILURE
			)
		} else if (payload.status === 'reversed') {
			this.logger.warn(`Payment reversed: ${payload.reference}`)
			return await this.updateStatus(
				payload.reference,
				PaymentStatus.REVERSED
			)
		} else if (payload.status === 'expired') {
			this.logger.warn(`Payment expired: ${payload.reference}`)
			return await this.updateStatus(
				payload.reference,
				PaymentStatus.EXPIRED
			)
		}
	}

	public async handleLiqpay({
		rawBody,
		payload,
		signature
	}: {
		rawBody: string
		payload: any
		signature: string
	}) {
		this.logger.log(`Received LiqPay webhook: ${payload.order_id}`)

		const isValid = this.liqpayService.verifyWebhookSignature(
			payload.data,
			signature
		)
		if (!isValid) {
			this.logger.warn(
				`Invalid LiqPay webhook signature for order: ${payload.order_id}`
			)
			throw new BadRequestException('Invalid signature')
		}

		const data = JSON.parse(
			Buffer.from(payload.data, 'base64').toString('utf-8')
		)
		const { order_id, status, amount, currency } = data

		this.logger.log(
			`Payment status: ${status}, order: ${order_id}, amount: ${amount} ${currency}`
		)

		switch (status) {
			case 'success':
				this.logger.log(`Payment succeeded: ${order_id}`)
				return await this.processPayment({
					provider: 'liqpay',
					paymentId: order_id
				})
			case 'failure':
				this.logger.warn(`Payment failed: ${order_id}`)
				return await this.updateStatus(
					order_id,
					PaymentStatus.FAILURE
				)
			case 'wait_secure':
			case 'processing':
				this.logger.log(`Payment processing: ${order_id}`)
				return await this.updateStatus(
					order_id,
					PaymentStatus.PROCESSING
				)
			case 'sandbox':
				this.logger.log(`Sandbox payment: ${order_id}`)
				return await this.updateStatus(
					order_id,
					PaymentStatus.CREATED
				)
			default:
				this.logger.warn(
					`Unknown LiqPay status: ${status} for order: ${order_id}`
				)
				return await this.updateStatus(
					order_id,
					PaymentStatus.CREATED
				)
		}
	}

	public async processPayment({
		provider,
		paymentId
	}: {
		provider: 'monobank' | 'cod' | 'liqpay'
		paymentId: string
	}) {
		this.logger.log(`Processing payment: ${paymentId} [${provider}]`)

		const payment = await this.prismaService.payment.findUnique({
			where: {
				invoiceId: paymentId
			}
		})

		if (!payment) {
			this.logger.error(`Payment not found: ${paymentId}`)
			throw new BadRequestException('Payment not found')
		}

		await this.prismaService.payment.update({
			where: { invoiceId: paymentId },
			data: {
				status: PaymentStatus.SUCCESS
			}
		})

		const order = await this.prismaService.order.findFirst({
			where: { paymentId: payment.id },
			include: {
				mainClientInfo: true,
				products: true,
				user: {
					select: {
						id: true,
						email: true,
						firstname: true,
						role: true,
						lastname: true,
						phone: true,
						createdAt: true,
						mfa: {
							select: {
								recoveryCodes: true,
								totp: {
									select: {
										status: true
									}
								}
							}
						}
					}
				}
			}
		})

		await this.mailService.sendOrderSuccess(order, payment)
		await this.botService.sendOrderPurchased(order, payment)
	}

	private async updateStatus(invoiceId: string, status: PaymentStatus) {
		await this.prismaService.payment.update({
			where: { invoiceId },
			data: {
				status
			}
		})
	}
}
