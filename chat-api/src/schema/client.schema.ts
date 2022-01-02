import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ClientDocument = Client & Document

@Schema()
export class Client{

    @Prop()
    user_id:string

    @Prop()
    sender_type:string

    @Prop()
    is_active:boolean

    @Prop({ default: Date.now })
    created_at: Date

}

export const ClientSchema = SchemaFactory.createForClass(Client)