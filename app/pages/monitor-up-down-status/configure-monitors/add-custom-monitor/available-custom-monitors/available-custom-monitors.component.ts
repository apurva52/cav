import { Component, ViewEncapsulation } from '@angular/core';
import { SelectItem, ConfirmationService, MessageService } from 'primeng';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NFGlobalData } from '../../../containers/nf-global-data';
import { ConfMonTableData } from '../../../containers/conf-custom-mon-table-data';
import { CustomMonitorService } from '../services/custom-monitor.service';
import { UtilityService } from '../../../service/utility.service';
import * as COMPONENT from '../constants/mon-component-constants';
import * as _ from "lodash";
import { ChangeDetectorRef } from '@angular/core';
import { APIData } from '../containers/api-data';
import { JMXConnectionParams } from '../containers/jmx-mon-data';
import { DialogService, DynamicDialogRef } from 'primeng';
import * as LONG_ARG from '../../add-custom-monitor/constants/longArguments-constants';
import { MonitorupdownstatusService } from '../../../service/monitorupdownstatus.service';
import { Subscription } from 'rxjs';
import * as MSGCOMPONENT from '../../add-monitor/constants/monitor-configuration-constants';

@Component({
  selector: 'app-available-custom-monitors',
  templateUrl: './available-custom-monitors.component.html',
  styleUrls: ['./available-custom-monitors.component.scss'],
  providers: [ConfirmationService],
  encapsulation: ViewEncapsulation.None,
})


export class AvailableCustomMonitorsComponent {
  nfMonData: NFGlobalData; // log metric global settings data
  confMonData: ConfMonTableData[] = []; // datatable value for available configured log metric monitors
  selectedConf: ConfMonTableData[];
  showNFdialog: boolean = false; // show the dailog box for log metric global settings 
  envList: SelectItem[]; // environment list
  idxList: SelectItem[]; //index pattern list
  hasGlobalSettings: boolean = false; //flag to show note if global settings is not present
  secure: boolean = false;
  operation: number; //edit(1) or delete(0) operation
  isDelForceFully: boolean;  //flag for deleting monitor forcefully if being used in some other monitor json
  monType: string = 'db'; // monitor type - eg - 'nf', 'cmd'
  monHeaders: string = 'COMMAND MONITORS';
  loading: boolean; // for loading spinner.
  tableColumns: any[] = [];
  subscription: Subscription;
  monArg: string = ''; // to show monitor arguments such as query in case of NF and command in case of cmd
  emptyTable: boolean = false
  opt: string = ''
  serverIdList: any = []; // server id list	
  serverNameList: any = []; // to store server list values	
  serverList: SelectItem[];   //for getting serverId in the basis of serverList
  jmxConnDialog: boolean = false;
  apiData: APIData
  rejectVisible: boolean = true;
  acceptLable: string = "Yes";
  jmxMonData: JMXConnectionParams
  ref: DynamicDialogRef
  HeaderList: any[] = []
  copyMonJson: string = '';
  displayCopyDailog: boolean = false;
  copyAs: string = '';
  tierHeadersList: any[];
  tierList: SelectItem[];// for storing tier list obj 
  constructor(private router: Router,
    private cmsObj: CustomMonitorService,
    private confirmationService: ConfirmationService,
    private monUpDownService: MonitorupdownstatusService,
    private route: ActivatedRoute, private utlSerObj: UtilityService, private cd: ChangeDetectorRef,
    public dialogService: DialogService,
    private msgService: MessageService,
  ) {

  }


  ngOnInit() {
    this.apiData = new APIData()
    this.nfMonData = new NFGlobalData();

    this.route.params.subscribe((params: Params) => {
      this.monType = params['monType'];
      this.cmsObj.monType = this.monType;
    });

    this.getTableHeaderOnTypeChange();
    this.getAvailableMonList();

    this.subscription = this.cmsObj.$customMonType.subscribe((res) => {
      if (res) {
        this.monType = res;
        this.cmsObj.monType = this.monType;
        this.getTableHeaderOnTypeChange();
        this.getAvailableMonList();
      }
    });

    this.tierHeadersList = this.cmsObj.getTierHeaderList();
    let tierNameList = []
    this.tierHeadersList.map(function (each) {
      if (each.value > -1) // for skipping tierGroups and All tiers
        tierNameList.push(each.label)
    })
    this.tierList = UtilityService.createDropdown(tierNameList);
  }


  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }

  getGlobalSettings() {
    this.cmsObj.globalNf().subscribe(data => {
      if (data) {
        this.envList = []
        this.idxList = [];

        if (data["env"] != '')
          this.envList.push({ label: '--Select--', value: '' }, { label: data["env"], value: data["env"] });
        if (data["idx"] != '')
          this.idxList.push({ label: '--Select--', value: '' }, { label: data["idx"], value: data["idx"] });
        this.getSecureVal(data.protocol)
        this.nfMonData = data; // saving data in service for next screen
        this.cmsObj.globalNFData = data;
        if (this.nfMonData.pPort == 0 || this.nfMonData.pPort == -1) {
          this.nfMonData.pPort = null;
        }
        if ((this.nfMonData.host != null && this.nfMonData.host != undefined && this.nfMonData.host != "") &&
          (this.nfMonData.port != null && this.nfMonData.port != undefined)) {
          this.hasGlobalSettings = false
        }
        else {
          this.hasGlobalSettings = true
        }
      }
    })
  }

  getProtocol(isSecure) {
    if (!isSecure) {
      this.nfMonData.protocol = "http";
    }
    else
      this.nfMonData.protocol = "https";
  }

  getIndexPattern(isSecure) {
    this.getProtocol(isSecure)
    if (this.nfMonData.host == "") //check for having host
    {
      this.msgService.add({ severity: MSGCOMPONENT.SEVERITY_ERROR, summary: MSGCOMPONENT.SUMMARY_ERROR, detail: "Please enter host" });
      return;
    }

    if (this.nfMonData.port == null && this.nfMonData.port == -1) //check for having port/proxy port
    {
      this.msgService.add({ severity: MSGCOMPONENT.SEVERITY_ERROR, summary: MSGCOMPONENT.SUMMARY_ERROR, detail: "Please enter port" });
      return;
    }
    this.loading = true;
    if (this.nfMonData.host && this.nfMonData.port) {
      this.apiData['nfGlobalDto'] = this.nfMonData;
      this.cmsObj.getIndxList(this.apiData)
        .subscribe(data => {
          this.loading = false;
          if (data != null) {
            this.envList = [];
            this.idxList = [];
            if (data['status'] == "true") {
              this.envList = UtilityService.createDropdown(data["env"]);
              this.idxList = UtilityService.createDropdown(data["id"]);
              this.loading = false;
              this.msgService.add({ severity: MSGCOMPONENT.SEVERITY_SUCCESS, summary: MSGCOMPONENT.SUMMARY_SUCCESS, detail: "Environment and index pattern list fetched successfully." })

            }
            else {
              this.secure = false;
              this.msgService.add({ severity: MSGCOMPONENT.SEVERITY_ERROR, summary: MSGCOMPONENT.SUMMARY_ERROR, detail: data['msg'] });
              this.nfMonData = new NFGlobalData();
              this.nfMonData.port = 443;
              this.loading = false;
              return;
            }
          }
        })
    }
  }

  saveNFGlobalData() {
    this.getProtocol(this.secure);
    if (!this.validateGlobalSettings()) {
      return false;
    }
    // if (this.nfMonData.env == '') {
    //   this.msgService.add({ severity: MSGCOMPONENT.SEVERITY_ERROR, summary: MSGCOMPONENT.SUMMARY_ERROR, detail: "Please enter Environment" })
    //   return;
    // }
    else if (this.nfMonData.idx == '') {
      this.msgService.add({ severity: MSGCOMPONENT.SEVERITY_ERROR, summary: MSGCOMPONENT.SUMMARY_ERROR, detail: "Please enter Index Pattern" })
      return;
    }
    else {
      if (this.nfMonData.pHost == null) {
        this.nfMonData.pHost = "";
      }
      if (this.nfMonData.pUser == null) {
        this.nfMonData.pUser = "";
      }
      if (this.nfMonData.pPwd == null) {
        this.nfMonData.pPwd = "";
      }
      if (this.nfMonData.pPwd != null || this.nfMonData.pPwd != "") {
        this.nfMonData.pPwd = encodeURIComponent(this.nfMonData.pPwd);
      }

      if (this.nfMonData.pPort == null) {
        this.nfMonData.pPort = -1;
      }

      this.apiData['nfGlobalDto'] = this.nfMonData;
      this.loading = true;
      this.cmsObj.saveConfigIni(this.apiData).subscribe(res => {
        if (res['status']) // true is returned as response on saving changes to config.ini
        {
          //this.hasGlobalSettings = false; // to hide the note tag when data is saved to config.ini
          this.cmsObj.globalNFData = this.apiData['nfGlobalDto'];
          this.showNFdialog = false;
          this.loading = false;
          this.msgService.add({ severity: MSGCOMPONENT.SEVERITY_SUCCESS, summary: MSGCOMPONENT.SUMMARY_SUCCESS, detail: 'Successfully saved NF global settings' });
        }
        else {
          this.loading = false;
          this.msgService.add({ severity: MSGCOMPONENT.SEVERITY_ERROR, summary: MSGCOMPONENT.SUMMARY_ERROR, detail: res['msg'] });
        }
      })
    }
  }

  //   //for saving global NF setting data
  openGlobalDialog() {
    this.showNFdialog = true
    this.getGlobalSettings();
    this.getProtocol(this.secure);
  }

  //Method to get the value of secure checkbox from protocol if protocol http then secure is false 
  getSecureVal(protocol) {
    if (protocol == "https")
      this.secure = true;
    else
      this.secure = false;
  }

  deleteCustomMon(monName, objId, rowIndex) {
    if (this.confMonData.length == 0) {
      this.msgService.add({ severity: MSGCOMPONENT.SEVERITY_ERROR, summary: MSGCOMPONENT.SUMMARY_ERROR, detail: "No configured monitors available to delete" });
      return;
    }
    
    this.operation = 0;
    this.rejectVisible = true;
    this.acceptLable = "Yes";
    this.confirmationService.confirm({
      message: COMPONENT.DELETE_MON_MSG,
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      key: 'deleteConfirmation',
      accept: () => {
        this.loading = true;
        /**** here request is send to server to delete profiles  */
        this.cmsObj.deleteCustomMonitor(this.monType, monName, objId)
          .subscribe(data => {
            this.loading = false;
            if (data['Status'] != "Pass") {
              // this.deleteForcefully(monName, objId);
            }
            else {
              this.deleteMonFromUI(rowIndex); // this is used to delete the profiles from the table from ui side
              this.msgService.add({ severity: MSGCOMPONENT.SEVERITY_SUCCESS, summary: MSGCOMPONENT.SUMMARY_SUCCESS, detail: "Deleted Successfully" });
            }
          });
      },
      reject: () => {
      }
    });
  }

  /**
   * This method is used to delete profile data from ui
   */
  deleteMonFromUI(index) {
    this.confMonData = this.confMonData.filter(function (val) {
      return val.id != index;  //value to be deleted should return false
    })
    /**** clearing object used for storing data */
    this.selectedConf = [];
  }

  //for validating host,port,username & password
  validateGlobalSettings() {
    if (this.nfMonData.host.length > 64) {
      this.msgService.add({ severity: MSGCOMPONENT.SEVERITY_ERROR, summary: MSGCOMPONENT.SUMMARY_ERROR, detail: "Host name should be less than 64 character" });
      return false;
    }

    if (this.nfMonData.pHost != null && this.nfMonData.pHost.length > 64) {
      this.msgService.add({ severity: MSGCOMPONENT.SEVERITY_ERROR, summary: MSGCOMPONENT.SUMMARY_ERROR, detail: "Proxy Host name should be less than 64 characters" });
      return false;
    }

    if (this.nfMonData.pUser != null && this.nfMonData.pUser.length > 32) {
      this.msgService.add({ severity: MSGCOMPONENT.SEVERITY_ERROR, summary: MSGCOMPONENT.SUMMARY_ERROR, detail: "Proxy Username should be less than 32 characters" });
      return false;
    }

    if (this.nfMonData.pUser != null && this.nfMonData.pPwd.length > 32) {
      this.msgService.add({ severity: MSGCOMPONENT.SEVERITY_ERROR, summary: MSGCOMPONENT.SUMMARY_ERROR, detail: "Proxy Password should be less than 32 characters" });
      return false;
    }
    return true;
  }

  checkUpdateAllowedInEdit(monName, gdfName, objId, techName) {
    this.cmsObj.gdfNameAtEdit = gdfName;     //used to check gdf name already exist or not for custom monitors
    this.cmsObj.objectID = objId;
    this.cmsObj.monType = this.monType;
    if (this.monType != COMPONENT.JMX_TYPE) {
      //for NF Monitor 
      if (this.monType == COMPONENT.NF_TYPE) {
        this.cmsObj.editMonitorConfig(monName, gdfName, objId).subscribe(data => {
          this.cmsObj.isFromEdit = true;
          this.cmsObj.getNfEditData = data;
          this.loading = false;
          this.router.navigate(['configure-log-metric-monitor']);
        })
      }
      else if (this.monType == COMPONENT.CMD_TYPE) {
        this.cmsObj.editCmdConfig(monName, gdfName, objId).subscribe(data => {
          this.cmsObj.isFromEdit = true;
          this.cmsObj.getCmdEditData = data;
          this.loading = false;
          this.router.navigate(['configure-cmd-monitor']);
        })
      }

      else if (this.monType == COMPONENT.STATSD_TYPE) {
        this.cmsObj.monType = COMPONENT.STATSD_TYPE
        this.cmsObj.editStatsd(monName, gdfName, objId).subscribe(data => {
          this.cmsObj.getStatsdEditData = data
          this.cmsObj.isFromEdit = true;
          this.loading = false;
          this.router.navigate(['configure-statsd-monitor']);
        })
      }

      else if (this.monType == COMPONENT.DB_TYPE) {
        this.cmsObj.editDBdataConfig(monName, gdfName, objId).subscribe(data => {
          this.cmsObj.isFromEdit = true;
          this.cmsObj.getDbEditData = data;
          this.loading = false;
          this.router.navigate(['configure-db-monitor']);
        })
      }
    }
    else {
      this.getJMXConnectionParam(gdfName);  //method used for getting jmx connection params from options key in edit mode
      this.cmsObj.setJmxConnParam(this.jmxMonData);
      this.loading = true;
      if (!this.jmxMonData.manualEntry) {
        let me = this;
        let tierInfo = _.find(me.tierHeadersList, function (each) { return each['label'] == me.jmxMonData.tier })
        //if Tier/server info is deleted from backend then second JMX UI will be opened 
        if (tierInfo) {
          this.getServerListData(tierInfo.value)
          setTimeout(() => {
            let selectedServerId = this.cmsObj.getServerId(this.serverIdList, this.serverNameList.indexOf(this.jmxMonData.server));
            if (selectedServerId != undefined) {
              let ip = this.getActualServerName(this.serverList, this.jmxMonData.server) //get actual server ip	
              if (this.jmxMonData.instance != 'Other') // for BCI agent jmx connection request.
              {
                this.cmsObj.makeBCIConnection(this.jmxMonData.tier, this.jmxMonData.server, this.jmxMonData.instance)
                  .subscribe(res => {
                    if (res['status']) {
                      this.cmsObj.treeData = res['data'];
                      this.loading = false;
                      this.cmsObj.jmxDataFlag = res['status'];
                      this.updateJmxMon(monName, gdfName, objId);
                    }
                    else {
                      let instance;
                      if (this.jmxMonData.instance == "Other")
                        instance = this.jmxMonData.custInstance;
                      else
                        instance = this.jmxMonData.instance;
                      this.getMBeanStatus(monName, gdfName, instance);
                      this.loading = false;
                    }
                  })
              }
              else // for CMON agent jmx connection request.
              {
                this.cmsObj.getMBean(this.jmxMonData, COMPONENT.DEFAULT_TOPO, ip, tierInfo.value, selectedServerId).subscribe((res) => {
                  if (res['status']) {
                    this.cmsObj.treeData = res['data'];
                    this.cmsObj.jmxDataFlag = res['status'];
                    this.cmsObj.jmxMonitorConnectionKey = res['key'];
                    this.updateJmxMon(monName, gdfName, objId);
                    this.loading = false;
                  }
                  else {
                    let instance;
                    if (this.jmxMonData.instance == "Other")
                      instance = this.jmxMonData.custInstance;
                    else
                      instance = this.jmxMonData.instance;
                    this.loading = false;
                    this.getMBeanStatus(monName, gdfName, instance);
                  }
                })
              }
            }
            else {
              this.updateJmxMon(monName, gdfName, objId);
            }
          }, 1000);
        }
        else {
          this.updateJmxMon(monName, gdfName, objId);
        }
      }
      else {
        this.updateJmxMon(monName, gdfName, objId);
      }
    }
  }

  //method is used to store serverList	
  getServerListData(tierId) {
    this.monUpDownService.getServerList(tierId)
      .subscribe(res => {
        if (res != null) {
          let sName = [];
          let dName = [];
          res.map(each => {
            if (each['id'] >= 0) {
              sName.push(each['sName']);
              dName.push(each['dName']);
              this.serverIdList.push(each['id']);
              this.serverNameList.push(each["sName"]);
            }
          })
          this.serverList = UtilityService.createListWithKeyValue(dName, sName);
        }
      })
  }

  //method used to get server id	
  getActualServerName(serverList, selectedServerName) {
    let serverSelectedObj = _.find(serverList, function (each) { return each['value'] == selectedServerName })
    let serverLabel = serverSelectedObj['label'];
    let actualServerName;
    actualServerName = serverLabel.substring(serverLabel.indexOf("(") + 1, serverLabel.length)
    if (actualServerName.substr(-1) == ")")
      actualServerName = actualServerName.substring(0, actualServerName.length - 1);
    return actualServerName;
  }

  //method used for getting jmx connection params from options key in edit mode
  getJMXConnectionParam(grpName) {
    this.jmxMonData = new JMXConnectionParams();
    let str = [];
    let isOtherInst = false;
    this.confMonData.map(each => {
      if (each._m == grpName) {
        let opt = each._opt;
        str = opt.split(" ");
      }
    })
    for (let i = 0; i < str.length; i++) {
      if (str[i] == LONG_ARG.LONG_FORMAT_HOST_ARG)
        this.jmxMonData.host = str[i + 1];
      else if (str[i] == LONG_ARG.LONG_FORMAT_PORT_ARG)
        this.jmxMonData.port = str[i + 1];
      else if (str[i] == LONG_ARG.LONG_FORMAT_TIER_ARG)
        this.jmxMonData.tier = str[i + 1];
      else if (str[i] == LONG_ARG.LONG_FORMAT_SERVER_ARG)
        this.jmxMonData.server = str[i + 1];
      else if (str[i] == LONG_ARG.LONG_FORMAT_INSTANCE_ARG)
        isOtherInst = true;
      else if (str[i] == LONG_ARG.LONG_FORMAT_VECTOR_PREFIX) {
        this.jmxMonData.instance = str[i + 1];
      }

      else if (str[i] == "--pid") {
        this.jmxMonData.pid = str[i + 1];
      }
      else if (str[i] == "--pidFile") {
        this.jmxMonData.pidFile = str[i + 1];
      }
      else if (str[i] == LONG_ARG.LONG_FORMAT_USER_ARG) {
        this.jmxMonData.user = str[i + 1];
      }
      else if (str[i] == LONG_ARG.LONG_FORMAT_PWD_ARG) {
        this.jmxMonData.pwd = str[i + 1];
      }
      else if (str[i] == "--url") {
        if (str[i + 1] == "JMX_REMOTING" || str[i + 1] == "JMX_RMI" || str[i + 1] == "JMX_CONNECTOR" || str[i + 1] == "JMX_HTTP") {
          this.jmxMonData.connURL = str[i + 1];
        }
        else {
          this.jmxMonData.connURL = "other"
          this.jmxMonData.otherConn = str[i + 1];
        }
      }
      else if (str[i] == LONG_ARG.LONG_FORMAT_TRUST_STORE_FILE_ARG) {
        this.jmxMonData.tsf = str[i + 1];
      }
      else if (str[i] == LONG_ARG.LONG_FORMAT_TRUST_STORE_PASSWORD_ARG) {
        this.jmxMonData.tsp = str[i + 1];
      }
      else if (str[i] == LONG_ARG.LONG_FORMAT_TRUST_STORE_FILE_TYPE_ARG) {
        this.jmxMonData.tst = str[i + 1];
      }
      else if (str[i] == LONG_ARG.LONG_FORMAT_KEY_STORE_FILE_ARG) {
        this.jmxMonData.ksf = str[i + 1];
      }
      else if (str[i] == LONG_ARG.LONG_FORMAT_KEY_STORE_PASSWORD_ARG) {
        this.jmxMonData.ksp = str[i + 1];
      }
      else if (str[i] == "--isTwoWaySSL") {
        this.jmxMonData.sslEnable = str[i + 1];
      }
      else if (str[i] == "--index") {
        this.jmxMonData.occCount = str[i + 1];
      }
      else if (str[i] == "--searchPattern") {
        this.jmxMonData.searchPattern.push(str[i + 1]);
      }
      else if (str[i] == "--manualEntry") {
        this.jmxMonData.manualEntry = true;
      }
    }
    if (isOtherInst) {
      this.jmxMonData.custInstance = this.jmxMonData.instance;
      this.jmxMonData.instance = "Other";
    }
  }

  getMBeanStatus(monName, grpName, instance) {
    this.confirmationService.confirm({
      message: `Not able to connect the application instance - ${instance} using configured Connection Parameters, do you want to connect using different Connection Parameters?`,
      header: 'MBean Confirmation',
      // icon: 'fa fa-trash',
      accept: () => {
        this.cmsObj.isFromEdit = true;
        this.jmxConnDialog = true;
        this.cmsObj.disableFields = true;
        this.loading = false;
      },
      reject: () => {
        this.loading = false;
      }
    });
  }


  getAvailableMonList() {
    this.tableColumns = []
    this.confMonData = []
    const HEADER_LIST = [
      { field: "_m", header: 'Metric Group Name' },
      // { field : "_g" , header: 'Metric Group Name'},
      { field: "tech", header: 'Technology' },
      { field: "_meta", header: 'Metric Group Hierarchy' },
      { field: this.opt, header: this.monArg },
    ]
    this.tableColumns = HEADER_LIST
    //Get list of available configured NF Monitors on basis of Type.Here type is "NF"
    this.loading = true;
    this.cmsObj.getAvailableConfiguredList(this.monType).subscribe(data => {
      // if (data != null && data.length == 0) {
        if (data == null) { // for bug 112666
        this.emptyTable = true;
        this.loading = false;
        // return;
      }
      else {
        this.confMonData = data;
        this.loading = false;
        this.cd.detectChanges();
        //this.tableColumns = this.HeaderList;
        // this.tableColumns = HEADER_LIST
        // this.cmsObj.confMonData = data;
        let that = this;
        if (COMPONENT.JMX_TYPE) {
          this.confMonData.map(each => {
            that.getJMXConnectionParam(each._m);
            if (that.jmxMonData.instance == "Other") {
              each._appName = that.jmxMonData.custInstance;
            }

            else
              each._appName = that.jmxMonData.instance;
          })
        }
      }
    })
  }

  getTableHeaderOnTypeChange() {
    if (this.monType == COMPONENT.NF_TYPE) {
      this.getGlobalSettings()
      this.monHeaders = "Log Metric Monitor(s)";
      this.monArg = "Query";
      this.opt = "_opt";
    }
    else if (this.monType == COMPONENT.CMD_TYPE) {
      this.monHeaders = "Command Based Monitor(s)";
      this.monArg = "Command/Script";
      this.opt = "_opt";
      this.hasGlobalSettings = false

    }

    else if (this.monType == COMPONENT.STATSD_TYPE) {
      this.monHeaders = "StatsD Monitor(s)";
      this.monArg = "Application Name";
      this.opt = "_opt";
      this.hasGlobalSettings = false
    }

    else if (this.monType == COMPONENT.DB_TYPE) {
      this.monHeaders = "DB Monitor(s)";
      this.monArg = "Query";
      this.opt = "_opt";
      this.hasGlobalSettings = false
    }

    else if (this.monType == COMPONENT.JMX_TYPE) {
      this.monHeaders = "JMX Monitor(s)";
      this.monArg = "Application Name";
      this.opt = "_appName";
      this.hasGlobalSettings = false
    }

    else if (this.monType == COMPONENT.SNMP_TYPE) {
      this.monHeaders = "SNMP Monitor(s)";
      this.monArg = "_opt";
      this.hasGlobalSettings = false
    }
  }
  openCustomMon() {
    this.cmsObj.monType = this.monType;
    if (this.monType == COMPONENT.NF_TYPE) {
      this.router.navigate(['configure-log-metric-monitor']);
    }
    else if (this.monType == COMPONENT.CMD_TYPE) {
      this.cmsObj.isFromEdit = false;
      this.router.navigate(['configure-cmd-monitor']);
    }

    else if (this.monType == COMPONENT.STATSD_TYPE) {
      this.router.navigate(['configure-statsd-monitor']);
      // this.cmsObj.monType = COMPONENT.STATSD_TYPE
    }

    else if (this.monType == COMPONENT.DB_TYPE) {
      this.router.navigate(['configure-db-monitor']);
      //this.cmsObj.monType = COMPONENT.DB_TYPE
      //this.cmsObj.dbMon = COMPONENT.DB_TYPE
    }

    else if (this.monType == COMPONENT.JMX_TYPE) {
      this.jmxConnDialog = true;
    }

    else if (this.monType == COMPONENT.SNMP_TYPE) {
      this.router.navigate(['configure-snmp-monitor']);
    }
  }

  editMonConfig(monName, gdfName, objId, techName) {
    this.loading = true;
    this.checkUpdateAllowedInEdit(monName, gdfName, objId, techName);
  }

  onDialogClose(event) {
    this.jmxConnDialog = event;
  }
  openCopyDailog(monName) {
    this.displayCopyDailog = true; // show copy dailog in UI
    this.copyMonJson = monName;
    this.copyAs = this.copyMonJson + "_copy";
  }
  copy() {
    if (this.copyAs == '') {
      this.msgService.add({ severity: MSGCOMPONENT.SEVERITY_ERROR, summary: MSGCOMPONENT.SUMMARY_ERROR, detail: "Please provide copy as name." });
      return;
    }

    if (!/^[a-zA-Z][a-zA-Z0-9_-]{0,31}$/.test(this.copyAs)) {
      this.msgService.add({ severity: MSGCOMPONENT.SEVERITY_ERROR, summary: MSGCOMPONENT.SUMMARY_ERROR, detail: "Please enter valid Copy As monitor name.Copy As name is of maximum 32 characters.First character must be Alpha.Other characters are Alpha, Numeric, Dash or Underscore" });
      return;
    }

    if (!this.checkMonNameAlreadyExist())  // this is used to prevent duplicate entry of monitor groups 
    {
      this.loading = true;
      this.cmsObj.copyCustomMonitor(this.copyMonJson, this.copyAs, this.cmsObj.objectID).subscribe(data => {
        if (data) {
          if (data['status']) {
            this.cmsObj.getAvailableConfiguredList(this.monType).subscribe(data => {
              if (data != null) {
                this.confMonData = data;
                this.cd.detectChanges();
              }
            })
            this.displayCopyDailog = false;
            this.loading = false;
            this.msgService.add({ severity: MSGCOMPONENT.SEVERITY_SUCCESS, summary: MSGCOMPONENT.SUMMARY_SUCCESS, detail: "Monitor json copied successfully." });
            this.copyAs = '';
            this.selectedConf = [];
          }
          else {
            this.loading = false;
            this.msgService.add({ severity: MSGCOMPONENT.SEVERITY_ERROR, summary: MSGCOMPONENT.SUMMARY_ERROR, detail: "Monitor json cannot be copied." });
            this.selectedConf = [];
            this.cd.detectChanges();
          }
        }
      })
    }
  }
  checkMonNameAlreadyExist(): boolean {
    for (let i = 0; i < this.confMonData.length; i++) {
      if (this.confMonData[i]._m == this.copyAs) {
        this.msgService.add({ severity: MSGCOMPONENT.SEVERITY_ERROR, summary: MSGCOMPONENT.SUMMARY_ERROR, detail: "Monitor name already exist.Please enter a different monitor name" });
        return true;
      }
    }
  }
  onMonChange() {
    this.tableColumns = []
    this.confMonData = []
    this.getTableHeaderOnTypeChange()
    this.getAvailableMonList()
  }
  updateJmxMon(monName, grpName, objId) {
    this.cmsObj.editJMXConfig(monName, grpName, this.cmsObj.jmxMonitorConnectionKey, objId).subscribe(data => {
      this.cmsObj.isFromEdit = true;
      this.cmsObj.getJMXEditData = data;
      this.cmsObj.disableFields = true;;
      this.router.navigate(['configure-jmx-monitor']);
      this.loading = false;
    })
  }
}
