import { Component, OnInit } from '@angular/core';
import { Document } from '../document.model';
import { NgForm } from '@angular/forms'
import { DocumentService } from '../document.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrl: './document-edit.component.css'
})
export class DocumentEditComponent implements OnInit {

  originalDocument: Document;
  document: Document;
  editMode: boolean = false;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute
  ){}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params)=> {
      let id = params.id;
      if(id === null || id === undefined){
        this.editMode = false;
        return;
      }
      this.originalDocument = this.documentService.getDocument(id);
      if(this.originalDocument === null || this.originalDocument === undefined){
        return;
      }
      this.editMode = true;
      this.document = JSON.parse(JSON.stringify(this.originalDocument));
    })
  }

  onSubmit(form: NgForm){
    let value = form.value;
    let newDocument: Document;
    if(this.document != null || this.document != undefined){
      newDocument = new Document(this.document.id, value.name, value.description, value.url, this.document.children);
    } else {
      newDocument = new Document(this.documentService.getMaxId().toString(), value.name, value.description, value.url, null);
    }
    if(this.editMode){
      this.documentService.updateDocument(this.originalDocument, newDocument);
    } else {
      this.documentService.addDocument(newDocument);
    }
    this.router.navigate(['documents'])
  }

  onCancel(){
    this.editMode = false;
    this.router.navigate(['documents'])
  }
}
