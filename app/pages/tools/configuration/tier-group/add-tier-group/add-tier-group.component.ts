import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';

@Component({
  selector: 'app-add-tier-group',
  templateUrl: './add-tier-group.component.html',
  styleUrls: ['./add-tier-group.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class AddTierGroupComponent extends PageDialogComponent 
implements OnInit {

 visible : boolean;
 allState: MenuItem[];
 allEvent: MenuItem[];
 

 constructor() {
   super();
  }

 ngOnInit(): void {
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