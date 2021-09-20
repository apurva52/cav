import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';

@Component({
  selector: 'app-map-integration',
  templateUrl: './map-integration.component.html',
  styleUrls: ['./map-integration.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class MapIntegrationComponent extends PageDialogComponent
implements OnInit {

  name : any[];
visible: boolean;
constructor() {
  super();
}

ngOnInit(): void {
  const me = this;
  me.name = [
    {
      label:"Tomcat_4",
      value:"tomcat_4"
    },
    {
      label:"node",
      value:"node"
    },
    {
      label:"node",
      value:"node"
    }
  ]
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
