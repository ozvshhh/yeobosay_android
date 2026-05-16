import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CallSessionsController } from './call-sessions.controller';
import { CallSessionsService } from './call-sessions.service';

@Module({
  imports: [PrismaModule],
  controllers: [CallSessionsController],
  providers: [CallSessionsService],
})
export class CallSessionsModule {}
