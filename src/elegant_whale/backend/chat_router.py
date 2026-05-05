from __future__ import annotations

from typing import AsyncGenerator

import httpx
from databricks.sdk import WorkspaceClient
from fastapi import HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from .core import Dependencies, create_router
from .core._config import logger

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
    headers_dep: Dependencies.Headers,
    config: Dependencies.Config,
):
    obo_token = headers_dep.token.get_secret_value() if headers_dep.token else None

    if config.auth_mode == "obo":
        if not obo_token:
            raise HTTPException(
                status_code=401,
                detail=(
                    "auth_mode=obo requires the X-Forwarded-Access-Token header. "
                    "It is set automatically on deployed Databricks Apps for SSO users."
                ),
            )
        client = WorkspaceClient(token=obo_token, auth_type="pat")
        mode_used = "obo"
    elif config.auth_mode == "app_sp":
        client = ws
        mode_used = "app_sp"
    else:  # auto
        if obo_token:
            client = WorkspaceClient(token=obo_token, auth_type="pat")
            mode_used = "obo"
        else:
            client = ws
            mode_used = "app_sp"

    logger.info(f"chat: auth_mode={config.auth_mode} resolved={mode_used}")
    host = client.config.host.rstrip("/")
    auth_headers = client.config.authenticate()

    messages = [{"role": m.role, "content": m.content} for m in request.messages]

    return StreamingResponse(
        _stream_agent_response(host, auth_headers, messages, config.serving_endpoint),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
