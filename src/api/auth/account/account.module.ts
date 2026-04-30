import { Module } from '@nestjs/common'

import { ManagerBotModule } from '@/bots/manager/manager.bot.module'

import { AccountController } from './account.controller'
import { AccountService } from './account.service'

@Module({
	imports: [ManagerBotModule],
	controllers: [AccountController],
	providers: [AccountService]
})
export class AccountModule {}
