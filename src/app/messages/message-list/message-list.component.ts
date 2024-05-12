import { Component } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent {
  messages: Message[] = [
    new Message('001', "Birthday", "Hey! John's birthday party is this saturday at 4PM. You coming?", "Bob"),
    new Message('002', "Birthday", "Sure. Count me in. Should I bring anything?", "Joe"),
    new Message('003', "Birthday", "Bring the joy.", "Bob")
  ]

  onAddMessage(message: Message){
    this.messages.push(message);
  }
}
