import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CallSessionResponseDto } from './call-session-response.dto';
import { CallSessionsService } from './call-sessions.service';
import { ConversationTurnListResponseDto } from './conversation-turn-response.dto';

@ApiTags('Call Sessions')
@Controller('call-sessions')
export class CallSessionsController {
  constructor(private readonly callSessionsService: CallSessionsService) {}

  @Post()
  @ApiCreatedResponse({ type: CallSessionResponseDto })
  create(): Promise<CallSessionResponseDto> {
    return this.callSessionsService.create();
  }

  @Get(':id')
  @ApiOkResponse({ type: CallSessionResponseDto })
  @ApiNotFoundResponse({ description: 'Call session not found.' })
  findOne(@Param('id') id: string): Promise<CallSessionResponseDto> {
    return this.callSessionsService.findOne(id);
  }

  @Get(':id/turns')
  @ApiOkResponse({ type: ConversationTurnListResponseDto })
  @ApiNotFoundResponse({ description: 'Call session not found.' })
  findTurns(@Param('id') id: string): Promise<ConversationTurnListResponseDto> {
    return this.callSessionsService.findTurns(id);
  }

  @Post(':id/end')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CallSessionResponseDto })
  @ApiNotFoundResponse({ description: 'Call session not found.' })
  @ApiConflictResponse({ description: 'Call session is already ended.' })
  end(@Param('id') id: string): Promise<CallSessionResponseDto> {
    return this.callSessionsService.end(id);
  }
}
