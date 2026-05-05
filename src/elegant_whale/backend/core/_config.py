from __future__ import annotations

import logging
from importlib import resources
from pathlib import Path
from typing import ClassVar, Literal

from dotenv import load_dotenv
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

from ..._metadata import app_name, app_slug

AuthMode = Literal["auto", "obo", "app_sp"]

# --- Config ---

project_root = Path(__file__).parent.parent.parent.parent.parent
env_file = project_root / ".env"

if env_file.exists():
    load_dotenv(dotenv_path=env_file)


class AppConfig(BaseSettings):
    model_config: ClassVar[SettingsConfigDict] = SettingsConfigDict(
        env_file=env_file,
        env_prefix=f"{app_slug.upper()}_",
        extra="ignore",
        env_nested_delimiter="__",
    )
    app_name: str = Field(default=app_name)
    serving_endpoint: str = Field(default="mas-c15b1e56-endpoint")
    # auth_mode controls how chat_router authenticates to the serving endpoint:
    #   "auto"   — OBO when the X-Forwarded-Access-Token is present (deployed),
    #              fall back to the app SP otherwise (local dev).
    #   "obo"    — strict OBO; reject requests that don't carry the user token.
    #   "app_sp" — always use the app SP; ignore any forwarded user token.
    auth_mode: AuthMode = Field(default="auto")

    @property
    def static_assets_path(self) -> Path:
        return Path(str(resources.files(app_slug))).joinpath("__dist__")

    def __hash__(self) -> int:
        return hash(self.app_name)


# --- Logger ---

logger = logging.getLogger(app_name)
