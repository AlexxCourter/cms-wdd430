import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrl: './message-edit.component.css'
})
export class MessageEditComponent {
  @ViewChild('subjectInput') subjectInputRef: ElementRef;
  @ViewChild('msgInput') msgInputRef: ElementRef;
  @Output() addMessageEvent = new EventEmitter<Message>()

  constructor(private msgService : MessageService){}

  onSubmit(form: NgForm){
    let value = form.value;
    console.log(form.value);
    let message = new Message(this.msgService.getMaxId().toString(), value.subject, value.message, "101")
    this.msgService.addMessage(message);
  }

  onClear(){

  }


}
