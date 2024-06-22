import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];
  maxMessageId: number;
  messageChangedEvent = new Subject<Message[]>();

  constructor(private http: HttpClient) {
    http.get('https://ac-cms-33ea6-default-rtdb.firebaseio.com/messsages.json')
    .subscribe(
      (messages: Message[]) => {
        this.messages = messages;
        this.maxMessageId = this.getMaxId();
        //comparator function solved for alphabetizing objects by a property
        //thanks to this stack overflow answer by Omer Bokhari
        //https://stackoverflow.com/questions/8900732/sort-objects-in-an-array-alphabetically-on-one-property-of-the-array
        // this..sort(function(a: Document, b:Document){
        //   return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
        // }) //sorts alphabetically
        this.messageChangedEvent.next(this.messages.slice());
      },
      (error: any) => {console.log(error)}
    );
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

  getMaxId(): number {
    let maxId = 0;
    this.messages.forEach(message => {
      let currentId = Number(message.id)
      if (currentId > maxId){
        maxId = currentId;
      }
    })
    return maxId;
    }
  

  addMessage(message: Message){
    this.messages.push(message);
    this.storeMessages();
    // this.messageChangedEvent.next(this.messages.slice());
  }

  storeMessages(){
    const header = new HttpHeaders({'contentType': 'application/json'});
    const data = JSON.stringify(this.getMessages());
    this.http.put('https://ac-cms-33ea6-default-rtdb.firebaseio.com/messages.json', data, {'headers':header})
    .subscribe(()=>{
      this.messageChangedEvent.next(this.messages.slice());
    })
  }

}
