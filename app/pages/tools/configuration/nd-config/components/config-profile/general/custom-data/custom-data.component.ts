import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Subject } from 'rxjs';
import { KeywordData, KeywordList } from '../../../../containers/keyword-data';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { cloneObject } from '../../../../utils/config-utility';
import { ConfigUtilityService } from '../../../../services/config-utility.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ConfigCustomDataService } from '../../../../services/config-customdata.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-custom-dataa',
  templateUrl: './custom-data.component.html',
  styleUrls: ['./custom-data.component.css']
})
export class CustomDataComponent implements OnInit {

  @Input()
  saveDisable: boolean;
  data;
  subscription: Subscription;


  @Output()
  keywordData = new EventEmitter();

  custom_data: Object;
  isProfilePerm: boolean;
  profileId: number;
  agentType:string;
  captureCustomData: boolean;
  keywordList = ['captureCustomData'];
  constructor(private configUtilityService: ConfigUtilityService, private store: Store<Object>, private route: ActivatedRoute, private configKeywordsService: ConfigKeywordsService, private configCustomDataService: ConfigCustomDataService) {
    this.agentType = sessionStorage.getItem("agentType");
    
    this.subscription = this.store.select(store => store["keywordData"]).subscribe((data:any) => {
      if (!data)
        return;
      
      data = cloneObject(data);
      for (let key in data) {
        data[key].value = (data[key].value == 'true' || data[key].value == 'false') ? data[key].value == 'true' : data[key].value
      }
      this.custom_data = cloneObject(data);
    });
    this.subscription = this.store.select(store => store["keywordData"]).subscribe(data => {
      var keywordDataVal = {}
      this.keywordList.map(function (key) {
        keywordDataVal[key] = data[key];
      })
      this.custom_data = cloneObject(keywordDataVal);
      if (this.custom_data['captureCustomData'].value == true) {
        this.captureCustomData = true;
      }
      else {
        this.captureCustomData = false;
      }
    });
    this.configKeywordsService.toggleKeywordData();
  }

  ngOnInit() {
    this.isProfilePerm = +sessionStorage.getItem("ProfileAccess") == 4 ? true : false
  }

  saveKeywordData() {
    this.route.params.subscribe((params: Params) => this.profileId = params['profileId']);
    let flag;
    let flag1;
    this.configKeywordsService.getFetchSessionAttributeTable(this.profileId).subscribe(data => {
      if (data["sessionType"] == "Specific" && data["attrList"].length == 0) {
        this.configUtilityService.errorMessage("Provide session attribute(s) ");
        flag = true;
        return;
      }
      if (!flag) {
        this.configKeywordsService.getFetchHTTPReqHeaderTable(this.profileId).subscribe(data => {
          if (data["httpReqHdrType"] == "Specific" && data["attrList"].length == 0) {
            this.configUtilityService.errorMessage("Provide HTTP request header(s)");
            flag1 = true;
            return;
          }
          if (!flag1) {
            this.configKeywordsService.getFetchHTTPRepHeaderTable(this.profileId).subscribe(data => {
              if (data["httpReqHdrType"] == "Specific" && data["attrList"].length == 0) {
                this.configUtilityService.errorMessage("Provide HTTP response header(s)");
                return;
              }
              else {
                this.getHeaderValues();
              }
            });
          }
        });
      }
    });
  }

  getHeaderValues() {
    //this.header["captureCustomData"].value = String(this.header["captureCustomData"].value == '1');
    this.configCustomDataService.updateCaptureCustomDataFile(this.profileId);
    let filePath;
    this.configKeywordsService.getFilePath(this.profileId).subscribe(data => {
      if (this.captureCustomData == true) {
        filePath = data;
        filePath = filePath + "/captureCustomData.cd";
        this.custom_data['captureCustomData'].value = true;
      }
      else {
        filePath = "NA";
        this.custom_data['captureCustomData'].value = false;
      }
      this.custom_data['captureCustomData'].path = filePath;
      this.keywordData.emit(this.custom_data);
    });
  }
/**
 * Purpose : To invoke the service responsible to open Help Notification Dialog 
 * related to the current component.
 */
  sendHelpNotification() {
    this.configKeywordsService.getHelpContent("General","Custom Data",this.agentType );
}

} 
