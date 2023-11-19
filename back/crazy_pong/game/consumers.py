import json
import asyncio

from channels.generic.websocket import AsyncWebsocketConsumer

matchmaking = []

class gameConnection(AsyncWebsocketConsumer):
    
    async def connect(self):
        await self.accept()
        print("Connected to client")


    async def disconnect(self, code):
        print("disconnected") 
    


    async def receive(self, text_data):
        print(text_data)
        if (text_data == "buscar"):
            if (len(matchmaking) == 0):
                matchmaking.append(self)
                await self.send("Waiting for another client")
                while (self in matchmaking):
                    await asyncio.sleep(0.01)
            else:
                client2 = matchmaking.pop()
                await asyncio.sleep(3)
                i = 0
                while (i < 30):
                    await asyncio.sleep(1)
                    await self.send("Current second: " + str(i))
                    await client2.send("Current second: " + str(i))
                    i +=1
        else:
            self.send("Unknown command")
