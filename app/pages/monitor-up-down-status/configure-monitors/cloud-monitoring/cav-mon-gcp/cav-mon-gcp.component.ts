import { Component, OnInit, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng';
import { SessionService } from 'src/app/core/session/session.service';
import { environment } from 'src/environments/environment';
import * as CLOUD_MON from '../../../../monitor-up-down-status/constants/mon-rest-api-constants';
import { MonitorupdownstatusService } from '../../../service/monitorupdownstatus.service';
import { CloudMonitorData } from '../containers/cloud-monitor-data';
import { GCPConfigDTO } from '../containers/gcp-config-data';
import { TableData } from '../containers/table-data';
import { cloudMonitorService } from '../services/cloud-monitors-service';
import * as COMPONENT from '../../add-monitor/constants/monitor-configuration-constants';
import { Location } from '@angular/common';

@Component({
  selector: 'app-cav-mon-gcp',
  templateUrl: './cav-mon-gcp.component.html',
  styleUrls: ['./cav-mon-gcp.component.scss']
})
export class CavMonGcpComponent implements OnInit {

  /* This flag is used to make dialog visible */
  displayDialog: boolean = true;

  cloudMonitorData: CloudMonitorData[] = [];
  gcpConfigData: GCPConfigDTO[] = [];
  runTimeMode: number;
  modeStatus: boolean = false;
  userRole: string;   // used to restrict guest user
  profileName: string;
 // _dialogFileRef: MatDialogRef<CavMonStatsComponent>;

  isShowFilter: boolean;
  @Output()
  showFilterEvent = new EventEmitter<boolean>();
  productType: string = "";    //added for handeling serverName entry in the basis of product type
  serverName: string = "";
  cols:any[];
  gMonId: string = "-1";
  oID: string = "-1";
  operation: string = "add";  //check if it add/update mode
  rejectVisible: boolean = true;
  acceptLable: string = "Yes";
  loading:boolean = false;
  display: boolean;
  gdfDetail: {};

  constructor(private cloudMonitors:cloudMonitorService, private monitorupdownService: MonitorupdownstatusService,
    private messageService: MessageService, private cd: ChangeDetectorRef,private _location: Location,
    private confirmationService: ConfirmationService ,  private sessionService: SessionService) { }

  ngOnInit() {
    this.productType = this.cloudMonitors.getProductType();
    let url = environment.api.monitor.gcp.endpoint ;
    

    // this.userRole = this.monDataService.userRole;    // used to restrict guest user
    // this.profileName = this.monConfigurationService.getProfileName();
    // if (this.monDataService.monModeStatus() != undefined)
    //   this.modeStatus = this.monDataService.monModeStatus();
    // else {
    //   if (this.monDataService.getMonMode() == MODE.VIEW_MODE || this.monDataService.getMonMode() == MODE.TEST_RUN_MODE)
    //     this.modeStatus = true;
    // }

    this.cloudMonitors.getGCPProfile().subscribe(data => {
      if(data)
        this.gcpConfigData = data;
    })

    this.cloudMonitors.getCloudMonitor(CLOUD_MON.CLOUD_GCP_Ex).subscribe(data => {
      if (data != null) {
        this.cloudMonitorData = data.data;
        this.gMonId = data.gMonId;
        this.oID = data.id;
      }
    });

    // if (this.monDataService.getMonMode() == MODE.RUNTIME_MODE) {
    //   this.runTimeMode = MODE.RUNTIME_MODE;
    // }
    // else if (this.monDataService.getMonMode() == MODE.VIEW_MODE || this.monDataService.getMonMode() == MODE.TEST_RUN_MODE) {
    //   this.runTimeMode = MODE.TEST_RUN_MODE;
    // }
    // else if (this.monDataService.getMonMode() == MODE.EDIT_MODE) {
    //   this.runTimeMode = MODE.EDIT_MODE;
    // }

    // if(this.productType == COMPONENT.PRODUCTMODE_ND)
    //   this.serverName = COMPONENT.SERVERNAME_ND;
    // else
    //   this.serverName = COMPONENT.SERVERNAME_NS;

    this.cols = [
      {field: 'pID', header: 'Project ID'},
      {field: 'cID', header: 'Client ID'}

    ]
  }

  ngAfterViewInit() {
    setTimeout(() => {
      var fileUploadElementRef = document.getElementById("gcptestUpload");
      fileUploadElementRef.firstElementChild.firstElementChild.className = "ui-button-icon-left fa fa-upload";
    }, 0)
  }

  /**method for uploading gcp service account file into server (handled by uploadHandler)*/
  uploadFileMsg(event, files) {
    let f = new FormData();
    f.append(event.files[0].name, event.files[0]);
     let url = environment.api.monitor.gcp.endpoint
    let dataSubscription = this.cloudMonitors.getDataFromRESTUsingPOSTReq(url + "?productKey=" + this.sessionService.session.cctx.pk + "&userName=" + this.sessionService.session.cctx.u ,"&for=fileExplorer&destination=" + "/cloud/gcp/"+ "&operation="+ 0, f).subscribe((res) => {
      if (res.status == "success") {
        this.messageService.add({severity:COMPONENT.SEVERITY_SUCCESS,summary:COMPONENT.SUMMARY_SUCCESS,detail:"File uploaded Successfully"});
        this.loadProfileData();
        this.ngAfterViewInit();
        files.clear();
      } else if (res.status == "exist") {
        this.confirmationService.confirm({
          message: 'File ' + res.file + ' already present.Do you want to overwrite?',
          header: 'Confirmation',
          icon: 'fa fa-question-circle',
          accept: () => {
                 let url = environment.api.monitor.gcp.endpoint
            let dataSubscription  = this.cloudMonitors.getDataFromRESTUsingPOSTReq(url + "?productKey=" + this.sessionService.session.cctx.pk + "&userName=" + this.sessionService.session.cctx.u ,"&for=fileExplorer&destination=" + "/cloud/gcp/"+ "&operation=" + 1, f).subscribe((res) => {
              this.messageService.add({severity:COMPONENT.SEVERITY_SUCCESS,summary:COMPONENT.SUMMARY_SUCCESS,detail:"File uploaded Successfully"});
              this.loadProfileData();
              this.ngAfterViewInit();
              files.clear();
            }, (err) => {
              console.log(err);
              dataSubscription.unsubscribe();
            }, () => {
              dataSubscription.unsubscribe();
            });

          },
          reject: () => {
            files.clear();
            return;
          }
        });

      }
      else if (res.status == "error"){
       this.messageService.add({severity:COMPONENT.SEVERITY_ERROR,summary:COMPONENT.SUMMARY_ERROR,detail:"Error in uploading file as Project ID is not present. Please upload another file having Project ID."});
        files.clear();
        return;
      }
    }, (err) => {
      console.log(err);
      dataSubscription.unsubscribe();
    }, () => {
      dataSubscription.unsubscribe();
    });

  }

  /** Method to load data in the table according their project id */
  loadProfileData() {
    this.cloudMonitors.getGCPProfile().subscribe(data => {
      this.gcpConfigData = data;
    })
  }

  /**
* This method is used to download the json file
* for the selected gcp service account.
*/
  downloadProfile(profile) {

    /***download file directly in server  */
    let url = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port;

    this.cloudMonitors.downloadProfile(profile.fileName).subscribe(data => {
      if (data) {
        let path = url + "/netstorm/temp/";
        path = path + profile.fileName ;
        if(this.sessionService.preSession.DWNMULFILE) {
         window.open(path);
        }else {
          this.downloadURI(path, profile.fileName);
        }
      }
    })
  }

  /** This method is used to make the download link to download the selected json file */
  downloadURI(uri, name) {
    var link = document.createElement("a");

    link.download = name;
    link.href = uri;

    // Hence, We need to create mouse event initialization.
    var clickEvent = document.createEvent("MouseEvent");
    clickEvent.initEvent("click", true, true);

    link.dispatchEvent(clickEvent);
  }

  /*This method is used to delete selected rows*/
  deleteSpecificConfig(rowData) {
    const me = this;
    me.rejectVisible = true;
    me.acceptLable = "Yes";
    // rowData['id'] = index;
    this.confirmationService.confirm({
      message: "Are you sure to delete the selected configuration(s)?",
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {

        this.cloudMonitors.deleteGCPFile(rowData.fileName)
          .subscribe(res => {
            if(res == true)
            {
              this.messageService.add({severity:COMPONENT.SEVERITY_SUCCESS,summary:COMPONENT.SUMMARY_SUCCESS,detail:"File deleted Successfully"})
            }
          });
        let arrId = [];

        arrId.push(rowData.id) // push selected row's id

        this.gcpConfigData = this.gcpConfigData.filter(function (val) {
          return arrId.indexOf(val.id) == -1;  //value to be deleted should return false
        })
      },

      reject: () => {
      }
    });

  }

  /**method used for opening stats dialog to see metric information */
  advanceSettings(rowData) {   
    let gdfList = '';
    for(let i=0;i<rowData.gdfInfos.length;i++){
      if(gdfList){
      gdfList = gdfList + "," + rowData['gdfInfos'][i]['gdfName']
      }
      else{
        gdfList = rowData['gdfInfos'][i]['gdfName']
      }
    }
    this.gdfDetail = {
      "dispMonName":rowData['monName'],
      "gdfName":gdfList   
    }
  this.display = true;
}

onDialogClose(event) {
  this.display = event;
}

  // saving monitor json
  saveData() {
    let reqBody =
    {
      "isUseGlobal": false,
      "params": {},
      "mon": {}
    }

    this.cloudMonitorData.map(function (each) {
      // for (let i = 0; i < each['acMonList'].length; i++) {
        each['acMonList'].map(monName=>{
          let obj = {
            "options": "",
            "depOptions": "",
            "type": "std",
            "enabled": each['enabled'],
          };
          reqBody['mon'][monName] = obj;
        })
      // }
    })
    let tierServerInfo = [{
      "tier": "Cavisson",
      "server": "NDAppliance"
    }];

    if(this.gMonId != "-1"){
      this.operation = "update";
    }

    let finalReqBody: any = {
      "techName": CLOUD_MON.CLOUD_GCP_Ex,
      "appName": "default",
      "opr": this.operation,
      "gMonId": this.gMonId,
      "tierInfo": tierServerInfo,
      "body": reqBody
    };
    this.loading = true;
    this.monitorupdownService.saveMonitorConfiguration(finalReqBody, CLOUD_MON.CLOUD_GCP_Ex, this.oID).subscribe(res => {
      if (res['status']) {
        if (this.gMonId == "-1") {
          window.location.reload();
        }
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'GCP_Ex' + " Added Successfully" });
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  // when user changes the checkbox true/false

  showFilter() {
    this.isShowFilter = !this.isShowFilter;
    this.showFilterEvent.emit(this.isShowFilter);
  }
  navToPreviousPage(){
    if (this.monitorupdownService.routeFlag) {
      this.monitorupdownService.flag = true;
    }
    this._location.back();
  }
}
