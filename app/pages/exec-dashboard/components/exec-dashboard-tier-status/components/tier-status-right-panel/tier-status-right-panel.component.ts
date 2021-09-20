import { Subscription } from 'rxjs';
import { SelectItem } from 'primeng/primeng';
import { Component, OnInit } from '@angular/core';
import { TierStatusDataHandlerService } from '../../services/tier-status-data-handler.service';


@Component({
  selector: '[app-tier-status-right-panel]',
  templateUrl: './tier-status-right-panel.component.html',
  styleUrls: ['./tier-status-right-panel.component.css']
})
export class TierStatusRightPanelComponent implements OnInit {
  className: string = "TierStatusRightPanelComponent";
  tierName: string = "default";
  groupedTierList: SelectItem[] = [];
  selectedTier: string = '';
  dataSubscription: Subscription;
  rightPanelData: any;
  isGrouped: boolean = false;
  alertObj: any = {};
  healthObj: any = {};
  transactionScoreCard: any = {};
  healthArr: any = [];
  selectedTierName: string = '';
  groupName: string = '';
  dataAvilable: boolean = false;
  lblTierServer: any = {};
  constructor(public _dataHandlerService: TierStatusDataHandlerService) { }

  ngOnInit() {
    this.dataSubscription = this._dataHandlerService.Observable$.subscribe(data => {
      if (data === 'PanelDataAvailable') {
        let groupedTiers;
        let arr = [];
        this.rightPanelData = this._dataHandlerService.$selectedTierData;
        this.selectedTierName = this.removeNullString(this._dataHandlerService.$selectedNode);
        if (this.rightPanelData && Object.keys(this.rightPanelData).length > 0) {
          if (this.rightPanelData.isGroup == true && this.rightPanelData.isIndividualTier == false) {
            groupedTiers = '';
            this.groupedTierList = [];
            arr = [];
            groupedTiers = this.selectedTierName;
            arr = this.selectedTierName.split(',');
            this.groupedTierList.push({ label: "-- Select Tier --", value: groupedTiers });
            console.log('inside check data available', groupedTiers, arr);
            for (let val of arr) {
              this.groupedTierList.push({ label: val, value: val });
            }
          }
        }
        this.dataAvilable = true;
        //check for group name
        this.isGrouped = this.rightPanelData.isGroup;
        this.setRightPanelData(this.rightPanelData, this.isGrouped);
      }
    });
    this._dataHandlerService.isTransactionScoreCardAvlbl=true;
  }
  /**
   * Method to set the data for alerts health and transaction score card
   */
  setRightPanelData(data, isGrouped) {
    try {
      this.alertObj['critical'] = data.alertCritical;
      this.alertObj['major'] = data.alertMajor;
      this.alertObj['normal'] = data.alertNormal;
      this.alertObj['tierName'] = this._dataHandlerService.$selectedNode;
      this.lblTierServer = {};
      if (data.hasOwnProperty('reqVectorName') && data.reqVectorName) {
        if(data.reqVectorName.split('>')[2]==this._dataHandlerService.$selectedNode){
          this.healthObj['reqVectorName'] = data.reqVectorName;
          let arr = data.reqVectorName.split('>');
          this.selectedTierName = arr[0];
          this.lblTierServer['isServer'] = true;
          this.lblTierServer['server'] = arr[1];
          this.lblTierServer['instance'] = arr[2];
          this._dataHandlerService.isTransactionScoreCardAvlbl=true;
        }
        else{
          this._dataHandlerService.isTransactionScoreCardAvlbl=false;
        }
      }
      else {

        this.lblTierServer['isServer'] = {};
        this.healthObj['reqVectorName'] = null;
        this.lblTierServer['isServer'] = false;


      }

      this.healthObj['businessCritical'] = data.businessCritical;
      this.healthObj['businessCriticalPer'] = data.businessCriticalPer;
      this.healthObj['businessMajor'] = data.businessMajor;
      this.healthObj['businessMajorPer'] = data.businessMajorPer;
      this.healthObj['businessNormal'] = data.businessNormal;
      this.healthObj['businessNormalPer'] = data.businessNormalPer;
      this.healthObj['integrationCritical'] = data.integrationCritical;
      this.healthObj['integrationMajor'] = data.integrationMajor;
      this.healthObj['integrationNormal'] = data.integrationNormal;

      this.healthObj['serverCritical'] = data.serverCritical;
      this.healthObj['serverNormal'] = data.serverNormal;
      this.healthObj['serversMajor'] = data.serversMajor;
      this.healthObj['TotalServer'] = data.TotalServer;
      this.healthArr = [{ 'healthObj': this.healthObj }];
      this.transactionScoreCard = {};
      if (data.TransactionScorecard) {

        this.transactionScoreCard = data.TransactionScorecard;
      }
    }
    catch (e) {
      console.log('Getting Error in method setRightPanelData ', this.className, e);

    }
  }
  //method to handle selected tier event from dropdown
  onTierChange() {
    if (this.selectedTier) {
      this._dataHandlerService.$selectedNode = this.selectedTier;
      this._dataHandlerService.getTierData();
      if (this._dataHandlerService.$showDashboard) {
        this._dataHandlerService.flowChartActionHandler("TOGGLE_SELECTION")
      }
    }
  }

  /**
  * Removes null/NA from provided string
  */
  removeNullString(str: string): string {
    str = str.replace(/_null_/g, '_');
    str = str.replace(/_NULL_/g, '_');
    str = str.replace(/_na_/g, '_');
    str = str.replace(/_NA_/g, '_');
    return str;
  }
}
