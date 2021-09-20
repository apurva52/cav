import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng';
import { MonitorupdownstatusService } from '../../../service/monitorupdownstatus.service';
import { GdfTableData, ImmutableArray } from '../../add-custom-monitor/containers/gdf-table-data';
import { ConfiguredMonitorInfoComponent } from '../../configured-monitor-info/configured-monitor-info.component';
import { LogPatternData } from '../../log-monitors/log-pattern-monitor/log-pattern-data';
import { TierServerComponent } from '../../tier-server/tier-server.component';
import * as COMPONENT from '../../add-monitor/constants/monitor-configuration-constants';
import { SessionService } from 'src/app/core/session/session.service';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: "app-snmp",
  templateUrl: "./snmp.component.html",
  styleUrls: ["./snmp.component.scss"]
})

export class SnmpComponent implements OnInit {

  /*This variable is used to show header on ADD and EDIT functionality for GDF detail Table*/
  dialogHeaderForTable: string = "Add";

  gdfData: GdfTableData; // graph definition table data

  formulaTypeList: any[] = []; // formulae list 

  relationList: any[] = [];

  /*This variable is used to check whether it is ADD/EDIT functionality*/
  isFromAdd: boolean;

  /*Counter for ADD/EDIT  */
  count: number = 0;

  /*This variable is used to store the selected gdf details*/
  selectedGDFdetails: GdfTableData[];

  /*This variable is used to hold temporary id of the selected row of gdf details table used in EDIT functionality */
  tempId: number = 0;

  versionList: any[] = []; // holds the version list by default it is 1.
  levelList: any[] = []; //holds security level list
  graphTypeList: any[] = []; //added for bug 101175
  cols: any[];


  //new added
  @ViewChild(TierServerComponent) tierChild: TierServerComponent;
  @ViewChild(ConfiguredMonitorInfoComponent) monInfoChild: ConfiguredMonitorInfoComponent;
  tableInfo: any[];
  techName: string = "snmp";
  AddEditLabel: string = "Add";
  enabled: boolean = true;
  snmpMonData: LogPatternData = new LogPatternData();
  showSrchDialog: boolean = false;
  tierServerInfo: any[] = [];
  loading: boolean
  operation: string = "add";  //check if it add/update mode
  gMonId: string = "-1";
  objectId: string = "-1";  // Object ID
  rejectVisible: boolean;
  acceptLable: string;
  deleteMonConf: Subscription; // to detect delete operation
  
  constructor(private cd: ChangeDetectorRef,
    private messageService: MessageService,
    private cms: ConfirmationService,
    private _location: Location,
    private monitorupdownService: MonitorupdownstatusService, public sessionService: SessionService) { }

  ngOnInit() {
    this.monitorupdownService.getConfigInfo('snmp').subscribe(response => {
      this.splitTableResponse(response);
    });

    this.versionList = [
      {
        label: '1',
        value: '1'
      },
      {
        label: '2c',
        value: '2c'
      },
      {
        label: '3',
        value: '3'
      }

    ]
    this.levelList = [
      {
        label: '--Select--',
        value: ''
      },
      {
        label: 'No authentication and no privacy',
        value: 'noAuthNoPriv'
      },
      {
        label: 'Authentication and no privacy',
        value: 'authNoPriv'
      },
      {
        label: 'Authentication and privacy',
        value: 'authPriv'
      }
    ]
    this.relationList = [
      {
        label: 'Yes',
        value: 'Yes'
      },
      {
        label: 'No',
        value: 'No'
      }
    ]
    this.graphTypeList = [
      {
        label: 'sample',
        value: 'sample'
      },
      {
        label: 'rate',
        value: 'rate'
      },
      {
        label: 'cumulative',
        value: 'cumulative'
      }
    ]

    this.formulaTypeList = [
      {
        label: 'None',
        value: 'None'
      },
      {
        label: 'Multiply By',
        value: 'MultiplyBy'
      },
      {
        label: 'Divide By',
        value: 'DivideBy'
      },
      {
        label: 'MSToSec',
        value: 'MSToSec'
      },
      {
        label: 'PerSec',
        value: 'PerSec'
      }
    ]

    this.tableInfo = [
      { field: "tierInfo", header: 'Tier-Server Information', visible: true },
      { field: "instance", header: 'Instance', visible: true },
      { field: 'customMon', header: 'Metric Group' },
      { field: 'metaData', header: 'Group Hierarchy' },
    ]

    this.cols = [
      { field: 'oid', header: 'OID' },
      { field: 'dataType', header: 'Type' },
      { field: 'rel', header: 'Relative' },
      { field: 'formulae', header: 'Formulae' },
      { field: 'fVal', header: 'Formuale Value' },
      { field: 'graphName', header: 'Graph Name' },
      { field: 'grphDesc', header: 'Graph Description' }
    ]

    // Bug 110416
   this.deleteMonConf = this.monitorupdownService.$deleteMonConf.subscribe((res) => {
    if(res){
      this.resetUI();
    }
 });
 if (this.monitorupdownService.gMonId !== "-1") {
   this.loading = true;
  this.monitorupdownService.otherMonConfig(this.monitorupdownService.gMonId, "-1", this.techName).subscribe(res => {
    if (res) {
        if (res[COMPONENT.RESPONSE_STATUS] === false) {
            this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: res['reason'] });
            this.loading = false;
            this.cd.detectChanges();
        }
        else {
            res['gmonID'] = this.monitorupdownService.gMonId;
            res['objID'] = "-1";
            this.editData(res);
        }
    }
})
}

  }

  /**This method returns selected row on the basis of Id */
  getSelectedRowIndex(data): number {
    let index = this.snmpMonData['gdfDetails'].findIndex(each => each["id"] == data)
    return index;
  }

  /**For ADD Functionality-
    *This method is called when user want to ADD gdf details
    */
  openDialog() {
    this.dialogHeaderForTable = "Add Patterns";
    this.showSrchDialog = true;
    this.gdfData = new GdfTableData();
    this.isFromAdd = true;
  }

  saveSNMPData() {
    if (this.snmpMonData['gdfDetails'].length == 0) {
      this.messageService.add({ severity: 'error', summary: 'ERROR', detail: "Please enter atleast details for one graph" });
      return false;
    }
    this.tierServerInfo = this.tierChild.getTierServerInfo();
    if (this.tierServerInfo.length == 0) {
      return false;
    }
    let options = this.createOptions(this.snmpMonData)
    this.saveMonConfiguration(options);
  }

  saveMonConfiguration(monOptions) {
    let reqBody: any = {};
    let body: any = { "mon": {} };
    let gdfInfo: any = {};
    let metricGrpInfo = [];
    this.tierServerInfo = this.tierChild.getTierServerInfo();
    if (this.tierServerInfo.length == 0) {
      return false;
    }

    if (!this.monitorupdownService.validateDuplicateTier(this.tierServerInfo)) { return false; } 
    body['mon'][this.snmpMonData.gdfName] = {
      "options": monOptions,
      "instanceName": this.snmpMonData.instance,
      "enabled": this.enabled,
      "type": "snmp",
      "gdfName": this.snmpMonData.gdfName,
      "app-name": "default",
      "agent-type": "CMON",
    };
    this.snmpMonData.gdfDetails.map(each => {
      let metricObj = {
        graphNm: each.graphName,
        oid: each.oid,
        rel: each.rel,
        fVal: each.fVal,
        fL: each.formulae,
        dT: each.dataType,
        gD: each.grphDesc
      }
      metricGrpInfo.push(metricObj);
    })
    gdfInfo = {
      mD: this.snmpMonData.metaData,
      metricInfo: metricGrpInfo
    }
    reqBody =
    {
      "techName": "snmp",
      "opr": this.operation,
      "gMonId": this.gMonId,
      "tierInfo": this.tierServerInfo,
      "body": body,
      "gdfInfo": gdfInfo
    }

    this.loading = true;
    this.monitorupdownService.saveMonitorConfiguration(reqBody, "snmp", this.objectId).subscribe(res => {
      if (res['status']) {
        this.monitorupdownService.getConfigInfo('snmp').subscribe(response => {
          this.tierChild.clearTierServerData();
          this.snmpMonData = new LogPatternData();
          this.splitTableResponse(response);
          this.loading = false;
          this.operation = "add";
          this.AddEditLabel = "Add";
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'SNMP Monitor saved successfully' })
        });
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: res['msg'] })
        this.loading = false;
        this.cd.detectChanges();
      }
    })
  }

  /**For EDIT Functionality-
 *This method is called when user want to edit the graph definiton details
 */
  editDialog() {
    if (!this.selectedGDFdetails || this.selectedGDFdetails.length < 1) {
      this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: "No row is selected to edit" });
      return;
    }
    else if (this.selectedGDFdetails.length > 1) {
      this.messageService.add({severity:COMPONENT.SEVERITY_ERROR,summary:COMPONENT.SUMMARY_ERROR,detail:"Select a single row to edit"});
      return;
    }

    this.showSrchDialog = true;
    this.isFromAdd = false;
    this.dialogHeaderForTable = "Edit Patterns";

    this.tempId = this.selectedGDFdetails[0]["id"];
    this.gdfData = Object.assign({}, this.selectedGDFdetails[0]);
  }

  createOptions(formData) {
    let val = '';
    let path = "/home/cavisson/" + this.sessionService.preSession.controllerName + COMPONENT.SNMP_FILE_PATH;

    val = "-f " + path + COMPONENT.CUSTOM_INPUT_FILE + formData.gdfName + COMPONENT.CUSTOM_INPUT_FILE_EXT + COMPONENT.SPACE_SEPARATOR;

    if (formData.ver != null || formData.ver != undefined || formData.ver != '')
      val = val + "-v" + COMPONENT.SPACE_SEPARATOR + formData.ver + COMPONENT.SPACE_SEPARATOR;

    if (formData.com != null || formData.com != undefined || formData.com != '')
      val = val + "-c" + COMPONENT.SPACE_SEPARATOR + formData.com + COMPONENT.SPACE_SEPARATOR;

    if (formData.user != undefined && formData.user != '')
      val = val + "-u" + COMPONENT.SPACE_SEPARATOR + formData.user + COMPONENT.SPACE_SEPARATOR;

    if (formData.sl != undefined && formData.sl != '')
      val = val + "-l" + COMPONENT.SPACE_SEPARATOR + formData.sl + COMPONENT.SPACE_SEPARATOR;

    if (formData.authPro != undefined && formData.authPro != '')
      val = val + "-a" + COMPONENT.SPACE_SEPARATOR + formData.authPro + COMPONENT.SPACE_SEPARATOR;

    if (formData.authParams != undefined && formData.authParams != '')
      val = val + "-A" + COMPONENT.SPACE_SEPARATOR + formData.authParams + COMPONENT.SPACE_SEPARATOR;

    if (formData.encryPr != undefined && formData.encryPr != '')
      val = val + "-x" + COMPONENT.SPACE_SEPARATOR + formData.encryPr + COMPONENT.SPACE_SEPARATOR;

    if (formData.privParams != undefined && formData.privParams != '')
      val = val + "-X" + COMPONENT.SPACE_SEPARATOR + formData.privParams + COMPONENT.SPACE_SEPARATOR;

    if (formData.snmpHost != undefined && formData.snmpHost != '')
      val = val + "-s" + COMPONENT.SPACE_SEPARATOR + formData.snmpHost + COMPONENT.SPACE_SEPARATOR;

    if (formData.interval != undefined && formData.interval != -1)
      val = val + "-i" + COMPONENT.SPACE_SEPARATOR + formData.interval + COMPONENT.SPACE_SEPARATOR;

    if (formData.instance != undefined && formData.instance != '')
      val = val + "-V" + COMPONENT.SPACE_SEPARATOR + formData.instance + COMPONENT.SPACE_SEPARATOR;

    return val;

  }

  /** For SAVE Functionality-
  * This method is called when user performs save operation when ADD/EDIT is done for the gdf details.
  */
  saveSrchPattData() {
    /* for saving the details on ADD Functionality*/
    if (this.isFromAdd) {
      this.gdfData["id"] = this.count;
      this.snmpMonData.gdfDetails = ImmutableArray.push(this.snmpMonData.gdfDetails, this.gdfData);
      this.count = this.count + 1;
      this.showSrchDialog = false;
    }

    /*for saving the updated details on EDIT functionality*/
    else {
      this.gdfData["id"] = this.tempId;
      this.snmpMonData.gdfDetails = ImmutableArray.replace(this.snmpMonData.gdfDetails, this.gdfData, this.getSelectedRowIndex(this.gdfData["id"]))
      this.isFromAdd = true;
      this.showSrchDialog = false;
      this.selectedGDFdetails = [];
    }

  }

  editData(data) {
    this.snmpMonData = new LogPatternData();
    this.loading = true;
    this.operation = "update";
    this.AddEditLabel = 'Update';
    this.gMonId = data['gmonID'];
    this.objectId = data['objID'];
    this.tierChild.fillTierDataAtEit(data['tierInfo']);
    this.fillDataAtEdit(data);
    this.loading = false;
    this.cd.detectChanges();
  }

  fillDataAtEdit(formData) {
    // -f file1  -N 12 -C PerSec -p sw1 -u%20JournalD
    this.fillGDFTabledata(formData);
    this.snmpMonData.gdfName = formData['custMonGdfDto']['customMonName'];
    this.snmpMonData.instance = formData['custMonGdfDto']['instance'];
  }

  fillGDFTabledata(data) {
    let options = data['custMonGdfDto']['options'].replace(/ +/g, ' ').trim();
    let metricInfo = data['gdf']['metricInfo'];
    let gdfData = options.split(" ");
    this.snmpMonData.metaData = data['gdf']['mD'];
    for (let i = 0; i < gdfData.length; i++) {
      if (gdfData[i] === "-v")
        this.snmpMonData.ver = gdfData[i + 1];
      if (gdfData[i] === "-c") {
        this.snmpMonData.com = gdfData[i + 1];
      }
      if (gdfData[i] === "-u")
        this.snmpMonData.user = gdfData[i + 1];
      if (gdfData[i] === "-l")
        this.snmpMonData.sl = gdfData[i + 1];
      if (gdfData[i] === "-a")
        this.snmpMonData.authPro = gdfData[i + 1];
      if (gdfData[i] === "-A")
        this.snmpMonData.authParams = gdfData[i + 1];
      if (gdfData[i] === "-x")
        this.snmpMonData.encryPr = gdfData[i + 1];
      if (gdfData[i] === "-X")
        this.snmpMonData.privParams = gdfData[i + 1];
      if (gdfData[i] === "-s")
        this.snmpMonData.snmpHost = gdfData[i + 1];
      if (gdfData[i] === "-i")
        this.snmpMonData.interval = gdfData[i + 1];
      this.snmpMonData.dumpServer = gdfData[i + 1];
    }

    metricInfo.forEach(value => {
      this.gdfData = new GdfTableData();
      this.gdfData.dataType = value["dT"];
      this.gdfData.graphName = value['graphNm'];
      this.gdfData.oid = value['oid'];
      this.gdfData.rel = value['rel'];
      this.gdfData.formulae = value['fL'];
      this.gdfData.fVal = value['fVal'];
      this.gdfData.grphDesc = value["gD"];

      this.isFromAdd = true;
      this.saveSrchPattData();
    })
  }

  resetUI() {
    this.AddEditLabel = 'Add';
    this.operation = "add";
    this.gMonId = "-1";
    this.objectId = "-1";
    this.tierChild.clearTierServerData();
    this.snmpMonData = new LogPatternData();
  }

  splitTableResponse(data) {
    data.map(each => {
      if (each['options']) {
        let options = each['options'].trim().split(" ");

      }
    })
    this.monInfoChild.getTableData(data);
  }

  deleteGDFDetails() {
    if (this.snmpMonData['gdfDetails'].length == 0) {
      this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: "No record is present to delete" });
      return;
    }

    if (!this.selectedGDFdetails ||this.selectedGDFdetails.length < 1) {
      this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: "Select a row to delete" });
      return;
    }

    this.rejectVisible = true;
    this.acceptLable = "Yes";

    this.cms.confirm({
      message: 'Are you sure to remove this data?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
    let arrId = [];
    this.selectedGDFdetails.map(function (each) {
      arrId.push(each["id"])
    })

    this.snmpMonData['gdfDetails'] = this.snmpMonData['gdfDetails'].filter(function (val) {
      return arrId.indexOf(val["id"]) == -1;  //value to be deleted should return false
    })

    /**clearing object used for storing data */
    this.selectedGDFdetails = [];
  },
  reject: () => {
    this.selectedGDFdetails = [];
  }
});
  }
  //added for bug 111906 
  navigateToPage(){
  if (this.monitorupdownService.routeFlag) {
    this.monitorupdownService.flag = true;
  }
  this._location.back();
}

  ngOnDestroy() {
    this.monitorupdownService.gMonId = "-1"
    if(this.deleteMonConf)
      this.deleteMonConf.unsubscribe();
  } 

}
