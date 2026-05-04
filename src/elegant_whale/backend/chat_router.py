from __future__ import annotations

from typing import AsyncGenerator

import httpx
from fastapi import HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from .core import Dependencies, create_router

router = create_router()


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]


async def _stream_agent_response(
    host: str,
    auth_headers: dict[str, str],
    messages: list[dict],
    serving_endpoint: str,
) -> AsyncGenerator[str, None]:
    url = f"{host}/serving-endpoints/{serving_endpoint}/invocations"
    headers = {
        **auth_headers,
        "Content-Type": "application/json",
    }
    payload = {
        "input": messages,
        "stream": True,
    }

    async with httpx.AsyncClient(timeout=httpx.Timeout(300.0)) as client:
        async with client.stream(
            "POST",
            url,
            headers=headers,
            json=payload,
        ) as response:
            if response.status_code != 200:
                body = await response.aread()
                yield f'data: {{"error": "{body.decode()}"}}\n\n'
                return
            async for line in response.aiter_lines():
                if line:
                    yield f"{line}\n"


@router.post("/chat", operation_id="chat")
async def chat(
    request: ChatRequest,
    ws: Dependencies.Client,
    config: Dependencies.Config,
):
    host = ws.config.host.rstrip("/")
    auth_headers = ws.config.authenticate()

    messages = [{"role": m.role, "content": m.content} for m in request.messages]

    return StreamingResponse(
        _stream_agent_response(host, auth_headers, messages, config.serving_endpoint),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
