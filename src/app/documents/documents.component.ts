import { Component, OnInit } from '@angular/core';
import { Document } from './document.model';
import { DocumentService } from './document.service';

@Component({
  selector: 'cms-documents',
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css'
})
export class DocumentsComponent implements OnInit {
  selectedDocument: Document;

  constructor(private docService: DocumentService) {}

  ngOnInit() {
    this.docService.documentSelectedEvent.subscribe(e => {this.selectedDocument = e})
  }

}
