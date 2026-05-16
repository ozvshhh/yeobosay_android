import { ConflictException, NotFoundException } from '@nestjs/common';
import { CallSessionStatus, ConversationRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CallSessionsService } from './call-sessions.service';

const now = new Date('2026-05-16T05:00:00.000Z');
const expiresAt = new Date('2026-05-16T05:10:00.000Z');

describe('CallSessionsService', () => {
  let service: CallSessionsService;
  let prisma: {
    callSession: {
      create: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
    };
    conversationTurn: {
      findMany: jest.Mock;
    };
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(now);

    prisma = {
      callSession: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      conversationTurn: {
        findMany: jest.fn(),
      },
    };

    service = new CallSessionsService(prisma as unknown as PrismaService);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('creates an active call session with a 10 minute expiration', async () => {
    prisma.callSession.create.mockResolvedValue({
      id: 'session-1',
      status: CallSessionStatus.ACTIVE,
      startedAt: now,
      endedAt: null,
      expiresAt,
    });

    await expect(service.create()).resolves.toEqual({
      id: 'session-1',
      status: 'ACTIVE',
      startedAt: '2026-05-16T05:00:00.000Z',
      endedAt: null,
      expiresAt: '2026-05-16T05:10:00.000Z',
    });
    expect(prisma.callSession.create).toHaveBeenCalledWith({
      data: {
        startedAt: now,
        expiresAt,
      },
    });
  });

  it('returns an existing call session', async () => {
    prisma.callSession.findUnique.mockResolvedValue({
      id: 'session-1',
      status: CallSessionStatus.ACTIVE,
      startedAt: now,
      endedAt: null,
      expiresAt,
    });

    await expect(service.findOne('session-1')).resolves.toEqual({
      id: 'session-1',
      status: 'ACTIVE',
      startedAt: '2026-05-16T05:00:00.000Z',
      endedAt: null,
      expiresAt: '2026-05-16T05:10:00.000Z',
    });
  });

  it('throws when a call session does not exist', async () => {
    prisma.callSession.findUnique.mockResolvedValue(null);

    await expect(service.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('returns conversation turns in storage order', async () => {
    prisma.callSession.findUnique.mockResolvedValue({ id: 'session-1' });
    prisma.conversationTurn.findMany.mockResolvedValue([
      {
        id: 'turn-1',
        callSessionId: 'session-1',
        role: ConversationRole.USER,
        text: '오늘 기분이 조금 외로워',
        failed: false,
        riskFlag: true,
        riskType: 'EMOTIONAL_DISTRESS',
        createdAt: now,
      },
    ]);

    await expect(service.findTurns('session-1')).resolves.toEqual({
      callSessionId: 'session-1',
      turns: [
        {
          id: 'turn-1',
          role: 'USER',
          text: '오늘 기분이 조금 외로워',
          failed: false,
          riskFlag: true,
          riskType: 'EMOTIONAL_DISTRESS',
          createdAt: '2026-05-16T05:00:00.000Z',
        },
      ],
    });
    expect(prisma.conversationTurn.findMany).toHaveBeenCalledWith({
      where: { callSessionId: 'session-1' },
      orderBy: { createdAt: 'asc' },
    });
  });

  it('ends an active call session', async () => {
    prisma.callSession.findUnique.mockResolvedValue({
      id: 'session-1',
      status: CallSessionStatus.ACTIVE,
      startedAt: now,
      endedAt: null,
      expiresAt,
    });
    prisma.callSession.update.mockResolvedValue({
      id: 'session-1',
      status: CallSessionStatus.ENDED,
      startedAt: now,
      endedAt: now,
      expiresAt,
    });

    await expect(service.end('session-1')).resolves.toEqual({
      id: 'session-1',
      status: 'ENDED',
      startedAt: '2026-05-16T05:00:00.000Z',
      endedAt: '2026-05-16T05:00:00.000Z',
      expiresAt: '2026-05-16T05:10:00.000Z',
    });
    expect(prisma.callSession.update).toHaveBeenCalledWith({
      where: { id: 'session-1' },
      data: {
        status: CallSessionStatus.ENDED,
        endedAt: now,
      },
    });
  });

  it('throws conflict when ending an already ended call session', async () => {
    prisma.callSession.findUnique.mockResolvedValue({
      id: 'session-1',
      status: CallSessionStatus.ENDED,
      startedAt: now,
      endedAt: now,
      expiresAt,
    });

    await expect(service.end('session-1')).rejects.toBeInstanceOf(
      ConflictException,
    );
  });
});
