import { Global, Module } from '@nestjs/common';

import { DatabaseModule } from '@gitroom/nestjs-libraries/database/prisma/database.module';
import { ApiModule } from '@gitroom/backend/api/api.module';
import { APP_GUARD } from '@nestjs/core';
import { PoliciesGuard } from '@gitroom/backend/services/auth/permissions/permissions.guard';
import { BullMqModule } from '@gitroom/nestjs-libraries/bull-mq-transport-new/bull.mq.module';
import { PluginModule } from '@gitroom/plugins/plugin.module';
import { PublicApiModule } from '@gitroom/backend/public-api/public.api.module';
import { ThrottlerBehindProxyGuard } from '@gitroom/nestjs-libraries/throttler/throttler.provider';
import { ThrottlerModule } from '@nestjs/throttler';
import { AgentModule } from '@gitroom/nestjs-libraries/agent/agent.module';
import { McpModule } from '@gitroom/backend/mcp/mcp.module';
import { ThirdPartyModule } from '@gitroom/nestjs-libraries/3rdparties/thirdparty.module';

@Global()
@Module({
  imports: [
    BullMqModule,
    DatabaseModule,
    ApiModule,
    PluginModule,
    PublicApiModule,
    // AgentModule,  // DISABLED: AI/ML features
    // McpModule,  // DISABLED: MCP features
    // ThirdPartyModule,  // DISABLED: 3rd party integrations
    ThrottlerModule.forRoot([
      {
        ttl: 3600000,
        limit: process.env.API_LIMIT ? Number(process.env.API_LIMIT) : 30,
      },
    ]),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PoliciesGuard,
    },
  ],
  exports: [
    BullMqModule,
    DatabaseModule,
    ApiModule,
    PluginModule,
    PublicApiModule,
    // AgentModule,  // DISABLED
    // McpModule,  // DISABLED
    ThrottlerModule,
  ],
})
export class AppModule {}
