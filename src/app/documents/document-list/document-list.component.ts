import { Component, Output, EventEmitter } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [
    new Document('001', 'test1', 'a test document.', '../../assets/test001.docx', null),
    new Document('002', 'test2', 'a test document.', '../../assets/test002.docx', null),
    new Document('003', 'test3', 'a test document.', '../../assets/test003.docx', null),
    new Document('004', 'test4', 'a test document.', '../../assets/test004.docx', null)
  ]

  onSelectedDocument(document: Document){
    this.selectedDocumentEvent.emit(document);
  }
}
