import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConfigUiUtility, cloneObject } from '../../../../utils/config-utility';
import { SelectItem } from 'primeng/api';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Observable, Subscription } from 'rxjs';
import { ConfigCustomDataService } from '../../../../services/config-customdata.service';
import { ConfigUtilityService } from '../../../../services/config-utility.service';
import { Store } from '@ngrx/store';


@Component({
  selector: 'app-headerss',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  /**This is to send data to parent component(General Screen Component) for save keyword data */
  @Output()
  keywordData = new EventEmitter();

  @Input()
  saveDisable: boolean;


  HeaderForm: boolean = true;

  subscription: Subscription;
  // subscriptionEG: Subscription;
  isProfilePerm: boolean;
  // enableGroupKeyword: boolean = false;

  /*holding keyword data and sending to its child component
  * i.e so that when its values is changed at child
  * it can be acessed from its parent i.e its current component
  */
  header: Object;           //it is send to customData child component
  httpKeywordObject: any[];  //it is send to httpheaders child component


  httpReqFullFp: HttpReqFullFp;
  httpRespFullFp: HttpRespFullFp;
  httpBodyCapture: HttpBodyCapture;

  keywordList = ['captureHTTPReqFullFp', 'captureHTTPRespFullFp', 'enableBodyCapture'];

  profileId: number;
  agentType: string;
  //Variables to shoe dialog for Body Capture keyword
  showMsg : boolean = false;

  /* here value of keyworsds should be boolean but from server sides it is giving string so converting it to
   *  to boolean value
   */
  constructor(private configKeywordsService: ConfigKeywordsService, private configCustomDataService: ConfigCustomDataService, private route: ActivatedRoute, private configUtilityService: ConfigUtilityService, private store: Store<Object>) {
    
    this.agentType = sessionStorage.getItem("agentType");
    this.subscription = this.store.select(store => store["keywordData"]).subscribe(data => {
      if (!data)
        return;

      data = cloneObject(data);
      for (let key in data) {
        data[key].value = (data[key].value == 'true' || data[key].value == 'false') ? data[key].value == 'true' : data[key].value
      }
      this.header = cloneObject(data);
    });
    this.subscription = this.store.select(store => store["keywordData"]).subscribe(data => {
      var keywordDataVal = {}
      this.keywordList.map(function (key) {
        keywordDataVal[key] = data[key];
      })
      this.header = cloneObject(keywordDataVal);
    });
    // this.subscriptionEG = this.configKeywordsService.keywordGroupProvider$.subscribe(data => this.enableGroupKeyword = data.general.header.enable);
    this.configKeywordsService.toggleKeywordData();
    this.httpKeywordObject = [];
  }


  ngOnInit() {
    this.isProfilePerm = +sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
    if (this.saveDisable || this.isProfilePerm)
      this.configUtilityService.infoMessage("Reset and Save are disabled");
    this.splitKeywordData(this.header)
  }

  /*
``* Here value of keyword should be as:
  * 3%20ALL%201%2030
  * here 3 = enables
  *     ALL = captureMode ,if Specified headers selected ,headers Name is written instead of ALL
  */

  constructValHttpReqFullFp(httpReqkeyword) {
    let httpReqFullFpVal = '0';

    if (httpReqkeyword.enableHttpReq && httpReqkeyword.headerMode == 0)
      httpReqFullFpVal = '2';
    if (httpReqkeyword.enableHttpReq && httpReqkeyword.headerMode != 0) {
      httpReqFullFpVal = "3%20"
      if (httpReqkeyword.headerMode != 'All') {
        let val = '';
        for (var i = 0; i < httpReqkeyword.headersName.length; i++) {
          if (i == (httpReqkeyword.headersName.length - 1))
            val = val + httpReqkeyword.headersName[i]
          else
            val = val + httpReqkeyword.headersName[i] + ','
        }
        httpReqFullFpVal = httpReqFullFpVal + val + "%20";
      }
      else {
        httpReqFullFpVal = httpReqFullFpVal + "ALL%20";
        httpReqkeyword.headersName = [];
      }

      if (httpReqkeyword.captureMode == 1)
        httpReqFullFpVal = httpReqFullFpVal + "1%20" + httpReqkeyword.briefVal;
      else
        httpReqFullFpVal = httpReqFullFpVal + "0";
    }
    return httpReqFullFpVal;
  }

  constructValHttpRespFullFp(httpRespKeyword) {
    let httpRespFullFpVal = '0';

    if (httpRespKeyword.enableHttpResp && httpRespKeyword.headerModeResp == 0)
      httpRespFullFpVal = '1';
    if (httpRespKeyword.enableHttpResp && httpRespKeyword.headerModeResp != 0) {
      httpRespFullFpVal = "2%20"

      if (httpRespKeyword.headerModeResp != 'All') {
        let val = '';
        for (var i = 0; i < httpRespKeyword.headersNameResp.length; i++) {
          if (i == (httpRespKeyword.headersNameResp.length - 1))
            val = val + httpRespKeyword.headersNameResp[i]
          else
            val = val + httpRespKeyword.headersNameResp[i] + ','
        }
        httpRespFullFpVal = httpRespFullFpVal + val + "%20";
      }
      else {
        httpRespFullFpVal = httpRespFullFpVal + "ALL%20";
        httpRespKeyword.headersNameResp = [];
      }

      if (httpRespKeyword.captureModeResp == 1)
        httpRespFullFpVal = httpRespFullFpVal + "1%20" + httpRespKeyword.briefValResp;
      else
        httpRespFullFpVal = httpRespFullFpVal + "0";
    }
    return httpRespFullFpVal;
  }


  saveKeywordData() {
    //This flag will close Confirmation dialog
    this.showMsg = false;
    this.route.params.subscribe((params: Params) => this.profileId = params['profileId']);
    let captureHttpReqFullFpVal = this.constructValHttpReqFullFp(this.httpKeywordObject[0]);
    let captureHttpRespFullFpVal = this.constructValHttpRespFullFp(this.httpKeywordObject[1]);

    this.header["captureHTTPReqFullFp"].value = captureHttpReqFullFpVal;
    this.header["captureHTTPRespFullFp"].value = captureHttpRespFullFpVal;

    //Set the value for enableBodyCapture keyword
    if(this.httpKeywordObject[2].isEnableBodyCapture)
    {
      this.header["enableBodyCapture"].value = "1%20" + this.httpKeywordObject[2].bodyCaptureThreshold;
    }
    else
    {
      this.header["enableBodyCapture"].value = "0%2010000";
      this.httpKeywordObject[2].isEnableBodyCapture = false;
      this.httpKeywordObject[2].bodyCaptureThreshold = "10000";
    } 
    this.keywordData.emit(this.header);
  }

  splitKeywordData(keywords) {
    this.httpReqFullFp = new HttpReqFullFp();
    this.httpRespFullFp = new HttpRespFullFp();
    this.httpBodyCapture = new HttpBodyCapture();
    if ((keywords["captureHTTPReqFullFp"].value).includes("%20")) {
      let arr = (keywords["captureHTTPReqFullFp"].value).split("%20")
      this.httpReqFullFp.enableHttpReq = arr[0] == 3;
      this.httpReqFullFp.headerMode = arr[1] == "ALL" ? "All" : "Specified";
      let arrVal = [];
      if (arr[1].includes(",") || arr[1] != "ALL") {
        arrVal = arr[1].split(",")
      }
      this.httpReqFullFp.headersName = arrVal;
      this.httpReqFullFp.captureMode = arr[2] == 1;
      this.httpReqFullFp.briefVal = arr[2] == 1 ? arr[3] : '';
    }
    else if (keywords["captureHTTPReqFullFp"].value == '2') {
      this.httpReqFullFp.enableHttpReq = true;
    }

    if ((keywords["captureHTTPRespFullFp"].value).includes("%20")) {
      let arr = (keywords["captureHTTPRespFullFp"].value).split("%20")
      this.httpRespFullFp.enableHttpResp = arr[0] == 3;
      this.httpRespFullFp.headerModeResp = arr[1] == "ALL" ? "All" : "Specified";
      let arrVal = [];
      if (arr[1] != "ALL" || arr[1].includes(",")) {
        arrVal = arr[1].split(",")
      }
      this.httpRespFullFp.headersNameResp = arrVal;
      this.httpRespFullFp.captureModeResp = arr[2] == 1;
      this.httpRespFullFp.briefValResp = arr[2] == 1 ? arr[3] : '';
      this.httpRespFullFp.enableHttpResp = true;
    }
    else if (keywords["captureHTTPRespFullFp"].value == '1') {
      this.httpRespFullFp.enableHttpResp = true;
    }

    //Set the values for enableBodyCapture keyword
    if ((keywords["enableBodyCapture"].value).includes("%20"))
    {
      let arr = (keywords["enableBodyCapture"].value).split("%20")
      this.httpBodyCapture.isEnableBodyCapture = arr[0] == "1" ? true : false;
      this.httpBodyCapture.bodyCaptureThreshold = arr[1];
    }
    else
    {
      this.httpBodyCapture.isEnableBodyCapture = false;
      this.httpBodyCapture.bodyCaptureThreshold = "10000";
    }

    this.httpKeywordObject = [];
    this.httpKeywordObject.push(this.httpReqFullFp)
    this.httpKeywordObject.push(this.httpRespFullFp)
    this.httpKeywordObject.push(this.httpBodyCapture)

  }

  resetKeywordData() {
    let data = this.configKeywordsService.keywordData;
    for (let key in data) {
      if (this.keywordList.includes(key)) {
        this.header[key].value = data[key].value;
      }
    }
    this.splitKeywordData(this.header);
  }

  /* This method is used to reset the keyword data to its Default value */
  resetKeywordsDataToDefault() {
    let data = this.configKeywordsService.keywordData;
    for (let key in data) {
      if (this.keywordList.includes(key)) {
        this.header[key].value = data[key].defaultValue;
      }
    }
    this.splitKeywordData(this.header);
  }
  /**
   * Purpose : To invoke the service responsible to open Help Notification Dialog 
   * related to the current component.
   */
  sendHelpNotification() {
    this.configKeywordsService.getHelpContent("General", "Header", this.agentType);
  }

  //this method is used to show Confirmation message if Body Capture keyword is disabled else call saveKeywordData() method
  showMessage()
  {
    if(!this.httpKeywordObject[2].isEnableBodyCapture && this.agentType == 'Java')
      this.showMsg = true;
    else
    this.saveKeywordData();
  }


}
//Contains httpReqFullFp Keyword variables
class HttpReqFullFp {
  enableHttpReq: boolean = false;
  headerMode: any = 0;
  headersName: any = [];
  captureMode: boolean = false;
  briefVal: string = '0';
}

//Contains httpRespFullFp Keyword variables
class HttpRespFullFp {
  enableHttpResp: boolean = false;
  headerModeResp: any = 0;
  headersNameResp: any = [];
  captureModeResp: boolean = false;
  briefValResp: string = '0';
}

//Create enableBodyCapture variable
class HttpBodyCapture {
  bodyCaptureThreshold : any;
  isEnableBodyCapture : boolean = false;
}
