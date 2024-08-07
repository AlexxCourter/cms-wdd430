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
    http.get('http://localhost:3000/messages')
    .subscribe(
      (messages) => {
        console.log(messages);
        this.messages = messages['messageList'];
        // this.maxMessageId = this.getMaxId();
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
    if (!message){
      return;
    }
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    message.id = '';
    console.log(message)
    // add to database
    this.http.post<{ message: string, newMessage: Message }>('http://localhost:3000/messages',
      message,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new
          this.messages.push(responseData.newMessage);
          this.messageChangedEvent.next(this.messages.slice());
        }
      );
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
