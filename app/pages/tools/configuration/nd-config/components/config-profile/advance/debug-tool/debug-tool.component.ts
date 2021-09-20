import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { SelectItem } from 'primeng/api';
import { Keywords } from '../../../../interfaces/keywords';
import { KeywordsInfo } from '../../../../interfaces/keywords-info';
import { KeywordData, KeywordList } from '../../../../containers/keyword-data';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { ConfigUtilityService } from '../../../../services/config-utility.service';
import { ActivatedRoute, Params } from '@angular/router';
import { cloneObject } from '../../../../utils/config-utility';

@Component({
  selector: 'app-debug-tool',
  templateUrl: './debug-tool.component.html',
  styleUrls: ['./debug-tool.component.css']
})
export class DebugToolComponent {
  
  @Output()
  keywordData = new EventEmitter();

  @Input()
  saveDisable: boolean;

  keywordsData: Keywords;

  keywordList = ['enableCaptureSocketStackTrace','enableCaptureDataOutsideTxn'];

  /**It stores keyword data for showing in GUI */
  debugToolObj: Object;
  agentType: string = "";
  isProfilePerm: boolean;
  subscription: Subscription;

  isEnableCaptureSocketStackTrace : boolean = false;
  enableCaptureSocketStackTrace : number;
  enableCaptureDataOutsideTxn : boolean = false;

  constructor(private configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService, private store: Store<object>) {
    this.agentType = sessionStorage.getItem("agentType");    
    this.getKeywordData();
  }

  ngOnInit() {
    this.isProfilePerm=+sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
    if(this.saveDisable || this.isProfilePerm)
      this.configUtilityService.infoMessage("Reset and Save are disabled");
  }

/* This method is used to get the existing keyword data from the backend */
    getKeywordData() {
      this.subscription = this.store.select(store => store["keywordData"]).subscribe(data => {
        var keywordDataVal = {}
        this.keywordList.map(function (key) {
          keywordDataVal[key] = data[key];
        })
        this.debugToolObj = cloneObject(keywordDataVal);
		this.methodToSetValue(this.debugToolObj);
      });
    }

    //This method is used to set value of data depending on data received in its argument
    methodToSetValue(data){
        this.debugToolObj = data;
        if ((this.debugToolObj["enableCaptureSocketStackTrace"].value).includes("%20")) {
            let arr = (this.debugToolObj["enableCaptureSocketStackTrace"].value).split("%20")

            if (arr[0] == "1") 
                this.isEnableCaptureSocketStackTrace = true;
            else
                this.isEnableCaptureSocketStackTrace = false;

            this.enableCaptureSocketStackTrace = arr[1];
        }
        //this.enableCaptureDataOutsideTxn = this.debugToolObj["enableCaptureDataOutsideTxn"].value;
	if(this.debugToolObj["enableCaptureDataOutsideTxn"].value == "1") {
          this.enableCaptureDataOutsideTxn = true;
        } else {
          this.enableCaptureDataOutsideTxn = false;
        }
    }

//Method to save values of the keywords
  saveKeywordData() {
    if(this.isEnableCaptureSocketStackTrace == false)
    {
        this.debugToolObj['enableCaptureSocketStackTrace'].value = "0%20100";
    }
    else
    {
        this.debugToolObj['enableCaptureSocketStackTrace'].value = "1%20"+this.enableCaptureSocketStackTrace;
    }
    //this.debugToolObj["enableCaptureDataOutsideTxn"].value = this.enableCaptureDataOutsideTxn;
    if(this.enableCaptureDataOutsideTxn) {
      this.debugToolObj["enableCaptureDataOutsideTxn"].value = "1";
    } else {
      this.debugToolObj["enableCaptureDataOutsideTxn"].value = "0";
    }

    this.keywordData.emit(this.debugToolObj);
  }

    //Method to reset the default values of the keywords
  resetKeywordData() {
    let data = this.configKeywordsService.keywordData;
      for (let key in data) {
        if (this.keywordList.includes(key)) {
          this.debugToolObj[key].value = data[key].value;
        }
      }
	  this.methodToSetValue(this.debugToolObj);
  }

 /* This method is used to reset the keyword data to its Default value */
  resetKeywordsDataToDefault() {
     let data = this.configKeywordsService.keywordData;
      for (let key in data) {
        if (this.keywordList.includes(key)) {
          this.debugToolObj[key].value = data[key].defaultValue;
        }
      }
	  this.methodToSetValue(this.debugToolObj);
  }

  /**
  * Purpose : To invoke the service responsible to open Help Notification Dialog 
  */
  sendHelpNotification() {
    this.configKeywordsService.getHelpContent("Advance","Debug Tool",this.agentType );
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }
}
