import { Body, Param, Controller, Get, Post, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dtos/create-message.dto';
import { Message } from './message';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {

  constructor(
    private messagesService: MessagesService,
  ) {}

  @Get()
  async listMessages(): Promise<Message[]> {
    return this.messagesService.findAll();
  }

  /**
   * Creates a message
   * POST '/messages' - JSON.stringify({ "content": "message" })
   */
  @Post()
  async createMessage(@Body() body: CreateMessageDto): Promise<Message> {
    return this.messagesService.create(body);
  }

  /**
   * Gets a message by Id
   */
  @Get(':id')
  async getMessage(@Param('id') id: string): Promise<Message> {
    const message = await this.messagesService.findOne(id);
    if (!message) {
      throw new NotFoundException('message not found');
    }
    return message;
  }
}
