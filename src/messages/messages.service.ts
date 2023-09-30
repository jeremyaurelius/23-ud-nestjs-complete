import { Injectable } from "@nestjs/common";
import { CreateMessageDto } from "./dtos/create-message.dto";
import { MessagesRepository } from "./messages.repository";

@Injectable()
export class MessagesService {

  constructor(
    private messagesRepo: MessagesRepository,
  ) {}

  findOne(id: string) {
    return this.messagesRepo.findOne(id);
  }

  findAll() {
    return this.messagesRepo.findAll();
  }

  create(message: CreateMessageDto) {
    return this.messagesRepo.create(message);
  }
}
