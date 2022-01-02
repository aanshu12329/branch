import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ChatInitiationDto, ResolveChatIdDto, SendMessageDto } from './dto/chat.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('initiate-chat')
  async initiateChat(@Body() payload:ChatInitiationDto ):Promise<any>{
    if(payload==null)
    {
      return {message: "Chat initiiation Payload Is Empty", statusCode: HttpStatus.BAD_REQUEST}
    }else{
       const response = await this.appService.initiateChat(payload)
       return response
    }
  }

  @Post('send-message')
  async sendMessage(@Body() payload: SendMessageDto) {
    console.log('payload: ', payload);
    if (!payload) {
      return {message: " Message Payload Is Empty", statusCode: HttpStatus.BAD_REQUEST}
    }
    const response = await this.appService.sendMessage(payload)
    return response;
  }

  @Post('resolve-chat-id')
  async resolveChatId(@Body() payload:ResolveChatIdDto) {
    if (!payload) {
      return {message: " ResolveChatId Payload Is Empty", statusCode: HttpStatus.BAD_REQUEST}
    }else{
      const response = await this.appService.resolveChatID(payload)
      return response
    }
  }

  @Get('get-all-unresolved-chat')
  async getAllUnResolvedChatList()
  {
    const response = await this.appService.getAllUnResolvedChatList()
    return response
  }
}
