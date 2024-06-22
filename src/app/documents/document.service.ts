import { EventEmitter, Injectable } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Subject } from 'rxjs';
import {HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documents: Document[] = [];
  documentSelectedEvent = new EventEmitter<Document>();
  documentChangedEvent = new Subject<Document[]>();

  maxDocumentId : number;

  constructor(private http: HttpClient) {
    http.get('https://ac-cms-33ea6-default-rtdb.firebaseio.com/documents.json')
    .subscribe(
      (documents: Document[]) => {
        this.documents = documents;
        this.maxDocumentId = this.getMaxId();
        //comparator function solved for alphabetizing objects by a property
        //thanks to this stack overflow answer by Omer Bokhari
        //https://stackoverflow.com/questions/8900732/sort-objects-in-an-array-alphabetically-on-one-property-of-the-array
        this.documents.sort(function(a: Document, b:Document){
          return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
        }) //sorts alphabetically
        this.documentChangedEvent.next(this.documents.slice());
      },
      (error: any) => {console.log(error)}
    );

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
    // this.documentChangedEvent.next(this.documents.slice());
    this.storeDocuments();
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
    // let documentsClone = this.documents.slice();
    // this.documentChangedEvent.next(documentsClone);
    this.storeDocuments();
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
    // let documentsClone = this.documents.slice();
    // this.documentChangedEvent.next(documentsClone);
    this.storeDocuments();
   }

   storeDocuments(){
    const header = new HttpHeaders({'contentType': 'application/json'});
    const data = JSON.stringify(this.getDocuments());
    this.http.put('https://ac-cms-33ea6-default-rtdb.firebaseio.com/documents.json', data, {'headers':header})
    .subscribe(()=>{
      this.documentChangedEvent.next(this.documents.slice());
    })
   }

}
