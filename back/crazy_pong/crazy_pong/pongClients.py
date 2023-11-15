# clientsPong.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class pongClients(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['hello from the server']

        # Process the message and send a response if needed
        await self.send(text_data=json.dumps({'message': message}))