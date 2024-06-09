import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contacts: Contact[] = [];
  contactSelectedEvent = new EventEmitter<Contact>();
  contactsChangedEvent = new Subject<Contact[]>();

  maxContactId: number;

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
    this.contactsChangedEvent.next(this.contacts.slice());
   }

   getMaxId(): number {
    let maxId = 0;
    this.contacts.forEach(contact => {
      let currentId = +contact.id
      if (currentId > maxId){
        maxId = currentId;
      }
    })

    return maxId;
   }

   addContact(newContact: Contact){
    if(newContact === undefined || newContact === null){
      return;
    }
    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    let contactsClone = this.contacts.slice();
    this.contactsChangedEvent.next(contactsClone);
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
    let ContactsClone = this.contacts.slice();
    this.contactsChangedEvent.next(ContactsClone);
   }


}
