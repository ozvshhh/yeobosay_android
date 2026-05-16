import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CallSessionStatus } from '@prisma/client';
import type { CallSession, ConversationTurn } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CallSessionResponseDto } from './call-session-response.dto';
import {
  ConversationTurnListResponseDto,
  ConversationTurnResponseDto,
} from './conversation-turn-response.dto';

const CALL_SESSION_DURATION_MS = 10 * 60 * 1000;

@Injectable()
export class CallSessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(): Promise<CallSessionResponseDto> {
    const startedAt = new Date();
    const expiresAt = new Date(startedAt.getTime() + CALL_SESSION_DURATION_MS);

    const session = await this.prisma.callSession.create({
      data: {
        startedAt,
        expiresAt,
      },
    });

    return this.toCallSessionResponse(session);
  }

  async findOne(id: string): Promise<CallSessionResponseDto> {
    const session = await this.prisma.callSession.findUnique({
      where: { id },
    });

    if (!session) {
      throw new NotFoundException('Call session not found.');
    }

    return this.toCallSessionResponse(session);
  }

  async findTurns(id: string): Promise<ConversationTurnListResponseDto> {
    await this.ensureSessionExists(id);

    const turns = await this.prisma.conversationTurn.findMany({
      where: { callSessionId: id },
      orderBy: { createdAt: 'asc' },
    });

    return {
      callSessionId: id,
      turns: turns.map((turn) => this.toConversationTurnResponse(turn)),
    };
  }

  async end(id: string): Promise<CallSessionResponseDto> {
    const session = await this.prisma.callSession.findUnique({
      where: { id },
    });

    if (!session) {
      throw new NotFoundException('Call session not found.');
    }

    if (session.status === CallSessionStatus.ENDED) {
      throw new ConflictException('Call session is already ended.');
    }

    const endedSession = await this.prisma.callSession.update({
      where: { id },
      data: {
        status: CallSessionStatus.ENDED,
        endedAt: new Date(),
      },
    });

    return this.toCallSessionResponse(endedSession);
  }

  private async ensureSessionExists(id: string): Promise<void> {
    const session = await this.prisma.callSession.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!session) {
      throw new NotFoundException('Call session not found.');
    }
  }

  private toCallSessionResponse(session: CallSession): CallSessionResponseDto {
    return {
      id: session.id,
      status: session.status,
      startedAt: session.startedAt.toISOString(),
      endedAt: session.endedAt?.toISOString() ?? null,
      expiresAt: session.expiresAt.toISOString(),
    };
  }

  private toConversationTurnResponse(
    turn: ConversationTurn,
  ): ConversationTurnResponseDto {
    return {
      id: turn.id,
      role: turn.role,
      text: turn.text,
      failed: turn.failed,
      riskFlag: turn.riskFlag,
      riskType: turn.riskType,
      createdAt: turn.createdAt.toISOString(),
    };
  }
}
