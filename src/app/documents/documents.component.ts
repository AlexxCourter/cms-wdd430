import { Component } from '@angular/core';
import { Document } from './document.model';

@Component({
  selector: 'cms-documents',
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css'
})
export class DocumentsComponent {
  selectedDocument: Document;
  
}
