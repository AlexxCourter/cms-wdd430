import { EventEmitter, Injectable } from '@angular/core';
import { Document } from './document.model';

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
    this.getDocsFromServer()
   }

  getDocsFromServer(){
    this.http.get('http://localhost:3000/documents')
    .subscribe(
      (documents) => {
        console.log(documents)
        this.documents = documents['documentList'];
        
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
    this.http.delete('http://localhost:3000/documents/' + document.id)
    .subscribe(
      (response: Response) => {
        this.documents.splice(position, 1);
        this.documents.sort(function(a: Document, b:Document){
          return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
        }) //sorts alphabetically
        this.documentChangedEvent.next(this.documents.slice());
      }
    )
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
    newDocument.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.post<{message: string, document: Document}>('http://localhost:3000/documents', newDocument, {headers: headers})
    .subscribe(
      (responseData) => {
        this.documents.push(responseData.document);
        this.documents.sort(function(a: Document, b:Document){
          return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
        }) //sorts alphabetically
        this.documentChangedEvent.next(this.documents.slice());
      }
    )
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

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // update database
    this.http.put('http://localhost:3000/documents/' + originalDocument.id,
      newDocument, { headers: headers })
      .subscribe(
        (response: Response) => {
          this.documents[position] = newDocument;
          this.documents.sort(function(a: Document, b:Document){
            return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
          }) //sorts alphabetically
          this.documentChangedEvent.next(this.documents.slice());
        }
      );
    // let documentsClone = this.documents.slice();
    // this.documentChangedEvent.next(documentsClone);
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
