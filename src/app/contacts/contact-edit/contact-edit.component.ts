import { Component, OnDestroy, OnInit } from '@angular/core';
import { Contact } from '../contact.model';
import { NgForm } from '@angular/forms';
import { ContactService } from '../contact.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrl: './contact-edit.component.css'
})
export class ContactEditComponent implements OnInit, OnDestroy {

  originalContact: Contact;
  contact: Contact;
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  id: string;


  constructor(private contactService: ContactService, private router: Router, private route: ActivatedRoute){}

  ngOnInit(){
    this.route.params.subscribe((params: Params)=> {
      let id = params.id;
      if(id === null || id === undefined){
        this.editMode = false;
        return;
      }
      this.originalContact = this.contactService.getContact(id);
      if(this.originalContact === null || this.originalContact === undefined){
        return;
      }
      this.editMode = true;
      this.contact = JSON.parse(JSON.stringify(this.originalContact));
  
      if(this.contact.group != null && this.contact.group != undefined){
        this.groupContacts = this.contact.group.slice()
      }
    })
  }

  ngOnDestroy(): void {

  }

  onSubmit(form: NgForm){
    let value = form.value;
    let newContact: Contact;
    if(this.editMode){
      newContact = new Contact(this.contact.id, value.name, value.email, value.phone, value.imageUrl, this.groupContacts);
    } else {
      newContact = new Contact(null, value.name, value.email, value.phone, value.imageUrl, this.groupContacts);
    }
    if(this.editMode){
      this.contactService.updateContact(this.originalContact, newContact);
    } else {
      this.contactService.addContact(newContact);
    }
    this.router.navigate(['contacts'])
  }

  onCancel(){
    this.editMode = false;
    this.router.navigate(['contacts'])
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      return;
    } else {
      console.log(event);
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    console.log(this.groupContacts);
  }

  
isInvalidContact(newContact: Contact) {
  if (!newContact) {// newContact has no value
    return true;
  }
  if (this.contact && newContact.id === this.contact.id) {
     return true;
  }
  for (let i = 0; i < this.groupContacts.length; i++){
     if (newContact.id === this.groupContacts[i].id) {
       return true;
    }
  }
  return false;
}

addToGroup($event: any) {
  const selectedContact: Contact = $event.dragData;
  const invalidGroupContact = this.isInvalidContact(selectedContact);
  if (invalidGroupContact){
     return;
  }
  this.groupContacts.push(selectedContact);
}

onRemoveItem(index: number) {
  if (index < 0 || index >= this.groupContacts.length) {
     return;
  }
  this.groupContacts.splice(index, 1);
}

  onDelete(){}

  

}
