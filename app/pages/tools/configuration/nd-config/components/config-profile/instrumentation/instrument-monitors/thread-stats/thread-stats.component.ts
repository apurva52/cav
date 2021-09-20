import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { ConfigKeywordsService } from '../../../../../services/config-keywords.service';
import { KeywordData, KeywordList } from '../../../../../containers/keyword-data';
import { ConfigUtilityService } from '../../../../../services/config-utility.service';
import { cloneObject } from '../../../../../utils/config-utility';

@Component({
  selector: 'app-thread-stats',
  templateUrl: './thread-stats.component.html',
  styleUrls: ['./thread-stats.component.css']
})
export class ThreadStatsComponent implements OnInit {

  @Input()
  profileId: number;
  @Input()
  saveDisable: boolean;
  /**This is to send data to parent component(General Screen Component) for save keyword data */
  @Output()
  keywordData = new EventEmitter();

  jvmThreadStats: JVMThreadStats;

  subscription: Subscription;
  /**These are those keyword which are used in current screen. */;
  keywordList: string[] = ['enableJVMThreadMonitor'];

  /**It stores keyword data for showing in GUI */
  threadStats: Object;
  enableGroupKeyword: boolean;
  isProfilePerm: boolean;
  constructor(private configKeywordsService: ConfigKeywordsService, private store: Store<KeywordList>, private configUtilityService: ConfigUtilityService) {
  }

  ngOnInit() {
    this.isProfilePerm = +sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
    this.getKeywordData();
    if (this.profileId == 1 || this.profileId == 777777 || this.profileId == 888888)
      this.saveDisable = true;
  }

  //method to split enableJVMThreadMonitor keyword value
  threadStatsKeyVal() {
    if (this.threadStats["enableJVMThreadMonitor"].value == 0) {
      this.jvmThreadStats = new JVMThreadStats();
      this.jvmThreadStats.jvm = false;
      this.jvmThreadStats.cpu = 5;
      // this.jvmThreadStats.deleteVector = false; 
    }
    else if ((this.threadStats["enableJVMThreadMonitor"].value).includes("%20")) {
      let arr = (this.threadStats["enableJVMThreadMonitor"].value).split("%20");
      this.jvmThreadStats = new JVMThreadStats();
      this.jvmThreadStats.jvm = arr[0] == 1 ? true : false;
      this.jvmThreadStats.cpu = arr[1];
      // this.jvmThreadStats.deleteVector = arr[2] == 1 ? true : false;
    }

  }

  getKeywordData() {
    let keywordData;
    //hasOwnProperty is undefined on refreshing page, checking for keywordData if it is undefined or not 
    if (this.configKeywordsService.keywordData != undefined) {
      keywordData = this.configKeywordsService.keywordData;
      let config = {
        'configkeyword': keywordData
      }
      sessionStorage.setItem('keywordValue', JSON.stringify(config));
    }
    else {
      // Commenting this as store is giving default value instead of saved one
      /*
      this.subscription = this.store.select(store => store["keywordData"]).subscribe(data => {
        var keywordDataVal = {}
        this.keywordList.map(function (key) {
          keywordDataVal[key] = data[key];
        })
        keywordData = keywordDataVal;
      });*/
      let keyVal = JSON.parse(sessionStorage.getItem('keywordValue'));
      keywordData = keyVal['configkeyword'];
    }
    this.threadStats = {}
    this.keywordList.forEach((key) => {
      if (keywordData.hasOwnProperty(key)) {
        this.threadStats[key] = keywordData[key];
        if (JSON.parse(sessionStorage.getItem('savedkeyWordValue')) == null || JSON.parse(sessionStorage.getItem('savedkeyWordValue')) == undefined) {
          sessionStorage.setItem('savedkeyWordValue', JSON.stringify(this.threadStats[key].value));
        }
      }
    });
    this.threadStats = cloneObject(this.threadStats);
    this.threadStatsKeyVal();
  }

  /*Here the value of this keyword is as:
  * enableJVMMonitor = "1%2040%20%1"
  * Here 1  = enableJVMMonitor
  *      40 = cpuFilter value
  *      1  = donot delete  vector(enabled = 1 /disabled = 0)
  */

  saveKeywordData(data) {
    let threadVal = this.threadValMethod(data);
    sessionStorage.setItem('savedkeyWordValue', JSON.stringify(threadVal));
    for (let key in this.threadStats) {
      if (key == 'enableJVMThreadMonitor')
        this.threadStats[key]["value"] = threadVal;
    }
    this.keywordData.emit(this.threadStats);
    let config = {
      'configkeyword': this.configKeywordsService.keywordData
    }
    sessionStorage.setItem('keywordValue', JSON.stringify(config));
  }

  //Method to generate enableJVMThreadMonitor keyword value
  threadValMethod(data) {
    if (this.jvmThreadStats.jvm == false) {
      let key = 0;
      return key;
    }
    else {
      let key = `${this.jvmThreadStats.jvm == true ? 1 : 0}%20${this.jvmThreadStats.cpu}%200`;
      return key;
    }
  }

  resetKeywordData() {
    //We are using the sessionStorage to store the saved data  as store/service is giving default value instead of saved one after clicking on Reset To Default
    let savedValue = JSON.parse(sessionStorage.getItem('savedkeyWordValue'));
    let data = this.configKeywordsService.keywordData;
    for (let key in data) {
      if (this.keywordList.includes(key)) {
        this.threadStats[key].value = savedValue;
      }
    }
    this.threadStatsKeyVal();
  }
  /* This method is used to reset the keyword data to its Default value */
  resetKeywordsDataToDefault() {
    this.jvmThreadStats.jvm = false;
    this.jvmThreadStats.cpu = 5;
  }
/**
 * Purpose : To invoke the service responsible to open Help Notification Dialog 
 */
sendHelpNotification() {
  this.configKeywordsService.getHelpContent("Instrumentation","JVM Thread CPU Monitor", "");
}
}
class JVMThreadStats {
  jvm;
  cpu: number = 5;
}
