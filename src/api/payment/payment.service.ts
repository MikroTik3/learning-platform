import {
	BadRequestException,
	ConflictException,
	Injectable
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PaymentMethod, type User } from '@prisma/generated'
import { MonobankService } from 'nestjs-monobank'

import { ManagerBotService } from '@/bots/manager/manager.bot.service'
import { PrismaService } from '@/infra/prisma/prisma.service'
import {
	LiqPayAction,
	LiqPayCurrency,
	LiqPayLanguage
} from '@/libs/liqpay/enums'
import { LiqpayService } from '@/libs/liqpay/liqpay.service'
import { MailService } from '@/libs/mail/mail.service'

import { InitPaymentRequest } from './dto'

@Injectable()
export class PaymentService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly monobankService: MonobankService,
		private readonly liqpayService: LiqpayService,
		private readonly botService: ManagerBotService,
		private readonly configService: ConfigService,
		private readonly mailService: MailService
	) {}

	public async create(dto: InitPaymentRequest, user?: User) {
		const { method, orderId, email } = dto

		const order = await this.prismaService.order.findUnique({
			where: { id: orderId },
			include: {
				products: true,
				mainClientInfo: true
			}
		})

		if (user) {
			if (!user.email) {
				if (!email)
					throw new BadRequestException(
						'Email is required to proceed with the payment'
					)

				const emailExists =
					await this.prismaService.user.findUnique({
						where: {
							email
						}
					})

				if (emailExists)
					throw new ConflictException(
						'This email is already in use'
					)

				const updatedUser =
					await this.prismaService.user.update({
						where: {
							id: user.id
						},
						data: {
							email
						}
					})

				user = updatedUser
			}
		}

		const payment = await this.prismaService.payment.create({
			data: {
				amount: order.total,
				method,
				invoiceId: this.generateInvoiceId(),
				user: user ? { connect: { id: user.id } } : undefined,
				order: {
					connect: {
						id: order.id
					}
				}
			}
		})

		await this.prismaService.order.update({
			where: { id: order.id },
			data: { paymentId: payment.id }
		})

		let providerResponse

		switch (method) {
			case PaymentMethod.MONOBANK:
				providerResponse =
					await this.monobankService.invoices.create({
						amount: order.total * 100,
						merchantPaymInfo: {
							reference: payment.invoiceId,
							destination:
								'Оплата вашого замовлення',
							basketOrder: order.products.map(
								product => ({
									name: product.name,
									qty: product.quantity,
									sum:
										product.price *
										product.quantity *
										100,
									icon: product.imageUrl,
									unit: 'шт.',
									code: product.id
								})
							)
						},
						webHookUrl: `${this.configService.get<string>('HOSTS_REST')}/api/v1/webhook/monobank`,
						redirectUrl: `${this.configService.get<string>('HOSTS_APP')}/payment/success`,
						validity: 3600 * 24 * 7,
						paymentType: 'debit'
					})
				break
			case PaymentMethod.LIQPAY:
				providerResponse = await this.liqpayService.create({
					action: LiqPayAction.INVOICE,
					version: 3,
					public_key: this.configService.get<string>(
						'LIQPAY_API_KEY_PUBLIC'
					),
					description: 'Оплата вашого замовлення',
					email: order.mainClientInfo.email,
					currency: LiqPayCurrency.UAH,
					amount: order.total,
					order_id: payment.invoiceId,
					language: LiqPayLanguage.UK,
					rro_info: {
						items: order.products.map(product => ({
							amount: product.quantity,
							cost:
								product.price *
								product.quantity,
							id: product.id,
							price: product.price
						})),
						delivery_emails: [
							order.mainClientInfo.email
						]
					},
					server_url: `${this.configService.get<string>('HOSTS_REST')}/api/v1/webhook/liqpay`,
					result_url: `${this.configService.get<string>('HOSTS_APP')}/payment/success`
				})
				break
			case PaymentMethod.COD:
				await this.mailService.sendOrderSuccess(order, payment)
				await this.botService.sendOrderPurchased(order, payment)

				providerResponse = {
					pageUrl: `${this.configService.get<string>('HOSTS_APP')}/order/success`
				}

				break
			default:
				throw new BadRequestException(
					'Unsupported payment provider'
				)
		}

		return {
			url: providerResponse?.pageUrl ?? providerResponse?.href
		}
	}

	private generateInvoiceId() {
		const digits = 8

		const min = Math.pow(10, digits - 1)
		const max = Math.pow(10, digits) - 1

		return String(Math.floor(Math.random() * (max - min + 1)) + min)
	}
}
