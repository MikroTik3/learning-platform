import { Module } from '@nestjs/common'

import { ManagerBotModule } from './manager/manager.bot.module'

@Module({
	imports: [ManagerBotModule],
	exports: [ManagerBotModule]
})
export class BotModule {}
