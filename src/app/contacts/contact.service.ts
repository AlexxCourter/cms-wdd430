import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contacts: Contact[] = [];
  contactSelectedEvent = new EventEmitter<Contact>();
  contactsChangedEvent = new EventEmitter<Contact[]>();

  constructor() {
    this.contacts = MOCKCONTACTS;
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
    this.contactsChangedEvent.emit(this.contacts.slice());
   }


}
