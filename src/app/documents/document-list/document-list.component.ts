import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent implements OnInit, OnDestroy {
  subscription : Subscription;

  documents: Document[] = []

  constructor(private docService: DocumentService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(){
    this.documents = this.docService.getDocuments();
    this.subscription = this.docService.documentChangedEvent.subscribe((documents: Document[])=>{
      this.documents = documents;
    })
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }


  onSelectedDocument(document: Document){
    this.docService.documentSelectedEvent.emit(document);
  }

  onNewDocument(){
    this.router.navigate(['new'], {relativeTo: this.route})
  }
}
