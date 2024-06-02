import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent implements OnInit {

  documents: Document[] = []

  constructor(private docService: DocumentService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(){
    this.documents = this.docService.getDocuments();
    this.docService.documentChangedEvent.subscribe((documents: Document[])=>{
      this.documents = documents;
    })
  }


  onSelectedDocument(document: Document){
    this.docService.documentSelectedEvent.emit(document);
  }

  onNewDocument(){
    this.router.navigate(['new'], {relativeTo: this.route})
  }
}
