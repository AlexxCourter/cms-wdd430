import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contacts: Contact[] = [];
  contactSelectedEvent = new EventEmitter<Contact>();
  contactsChangedEvent = new Subject<Contact[]>();
  startedEditing = new Subject();

  maxContactId: number;

  constructor(private http: HttpClient) {
    http.get('https://ac-cms-33ea6-default-rtdb.firebaseio.com/contacts.json')
    .subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts;
        this.maxContactId = this.getMaxId();
        //comparator function solved for alphabetizing objects by a property
        //thanks to this stack overflow answer by Omer Bokhari
        //https://stackoverflow.com/questions/8900732/sort-objects-in-an-array-alphabetically-on-one-property-of-the-array
        this.contacts.sort(function(a: Contact, b:Contact){
          return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
        }) //sorts alphabetically
        this.contactsChangedEvent.next(this.contacts.slice());
      },
      (error: any) => {console.log(error)}
    );
   }

   getContacts(): Contact[] {
    return this.contacts.slice();
   }

   getContact(id: string): Contact {
    let contacts: Contact[] = this.getContacts();
    let theContact: Contact = null;
    
    contacts.forEach(contact => {
      if(id === contact.id){
        theContact = contact;
      }
    })
    return theContact;
   }

   deleteContact(contact: Contact){
    if(!contact){
      return;
    }
    const position = this.contacts.indexOf(contact);
    if (position < 0) {
      return
    }
    this.contacts.splice(position, 1);
    // this.contactsChangedEvent.next(this.contacts.slice());
    this.storeContacts();
   }

   getMaxId(): number {
    let maxId = 0;
    this.contacts.forEach(contact => {
      let currentId = Number(contact.id)
      if (currentId > maxId){
        maxId = currentId;
      }
    })
    return maxId;
   }

   addContact(newContact: Contact){
    if(this.maxContactId == undefined){
      this.maxContactId = this.getMaxId()
    }
    if(newContact === undefined || newContact === null){
      return;
    }
    this.maxContactId++;
    console.log(this.maxContactId);
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    // let contactsClone = this.contacts.slice();
    // this.contactsChangedEvent.next(contactsClone);
    this.storeContacts();
   }

   updateContact(originalContact: Contact, newContact: Contact){
    if(originalContact === undefined || originalContact === null || newContact === undefined || newContact === null){
      return;
    }
    let position = this.contacts.indexOf(originalContact);
    if (position < 0){
      return;
    }
    newContact.id = originalContact.id;
    this.contacts[position] = newContact;
    // let ContactsClone = this.contacts.slice();
    // this.contactsChangedEvent.next(ContactsClone);
    this.storeContacts();
   }

   storeContacts(){
    const header = new HttpHeaders({'contentType': 'application/json'});
    const data = JSON.stringify(this.getContacts());
    this.http.put('https://ac-cms-33ea6-default-rtdb.firebaseio.com/contacts.json', data, {'headers':header})
    .subscribe(()=>{
      this.contactsChangedEvent.next(this.contacts.slice());
    })
   }


}
