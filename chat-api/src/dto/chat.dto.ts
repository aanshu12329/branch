
export enum Sender {
    AGET = "agent",
    CLIENT = "client",
    ADMIN = "admin"
  }

export class ChatInitiationDto {
    user_id?: string;
    sender_type?: string;
    is_Active?:boolean
}

export class ChatDto {
    user_id?:string
    chat_id?: string;
    agent_id?: string
    messages?: Array<MessagesDto>
    created_at?: Date
    updated_at?: Date
    //chat_type:string
}

export class MessagesDto {
    message_id?: number;
    message?: string;
    id?: string;
    is_read_by_client?: boolean;
    is_read_by_agent?: boolean;
    is_deleted_by_client?: boolean;
    is_deleted_by_agent?: boolean;
    sender_type?: string;
    date?: Date;
    //message_type: string;
    //request_info?: Object;
}

export class SendMessageDto extends MessagesDto {
    chat_id?: string;
}

export class ResolveChatIdDto {
    chat_id?: string
    agent_id?: string
}