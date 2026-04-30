import { DocumentBuilder } from '@nestjs/swagger'

export function getSwaggerConfig() {
	return new DocumentBuilder()
		.setTitle('Learning Platform API')
		.setDescription('API for Learning educational platform')
		.setVersion('1.0.0')
		.setContact(
			'MikroTik3 Support',
			'https://docenko.vercel.app',
			'dotsenk20034@gmail.com'
		)
		.setLicense(
			'AGPLv3',
			'https://github.com/MikroTik3/learning-platform/blob/master/LICENSE'
		)
		.build()
}
