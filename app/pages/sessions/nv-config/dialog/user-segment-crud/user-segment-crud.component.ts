import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';
import { NEW_USER_SEGMENT_DATA } from './service/user-segment-curd.dummy';
import { NewUserSegmentData } from './service/user-segment-curd.model';

@Component({
  selector: 'app-user-segment-crud',
  templateUrl: './user-segment-crud.component.html',
  styleUrls: ['./user-segment-crud.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class UserSegmentCrudComponent extends PageDialogComponent 
implements OnInit {

  data: NewUserSegmentData[];
  showFields: boolean;
  userName: string;
  userDescription: any;
 


 constructor() {
   super();
  }

 ngOnInit(): void {
  const me = this;
  me.data = NEW_USER_SEGMENT_DATA;
  console.log("me.data ", me.data);
  
 }

 

 showDialog(row, isShowFields) {
  console.log(row);
  super.show();
  if (row) {
    this.userName = row.name;
    this.userDescription = row.description;
    
  } else {
    this.userName = null;
    this.userDescription = null;
   
  }
  this.showFields = isShowFields;
}


 open(){
   this.visible = true;
 }

 closeDialog(){
   this.visible = false;
 }
}