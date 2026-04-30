import type { AppConfig } from './app.config'
import type { HostsConfig } from './hosts.config'
import type { KinescopeConfig } from './kinescope.config'
import type { MailerConfig } from './mailer.config'
import type { MonobankConfig } from './monobank.config'
import type { QueueConfig } from './queue.config'
import type { RedisConfig } from './redis.config'
import type { SentinelConfig } from './sentinel.config'
import type { StorageConfig } from './storage.config'
import type { TelegramConfig } from './telegram.config'
import type { TurnstileConfig } from './turnstile.config'
import type { WebAuthnConfig } from './webauthn.config'

export interface AllConfigs {
	app: AppConfig
	hosts: HostsConfig
	kinescope: KinescopeConfig
	mailer: MailerConfig
	queue: QueueConfig
	redis: RedisConfig
	sentinel: SentinelConfig
	storage: StorageConfig
	telegram: TelegramConfig
	turnstile: TurnstileConfig
	webauthn: WebAuthnConfig
	monobank: MonobankConfig
}
