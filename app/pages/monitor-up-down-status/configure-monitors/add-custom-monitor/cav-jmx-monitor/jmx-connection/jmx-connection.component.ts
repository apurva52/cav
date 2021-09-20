import { Component, OnInit, Optional, Inject, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';

import { Router } from '@angular/router';
import * as _ from "lodash";
import { SelectItem, ConfirmationService, MessageService } from 'primeng/api';
import { MonitorupdownstatusService } from 'src/app/pages/monitor-up-down-status/service/monitorupdownstatus.service';
import { JMXConnectionParams } from '../../containers/jmx-mon-data';
import { CustomMonitorService } from '../../services/custom-monitor.service';
import { UtilityService } from '../../../../../monitor-up-down-status/service/utility.service';
import * as COMPONENT from '../../constants/mon-component-constants';
import { ImmutableArray } from '../../../add-monitor/containers/immutable-array';
import * as MSGCOMPONENT from '../../../add-monitor/constants/monitor-configuration-constants';

class JMXSearchPattern {
  pattern: string = ''; // pattern value
  id: number = 0;
}

@Component({
  selector: 'app-jmx-connection',
  templateUrl: './jmx-connection.component.html',
  styleUrls: ['./jmx-connection.component.scss']
})

export class JmxConnectionComponent implements OnInit {
  @Input() jmxConnDialog :boolean
  @Output() displayChange = new EventEmitter();
 // @Input() disableFields:boolean;
  displayDialog: boolean = true;
  jmxMonData: JMXConnectionParams; // jmx monitor Data transfer object
  tierList: SelectItem[] ;// for storing tier list obj 
  serverList: SelectItem[]; // contains serverlist for dropdown in run dailog
  instanceList: any[];
  jmxUrl: SelectItem[];
  dialogHeader: string = ''; //for search pattern dialog
  showSrchDialog: boolean = false;
  tableData = "";
  cols: any[];
  patternTableData: any[] = [];
  json = {};
  selectedSrchPattern: JMXSearchPattern[];
  tempId: number = 0;
  isFromAdd: boolean; // flag to know whether operation is add or edit in search pattern dailog.
  count: number = 0;
  jmxSp: JMXSearchPattern;
  jmxConn: string = "setting"; //JMX connection
  // used for handling css of the jmx connection dailog for fixing bottom position of the dailog on selecting others option in instance
  changeDialogCss: boolean = false;
  serverIdList: any[] = []; // server id list
  serverNameList: any = []; // to store server list values
  tierID:string = "";
  disableFields:boolean = false;    //disable jmx connection dialog fields in jmx Monitor UI
  jmxConnPID:string = "";
  monName:string = "";
  grpName:string = "";
  rejectVisible: boolean;
  acceptLable: string;
  tierHeadersList: any[];
  anyTierList: any[];   //for tierName tag
  loading: boolean;
  toggleFieldset:boolean;
  constructor(
    private router: Router, 
    private customMonService:CustomMonitorService,
    private cms: ConfirmationService,
   private  monitorupdownService:MonitorupdownstatusService,
   private cd: ChangeDetectorRef,
   private msgService:MessageService
    
    ) { }

  ngOnInit() {
    const me = this
    this.disableFields = this.customMonService.disableFields;	
    this.jmxMonData = new JMXConnectionParams();  // initialising jmx component data binding fields.
    me.tierHeadersList = this.customMonService.getTierHeaderList();
    let tierNameList = []
    me.tierHeadersList.map(function (each) {
      if (each.value > -1) // for skipping tierGroups and All tiers
        tierNameList.push(each.label)
    })
    me.tierList = UtilityService.createDropdown(tierNameList);
     
    if(this.jmxConnDialog ||this.disableFields || this.customMonService.isFromEdit){	
      this.jmxMonData = this.customMonService.getJmxConnParam();	
      this.onTierChange(me.jmxMonData.tier);
      if(this.jmxMonData.pid){
        this.jmxConn = "pid";
        this.jmxConnPID = "procId";
      }
      else if(this.jmxMonData.pidFile){
        this.jmxConn = "pid";
        this.jmxConnPID = "pidFile";
      }
      else if(this.jmxMonData.host)
        this.jmxConn = "setting";
      else if(this.jmxMonData.searchPattern.length > 0){
        this.jmxConn = "pid";
        this.jmxConnPID = "searchPattern";
      }
    }

    me.jmxUrl = [
      {label: '--Select JMX URL-- ' , value : ''},
      { label: 'JMX_REMOTING', value: 'JMX_REMOTING' },
      { label: 'JMX_RMI', value: 'JMX_RMI' },
      { label: 'JMX_CONNECTOR', value: 'JMX_CONNECTOR' },
      { label: 'JMX_HTTP', value: 'JMX_HTTP' },
      { label: 'Other', value: 'Other' }
    ]

    me.cols = [
      { field: 'pattern', header: 'Search Pattern' },

    ];
    me.instanceList = [
      {label:'BCI2', value: 'bci2'},
      {label: '--Add new instance--', value: 'Other'}
    ]
  }

  //this method is used to open JMX Monitor UI
  getMbeans() 
  {
    if(this.jmxMonData.instance == 'Other')
    {
      // if (this.jmxConn == 'searchPattern' && this.jmxMonData.searchPattern.length == 0) {
        //   this.msgServiceObj.errorMessage("Please provide search pattern data ");
        //   return;
        // }
        
     let ip = this.getActualServerName(this.serverList, this.jmxMonData.server) //get actual server ip
     let that = this;
   
      let tierInfo = _.find(this.tierHeadersList, function (each) { return each['label'] == that.jmxMonData.tier })
      let selectedServerId = this.customMonService.getServerId(this.serverIdList, this.serverNameList.indexOf(this.jmxMonData.server));
      this.loading = true;
      this.clearConnectionParams();
      this.customMonService.getMBean(this.jmxMonData, COMPONENT.DEFAULT_TOPO, ip, tierInfo.value, selectedServerId).subscribe((res) => {
        if(!res['status']){
          if(this.customMonService.isFromEdit){
            this.loading = false
            this.getMBeanStatusAtEdit();
          }
          else
          {
            this.loading = false
            this.getMBeanStatus();
          }
        }
        else{
          this.customMonService.treeData = res['data'];
          this.customMonService.jmxDataFlag = res['status'];
          this.customMonService.jmxMonitorConnectionKey = res['key'];
          this.displayDialog = false;
          if(this.customMonService.isFromEdit){
            this.updateJmxMon(this.monName, this.grpName);
          }
          else{
            this.customMonService.setJmxConnParam(this.jmxMonData);
            this.loading = false
            this.router.navigate(['configure-jmx-monitor']);
          }
        }
      })
    }
    else
    {
      this.customMonService.makeBCIConnection(this.jmxMonData.tier, this.jmxMonData.server, this.jmxMonData.instance)
            .subscribe(res=>{
              if(!res['status']){
                if(this.customMonService.isFromEdit)
                  this.getMBeanStatusAtEdit();
                else
                  this.getMBeanStatus();
              }
              else{
                this.customMonService.treeData = res['data'];
                this.customMonService.jmxMonitorConnectionKey = res['key'];
                this.customMonService.jmxDataFlag = res['status'];
                this.displayDialog = false;
                if(this.customMonService.isFromEdit){
                  this.updateJmxMon(this.monName, this.grpName);
                }
                else{
                  this.customMonService.setJmxConnParam(this.jmxMonData);
                  this.router.navigate(['configure-jmx-monitor']);
                }
              }
            })
    }
  }

  /**
   * This method is used to get the actual server name for the specified server display name
   * @param serverList 
   * @param selectedServerName 
   */
  getActualServerName(serverList, selectedServerName) {
    let serverSelectedObj = _.find(serverList, function (each) { return each['value'] == selectedServerName })

    let serverLabel = serverSelectedObj['label']

    let actualServerName;

    actualServerName = serverLabel.substring(serverLabel.indexOf("(") + 1, serverLabel.length)

    if (actualServerName.substr(-1) == ")")
      actualServerName = actualServerName.substring(0, actualServerName.length - 1);

    return actualServerName;
  }

  onTierChange(data) {
    let me = this;
    let tierInfo = _.find(me.tierHeadersList, function (each) { return each['label'] == data })
    //me.loading = true;
    if(tierInfo)
    {
      me.monitorupdownService.getServerList(tierInfo.value).subscribe(res => {
        me.loading = false;
        me.cd.detectChanges();
        let dName = [];
        let sName = [];
        res.map(each => {
          if (each['id'] >= 0) {
            sName.push(each['sName']);
            dName.push(each['dName']);
            this.serverIdList.push(each['id']);
            this.serverNameList.push(each["sName"]);
          }
        })
        me.serverList = UtilityService.createListWithKeyValue(dName, sName);
      })
    }
  }

  addSearchPattern() {
    this.dialogHeader = "Add Search Pattern";
    this.jmxSp = new JMXSearchPattern();
    this.showSrchDialog = true;
    this.isFromAdd = true;
  }


  editSearchPattern() {
    if (!this.selectedSrchPattern || this.selectedSrchPattern.length < 1) {
     this.msgService.add({severity:MSGCOMPONENT.SEVERITY_ERROR,summary:MSGCOMPONENT.SUMMARY_ERROR,detail:'No row is selected to edit'});
      return;
    }
    else if (this.selectedSrchPattern.length > 1) {
      this.msgService.add({severity:MSGCOMPONENT.SEVERITY_ERROR,summary:MSGCOMPONENT.SUMMARY_ERROR,detail:"Select a single row to edit"});
      return;
    }

    this.dialogHeader = "Edit Search Pattern"
    this.showSrchDialog = true;
    this.isFromAdd = false;
    this.tempId = this.selectedSrchPattern[0]["id"]
    this.jmxSp = Object.assign({}, this.selectedSrchPattern[0]);
  }

  saveSrchPattData() {
    if (this.isFromAdd) {
      this.jmxSp['id'] = this.count;
      this.patternTableData = ImmutableArray.push(this.patternTableData, this.jmxSp); //adding new entries in the datatable when ADD is performed
      this.count = this.count + 1;
      this.showSrchDialog = false;

    }
    else {
      this.jmxSp['id'] = this.tempId; //assign temporary id
      this.patternTableData = ImmutableArray.replace(this.patternTableData, this.jmxSp, this.getSelectedRowIndex(this.jmxSp['id']))
      this.isFromAdd = true;
      this.showSrchDialog = false;
      this.selectedSrchPattern = [];
    }

    this.jmxMonData.searchPattern.push(this.jmxSp.pattern);
    // this.jmxSp = new JMXSearchPattern(); //used for clearing search pattern textfield value.
  }


  onServerChange() {
  //  let serverId = this.customMonService.getServerId(this.serverIdList, this.serverNameList.indexOf(this.jmxMonData.server));
  //   this.customMonService.getInstanceList(this.tierID, serverId)
  //     .subscribe(data => {
  //       if (data != null) {
  //         this.instanceList = UtilityService.createListWithKeyValue(data['displayName'].reverse(), data['name'].reverse());
  //       }
  //     })
  }

  deleteSrchPatData() {
    let noRowSelected: boolean = false;
    if (this.selectedSrchPattern == undefined || this.selectedSrchPattern.length == 0)
      noRowSelected = true;

    if (this.patternTableData.length == 0) {
      this.msgService.add({severity:MSGCOMPONENT.SEVERITY_ERROR,summary:MSGCOMPONENT.SUMMARY_ERROR,detail:"No row is added"});
      return;
    }
    this.rejectVisible = true;
    this.acceptLable = "Yes";

    this.cms.confirm({
      message: (noRowSelected) ? "Are You want to delete all row" : "Are you want to delete selected row",
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {

        let arrId = [];
        if (noRowSelected)
          this.selectedSrchPattern = this.patternTableData; // if no row is selected then set the whole table data in the selected table data to perform delete

        this.selectedSrchPattern.map(function (each) {
          arrId.push(each.id); // push items to be deleted
        })

        this.patternTableData = this.patternTableData.filter(function (val) {
          return arrId.indexOf(val.id) == -1;  //value to be deleted should return false
        })

        /**clearing object used for storing data ****/
        this.selectedSrchPattern = [];
        this.jmxMonData.searchPattern = [];


      },
      reject: () => {
        this.selectedSrchPattern = [];
      }
    });


  }

  getSelectedRowIndex(data): number {
    let index = this.patternTableData.findIndex(each => each['id'] == this.tempId)
    return index;
  }

  // Method called when user clicks on "Get Mbeans" button. It clears previous selected radiobutton options.
  clearConnectionParams() {
    // JMX Connection Using Process ID
    if (this.jmxConnPID == 'procId') {
      this.jmxMonData.pidFile = "";
      this.jmxMonData.host = "";
      this.jmxMonData.port = "";
      this.jmxMonData.user = "",
        this.jmxMonData.pwd = "";
      this.jmxMonData.connURL = "";
      this.jmxMonData.tsf = "";
      this.jmxMonData.tsp = "";
      this.jmxMonData.ksf = "";
      this.jmxMonData.ksp = "";
      this.jmxMonData.searchPattern = []
      this.jmxMonData.sslEnable = false;
      this.jmxMonData.occCount = null;
      this.jmxMonData.otherConn = "";
    }
    // JMX Connector using Process Id File
    else if (this.jmxConnPID == "pidFile") {
      this.jmxMonData.pid = "";
      this.jmxMonData.host = "";
      this.jmxMonData.port = "";
      this.jmxMonData.user = "",
        this.jmxMonData.pwd = "";
      this.jmxMonData.connURL = "";
      this.jmxMonData.tsf = "";
      this.jmxMonData.tsp = "";
      this.jmxMonData.ksf = "";
      this.jmxMonData.ksp = "";
      this.jmxMonData.searchPattern = []
      this.jmxMonData.sslEnable = false;
      this.jmxMonData.occCount = null;
      this.jmxMonData.otherConn = "";

    }
    // JMX Remote Settings
    else if (this.jmxConn == "setting") {
      this.jmxMonData.pidFile = "";
      this.jmxMonData.pid = "";
      this.jmxMonData.searchPattern = [];
      this.jmxMonData.occCount = null;
    }

    // JMX Connector using Search Pattern
    else if (this.jmxConnPID == "searchPattern") {
      this.jmxMonData.pidFile = "";
      this.jmxMonData.pid = "";
      this.jmxMonData.host = "";
      this.jmxMonData.port = "";
      this.jmxMonData.user = "",
        this.jmxMonData.pwd = "";
      this.jmxMonData.connURL = "";
      this.jmxMonData.tsf = "";
      this.jmxMonData.tsp = "";
      this.jmxMonData.ksf = "";
      this.jmxMonData.ksp = "";
      this.jmxMonData.sslEnable = false;
      this.jmxMonData.otherConn = "";
    }
  }

  onInstanceChange() {
    if (this.jmxMonData.instance == 'Other'){
      let ip = this.getActualServerName(this.serverList, this.jmxMonData.server) //get actual server ip
      this.jmxMonData.host = ip;
      this.changeDialogCss = true;
    }
    else
      this.changeDialogCss = false;
  }

  getMBeanStatus(){
    const me = this;
    me.rejectVisible = true;
me.acceptLable = "Yes";
    this.cms.confirm({
      message: "Not able to connect the application, do you want to configure MBeans manually?",
      header: 'MBean Confirmation',
      // icon: 'fa fa-trash',
      accept: () => {
        this.displayDialog = false;
        this.jmxMonData.manualEntry = true;
        this.customMonService.setJmxConnParam(this.jmxMonData);
        this.router.navigate(['configure-jmx-monitor']);
      },
      reject: () => {
      }
    });
  }

  updateJmxMon(monName, grpName)
  {
    // this.cmsService.editJMXConfig(monName, grpName, this.cmsService.jmxMonitorConnectionKey).then(data => {	
    //   this.cmsService.isFromEdit = true;	
    //   this.cmsService.getJMXEditData = data;	
    //   this.router.navigate([URL.JMX_ROUTE]);	
    // })	
  }

  getMBeanStatusAtEdit(){
    this.cms.confirm({
      message: "Not able to connect the application, do you want to configure MBeans manually?",
      header: 'MBean Confirmation',
      // icon: 'fa fa-trash',
      accept: () => {
        this.displayDialog = false;
        this.customMonService.setJmxConnParam(this.jmxMonData);
        this.jmxMonData.manualEntry = true;
        this.updateJmxMon(this.monName, this.grpName);
      },
      reject: () => {
      }
    });
  }
  onClose(){
    this.displayChange.emit(false);
  }

  // Work against memory leak if component is destroyed
  ngOnDestroy() {
    this.displayChange.unsubscribe();
  }
  afterToggle(event){
    this.toggleFieldset = event.collapsed
  }
  beforeToggle(event){
    this.toggleFieldset = event.collapsed
  }
}
