import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import e from 'express';
import { appendFile } from 'fs';
import { Model, UpdateWriteOpResult } from 'mongoose';
import { ChatDto, ChatInitiationDto, ResolveChatIdDto, SendMessageDto } from './dto/chat.dto';
import { Chat, ChatDocument } from './schema/chat.schema';
import { ClientDocument } from './schema/client.schema';
import { Client } from './schema/client.schema';

@Injectable()
export class AppService {

  private logger : Logger = new Logger()

  constructor(
    @InjectModel(Client.name) private cleintModel:Model<ClientDocument>,
    @InjectModel(Chat.name) private chatModel:Model<ChatDocument>
  ){}
  
  
  getHello(): string {
    return 'Hello World!';
  }

  public async createClient(payload:ChatInitiationDto):Promise<any>{
     try{
          const resp: ClientDocument = await this.cleintModel.create({
          user_id:payload.user_id,
          sender_type:payload.sender_type,
          is_active:true
          })
          return resp
     }
     catch(error){
       console.log('Create user error ' + error)
       throw new Error(error);
     }
    return false
  }

  public async initiateChat(payload:ChatInitiationDto):Promise<any>{
    try{
        var ifPresent = await this.cleintModel.findOne({user_id:payload.user_id})
        if(!ifPresent){
          const respo = await this.createClient(payload);
          this.logger.log("New User OnBoarded " + respo)
          const request:ChatDto = {
            user_id:payload.user_id,
            chat_id: payload.user_id + "-cid-" + new Date().getTime(),
            updated_at: new Date(),
            created_at: new Date(),
            agent_id: '',
            messages: []
          }
          const resp: ChatDocument = await this.chatModel.create(request);
          this.logger.log("New Chat Initiated by user chat object " + resp.chat_id)
          return { message: "New Chat Initiated Success", statusCode: HttpStatus.ACCEPTED, data: resp,chat_id:request.chat_id};
          }else{
            const doc:ChatDocument = await this.chatModel.findOne({$and : [{user_id : payload.user_id}, {is_active :true}]}).sort({createAt:-1})
            if(!doc)
            {
              const request:ChatDto = {
                user_id:payload.user_id,
                chat_id: payload.user_id + "-cid-" + new Date().getTime(),
                updated_at: new Date(),
                created_at: new Date(),
                agent_id: '',
                messages: []
              }
              
              const resp: ChatDocument = await this.chatModel.create(request);
              this.logger.log("New Chat Initiated by user chat object " + resp.chat_id)
              return { message: "New Chat Initiated Success", statusCode: HttpStatus.ACCEPTED, data: resp,chat_id:request.chat_id};
            }
            this.logger.log(doc.chat_id + "  " + doc)
            return { message: "Old Unresolved Chat", statusCode: HttpStatus.ACCEPTED, data: doc,chat_id:doc.chat_id};
          }
    }
    catch(error){
      console.log('Initiate chat error ' + error)
      throw new Error(error)
    }

  }
  
  public async sendMessage(request: SendMessageDto): Promise<any> {
    try {
      const prevDetails: ChatDocument = await this.chatModel.findOne({ chat_id: request.chat_id })
      const a_id = request.sender_type == "agent" ? request.id : ""
      console.log('sendMessage request: ', request);
      
      const newMessage: SendMessageDto = {
        message_id: new Date().getTime(),
        message: request.message,
        id: request.id,
        sender_type: request.sender_type,
        date: new Date()
        //message_type: request.message_type,
      }
      switch (true){
        case request.sender_type === "client" : {
          newMessage.is_read_by_client = true;
          newMessage.is_read_by_agent = false;
          newMessage.is_deleted_by_client =  false;
          newMessage.is_deleted_by_agent=  false;
        } break;
        case request.sender_type === "agent" : {
          newMessage.is_read_by_client = false;
          newMessage.is_read_by_agent = true;
          newMessage.is_deleted_by_client =  false;
          newMessage.is_deleted_by_agent=  false;
        }
        break;
       default : {
        newMessage.is_read_by_client = false;
        newMessage.is_read_by_agent = false;
        newMessage.is_deleted_by_client =  false;
        newMessage.is_deleted_by_agent=  false;
        }
        break;
      }
      const resp: UpdateWriteOpResult = await this.chatModel.updateOne(
        { chat_id: request.chat_id },
        {
          $push: {
            messages: newMessage
          },
          $set: {
            updated_at: new Date(),
            agent_id:a_id
          }
        }
      );
      console.log('sendMessage resp: ', resp);
      let response = {}
      if (resp.modifiedCount > 0) {
        response = { message: "Sent Message.", statusCode: 200 , message_id : newMessage.id}
      } else {
        response = { message: "Something went wrong.", statusCode: 500 };
      }
      return response;
    } catch (error) {
      console.log('sendMessage error: ', error);
      throw new Error(error)
    }
  }

  public async resolveChatID(request: ResolveChatIdDto): Promise<any>{
    const resp: UpdateWriteOpResult = await this.chatModel.updateOne(
      { chat_id: request.chat_id },
      {
        $set: {
          is_active: false
        }
      }
    );
    this.logger.log('sendMessage resp: ', resp);
    let response = {}
    if (resp.modifiedCount > 0) {
      response = { message: "Chat resolved by agent Message.", statusCode: 200 , chat_id:request.chat_id , agent_id:request.agent_id }
    } else {
      response = { message: "Chat not resolved Something went wrong.", statusCode: 500 };
    }
  }

  public async getAllUnResolvedChatList()
  {
    const resp_ : ChatDocument[] = await this.chatModel.find({is_active:true})
    let response = { message: "Chat resolved by agent Message.", statusCode: 200 , list:resp_}
    return response
  }
}
