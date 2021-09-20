import { TierStatusRightPanelService } from './../../../services/tier-status-right-panel.service';
import { TierStatusCommonDataHandlerService } from './../../../services/tier-status-common-data-handler.service';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { TierStatusDataHandlerService } from '../../../services/tier-status-data-handler.service';

@Component({
  selector: 'app-tier-status-health',
  templateUrl: './tier-status-health.component.html',
  styleUrls: ['./tier-status-health.component.css']
})
export class TierStatusHealthComponent implements OnInit, OnChanges {
  @Input('healthArr') healthArr;
  className: string = "TierStatusHealthComponent";
  healthStatus:any ={};
  totalServer:number = 0;
  isDataAvailable:boolean = false;
  healthObj:any = {};
  isND:boolean = false;
  showLink:boolean = true;
  dispLabel:String = "Server Health";
  constructor(
public _dataHandlerService: TierStatusDataHandlerService,
 public _rightPanelService: TierStatusRightPanelService,
public _commonHandler: TierStatusCommonDataHandlerService
) { }
  ngOnChanges() {
    if (this.healthArr[0]){
      console.log('insideTierStatusHealthComponent', this.healthArr[0]);
      this.healthObj = Object.assign({}, this.healthArr[0]['healthObj']);
      
       if(this._dataHandlerService.$selectedMenuNodeEntity=='1'){
        this.isND = false;
      }
      else{
        this.isND = true;
        if(this._dataHandlerService.$selectedMenuNodeEntity != '0')
          this.showLink= false;
          else
            this.showLink= true;
      }
      if(this._commonHandler.$flowMapMode == '2' ){
        this.dispLabel = "Instance Health";
        if(this._dataHandlerService.isNonNd)
          this.isND = false;
      }
      else
      this.dispLabel = "Server Health";

      this.isDataAvailable = (this._commonHandler.$flowMapMode !='2' && this.healthObj['integrationCritical']!= undefined ) ? true : false;
      this.healthStatus.businessCritical = this.healthObj['businessCritical'] != undefined ? this.healthObj['businessCritical']:0;
      this.healthStatus.businessMajor = this.healthObj['businessMajor'] ? this.healthObj['businessMajor']:0;
      this.healthStatus.businessNormal = this.healthObj['businessNormal'] ? this.healthObj['businessNormal']:100-(this.healthStatus.businessCritical+this.healthStatus.businessMajor);
      this.healthStatus.integrationCritical = this.healthObj['integrationCritical'];
      this.healthStatus.integrationMajor = this.healthObj['integrationMajor'];
      this.healthStatus.integrationNormal = this.healthObj['integrationNormal'];

      this.healthStatus.serverCritical = this.healthObj['serverCritical'];
      this.healthStatus.serverNormal = this.healthObj['serverNormal'];
      this.healthStatus.serversMajor = this.healthObj['serversMajor'];
      this.totalServer = this.healthObj['TotalServer'];
    }
  }
  ngOnInit() {
  }

}
