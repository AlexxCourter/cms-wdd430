import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent implements OnInit {

  constructor(private contactService: ContactService, private router: Router, private route: ActivatedRoute) {}

  contacts: Contact[] = [];


  ngOnInit(){
    this.contacts = this.contactService.getContacts();
    this.contactService.contactsChangedEvent.subscribe((contacts: Contact[]) => {
      this.contacts = contacts;
    })
  }

  onNewContact(){
    this.router.navigate(['new'], {relativeTo: this.route})
  }
}
