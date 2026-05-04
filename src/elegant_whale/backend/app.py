from .core import create_app
from .router import router
from .chat_router import router as chat_router

app = create_app(routers=[router, chat_router])
