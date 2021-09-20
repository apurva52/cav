import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Keywords } from '../../../../interfaces/keywords';
import { KeywordList } from '../../../../containers/keyword-data';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { ConfigUtilityService } from '../../../../services/config-utility.service';
import { cloneObject } from '../../../../utils/config-utility';

@Component({
  selector: 'app-nd-nf-configuration',
  templateUrl: './nd-nf-configuration.component.html',
  styleUrls: ['./nd-nf-configuration.component.css']
})
export class NDNFConfigurationComponent implements OnInit {
  @Input()
  saveDisable: boolean;
  @Output()
  keywordData = new EventEmitter();
  keywordsData: Keywords;
  keywordList: string[] = ['enableNDNFDataTransfer', 'NDNFFlushInterval', 'bciNDNFDataBufferSetting', 'enableUpdateLogMsgForNF', 'enableMDCLogMsgForNF'];
  //It stores data for showing in GUI
  ndNfConfObj: Object;

  subscription: Subscription;

  isProfilePerm: boolean;

  agentType: any;

  // Variable names
  isNdNfDataTransfer: boolean = false;

  ndNfDataTransferHost: any;

  ndNfDataTransferPort: any;

  ndNfDataTransferUrl: any;

  ndNfFlushIntervalVal: number;

  bufferCount: number;

  bufferSize: number;

  isEnableUpdateLogMsgForNF: boolean = false;
  isEnableMDCLogMsgForNF: boolean = false;

  constructor(private configKeywordsService: ConfigKeywordsService, private store: Store<KeywordList>, private configUtilityService: ConfigUtilityService) {
    this.subscription = this.store.select(store => store["keywordData"]).subscribe(data => {
      this.agentType = sessionStorage.getItem("agentType");
      var keywordDataVal = {}
      this.keywordList.map(function (key) {
        keywordDataVal[key] = data[key];
      })
      this.ndNfConfObj = cloneObject(keywordDataVal);
    });
  }

  ngOnInit() {
    this.isProfilePerm = +sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
    if (this.saveDisable || this.isProfilePerm)
      this.configUtilityService.infoMessage("Reset and Save are disabled");
    this.splitNDSessionKeywordValue();

  }

  //Method to split the enableNDSession keyword values by %20
  splitNDSessionKeywordValue() {
    if ((this.ndNfConfObj["enableNDNFDataTransfer"].value).includes("%20")) {
      let arr = this.ndNfConfObj["enableNDNFDataTransfer"].value.split("%20");
      this.isNdNfDataTransfer = true;
      if ((this.ndNfConfObj["enableNDNFDataTransfer"].value).includes("%3B")) {
        let splitArr = arr[1].split("%3B");
        this.ndNfDataTransferHost = splitArr[0];
        this.ndNfDataTransferPort = splitArr[1];
        this.ndNfDataTransferUrl = splitArr[2];
      }
    }
    else
    {
      this.isNdNfDataTransfer = false;
      this.ndNfDataTransferHost = '';
      this.ndNfDataTransferPort = '';
      this.ndNfDataTransferUrl = '';
    }

    if ((this.ndNfConfObj["bciNDNFDataBufferSetting"].value).includes("%20")) {
      let arr = this.ndNfConfObj["bciNDNFDataBufferSetting"].value.split("%20");
      this.bufferCount = arr[0];
      this.bufferSize = arr[1];
    }

    this.ndNfFlushIntervalVal = this.ndNfConfObj["NDNFFlushInterval"].value;

    if (this.ndNfConfObj["enableUpdateLogMsgForNF"].value == "1")
      this.isEnableUpdateLogMsgForNF = true;
    else
      this.isEnableUpdateLogMsgForNF = false;

    if (this.ndNfConfObj["enableMDCLogMsgForNF"].value == "1")
      this.isEnableMDCLogMsgForNF = true;
    else
      this.isEnableMDCLogMsgForNF = false;
  }

  saveKeywordData() {
    if (this.isNdNfDataTransfer) {
      let arr = ['1'];
      let secField = this.ndNfDataTransferHost + "%3B" + this.ndNfDataTransferPort + "%3B" + this.ndNfDataTransferUrl;
      arr.push(secField);
      this.ndNfConfObj['enableNDNFDataTransfer'].value = arr.join("%20");
    }
    else {
      this.ndNfConfObj['enableNDNFDataTransfer'].value = "0";
    }

    this.ndNfConfObj['NDNFFlushInterval'].value = this.ndNfFlushIntervalVal;

    this.ndNfConfObj['bciNDNFDataBufferSetting'].value = this.bufferCount + "%20" + this.bufferSize;

    if (this.isEnableUpdateLogMsgForNF)
      this.ndNfConfObj['enableUpdateLogMsgForNF'].value = "1";
    else
      this.ndNfConfObj['enableUpdateLogMsgForNF'].value = "0";

    if (this.isEnableMDCLogMsgForNF)
      this.ndNfConfObj['enableMDCLogMsgForNF'].value = "1";
    else
      this.ndNfConfObj['enableMDCLogMsgForNF'].value = "0";

    this.keywordData.emit(this.ndNfConfObj);
  }

  resetKeywordData() {
    this.getKeyWordDataFromStore();
    this.splitNDSessionKeywordValue();
  }

  getKeyWordDataFromStore() {
    this.subscription = this.store.select(store => store["keywordData"]).subscribe(data => {
      var keywordDataVal = {}
      this.keywordList.map(function (key) {
        keywordDataVal[key] = data[key];
      })
      this.ndNfConfObj = cloneObject(keywordDataVal);
    });
  }

  /* This method is used to reset the keyword data to its Default value */
  resetKeywordsDataToDefault() {
    let data = this.configKeywordsService.keywordData;
    for (let key in data) {
      if (this.keywordList.includes(key)) {
        this.ndNfConfObj[key] = data[key];
      }
    }
    var keywordDataVal = {}
    keywordDataVal = cloneObject(this.ndNfConfObj);
    this.keywordList.map(function (key) {
      keywordDataVal[key].value = data[key].defaultValue;
    })
    this.ndNfConfObj = cloneObject(keywordDataVal);
    this.splitNDSessionKeywordValue();
  }

  /**
 * Purpose : To invoke the service responsible to open Help Notification Dialog 
 */
 sendHelpNotification() {
  this.configKeywordsService.getHelpContent("Product Integration", "Log Monitoring Settings", this.agentType);
 }

}
