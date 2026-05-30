import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export const CALL_SESSION_MODES = [
  'manual_recording',
  'auto_conversation',
] as const;

export type CallSessionModeRequest = (typeof CALL_SESSION_MODES)[number];

export class CreateCallSessionDto {
  @ApiPropertyOptional({
    enum: CALL_SESSION_MODES,
    default: 'manual_recording',
    description:
      'manual_recording keeps the MVP record-button flow. auto_conversation starts the phone-like automatic call flow.',
  })
  @IsOptional()
  @IsIn(CALL_SESSION_MODES)
  mode?: CallSessionModeRequest;

  @ApiPropertyOptional({
    example: 'incoming_call',
    description: 'Client-side source that created the session.',
  })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiPropertyOptional({
    example: 'cmeyobosay0000invitation',
    description: 'Optional invitation id accepted before the session started.',
  })
  @IsOptional()
  @IsString()
  callInvitationId?: string;

  @ApiPropertyOptional({
    example: 'android-session-1700000000',
    description: 'Optional Android-generated id used for client diagnostics.',
  })
  @IsOptional()
  @IsString()
  clientSessionId?: string;
}
