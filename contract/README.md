# YeoboSay API Contract

This directory contains shared API contracts between the YeoboSay Android client and NestJS backend.

The purpose of this contract is to allow Android and Backend development to proceed independently while keeping request/response formats, endpoint behavior, enums, and call state transitions aligned.

## Scope

This contract currently focuses on the MVP integration flow:

1. Android starts a scheduled or test call.
2. Backend creates a call session.
3. Android sends call state events.
4. Android creates a WebRTC SDP Offer.
5. Backend exchanges the SDP Offer with OpenAI Realtime and returns an SDP Answer.
6. Android applies the SDP Answer and starts the AI voice call.
7. Android ends the call and Backend stores the final call status.

## Directory Structure

- `rest/openapi.v1.yaml`: REST API contract for Android ↔ Backend integration.
- `websocket/call-events.v1.yaml`: WebSocket event contract for future real-time call synchronization.
- `examples/`: JSON examples for development and mock testing.

## MVP Required APIs

The MVP required APIs are:

- `POST /v1/auth/login`
- `POST /v1/devices/register`
- `GET /v1/users/{userId}`
- `GET /v1/users/{userId}/call-schedules`
- `POST /v1/calls/start`
- `POST /v1/calls/{callId}/events`
- `POST /v1/calls/{callId}/realtime/offer`
- `POST /v1/calls/{callId}/end`
- `GET /v1/calls/{callId}`

## Response Format

All backend API responses should follow this structure:

```json
{
  "data": {},
  "error": null
}
```

Error responses should follow this structure:

```json
{
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

## Notes

- Android must not store or receive the OpenAI API key.
- Backend is responsible for OpenAI Realtime session creation.
- Android is responsible for WebRTC PeerConnection creation and SDP Offer generation.
- Backend returns the SDP Answer to Android.
- WebSocket contracts are planned for second-phase sideband expansion.
````
