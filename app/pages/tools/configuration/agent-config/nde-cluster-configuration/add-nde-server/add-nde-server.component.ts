import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';

@Component({
  selector: 'app-add-nde-server',
  templateUrl: './add-nde-server.component.html',
  styleUrls: ['./add-nde-server.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddNdeServerComponent  extends PageDialogComponent 
implements OnInit {

 visible : boolean;
 allState: MenuItem[];
 allEvent: MenuItem[];
  primengConfig: any;
 

 constructor() {
   super();
  }

 ngOnInit(): void {
  this.primengConfig.ripple = true;
  const me = this;

  me.allState = [
    { label: 'Select An Agent' },
    { label: 'Select' },
  ];
  me.allEvent = [
    { label: 'Select Type' },
    { label: 'Select' },
    
  ];
 }


 open(){
   this.visible = true;
 }

 closeDialog(){
   this.visible = false;
 }
}