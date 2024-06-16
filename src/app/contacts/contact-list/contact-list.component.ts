import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';

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

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      return;
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
