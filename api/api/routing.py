from channels.routing import route

from main.consumers import (
    ws_connect,
    ws_message,
    ws_disconnect,
    sensordatum_consumer,
    c2_consumer
)

channel_routing = [
    route("websocket.connect", ws_connect),
    route("websocket.receive", ws_message),
    route("websocket.disconnect", ws_disconnect),
    route("sensor-data", sensordatum_consumer),
    route("c2", c2_consumer)
]
