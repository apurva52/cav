import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';

@Component({
  selector: 'app-checkout-crud',
  templateUrl: './checkout-crud.component.html',
  styleUrls: ['./checkout-crud.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class CheckoutCrudComponent extends PageDialogComponent 
implements OnInit {

 visible : boolean;

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