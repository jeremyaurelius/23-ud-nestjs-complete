import { Controller, Get, Post } from '@nestjs/common';

@Controller('messages')
export class MessagesController {

  // TDOO: move
  messages = [
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
  listMessages() {
    return JSON.stringify(this.messages);
  }

  /**
   * Creates a message
   * POST '/messages' - JSON.stringify({ "content": "message" })
   */
  @Post()
  createMessage() {
  }

  /**
   * Gets a message by Id
   */
  @Get(':id')
  getMessage() {
    return JSON.stringify(this.messages[0]);
  }
}
