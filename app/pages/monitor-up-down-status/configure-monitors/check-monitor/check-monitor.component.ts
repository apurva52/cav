import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MonitorupdownstatusService } from '../../service/monitorupdownstatus.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MessageService } from 'primeng';
import { UtilityService } from '../../service/utility.service';
import * as CHECK_MON_DROPDOWN_LIST from '../../constants/check-mon-dropdown-constants';
import { CHECKMONITORDATA } from './check-monitor.data';
import { TierServerComponent } from '../tier-server/tier-server.component';
import * as COMPONENT from '../add-monitor/constants/monitor-configuration-constants';
import { ConfiguredMonitorInfoComponent } from '../configured-monitor-info/configured-monitor-info.component';
import * as _ from "lodash";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-check-monitor',
  templateUrl: './check-monitor.component.html',
  styleUrls: ['./check-monitor.component.scss'],
})
export class CheckMonitorComponent implements OnInit {
  /*It stores options to be displayed in the execute first time from event dropdown*/
  executeTimeArr = [];

  /*It stores options to be displayed in the FREQUENCY dropdown*/
  freqArr = [];

  /*It stores options to be displayed in the END EVENT dropdown*/
  endEventArr = [];

  sucessCriteriaArr = [];

  displayMonName: string;

  displayFrmEvnt: string;

  displayEndEvnt: string;

  checkMonData: CHECKMONITORDATA
  option: string = ""
  monType: string;
  saveMonDTO: any = {}
  body: {};
  isNewConfig: boolean = true;
  operation: string = "add"
  tableInfo: any[]
  techName: string = ""
  @ViewChild(TierServerComponent) tierChild: TierServerComponent;
  @ViewChild(ConfiguredMonitorInfoComponent) monInfoChild: ConfiguredMonitorInfoComponent;
  tierServerInfo: any[] = [];
  loading: boolean
  AddEditLabel: string = "Add";    //label for Add/Update Button
  type:string = ""
  gMonId: string = "-1";
  objectId: string = "-1";  // Object ID
  enabled:boolean = true;
  monName: string;
  deleteMonConf: Subscription; // to detect delete operation
  constructor(private monUpDownStatus: MonitorupdownstatusService,
    public router: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private msgService: MessageService) { }

  ngOnInit(): void {
    this.checkMonData = new CHECKMONITORDATA()
    this.route.params.subscribe((params: Params) => {
      this.monType = params['monName']
    });

    if (this.monType == 'Check Monitor') {
      this.monName = 'CHECK MONITOR';
      this.displayMonName = "Check Monitor Name";
      this.displayFrmEvnt = "From Event";
      this.displayEndEvnt = "End Event";
      this.techName = "checkMon"

    }
    else {
      this.monName = 'BATCH JOBS';
      this.displayMonName = "Batch Job Name";
      this.displayFrmEvnt = "When to Start?";
      this.displayEndEvnt = "When to End?";
      this.techName = 'batchJob'
    }
    this.createListForDropDown()
    this.monUpDownStatus.getConfigInfo(this.techName).subscribe(response => {
      this.splitOption(response)
      this.monInfoChild.getTableData(response)
    })
    if(this.techName == "checkMon"){
    this.tableInfo = [
      { field: "tierInfo", header: 'Tier Information', visible: true },
      //{ field: "monInfo", header: 'Monitors', visible: true },
      { field: 'checkMon', header: 'Check Monitor Name' },
      { field: COMPONENT.PHASE_NAME, header: 'Phase Name', width:'95px' },
      { field: COMPONENT.PERIODICITY, header: 'Periodicity', width:'84px' },
      { field: COMPONENT.COUNT, header: 'Count', width: '66px' },
      { field: COMPONENT.END_PHASE_NAME, header: 'End Phase Name' },
      { field: COMPONENT.FROM_EVENT, header: 'From Event'},
      { field: COMPONENT.FREQUENCY, header: 'Frequency'},
      { field: COMPONENT.END_EVENT, header: 'End Event'},
      { field: COMPONENT.CHECK_MON_PROG_NAME, header: 'Program Name' }
    ]
  }
  else{
  this.tableInfo = [
      { field: "tierInfo", header: 'Tier Information', visible: true },
      //{ field: "monInfo", header: 'Monitors', visible: true },
      { field: 'batchJobMon', header: 'Batch Job Name' },
      { field: COMPONENT.CHECK_MON_PROG_NAME, header: 'Program Name' },
      { field: COMPONENT.PHASE_NAME, header: 'Phase Name' },
      { field: COMPONENT.PERIODICITY, header: 'Periodicity' },
      { field: COMPONENT.COUNT, header: 'Count' },
      { field: COMPONENT.END_PHASE_NAME, header: 'End Phase Name' },
      { field: COMPONENT.FROM_EVENT, header: 'When to Start'},
      { field: COMPONENT.FREQUENCY, header: 'Frequency' },
      { field: COMPONENT.END_EVENT, header: 'When to End' },
      {field:COMPONENT.SUCCESS_CRITERIA, header:'Success Criteria'},
      {field:COMPONENT.BATCH_LOG_FILE_NAME, header:'Log File Name'},
      {field:COMPONENT.COMMAND_NAME, header:'Command Name'},
      {field:COMPONENT.BATCH_SEARCH_PATTERN, header:'Search Pattern'},
      
  ]
}
   // Bug 110416
   this.deleteMonConf = this.monUpDownStatus.$deleteMonConf.subscribe((res) => {
    if(res){
      this.resetUI();
    }
 });
  }
  createListForDropDown() {
    /* To get dropdown list for FROM EVENT */
    this.executeTimeArr = UtilityService.createListWithKeyValue(CHECK_MON_DROPDOWN_LIST.EXECUTE_TIME_LABEL, CHECK_MON_DROPDOWN_LIST.EXECUTE_TIME_VALUE);

    /* To get dropdown list for FREQUENCY */
    this.freqArr = UtilityService.createListWithKeyValue(CHECK_MON_DROPDOWN_LIST.FREQUENYCY_LABEL, CHECK_MON_DROPDOWN_LIST.FREQUENYCY_VALUE);

    /* To get dropdown list for END EVENT */
    this.endEventArr = UtilityService.createListWithKeyValue(CHECK_MON_DROPDOWN_LIST.END_EVENT_LABEL, CHECK_MON_DROPDOWN_LIST.END_EVENT_VALUE);

    /* To get dropdown list for success criteria mode */
    this.sucessCriteriaArr = UtilityService.createListWithKeyValue(CHECK_MON_DROPDOWN_LIST.SUCCESS_CRITERIA_LABEL, CHECK_MON_DROPDOWN_LIST.SUCCESS_CRITERIA_VALUE);
  }

  fromEventDropDownChange() {
    if (this.checkMonData.fromEvent == "1" || this.checkMonData.fromEvent == "3") {
      this.checkMonData.frequency == "2";
    }
  }
  addData() {
    if(this.monType == 'Check Monitor'){
      this.type = 'checkMon'
    }
    else{
      this.type = 'batchJob'
    }
      if (this.validateCheckMon(this.checkMonData)) {
        this.option = this.createOptionForCheckMonitor(this.checkMonData)
        this.saveMonConfiguration()
      }
  }
  createOptionForCheckMonitor(checkMonData) {
    let opt = ""
    if(this.monType == 'Batch Jobs'){
      if(checkMonData.checkMonProgName){
        opt = opt + checkMonData.checkMonProgName + " "
      }
    }
    if (this.checkMonData.fromEvent) {
      opt = opt + checkMonData.fromEvent + " "
    }
    if (checkMonData.phaseName) {
      opt = opt + checkMonData.phaseName + " "
    }

    if (checkMonData.frequency) {
      opt = opt + checkMonData.frequency + " "
    }

    if (checkMonData.periodicity) {
      opt = opt + checkMonData.periodicity + " "
    }

    if (checkMonData.endEvent) {
      opt = opt + checkMonData.endEvent + " "
    }

    if (checkMonData.endEvent) {
      if (checkMonData.endEvent == 'NA' || checkMonData.endEvent == '1' || checkMonData.endEvent == '2')
        opt = opt + checkMonData.count + " "
      else
        opt = opt + checkMonData.endPhaseName + " "
    }
    
    if(this.monType == 'Check Monitor'){
    if (checkMonData.checkMonProgName) {
      opt = opt + checkMonData.checkMonProgName
    }
  }
  if(this.monType == 'Batch Jobs'){
    if(checkMonData.successCriteria){
    opt = opt + checkMonData.successCriteria + " "
    }
    
    if(checkMonData.logFile){
      opt = opt + checkMonData.logFile + " "
    }

    if(checkMonData.cmdName){
      opt = opt + checkMonData.cmdName + " "
    }

    if(checkMonData.batchSearchPattern){
      opt = opt + checkMonData.batchSearchPattern
    }
  }
    return opt
  }
  saveMonConfiguration() {
    let reqBody: any = {};
    let tierInfo: any[] = []
    let body: any = {}
    let saveMonDTO: any = {}
    this.tierServerInfo = this.tierChild.getTierServerInfo();
    if (this.tierServerInfo.length == 0) {
      return false;
    }
    if (!this.monUpDownStatus.validateDuplicateTier(this.tierServerInfo)) { return false; } 
    this.loading = true;
    reqBody =
    {
      "techName": this.techName,
      "opr": this.operation,
      "gMonId": this.gMonId,
      "tierInfo": this.tierServerInfo,
      "body": body
    }
    body = {
      "mon": {}
    }
    body['mon'][this.checkMonData.name] = this.createDataforSave(this.checkMonData);
    reqBody['body'] = body
    this.monUpDownStatus.saveMonitorConfiguration(reqBody, this.techName, -1).subscribe(res => {
      if (res['status']) {
        this.monUpDownStatus.getConfigInfo(this.techName).subscribe(response => {
          this.splitOption(response)
          this.monInfoChild.getTableData(response)
        })
        this.msgService.add({ severity: COMPONENT.SEVERITY_SUCCESS, summary: COMPONENT.SUMMARY_SUCCESS, detail: res['msg'] })
        this.checkMonData = new CHECKMONITORDATA()
        this.tierChild.clearTierServerData();
        this.loading = false;
        this.cd.detectChanges();
        this.AddEditLabel = "Add";
        this.operation = 'Add'
        this.enabled = true
      }
      else{
        this.msgService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: res['msg'] })
        this.loading = false;
        this.cd.detectChanges();
      }
    })
  }
  createDataforSave(checkMonData) {
    let monObj: any = {}
    let option = this.option
    let instance = ""
    let enabled = this.enabled
    let type = this.type
    if (checkMonData.instance) {
      instance = checkMonData.instance
    }
    Object.assign(monObj, {
      [COMPONENT.OPTIONS]: option,
      [COMPONENT.INSTANCE]: instance,
      [COMPONENT.ENABLED]: enabled,
      [COMPONENT.TYPE]: type
    })
    return monObj
  }
  editData(data) {
    this.checkMonData = new CHECKMONITORDATA();
    this.loading = true;
    this.AddEditLabel = 'Update';
    this.operation = 'update'
    this.gMonId = data['gmonID'];
    this.objectId = data['objID'];
    this.enabled = data['custMonGdfDto']['enabled']
    this.tierChild.fillTierDataAtEit(data['tierInfo']);
    this.modifyTableDataByMonType(data.custMonGdfDto)
    this.loading = false;
    this.cd.detectChanges();
  }
  
 

  
  modifyTableDataByMonType(res) {
    let valArr = res['options'].trim().split(" ");
    if(res.type == 'checkMon'){
     this.checkMonData.name = res.checkMon;
     this.checkMonData.instance = res.instance;
     this.checkMonData.fromEvent = valArr[0]
     this.checkMonData.phaseName = valArr[1]
     this.checkMonData.frequency = valArr[2]
     this.checkMonData.periodicity = valArr[3]
     this.checkMonData.endEvent = valArr[4]
     if(this.checkMonData.endEvent === 'NA' || this.checkMonData.endEvent === '1' || this.checkMonData.endEvent === '2'){
       this.checkMonData.count = valArr[5]
     }
     else{
       this.checkMonData.endPhaseName = valArr[5]
     }
     this.checkMonData.checkMonProgName = valArr[6]
    }

    if(res.type == 'batchJob'){
      this.checkMonData.checkMonProgName = valArr[0]
      this.checkMonData.name = res.batchJobMon;
      this.checkMonData.instance = res.instance;
      this.checkMonData.fromEvent = valArr[1]
      this.checkMonData.phaseName = valArr[2]
      this.checkMonData.frequency = valArr[3]
      this.checkMonData.periodicity = valArr[4]
      this.checkMonData.endEvent = valArr[5]
      if(this.checkMonData.endEvent === 'NA' || this.checkMonData.endEvent === '1' || this.checkMonData.endEvent === '2'){
        this.checkMonData.count = valArr[6]
      }
      else{
        this.checkMonData.endPhaseName = valArr[6]
      }
      this.checkMonData.successCriteria = valArr[7]
      this.checkMonData.logFile = valArr[8]
      this.checkMonData.cmdName = valArr[9]
      this.checkMonData.batchSearchPattern =valArr[10]
    }

  }
  validateCheckMon(checkMonData): boolean {
    if (checkMonData.fromEvent == "NA") {
      this.msgService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: 'Please Select From Event' })
      return false;
    }

    //if from event selected as "Before start of test" or "At end of test" then it sets phaseName,endPhaseName, frequency, periodicity,count,endPhasename to NA
    else if (checkMonData.fromEvent == "1" || checkMonData.fromEvent == "90") {
      checkMonData.phaseName = "NA";
      checkMonData.periodicity = "NA";
      checkMonData.count = "NA";
      checkMonData.endPhaseName = "NA";
      checkMonData.frequency = "2";
      checkMonData.endEvent = "NA";
    }
    else if (checkMonData.fromEvent == "2" || checkMonData.fromEvent == "3") {
      if (checkMonData.fromEvent == "3" && (checkMonData.phaseName == "NA" || checkMonData.phaseName == "")) {
        this.msgService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: 'Please Enter Valid Phase Name' })
        return false;
      }
      else if (checkMonData.phaseName != "NA" || checkMonData.fromEvent == "2") {
        if (checkMonData.frequency == "NA") {
          this.msgService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: 'Please Select frequency' })
          return false;
        }
        else if (checkMonData.frequency == "1") //Case of frequency 'Run Periodicly' 
        {
          if (checkMonData.endEvent == "NA") {
            this.msgService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: 'Please Select End Event' })
            return false;
          }
          else if (checkMonData.endEvent == "3") {
            if (checkMonData.endPhaseName == "NA" || checkMonData.endPhaseName == '' || checkMonData.endPhaseName == null) {
              this.msgService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: 'Please Enter End Phase Name' })
              return false;
            }
          }
          else if (checkMonData.endEvent == "2") {
            if (checkMonData.count == "NA" || checkMonData.count == null) {
              this.msgService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: 'Please Enter Valid Count' })
              return false;
            }
          }
        }
      }
    }

    //if frequency is not selected while editing then it sets periodicity,count,endPhasename to NA
    if (checkMonData.frequency == "2") {
      checkMonData.periodicity = "NA";
      checkMonData.count = "NA";
      checkMonData.endPhaseName = "NA";
    }
    if (checkMonData.fromEvent == "2") {
      checkMonData.phaseName = "NA";
    }

    //if endevent is changed while editing then values of count or endphasename is set to NA
    if (checkMonData.frequency == "1") {
      if (checkMonData.endEvent == "1") {
        checkMonData.count = "NA";
        checkMonData.endPhaseName = "NA";
      } else if (checkMonData.endEvent == "2") {
        checkMonData.endPhaseName = "NA";
      } else if (checkMonData.endEvent == "3") {
        checkMonData.count = "NA";
      }
    }

    if (this.monType == 'Batch Jobs') {
      // for selecting success criteria mode	
      if (checkMonData.successCriteria == "1") {
        checkMonData.batchSearchPattern = "NA";
        checkMonData.logFile = "NA";
        checkMonData.cmdName = "NA";
      }
      else if (checkMonData.successCriteria == "2") {
        if (checkMonData.batchSearchPattern == "NA") {
          this.msgService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: 'Please Enter Search Pattern' })
          return false;
        }
        checkMonData.logFile = "NA";
        checkMonData.cmdName = "NA";
      }
      else if (checkMonData.successCriteria == "3") {
        if (checkMonData.batchSearchPattern == "NA") {
          this.msgService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: 'Please Enter Search Pattern' })
          return false;
        }
        else if (checkMonData.logFile == "NA") {
          this.msgService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: 'Please Enter Log File Path' })
          return false;
        }
        checkMonData.cmdName = "NA";
      }
      else {
        if (checkMonData.cmdName == "NA") {
          this.msgService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: 'Please Enter Command Name' })
          return false;
        }
        checkMonData.batchSearchPattern = "NA";
        checkMonData.logFile = "NA";
      }
    }
    return true;
  }
  resetUI(){
    this.AddEditLabel = 'Add';
    this.operation = "add"
    this.gMonId = "-1";
    this.objectId = "-1";
    this.tierChild.clearTierServerData();
    this.checkMonData = new CHECKMONITORDATA();
  }
  splitOption(res){
    let that = this;
    res.map(function(each){
      let valArr = each["options"].trim().split(" ");
      if (each['checkMon'] != null) {
        let dataArr: string[] = [COMPONENT.FROM_EVENT, COMPONENT.PHASE_NAME, COMPONENT.FREQUENCY, COMPONENT.PERIODICITY, COMPONENT.END_EVENT, COMPONENT.COUNT, COMPONENT.CHECK_MON_PROG_NAME];
    
        each[COMPONENT.END_PHASE_NAME] = 'NA';
        for (let ii = 0; ii < dataArr.length; ii++) {
          each[dataArr[ii]] = 'NA';
          if (valArr[ii] == undefined)
            continue;
           
          if (dataArr[ii] == COMPONENT.COUNT && valArr[ii - 1] == '3') {
            each[COMPONENT.END_PHASE_NAME] = valArr[ii];
          }
          else if (dataArr[ii] == COMPONENT.CHECK_MON_PROG_NAME) {
            each[dataArr[ii]] = valArr[ii];
          }
          else {
            each[dataArr[ii]] = valArr[ii];
          }
        }
      }
      
      //Handled cases for Batch Jobs
      else if (each['batchJobMon'] != null) {
        let dataArr: string[] = [COMPONENT.CHECK_MON_PROG_NAME, COMPONENT.FROM_EVENT, COMPONENT.PHASE_NAME, COMPONENT.FREQUENCY, COMPONENT.PERIODICITY, COMPONENT.END_EVENT, COMPONENT.COUNT, COMPONENT.SUCCESS_CRITERIA, COMPONENT.BATCH_LOG_FILE_NAME, COMPONENT.COMMAND_NAME, COMPONENT.BATCH_SEARCH_PATTERN];

        each[COMPONENT.END_PHASE_NAME] = 'NA';
        for (let ii = 0; ii < dataArr.length; ii++) {
          each[dataArr[ii]] = 'NA';
          if (valArr[ii] == undefined)
            continue;

          if (dataArr[ii] == COMPONENT.COUNT && valArr[ii - 1] == '3') {
            each[COMPONENT.END_PHASE_NAME] = valArr[ii];
          }
          else if (dataArr[ii] == COMPONENT.CHECK_MON_PROG_NAME) {
            each[dataArr[ii]] = decodeURIComponent(valArr[ii]);
          }
          else if (dataArr[ii] == COMPONENT.BATCH_SEARCH_PATTERN) {
            each[dataArr[ii]] = decodeURIComponent(valArr[ii]);
          }
          else if (dataArr[ii] == COMPONENT.BATCH_LOG_FILE_NAME) {
            each[dataArr[ii]] = decodeURIComponent(valArr[ii]);
          }
          else if (dataArr[ii] == COMPONENT.COMMAND_NAME) {
            each[dataArr[ii]] = decodeURIComponent(valArr[ii]);
          }
          else {
            each[dataArr[ii]] = valArr[ii];
          }
        }
      }
       // for check monitor need to get label for displaying in the ui 
       if(each['checkMon']!=null){
        let list = that.modifyDataForCheckMonDropDown(that.tableInfo, each);
       }
       if(each['batchJobMon']!= null){
        let list = that.modifyDataForCheckMonDropDown(that.tableInfo, each);
       }
      

    })
  }
  modifyDataForCheckMonDropDown(hdrList, response) {
    let that = this;
    hdrList.map(function (eachObj) {
      that.getDropDownLabelForCheckMon(response, eachObj)
    })
  }
  getDropDownLabelForCheckMon(response, eachObj) {
    if (eachObj.field == COMPONENT.FROM_EVENT || eachObj.field == COMPONENT.FREQUENCY || eachObj.field == COMPONENT.END_EVENT || eachObj.field == COMPONENT.SUCCESS_CRITERIA) {
      let key = eachObj.field;
      if (!key.includes("_ui") || response[key] != '') {
        let list = [];

        if (key == COMPONENT.FROM_EVENT)
          list = UtilityService.createListWithKeyValue(CHECK_MON_DROPDOWN_LIST.EXECUTE_TIME_LABEL, CHECK_MON_DROPDOWN_LIST.EXECUTE_TIME_VALUE);
        else if (key == COMPONENT.FREQUENCY)
          list = UtilityService.createListWithKeyValue(CHECK_MON_DROPDOWN_LIST.FREQUENYCY_LABEL, CHECK_MON_DROPDOWN_LIST.FREQUENYCY_VALUE);
        else if (key == COMPONENT.END_EVENT)
          list = UtilityService.createListWithKeyValue(CHECK_MON_DROPDOWN_LIST.END_EVENT_LABEL, CHECK_MON_DROPDOWN_LIST.END_EVENT_VALUE);
        else if (key == COMPONENT.SUCCESS_CRITERIA)
          list = UtilityService.createListWithKeyValue(CHECK_MON_DROPDOWN_LIST.SUCCESS_CRITERIA_LABEL, CHECK_MON_DROPDOWN_LIST.SUCCESS_CRITERIA_VALUE);

        let obj = _.find(list, function (item) { return item.value == response[key] })

        let Key = key 

        if (obj.value != 'NA'){ // skipping those values from the list which have value as NA.when no option is selected from the dropdown it is having value as "NA"
          response[Key] = obj.label; // add an entry in the formData when value is not "NA"
        }
        else {
          response[Key] = obj.value;
        }
        // otherwise set "NA" as its value to be displayed in the ui.
      }
    }
  }

  ngOnDestroy() {
    if(this.deleteMonConf)
      this.deleteMonConf.unsubscribe();
  } 

}
