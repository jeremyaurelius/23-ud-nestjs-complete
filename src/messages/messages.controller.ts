import { Body, Param, Controller, Get, Post } from '@nestjs/common';
import { CreateMessageDto } from './dtos/create-message.dto';
import { Message } from './message';

@Controller('messages')
export class MessagesController {

  static nextID = 4;

  // TDOO: move to service or db
  messages: Message[] = [
    {
      id: '1',
      content: "Hola. Me llamo Jeremy",
    },
    {
      id: '2',
      content: "Hola Jeremy. Me llamo David",
    },
    {
      id: '3',
      content: "Encantado de conocerte",
    },
  ];

  @Get()
  listMessages(): Message[] {
    return this.messages;
  }

  /**
   * Creates a message
   * POST '/messages' - JSON.stringify({ "content": "message" })
   */
  @Post()
  createMessage(@Body() body: CreateMessageDto): Message {
    const newMessage = {
      id: MessagesController.nextID + '',
      ...body,
    };
    this.messages = [
      ...this.messages,
      newMessage,
    ];
    MessagesController.nextID++;
    return newMessage;
  }

  /**
   * Gets a message by Id
   */
  @Get(':id')
  getMessage(@Param('id') id: string): Message {
    return this.messages.find(m => m.id === id);
  }
}
