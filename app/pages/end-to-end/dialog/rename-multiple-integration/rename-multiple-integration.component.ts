import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';

@Component({
  selector: 'app-rename-multiple-integration',
  templateUrl: './rename-multiple-integration.component.html',
  styleUrls: ['./rename-multiple-integration.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class RenameMultipleIntegrationComponent extends PageDialogComponent
implements OnInit {

visible: boolean;
constructor() {
  super();
}

ngOnInit(): void {
}

show() {
  this.visible = true;
}

checkToogle(){

}

closePopup(){
  this.visible = false;
}

}
