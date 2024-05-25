import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];
  messageChangedEvent = new EventEmitter<Message[]>();

  constructor() {
    this.messages = MOCKMESSAGES;
   }

  getMessages(): Message[] {
    return this.messages.slice();
  }

  getMessage(id: string): Message {
    let theMessage: Message = null;
    this.messages.forEach(msg => {
      if(msg.id === id){
        theMessage = msg;
      }
    })
    return theMessage;
  }

  addMessage(message: Message){
    this.messages.push(message);
    this.messageChangedEvent.emit(this.messages.slice());
  }

}
