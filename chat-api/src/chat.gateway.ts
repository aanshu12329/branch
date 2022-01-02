import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server , Socket } from 'socket.io';
import { AppService } from './app.service';
import { SendMessageDto } from './dto/chat.dto';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect{

  constructor(private readonly appService: AppService) {}

  clientId:any = []
  agentId:any = []
  Room_:string =""

  @WebSocketServer()
  server : Server

  private logger : Logger = new Logger()

  handleConnection(client: Socket) {

    this.logger.log(`Client connedted ${client.id}`)
  }
  
  afterInit(server: Server) {
    this.logger.log('Init')
  }
  
  handleDisconnect(client: Socket) {

    this.logger.log(`Client disconnected ${client.id}`)
    
  }

  @SubscribeMessage('messageToServer')
  async handleMessage(client: Socket , body: any): Promise<void> {
    this.logger.log("CLIENT:::" + body + "  "+client.id)
    const payload : SendMessageDto ={
      chat_id: body.chat_id,
      message: body.message,
      id: body.id,
      sender_type: body.sender_type,
      
    }
    const response = await this.appService.sendMessage(payload)
    this.logger.log("Response is " + JSON.stringify(response))
    client.to(body.room).emit('msgToClient', { message : body.message, sender_type : body.sender_type});
    return response;
    /*this.server.to(client.id).emit('msgToClient', payload )
    this.server.
    client.emit('msgToClient',"89")
    client.emit('messageToServer',"09")
    //this.server.emit('msgToClient', payload , client.id)*/
  }
  
  @SubscribeMessage('message')
  handleMessageRoom(client: Socket , room: any): void {
    this.logger.log("CLIENT:::" + JSON.stringify(room) + "  "+client.id + " " + room.room)
    client.join(room.room);
    this.Room_ = room.room
    /*this.server.to(client.id).emit('msgToClient', payload )
    this.server.
    client.emit('msgToClient',"89")
    client.emit('messageToServer',"09")
    //this.server.emit('msgToClient', payload , client.id)*/
  }
}
