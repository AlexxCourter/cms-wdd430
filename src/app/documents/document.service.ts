import { EventEmitter, Injectable } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documents: Document[] = [];
  documentSelectedEvent = new EventEmitter<Document>();
  documentChangedEvent = new Subject<Document[]>();

  maxDocumentId : number;

  constructor() {
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
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
    this.documentChangedEvent.next(this.documents.slice());
   }

   getMaxId(): number {
    let maxId = 0;
    this.documents.forEach(document => {
      let currentId = +document.id
      if (currentId > maxId){
        maxId = currentId;
      }
    })

    return maxId;
   }

   addDocument(newDocument: Document){
    if(newDocument === undefined || newDocument === null){
      return;
    }
    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    let documentsClone = this.documents.slice();
    this.documentChangedEvent.next(documentsClone);
   }

   updateDocument(originalDocument: Document, newDocument: Document){
    if(originalDocument === undefined || originalDocument === null || newDocument === undefined || newDocument === null){
      return;
    }
    let position = this.documents.indexOf(originalDocument);
    if (position < 0){
      return;
    }
    newDocument.id = originalDocument.id;
    this.documents[position] = newDocument;
    let documentsClone = this.documents.slice();
    this.documentChangedEvent.next(documentsClone);
   }

}
