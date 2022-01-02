import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './chat.gateway';
import { Chat, ChatSchema } from './schema/chat.schema';
import { ClientSchema } from './schema/client.schema';
import { Client } from './schema/client.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/branch'),
    MongooseModule.forFeature([{name:Client.name, schema:ClientSchema},
      {name:Chat.name, schema:ChatSchema}
    ])
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
