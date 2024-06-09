import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  constructor(private contactService: ContactService, private router: Router, private route: ActivatedRoute) {}

  contacts: Contact[] = [];


  ngOnInit(){
    this.contacts = this.contactService.getContacts();
    this.subscription = this.contactService.contactsChangedEvent.subscribe((contacts: Contact[]) => {
      this.contacts = contacts;
    })
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  onNewContact(){
    this.router.navigate(['new'], {relativeTo: this.route})
  }
}
