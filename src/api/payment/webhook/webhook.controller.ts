import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Ip,
	Post
} from '@nestjs/common'
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger'

import { WebhookService } from './webhook.service'

@Controller('webhook')
export class WebhookController {
	public constructor(
		private readonly webhookService: WebhookService
	) {}

	@ApiOperation({
		summary: 'Monobank Webhook',
		description: 'Endpoint to receive Monobank webhook events'
	})
	@ApiOkResponse({
		description: 'Webhook processed successfully',
		schema: {
			example: { ok: true }
		}
	})
	@Post('monobank')
	@HttpCode(HttpStatus.OK)
	public async monobank(@Body() payload: any, @Ip() ip: string) {
	}
}
