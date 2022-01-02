import { Prop, Schema ,SchemaFactory} from "@nestjs/mongoose";
import { MessagesDto } from "src/dto/chat.dto";
import { Document } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema()
export class Chat{
    @Prop()
    user_id:string
    
    @Prop()
    chat_id:string

    @Prop()
    agent_id:string

    @Prop()
    messages: Array<MessagesDto>

    @Prop({default:Date.now})
    created_at:Date

    @Prop({default:Date.now})
    updated_at:Date

    @Prop({default:true})
    is_active:boolean
}
export const ChatSchema = SchemaFactory.createForClass(Chat);