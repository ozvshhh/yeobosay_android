import { ApiProperty } from '@nestjs/swagger';

export class CallSessionResponseDto {
  @ApiProperty({ example: 'cmeyobosay0000session' })
  id: string;

  @ApiProperty({ enum: ['ACTIVE', 'ENDED'], example: 'ACTIVE' })
  status: 'ACTIVE' | 'ENDED';

  @ApiProperty({ example: '2026-05-16T05:00:00.000Z' })
  startedAt: string;

  @ApiProperty({
    example: '2026-05-16T05:10:00.000Z',
    nullable: true,
  })
  endedAt: string | null;

  @ApiProperty({ example: '2026-05-16T05:10:00.000Z' })
  expiresAt: string;
}
