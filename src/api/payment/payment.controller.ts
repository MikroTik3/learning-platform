import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiHeader, ApiOkResponse, ApiOperation } from '@nestjs/swagger'
import { User } from '@prisma/generated'

import { Authorized, OptionalAuthorization } from '@/shared/decorators'

import { InitPaymentRequest, InitPaymentResponse } from './dto'
import { PaymentService } from './payment.service'

@Controller('payment')
export class PaymentController {
	public constructor(private readonly paymentService: PaymentService) {}

	@ApiOperation({
		summary: 'Init Payment',
		description:
			'Creates a new payment and returns a URL to complete the payment process.'
	})
	@ApiOkResponse({
		type: InitPaymentResponse
	})
	@ApiHeader({
		name: 'X-Session-Token',
		required: true
	})
	@OptionalAuthorization()
	@Post('init')
	@HttpCode(HttpStatus.OK)
	public async init(
		@Body() dto: InitPaymentRequest,
		@Authorized() user: User
	) {
		return await this.paymentService.create(dto, user)
	}
}
