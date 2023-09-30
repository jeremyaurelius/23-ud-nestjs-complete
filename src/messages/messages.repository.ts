import { readFile, writeFile } from 'fs/promises';
import { Message } from './message';
import { CreateMessageDto } from './dtos/create-message.dto';
import * as uuid from 'uuid';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagesRepository {

  async findOne(id: string): Promise<Message> {
    const dictionary = await this._readJSON();
    return dictionary[id];
  }

  async findAll(): Promise<Message[]> {
    const dictionary = await this._readJSON();
    return Object.keys(dictionary).map((key) => dictionary[key]);
  }

  async create(message: CreateMessageDto): Promise<Message> {
    const dictionary = await this._readJSON();
    const newMessage = this._buildMessage(message)
    dictionary[newMessage.id] = newMessage;
    await this._persistJSON(dictionary);
    return newMessage;
  }

  private _buildMessage(message: CreateMessageDto): Message {
    return {
      ...message,
      id: uuid.v1(),
    };
  }

  private async _readJSON(): Promise<Record<string, Message>> {
    try {
      const contents = await readFile('messages.json', 'utf8');
      return JSON.parse(contents);
    } catch (e) {
      console.error('e', e);
      if (e.code === 'ENOENT') {
        return {};
      }
    }
  }

  private async _persistJSON(newContents: Record<string, Message>) {
    await writeFile('messages.json', JSON.stringify(newContents), 'utf8');
  }
}
