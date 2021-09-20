import { TierStatusRightPanelService } from './../../../services/tier-status-right-panel.service';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ExecDashboardChartProviderService } from '../../../../../services/exec-dashboard-chart-provider.service';

@Component({
  selector: 'app-tier-status-alert',
  templateUrl: './tier-status-alert.component.html',
  styleUrls: ['./tier-status-alert.component.css']
})
export class TierStatusAlertComponent implements OnInit, OnChanges {
  className: string = "TierStatusAlertComponent";
  @Input('alertObj') tsAlertData;
  disableAlert: any = { 'capacity': false, 'behavior': true };
  alertWindow: boolean = true;
  alertFlag:boolean = false;
  allAlertCount: number = 0;
  _selectedDCArr: string[] = [];
  selectedTier: string = "";

  alertArr: any = [{ "icon": "MinorEvent.png", "ruleName": "No Trend", "alertMessage": "-", "alertTime": "07/04/18 00:06:38", "timeAgo": "23:40:54", "tier": "ATG-OPEN-API-SAL-BURST", "server": "h121580vaps2697", "instance": "-", "alertValue": "1.0", "threshold": "1.0", "type": "Capacity" }, { "icon": "MinorEvent.png", "ruleName": "No Trend", "alertMessage": "-", "alertTime": "07/04/18 05:06:49", "timeAgo": "18:40:44", "tier": "ATG-OPEN-API-SAL-BURST", "server": "h121580vaps2693", "instance": "-", "alertValue": "1.0", "threshold": "1.0", "type": "Capacity" }, { "icon": "MinorEvent.png", "ruleName": "No Trend", "alertMessage": "-", "alertTime": "07/04/18 05:40:51", "timeAgo": "18:06:42", "tier": "ATG-OPEN-API-SAL-BURST", "server": "h121580vaps2417", "instance": "-", "alertValue": "1.0", "threshold": "1.0", "type": "Capacity" }, { "icon": "MinorEvent.png", "ruleName": "No Trend", "alertMessage": "-", "alertTime": "07/04/18 23:11:07", "timeAgo": "00:36:25", "tier": "ATG-OPEN-API-SAL-BURST", "server": "h121580vaps2414", "instance": "-", "alertValue": "1.0", "threshold": "1.0", "type": "Capacity" }, { "icon": "MinorEvent.png", "ruleName": "No Trend", "alertMessage": "-", "alertTime": "07/04/18 23:33:08", "timeAgo": "00:14:24", "tier": "ATG-OPEN-API-SAL-BURST", "server": "h121580vaps2696", "instance": "-", "alertValue": "1.0", "threshold": "1.0", "type": "Capacity" }, { "icon": "MinorEvent.png", "ruleName": "No Trend", "alertMessage": "-", "alertTime": "07/04/18 23:35:09", "timeAgo": "00:12:24", "tier": "ATG-OPEN-API-SAL-BURST", "server": "h121580vaps2679", "instance": "-", "alertValue": "1.0", "threshold": "1.0", "type": "Capacity" }, { "icon": "MinorEvent.png", "ruleName": "No Trend", "alertMessage": "-", "alertTime": "07/04/18 23:39:08", "timeAgo": "00:08:24", "tier": "ATG-OPEN-API-SAL-BURST", "server": "h121580vaps2695", "instance": "-", "alertValue": "1.0", "threshold": "1.0", "type": "Capacity" }, { "icon": "MinorEvent.png", "ruleName": "No Trend", "alertMessage": "-", "alertTime": "07/04/18 23:45:09", "timeAgo": "00:02:24", "tier": "ATG-OPEN-API-SAL-BURST", "server": "h121580vaps2683", "instance": "-", "alertValue": "1.0", "threshold": "1.0", "type": "Capacity" }, { "icon": "MinorEvent.png", "ruleName": "No Trend", "alertMessage": "-", "alertTime": "07/04/18 23:45:09", "timeAgo": "00:02:24", "tier": "ATG-OPEN-API-SAL-BURST", "server": "h121580vaps2413", "instance": "-", "alertValue": "1.0", "threshold": "1.0", "type": "Capacity" }, { "icon": "MinorEvent.png", "ruleName": "No Trend", "alertMessage": "-", "alertTime": "07/04/18 23:47:09", "timeAgo": "00:00:24", "tier": "ATG-OPEN-API-SAL-BURST", "server": "h121580vaps2415", "instance": "-", "alertValue": "1.0", "threshold": "1.0", "type": "Capacity" }, { "icon": "MinorEvent.png", "ruleName": "No Trend", "alertMessage": "-", "alertTime": "07/04/18 23:47:09", "timeAgo": "00:00:24", "tier": "ATG-OPEN-API-SAL-BURST", "server": "h121580vaps2416", "instance": "-", "alertValue": "1.0", "threshold": "1.0", "type": "Capacity" }];
  constructor(public _rightPanelService: TierStatusRightPanelService, public _chartProviderService: ExecDashboardChartProviderService) {   }
  ngOnChanges() {
    console.log('insidealertComponent before check', this.tsAlertData);
    if (this.tsAlertData){
      this._rightPanelService._dataHandlerService.$selectedNode = this.tsAlertData.tierName;
      console.log('insidealertComponent', this.tsAlertData);
      this.alertFlag = this.isAlertAvailable();
      console.log('insidealertComponent', this.alertFlag);
      
    }
  }
  ngOnInit() {
    // this.tsAlertData.normal=10;
    // this.tsAlertData.major=0;
    // this.tsAlertData.critical=0;

    //this._chartProviderService.getAlertChart(this.tsAlertData);
    this._rightPanelService._dataHandlerService.$selectedNode = this.tsAlertData.tierName;
    this.allAlertCount = this.tsAlertData.critical + this.tsAlertData.major + this.tsAlertData.normal;
    this._rightPanelService.$alertDataSubject.subscribe((data)=>{
      if (data == 'Data_Available'){
        if (this.disableAlert.capacity == false){
          this.getDataForCapacity();
        }
        else{
          this.getBehavioral();
        }
      }
    })
  }
  isAlertAvailable():boolean{
    let flag = 0;
    try
    {
      for (const key in this.tsAlertData) {
        if (this.tsAlertData.hasOwnProperty(key)) {
          const element = this.tsAlertData[key];
          if(element > 0){
            flag = 1;
          }
        }
      }
      if (flag == 1)
        return true;
      else 
        return false;
    }
    catch(error){
      console.log('Getting error in isAlertDataAvailable() in class '+this.className);
      console.log(error);
    }
  }
    /**
   * setting data for capacity alert
   */
  getDataForCapacity() {
    this.alertArr = [...this._rightPanelService.$capacityData]
    this.disableAlert.behavior = true;
    this.disableAlert.capacity = false;
    this.disableAlert = { ...this.disableAlert };
  }
  /**
   * setting data for behavioral alert
   */
  getBehavioral() {
    this.disableAlert.capacity = true;
    this.disableAlert.behavior = false;
    this.alertArr = [...this._rightPanelService.$behaviorData]
    this.disableAlert = { ...this.disableAlert };
  }
  //reseting window
  resetSubscription(){
    this.disableAlert.capacity = false;
    this.disableAlert.behavior = true;
    this.alertArr = [...this._rightPanelService.$capacityData];
  }


  /**
   * get dc_name for selected Tier/Group
   */
   getSelectedDC(): string {
     const data = this._rightPanelService._dataHandlerService;
     console.log({data});
    // this.selectedTier = this._rightPanelService._dataHandlerService.$selectedNode;
    // const nodeInfo = this._rightPanelService._dataHandlerService.$tierStatusData.nodeInfo;
    // let element, arr;

    // for (let index = 0; index < nodeInfo.length; index++) {
    //   element = nodeInfo[index];
    //   if(element.actualTierName.includes(this.selectedTier)){
    //       this._selectedDCArr = element.dc.split(",");
	  // if (this._selectedDCArr.length > 1) {
    //       arr = this.selectedTier.split(".");
    //       return arr[0];
    //     }
    //     else {
    //       return this._selectedDCArr[0];
    //     }
    //   }
    // }
    return '';
  }

}
