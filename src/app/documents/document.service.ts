import { EventEmitter, Injectable } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documents: Document[] = [];
  documentSelectedEvent = new EventEmitter<Document>();
  documentChangedEvent = new EventEmitter<Document[]>();

  constructor() {
    this.documents = MOCKDOCUMENTS;
   }

   getDocuments(): Document[] {
    return this.documents.slice();
   }

   getDocument(id: string): Document {
    let theDocument: Document = null;

    this.documents.forEach(doc => {
      if(doc.id === id){
        theDocument = doc;
      }
    })
    return theDocument;
   }

   deleteDocument(document: Document){
    if(!document){
      return;
    }
    const position = this.documents.indexOf(document);
    if (position < 0) {
      return
    }
    this.documents.splice(position, 1);
    this.documentChangedEvent.emit(this.documents.slice());
   }

}
