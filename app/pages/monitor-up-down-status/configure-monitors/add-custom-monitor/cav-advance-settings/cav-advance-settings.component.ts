import { Component, OnInit, Input} from '@angular/core';
// import { CustMonInfo } from '../../containers/cust-mon-info'
// import { CustomMonitorService } from '../../services/custom-monitor.service';

@Component({
  selector: 'app-cav-advance-settings',
  templateUrl: './cav-advance-settings.component.html',
  styleUrls: ['./cav-advance-settings.component.css']
})
export class CavAdvanceSettingsComponent implements OnInit {

  @Input()item: Object;
  //custMonInfo:CustMonInfo;
  monType:string;

  constructor() { }

  ngOnInit() {
    //this.monType = this.cmsObj.monType;
    //this.custMonInfo = new CustMonInfo();
  }

}
