import { Component, Input } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { WinRefService } from '../../win-ref.service';

@Component({
  selector: 'cms-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrl: './document-detail.component.css'
})
export class DocumentDetailComponent {
  @Input() document: Document;
  id: string;
  nativeWindow: any;

  constructor(
    private docService: DocumentService, 
    private router: Router, 
    private route: ActivatedRoute,
    private windowService: WinRefService
  ){
    this.nativeWindow = this.windowService.getNativeWindow();
  }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.document = this.docService.getDocument(this.id);
      }
    )
  }

  onEditDocument(){
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  onViewDocument(){
    if(this.document.url){
      this.nativeWindow.open(this.document.url);
    }
  }

  onDeleteDocument(){
    this.docService.deleteDocument(this.document);
    this.router.navigate(['documents'])
  }
}
