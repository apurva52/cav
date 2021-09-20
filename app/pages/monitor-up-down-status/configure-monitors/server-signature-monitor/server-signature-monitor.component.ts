import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MonitorupdownstatusService } from '../../service/monitorupdownstatus.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng';
import { UtilityService } from '../../service/utility.service';
import { TierServerComponent } from '../tier-server/tier-server.component';
import * as COMPONENT from '../add-monitor/constants/monitor-configuration-constants';
import { SERVERSIGNATUREMONDATA } from './server-signature-monitor.data';
import { ConfiguredMonitorInfoComponent } from '../configured-monitor-info/configured-monitor-info.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-server-signature-monitor',
  templateUrl: './server-signature-monitor.component.html',
  styleUrls: ['./server-signature-monitor.component.scss'],
})
export class ServerSignatureMonitorComponent implements OnInit {
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

  option: string = ""
  monType: string;
  saveMonDTO: any = {}
  body: {};
  isNewConfig: boolean = true;
  operation: string = "add"
  cols: any[]
  techName: string = ""
  @ViewChild(TierServerComponent) tierChild: TierServerComponent;
  tierServerInfo: any[] = [];
  loading: boolean
  AddEditLabel: string = "Add";    //label for Add/Update Button
  type:string = ""
  serverSignList:any[]=[];
  serverSignData:SERVERSIGNATUREMONDATA
  tableInfo:any[]
  gMonId: string = "-1";
  objectId: string = "-1";  // Object ID
  @ViewChild(ConfiguredMonitorInfoComponent) monInfoChild: ConfiguredMonitorInfoComponent;
  enabled:boolean = true;
  deleteMonConf: Subscription; // to detect delete operation
  constructor(private monUpDownStatus: MonitorupdownstatusService,
    public router: Router,
    private cd: ChangeDetectorRef,
    private msgService: MessageService) { }

  ngOnInit(): void {
    this.serverSignData = new SERVERSIGNATUREMONDATA()
    this.techName = "serverSignature"

    let arrLabel = ['Command', 'File'];
    let arrValue = ['Command','File']
    this.serverSignList = UtilityService.createListWithKeyValue(arrLabel,arrValue);
    this.monUpDownStatus.getConfigInfo(this.techName).subscribe(response => {
      this.splitOption(response)
      this.monInfoChild.getTableData(response)
    })
   this.tableInfo = [
    { field: "tierInfo", header: 'Tier Information', visible: true },
    { field :'serverSignatureMon' , header: 'Server Signature Name'},
    { field :COMPONENT.SIGN_TYPE , header : 'Server Signature Type'},
    { field : COMPONENT.CMDFILE_NAME , header : 'Command / File Name' ,isUrlEncode:true}
   ]

   // Bug 110416
   this.deleteMonConf = this.monUpDownStatus.$deleteMonConf.subscribe((res) => {
     if(res){
       this.resetUI();
     }
  });
  }
 

  
  addData() {
    
        if(this.validateServerSign(this.serverSignData)){
        this.option = this.createOptionForCheckMonitor(this.serverSignData)
        this.saveMonConfiguration()
        }
  }
  createOptionForCheckMonitor(serverSignData) {
    let opt = ""
    
      if(serverSignData.signType){
        opt = opt + serverSignData.signType + " " + encodeURIComponent(serverSignData.commandFileName)
      }
    return opt
  }
  saveMonConfiguration() {
    let reqBody: any = {};
    let body: any = {}
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
    body['mon'][this.serverSignData.name] = this.createDataforSave(this.serverSignData);
    reqBody['body'] = body
    this.monUpDownStatus.saveMonitorConfiguration(reqBody, this.techName, -1).subscribe(res => {
      if (res['status']) {
        this.monUpDownStatus.getConfigInfo(this.techName).subscribe(response => {
          this.splitOption(response)
          this.monInfoChild.getTableData(response)
        })
        this.msgService.add({ severity: COMPONENT.SEVERITY_SUCCESS, summary: COMPONENT.SUMMARY_SUCCESS, detail: res['msg'] })
        this.serverSignData = new SERVERSIGNATUREMONDATA()
        this.tierChild.clearTierServerData();
        this.loading = false;
        this.cd.detectChanges();
        this.AddEditLabel = "Add";
        this.operation = 'add'
        this.enabled = false;
      }
      else{
        this.msgService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: res['msg'] })
        this.loading = false;
        this.cd.detectChanges();
      }
    })
  }
  createDataforSave(serverSignData) {
    let monObj: any = {}
    let option = this.option
    let instance = ""
    let enabled = this.enabled
    let type = "serverSignature"
    if (serverSignData.instance) {
      instance = serverSignData.instance
    }
    Object.assign(monObj, {
      [COMPONENT.OPTIONS]: option,
      [COMPONENT.ENABLED]: enabled,
      [COMPONENT.TYPE]: type
    })
    return monObj
  }
 

  modifyTableDataByMonType(res) {
    let valArr = res['options'].trim().split(" ");
   this.serverSignData.name = res.serverSignatureMon
   this.serverSignData.signType = valArr[0]
   this.serverSignData.commandFileName = decodeURIComponent(valArr[1])
  }
  validateServerSign(serverSignData): boolean {
    if (serverSignData['signType'] == '') {
      this.msgService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: 'Please select signature type' })
      return false;
    }
    return true;
  }

  editData(data) {
    this.serverSignData = new SERVERSIGNATUREMONDATA();
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
  
  splitOption(res){
    let me = this
  res.map(function(each){
    let valArr = each["options"].trim().split(" ");
    let dataArr: string[] = [COMPONENT.SIGN_TYPE,COMPONENT.CMDFILE_NAME];
    for(let i = 0; i<dataArr.length;i++){
      if(dataArr[i]=== COMPONENT.SIGN_TYPE){
        each[dataArr[i]] = valArr[i];
      }
      if(dataArr[i] === COMPONENT.CMDFILE_NAME)
      each[dataArr[i]] = decodeURIComponent(valArr[i]);
    }
  })
  }
  resetUI(){
    this.AddEditLabel = 'Add';
    this.operation = 'add'
    this.gMonId = "-1";
    this.objectId = "-1";
    this.tierChild.clearTierServerData();
    this.serverSignData = new SERVERSIGNATUREMONDATA();
  }
}