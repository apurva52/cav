import { Component, OnInit, Input} from '@angular/core';
// import { CustMonInfo } from '../../containers/cust-mon-info'
// import { CustomMonitorService } from '../../services/custom-monitor.service';

@Component({
  selector: 'app-advance-settings',
  templateUrl: './advance-settings.component.html',
  styleUrls: ['./advance-settings.component.scss']
})
export class AdvanceSettingsComponent implements OnInit {

  @Input()item: Object;
  //custMonInfo:CustMonInfo;
  monType:string;

  constructor() { }

  ngOnInit() {
    //this.monType = this.cmsObj.monType;
    //this.custMonInfo = new CustMonInfo();
  }

}
