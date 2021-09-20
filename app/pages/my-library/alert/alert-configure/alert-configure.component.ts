import { Component, OnInit, ViewEncapsulation ,AfterViewInit, ViewChild} from '@angular/core';
import { MenuItem, MessageService } from 'primeng';
import { element } from 'protractor';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { AllInstance } from 'src/app/pages/end-to-end/end-to-end-tier/service/end-to-end-tier.model';
import { GenericImportExportComponent } from 'src/app/shared/generic-import-export/generic-import-export.component';
import { GenericImportExportService } from 'src/app/shared/generic-import-export/services/generic-import-export.service';
import { ALERT_EXPORT, ALERT_IMPORT, ALERT_MODULES, IMPORT_EXPORT_FILEPATH, IMPORT_EXPORT_MODULE_TYPE } from '../alert-constants';
import { ActionsEvents } from '../alert-rules/service/alert-rules.model';
import {
  ADDED_GRAPH,
  PANEL_DUMMY,
  SEVERITY_PANEL_DUMMY,
} from './service/alert-config.dummy';
import { Config, ConfigRequest, ModuleLog, PolicyConfigDTO } from './service/alert-config.model';
import {AlertConfigService} from './service/alert-config.service';
import { ConfigDataLoadedState, ConfigDataLoadingErrorState, ConfigDataLoadingState } from './service/alert-config.state';
import {AlertEventService} from '../service/alert-event.service';   
import { Router } from '@angular/router';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';
import { AlertCapabilityService } from 'src/app/pages/my-library/service/alert-capability.service';
@Component({
  selector: 'app-alert-configure',
  templateUrl: './alert-configure.component.html',
  styleUrls: ['./alert-configure.component.scss'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None,
  
})
export class AlertConfigureComponent implements OnInit,AfterViewInit {
  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';

  config: Config;
  //breadcrumb: MenuItem[];
  options: MenuItem[] = [];
  moduleName: ModuleLog;
  selectedValue: string;
  addedGraph: any[];
  panel: any;
  severityPanel: any;
  multipleCondition: string = 'Single';
  reset: any[];
  update: any[];
  ActionsEvents: {};
  moduleLevel: any;
  ruleSeverityLevel:any;
  toggleSeverityLevel:boolean=true; 
  sessionStart:boolean;
  graph:boolean;
  scaledMatric:boolean;
  selectedSNMP='0';
  selectedV3='4'; 
  selectedMD5='7';
  selectedDES='9';
  jfrtime: any[];
  displayBasic: boolean;
  displayBasic1: boolean;
  showCharts:boolean;
  generateReport:boolean;
  useMetrics:boolean=true;
  similarPattern:boolean;
  PlaceMetrices:boolean;
  useMetrics1:boolean=true;
  similarPattern1:boolean;
  jfrsize: { label: string; value: string; }[];
  displaySetings: boolean;
  visible: boolean;
  placeHolderSeverityLvl:any;
  clearRestEventlist:boolean;
  severity:number;
  alertSetting: MenuItem[];

  @ViewChild('impExpComponent', { read: GenericImportExportComponent })
  impExpComponent: GenericImportExportComponent;
  isOnlyReadable: boolean;
  
  constructor(private AlertConfigServiceObj:AlertConfigService,
              private messageService: MessageService,
              private sessionService: SessionService,
              private alertEventService : AlertEventService,
              private impExpService: GenericImportExportService,
              private router: Router,
              private alertCapability: AlertCapabilityService,
              public breadcrumb: BreadcrumbService
              ) {}

  ngOnInit(): void {
    const me = this;
    me.isOnlyReadable = me.alertCapability.isModuleOnlyReadable(ALERT_MODULES.ALERT_CONFIGURATION);
    me.breadcrumb.addNewBreadcrumb({ label: 'Alert Configurations', routerLink: ['/alert-configure'] });
    /* me.breadcrumb = [
      { label: 'Home', routerLink: '/home/dashboard' },
      { label: 'my-library', routerLink: ['/my-library'] },
      { label: 'Alerts', routerLink: ['/my-library/alert'] },
      { label: 'Alert Configurations', routerLink: ['/alert-configure'] },
    ]; */
    me.alertSetting = [
      {
        label: 'Active Alert',
        routerLink: ['/my-library/alert'],
        state: {isActHis: "active"},
        visible: me.alertCapability.isHasPermission(ALERT_MODULES.ALERT_EVENT)
      },
      {
        label: 'Alert History',
        routerLink: ['/my-library/alert'],
        state: {isActHis: "history"},
        visible: me.alertCapability.isHasPermission(ALERT_MODULES.ALERT_EVENT)
      },
      {
        label: 'Alert Rules',
        routerLink: ['/alert-rules'],
        visible: me.alertCapability.isHasPermission(ALERT_MODULES.ALERT_RULE)
      },
      {
        label: 'Alert Actions',
        routerLink: ['/alert-actions'],
        visible: me.alertCapability.isHasPermission(ALERT_MODULES.ALERT_ACTION)
      },
      {
        label: 'Alert Maintenance',
        routerLink: ['/alert-maintenance'],
        visible: me.alertCapability.isHasPermission(ALERT_MODULES.ALERT_MAINTENANCE)
      }
    ];
    
    me.addedGraph = ADDED_GRAPH;
    me.panel = PANEL_DUMMY;
    me.severityPanel = SEVERITY_PANEL_DUMMY;

   
    let policy: PolicyConfigDTO = {
      enablePolicy: false,
      mail: false,
      sms: false,
      snmp: false,
      threadDump: false,
      heapDump: false,
      tcpDump: false,
      cpuProfile: false,
      jfr:false,
      runScript: false,
      extension: false,
      snapshot: false,
      runOnServer:false
    }
    let actionsEvents: ActionsEvents = {
      enable: false,
      minorToMajor: false,
      minorToCritical: false,
      majorToMinor: false,
      majorToCritical: false,
      criticalToMajor: false,
      criticalToMinor: false,
      forceClear: false,
      continuousEvent: false,
      endedMinor: false,
      endedMajor: false,
      endedCritical: false,
      startedMinor: false,
      startedMajor: false,
      startedCritical: false
      
    }
    let moduleLog: ModuleLog = {
      name: "default",
      level: 0
    }

    me.config = {
      enable: true,
      configId: -1,
      restEvent: true,
      clearEvent:true,
      clearRestEvent: true,
      clearRestEventOnInterval: true,
      clearRestEventInterval: 30,
      historyLog: true,
      maintenance: true,
      restApiTriggered: false,
      numSkipSampleOnSR: 0,
      policy: policy,
      actionsEvents: actionsEvents,
      rSeverityLevel: 3,
      moduleLog: [],
      validSamplePct: 50
      
    }
    me.severity = 1;
    me.ruleSeverityLevel = [
      { label: 'Critical', value: 3 },
      { label: 'Major', value: 2 },
      { label: 'Minor', value: 1 },
      
      ];

      me.configLoad();

  }
  
  ngAfterViewInit(){
    //this.messageService.add({severity:'success', summary: 'Loaded', detail: 'Alert Configurations loaded Successfully'});
  }
  

  configLoad() {
    const me = this;
    try{
    me.AlertConfigServiceObj.load().subscribe(
    
      (state: Store.State) => {
        if (state instanceof ConfigDataLoadingState) {
          me.onConfigLoading(state);
          return;
        }

        if (state instanceof ConfigDataLoadedState) {
          me.onConfigLoaded(state);
          return;
        }
        
      },
      (state: ConfigDataLoadingErrorState) => {
        me.onConfigLoadingError(state);
      }
    );
    this.messageService.add({severity:'success', summary: 'Reset Done', detail: 'Alert Configuration reset succesfully'});
    }
    catch(e){
      console.log("Error While loading alert-configure.... ",e);
    }
    //throw new Error('Method not implemented.');
  }

  configUpdate() {
    const me = this;
    me.alertEventService.isConfigureUpdated= true;
    me.config.rSeverityLevel= me.severity;

    
    if(me.config.validSamplePct <= 0 || me.config.validSamplePct > 100)
    {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Please enter valid value of sample packet" });
      return;
    }

    try{
    me.AlertConfigServiceObj.update(me.config).subscribe((state: Store.State) => {
      if (state instanceof ConfigDataLoadingState) {
        me.onConfigLoading(state);
        return;
      }

      if (state instanceof ConfigDataLoadedState) {
        me.onConfigLoaded(state);
        return;
      }
    },
    (state: ConfigDataLoadingErrorState) => {
      me.onConfigLoadingError(state);
    }

  );
 // this.setPlaceholderForSeverityLvl();
    }
    catch(e){
      console.log("Error while updating alert-configure....",e);
    }
  }
 
  onConfigLoaded(state: ConfigDataLoadedState) {
    const me = this;
    //throw new Error('Method not implemented.');
    if(state.data)
    {
      if(state.data.config)
        me.config = state.data.config;
        me.onActionEvent();
      me.config.moduleLog.forEach(element => {
        me.options.push({label: element.name});
      });
    }
  // If alert configure not loaded once then severityLevel is by default 'Minor' 
    me.severity = (me.AlertConfigServiceObj.severityFlag == true) ?  me.config.rSeverityLevel : 1;


    if (state.data.status.code == 0)
    this.messageService.add({ severity: 'success', summary: 'Success', detail: state.data.status.detailedMsg });
    else
    this.messageService.add({ severity: 'error', summary: 'Error', detail: state.data.status.msg });
     me.AlertConfigServiceObj.severityFlag = (me.config.rSeverityLevel == null) ? false : true;
  }

  updateImportedData(data: any){
    const me = this;

    if(data)
    {
      if(data.config)
        me.config = data.config;
        me.onActionEvent();
      me.config.moduleLog.forEach(element => {
        me.options.push({label: element.name});
      });
    }
  // If alert configure not loaded once then severityLevel is by default 'Minor' 
    me.severity = (me.AlertConfigServiceObj.severityFlag == true) ?  me.config.rSeverityLevel : 1;

  }
 
  onConfigLoadingError(state: ConfigDataLoadingErrorState) {
    throw new Error('Method not implemented.');
  }

  onConfigLoading(state: ConfigDataLoadingState) {
    throw new Error('Method not implemented.');
  }
  showSuccess() {
    this.messageService.add({severity:'success', summary: 'Success', detail: 'ALert Configuration Updated Succesfully'});
}
  showLoaded() {
  this.messageService.add({severity:'success', summary: 'Data Loaded', detail: 'ALert Configuration Loaded succesful Succesfully'});
}
   showReset() {
    this.messageService.add({severity:'error', summary: 'Reset Done', detail: 'ALert Configuration reset Succesfully'});
}
 
 onTrue(){
if (this.config.actionsEvents.enable)
   {
  this.config.actionsEvents.minorToMajor = true;
  this.config.actionsEvents.minorToCritical =true;
  this.config.actionsEvents.majorToMinor =true;
  this.config.actionsEvents.majorToCritical = true;
  this.config.actionsEvents.criticalToMajor = true;
  this.config.actionsEvents.criticalToMinor = true;
  this.config.actionsEvents.forceClear = true;
  this.config.actionsEvents.continuousEvent = true;
  this.config.actionsEvents.endedMinor = true;
  this.config.actionsEvents.endedMajor = true;
  this.config.actionsEvents.endedCritical = true;
  this.config.actionsEvents.startedMinor = true;
  this.config.actionsEvents.startedMajor = true;
  this.config.actionsEvents.startedCritical = true;
   }
 else
   {
  this.config.actionsEvents.minorToMajor = false;
  this.config.actionsEvents.minorToCritical =false;
  this.config.actionsEvents.majorToMinor =false;
  this.config.actionsEvents.majorToCritical = false;
  this.config.actionsEvents.criticalToMajor = false;
  this.config.actionsEvents.criticalToMinor = false;
  this.config.actionsEvents.forceClear = false;
  this.config.actionsEvents.continuousEvent = false;
  this.config.actionsEvents.endedMinor = false;
  this.config.actionsEvents.endedMajor = false;
  this.config.actionsEvents.endedCritical = false;
  this.config.actionsEvents.startedMinor = false;
  this.config.actionsEvents.startedMajor = false;
  this.config.actionsEvents.startedCritical = false;
   }

 }
 onActionEvent() {
    if(this.config.actionsEvents.minorToMajor &&
     this.config.actionsEvents.minorToCritical &&
     this.config.actionsEvents.majorToMinor &&
     this.config.actionsEvents.majorToCritical &&
     this.config.actionsEvents.criticalToMajor &&
     this.config.actionsEvents.criticalToMinor &&
     this.config.actionsEvents.forceClear &&
     this.config.actionsEvents.continuousEvent &&
     this.config.actionsEvents.endedMinor &&
     this.config.actionsEvents.endedMajor &&
     this.config.actionsEvents.endedCritical &&
     this.config.actionsEvents.startedMinor &&
     this.config.actionsEvents.startedCritical &&
     this.config.actionsEvents.startedMajor == true
     )
    {
       this.config.actionsEvents.enable= true;
    }
     else  
    {
     this.config.actionsEvents.enable= false;
    }
  }
 showBasicDialog() {
  this.displayBasic = true;
}
showBasicDialog1() {
  this.displayBasic1 = true;
}
showSettings(){
  this.displaySetings = true;
}
closeDialog() {
  this.visible = false;
}

importExportConfigure(imEx: number){
  const me = this;
  me.impExpComponent.moduleType = me.impExpService.moduleType = IMPORT_EXPORT_MODULE_TYPE.ALERT_CONFIG;
  if(imEx == 1){
    me.impExpService.request = me.makeRequestBody(me.config);
    me.impExpComponent.openImportExportDialog("Configuration", "configurations", ALERT_EXPORT,"alert",IMPORT_EXPORT_FILEPATH);

  }
  else{
    me.impExpService.request = me.makeRequestBody();
    me.impExpComponent.openImportExportDialog("Configuration", "configurations", ALERT_IMPORT,"alert", IMPORT_EXPORT_FILEPATH);
   
}

}

makeRequestBody(config?: Config){
  const me = this;
  const session = me.sessionService.session;
  if(session){
    const cctx = {
      cck: session.cctx.cck,
      pk: session.cctx.pk,
      u: session.cctx.u,

  };
  const configReq: ConfigRequest ={
    cctx: cctx,
    opType: null,
    config: config
  }
  return configReq;
}

}
}
