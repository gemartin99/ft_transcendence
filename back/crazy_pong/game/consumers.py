import json
import asyncio

from channels.generic.websocket import AsyncWebsocketConsumer

clients_connected = {}

class gameConnection(AsyncWebsocketConsumer):
    
    async def connect(self):
        await self.accept()
        print("Connected to client")
        clients_connected[self.scope["session"]] = self
        await self.send("Waiting for another client")
        while (len(clients_connected) %2 ==  1):
            await asyncio.sleep(0.01)
        await asyncio.sleep(5)
        i = 0
        while (i < 30):
            await asyncio.sleep(1)
            await self.send("Current second: " + str(i))
            i +=1


    async def disconnect(self, code):
        print("disconnected") 
    


    async def receive(self, data):
        print(data)
        self.send("hello from server") 

