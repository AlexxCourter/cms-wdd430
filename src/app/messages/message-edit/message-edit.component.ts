import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrl: './message-edit.component.css'
})
export class MessageEditComponent {
  @ViewChild('subjectInput') subjectInputRef: ElementRef;
  @ViewChild('msgInput') msgInputRef: ElementRef;
  @Output() addMessageEvent = new EventEmitter<Message>()

  addMessage(){
    let message = new Message('000', this.subjectInputRef.nativeElement.value, this.msgInputRef.nativeElement.value, "Alex")
    this.addMessageEvent.emit(message);
  }
}
