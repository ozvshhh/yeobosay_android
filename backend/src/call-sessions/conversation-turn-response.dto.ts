import { ApiProperty } from '@nestjs/swagger';

export class ConversationTurnResponseDto {
  @ApiProperty({ example: 'cmeyobosay0000turn' })
  id: string;

  @ApiProperty({ enum: ['USER', 'ASSISTANT'], example: 'USER' })
  role: 'USER' | 'ASSISTANT';

  @ApiProperty({ example: '오늘 기분이 조금 외로워' })
  text: string;

  @ApiProperty({ example: false })
  failed: boolean;

  @ApiProperty({ example: false })
  riskFlag: boolean;

  @ApiProperty({ example: 'EMOTIONAL_DISTRESS', nullable: true })
  riskType: string | null;

  @ApiProperty({ example: '2026-05-16T05:00:10.000Z' })
  createdAt: string;
}

export class ConversationTurnListResponseDto {
  @ApiProperty({ example: 'cmeyobosay0000session' })
  callSessionId: string;

  @ApiProperty({ type: [ConversationTurnResponseDto] })
  turns: ConversationTurnResponseDto[];
}
