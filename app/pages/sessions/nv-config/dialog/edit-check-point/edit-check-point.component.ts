import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';
import { MenuItem } from 'primeng';

@Component({
  selector: 'app-edit-check-point',
  templateUrl: './edit-check-point.component.html',
  styleUrls: ['./edit-check-point.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class EditCheckPointComponent extends PageDialogComponent 
implements OnInit {

 visible : boolean;
 allState: MenuItem[];
 allEvent: MenuItem[];
 allMode: MenuItem[];
 allCondition: MenuItem[];
 allSearch: MenuItem[];
 allScope: MenuItem[];

 constructor() {
   super();
  }

 ngOnInit(): void {
  const me = this;

  me.allState = [
    { label: 'Inactive' },
    { label: 'Inactive' },
  ];
  me.allEvent = [
    { label: 'Select Event' },
    { label: 'Select Event' },
    
  ];
  me.allSearch = [
    { label: 'Search for specific text' },
    { label: 'Search for specific text' }, 
  ];
  me.allMode = [
    { label: 'Match text found' },
  ];
  me.allCondition = [
    { label: 'Please select Mode' },
    { label: 'Please select Mode' },
  ];
  me.allScope = [
    { label: 'All' },
    { label: 'All' },
  ];
  me.allSearch = [
    { label: 'Select Event' },
    { label: 'Select Event' },
    
  ];
 }


 open(){
   this.visible = true;
 }

 closeDialog(){
   this.visible = false;
 }
}