import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent implements OnInit {

  constructor(private contactService: ContactService) {}

  contacts: Contact[] = [];

  onSelected(contact: Contact){
    this.contactService.contactSelectedEvent.emit(contact);
  }

  ngOnInit(){
    this.contacts = this.contactService.getContacts();
  }
}
