import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
// import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { SelectItem } from 'primeng/api';
import { Keywords } from '../../../../interfaces/keywords';
import { KeywordsInfo } from '../../../../interfaces/keywords-info';
import { KeywordData, KeywordList } from '../../../../containers/keyword-data';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { ConfigUtilityService } from '../../../../services/config-utility.service';
import { ActivatedRoute, Params } from '@angular/router';
import { cloneObject } from '../../../../utils/config-utility';
import { ConfigProfileService } from '../../../../services/config-profile.service';
import { ConfigUiUtility } from '../../../../utils/config-utility';
import { ConfigRestApiService } from '../../../../services/config-rest-api.service';
import { NodeData } from '../../../../containers/node-data';

@Component({
  selector: 'app-config-dynamic-logging',
  templateUrl: './config-dynamic-logging.component.html',
  styleUrls: ['./config-dynamic-logging.component.css']
})
export class ConfigDynamicLoggingComponent implements OnInit {

  @Output()
  keywordData = new EventEmitter();

  @Input()
  saveDisable: boolean;
  profileName: string;
  selectedFQC: string = "";
  fqcList: any[] = [];
  isProfilePerm: boolean;
  dlFqmList: any[] = [];
  
  dlTableHeader = [
    { field: 'fqm', value: this.dlFqmList },
  ];

  cols = [
    { header: 'Fully Qualified Method Name', field: 'fqm' }
  ];

  nodeData: NodeData;	//
  tableValues = [];	//Value to display in table
  dlTableData = {};
  showCommonDLComponent: boolean;	//To View the DL Comoonent
  productName: string;
  argsForDynamicLogging: any[];		//Argument array for DL Component
  profileId: any;
  instanceName: string;
  serverName: string;
  tierName: string;
  trNo: any;
  isNoInstanceSelected: boolean = false;

  keywordList: string[] = ['ndMethodTracePointFile'];
  dynamicLogging: Object = {};
  selectedDLValues: boolean = false;
  keywordValue: Object;

  constructor(private configUtilityService: ConfigUtilityService, private configKeywordService: ConfigKeywordsService, private configProfileService: ConfigProfileService, private _restApi: ConfigRestApiService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.isProfilePerm=+sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
    //fetching the profile Id
    this.route.params.subscribe((params: Params) => {
      this.profileId = params['profileId'];
    });
    //getting the fqc list using profile Id
    this.configKeywordService.getDLFqcList(this.profileId).subscribe(response => {
      this.fqcList = response;
      //creating dropdown value for FQC
      this.fqcList = ConfigUiUtility.createListWithKeyValue(this.fqcList, this.fqcList);
    });

    this.nodeData = this.configProfileService.nodeData;
    //getting Test Run Number from the session storage
    this.trNo = sessionStorage.getItem("isTrNumber");
    //if TrNo is null then feth the Tr No. from config.ini file
    if(this.trNo == "null"){
      this.configKeywordService.getTrNoFromFile().subscribe(data => {
        this.trNo = data.toString();
      });
    }
    this.getTierServerInstanceName(this.nodeData);

    if (this.configKeywordService.keywordData != undefined) {
      this.keywordValue = cloneObject(this.configKeywordService.keywordData);
    }
    
    this.dynamicLogging = {};
    this.keywordList.forEach((key) => {
      if (this.keywordValue.hasOwnProperty(key)) {
        this.dynamicLogging[key] = this.keywordValue[key];
        if (this.dynamicLogging[key].value == "true")
          this.selectedDLValues = true;
        else
          this.selectedDLValues = false;
      }
    });
  }
  
  getFqmList() {
    //getting fqm list using selected fqc and profile id
    this.configKeywordService.getDLFqmListUsingFqc(this.profileId, this.selectedFQC).subscribe(data => {
      this.dlFqmList = data;
      this.tableValues = [];
      for (let i = 0; i < data.length; i++) {
        this.dlTableData = {
          'fqm': this.dlFqmList[i]
        };
	//storing the values into array to be displayed in the table
        this.tableValues.push(this.dlTableData);
      }
    });
  }

  getTierServerInstanceName(nodeData) {
    if (nodeData.nodeType == 'instance' || nodeData.nodeType == 'Instance') {
      //getting the Tier, Server, instance name 
      this.configKeywordService.getTierServerInstanceName(nodeData.nodeId, nodeData.topologyName).subscribe(data => {
        this.instanceName = data[0];
        this.serverName = data[1];
        this.tierName = data[2];
      });
    } else {
      this.isNoInstanceSelected = true;
      this.configUtilityService.errorMessage("Traverse via Application > Topology (T>S>I) to see DL Data.");
      return;
    }
  }

  dynamicLoggingNavigator(rowData) {
    this.productName = sessionStorage.getItem("productType");
    //Array for opening the DL component
    this.argsForDynamicLogging = [this.tierName, this.serverName, this.instanceName, rowData.fqm, this.productName, this.trNo, "", "", "1"];
    this.showCommonDLComponent = true;
  }
  
  saveDynamicLoggingDataonFile() {
    let filePath = '';
    for (let key in this.dynamicLogging) {
      
      if (key == 'ndMethodTracePointFile') {
        if (this.selectedDLValues == true) {
          this.dynamicLogging[key]["value"] = "true";
        }
        else {
          this.dynamicLogging[key]["value"] = "NA";
        }
      }
      this.configKeywordService.keywordData = cloneObject(this.configKeywordService.keywordData);
      this.configKeywordService.keywordData[key] = this.dynamicLogging[key];
    }
    //getting file path using profile id
    this.configKeywordService.getFilePath(this.profileId).subscribe(data => {
      if (this.selectedDLValues == false) {
        filePath = "NA";
      }
      else {
        filePath = data;
        filePath = filePath + "/tracePointsConfig.json";
      }
      //storing the keyword path
      this.dynamicLogging['ndMethodTracePointFile'].path = filePath;
      this.keywordData.emit(this.dynamicLogging);
    });
  }

  resetKeywordValue() {
    //Method to reset the keyword value
    let data = this.configKeywordService.keywordData;
    for (let key in data) {
      if (this.keywordList.includes(key)) {
        this.dynamicLogging[key].value = data[key].value;
      }
    }
    this.methodToResetValues(this.dynamicLogging);
  }

  resetKeywordsDataToDefault() {
    //Method to Reset values to Default
    let data = this.configKeywordService.keywordData;
    for (let key in data) {
      if (this.keywordList.includes(key)) {
	//values will be restored to default
        this.dynamicLogging[key].value = data[key].defaultValue;
      }
    }
    this.methodToResetValues(this.dynamicLogging);
    this.selectedDLValues = false;
  } 
 
  methodToResetValues(data) {
    this.dynamicLogging = data;
    this.selectedDLValues = this.dynamicLogging['ndMethodTracePointFile'].value == "NA" ? false : true;
  }

  closeDynamicLogging(isCloseDLDialog) {
    this.showCommonDLComponent = isCloseDLDialog;
  }
}
