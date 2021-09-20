import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';

@Component({
  selector: 'app-pre-post-log',
  templateUrl: './pre-post-log.component.html',
  styleUrls: ['./pre-post-log.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PrePostLogComponent extends PageDialogComponent implements OnInit {

  constructor() { 
    super();
  }

  ngOnInit(): void {
  }

  open(){
    this.visible = true;
  }
 
  closeDialog(){
    this.visible = false;
  }

}
