import { SelectItem } from 'primeng';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,Renderer2, ViewChild, ElementRef, OnDestroy
} from '@angular/core';
import {OverlayPanel} from 'primeng/overlaypanel';
import { MessageService,MenuItem } from 'primeng/api';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { Action, ActionResponse, ActionType, Chart, Command, DiagnosticDump, Email, JFR, Report, SMS, SNMP, TcpDump, booleanFlagProperty, MailCustomField } from '../service/alert-actions.model';
import { AlertActionService } from '../service/alert-actions.service';
import {
  ActionLoadedState,
  ActionLoadingErrorState,
  ActionLoadingState, ActionResponseLoadedState, ActionResponseLoadeErrorState, ActionResponseLoadingState
} from '../service/alert-actions.state';
import * as CONS from '../service/alert-action-constants';
import { IMAGE_PATH } from '../../alert-rules/alert-configuration/service/alert-config.dummy';
import { AlertRulesService } from '../../alert-rules/service/alert-rules.service';
import { ALERT_MODULES } from '../../alert-constants';
import { AlertCapabilityService } from 'src/app/pages/my-library/service/alert-capability.service';

@Component({
  selector: 'app-add-action',
  templateUrl: './add-action.component.html',
  styleUrls: ['./add-action.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddActionComponent implements OnInit{
  sendAnEmail: boolean = true;
  sendAnSms: boolean = false;
  sendSnmpTraps: boolean = false;
  forwardAlertsTo: boolean = false;
  //newActionName: string;

  threadDump: boolean = false;
  heapDump: boolean = false;
  cpuProfiling: boolean = false;
  tcpDump: boolean = false;
  javaFlightRecorder: boolean = false;

  remediation: boolean = false;
  advancedConfig: boolean = false;

  selectedValue: string = 'val1';
  selectedSecurityLevel: string = 'val1';
  authProtocol: string = 'val1';
  privacyProtocol: string = 'val1';

  advancedConfigVal: number = 10;

  forwardAlerts: SelectItem[];
  selectedForwardAlerts: string;
  javaFlightRecorder1: SelectItem[];
  selectedJavaFlightRecorder1: string;
  javaFlightRecorder2: SelectItem[];
  selectedJavaFlightRecorder2: string = 'mb';
  javaFlightRecorder3: SelectItem[];
  selectedJavaFlightRecorder3: string;
  checked1;
  checked2;
  checked3;
  checked4;
  checked5;
  checked6;
  cities: any[];
  chartTypeOption:MailCustomField[] = [];
  catalogueOption:MailCustomField[] = [];
  withOrWithout:booleanFlagProperty[] = [];
  max_min_option:booleanFlagProperty[] = [];
  metricsOption:MailCustomField[] = [];
  reportTypeOption:MailCustomField[] = [];
  reportChartTypeOption:MailCustomField[] = [];
  //metricsOption: MailCustomField[] = [];
  favoriteOption: MailCustomField[] = [];
  templateOption: MailCustomField[] = [];

  mailCustomFields: MenuItem[] = [];
  startingPositionOfPreText = -1;
  startingPositionOfPostText = -1;
  startingPositionOfMailText = -1;
  patternString: string = "";
  outputString: string = "";

  error: AppError;
  loading: boolean;
  textno: number;
  jfrTimeDuration: MailCustomField[] = [];
  jfrFileSize: MailCustomField[] = [];

  AdvaceEmail: boolean;
  isOnlyReadable: boolean;
  showModalDialog() {
    this.AdvaceEmail = true;
  }


  panelShown: boolean = true ;
  toggleShowPanel() {
    this.panelShown = !this.panelShown;
    }

  notification: boolean = true ;
  toggleShowNotification() {
    this.notification = !this.notification;
    }

  diagnostics: boolean = true ;
  toggleShowDiagnostics() {
    this.diagnostics = !this.diagnostics;
    }

  remediation1: boolean = true ;
  toggleShowRemediation1() {
    this.remediation1 = !this.remediation1;
    }

  advanceConfig: boolean = true ;
  toggleShowAdvanceConfig() {
    this.advanceConfig = !this.advanceConfig;
    }

    restApiConfig: boolean = true ;
  toggleShowRestApi() {
    this.restApiConfig = !this.restApiConfig;
    }

    debugConfig: boolean = true ;
    toggleShowDebugConfig() {
    this.debugConfig = !this.debugConfig;
    }

  @Input()
  fromRule:boolean=false;

  @Input()
  action: Action = new Action();
  @Input()
  actionList: Action[];

  @Output() addActionData = new EventEmitter<ActionResponse>();
  isEdit: boolean;

  @ViewChild('mailInp') mailInp:ElementRef;
  @ViewChild('preInp') preInp:ElementRef;
  @ViewChild('postInp') postInp:ElementRef;
  /** This is used to hold alert icon path*/
  imagePath: string;
  constructor(
    public _actionService: AlertActionService,
    private messageService: MessageService,
    public alertRuleService: AlertRulesService,
    private alertCapability: AlertCapabilityService,
    private renderer: Renderer2
  ) {

    this.forwardAlerts = [
      { label: 'Big Panda', value: 'bigPanda' },
      { label: 'Cisco Spark', value: 'ciscoSpark' },
      { label: 'Microsoft Kaizala', value: 'microsoftKaizala' },
      { label: 'Microsoft Teams', value: 'microsoftTeams' },
      { label: 'Pager Duty', value: 'pagerDuty' },
      { label: 'Service Now', value: 'serviceNow' },
      { label: 'Slack', value: 'slack' },
      { label: 'Other Cavisson Product', value: 'otherCavissonProduct' },
    ];

    this.javaFlightRecorder1 = [
      { label: 'Second(s)', value: 'seconds' },
      { label: 'Minute(s)', value: 'minutes' },
      { label: 'Hour(s)', value: 'hours' },
    ];

    this.javaFlightRecorder2 = [
      { label: 'KB', value: 'kb' },
      { label: 'MB', value: 'mb' },
      { label: 'GB', value: 'gb' },
    ];

    this.javaFlightRecorder3 = [
      { label: 'Second(s)', value: 'seconds' },
      { label: 'Minute(s)', value: 'minutes' },
      { label: 'Hour(s)', value: 'hours' },
    ];
    this.initAction();
  }

  ngOnInit(): void {
    let me = this;
    me.isOnlyReadable = me.alertCapability.isModuleOnlyReadable(ALERT_MODULES.ALERT_ACTION);
    //me.initAction();
    me.imagePath = IMAGE_PATH;
    this.chartTypeOption = CONS.CHART_TYPE;

    this.withOrWithout = CONS.WITH_WITHOUT;

    this.max_min_option =  CONS.MAX_MIN;

    this.metricsOption = CONS.METRIC_FROM_TYPE;

    this.reportTypeOption = CONS.REPORT_TYPE;

    this.reportChartTypeOption = CONS.REPORT_CHART_TYPE;

    this.jfrTimeDuration =  CONS.JFRTIMEDURATION;
    this.jfrFileSize =  CONS.JFRFILESIZE;

    this.mailCustomFields = [
      { label: "$SUBJECT", command: (event) => { me.addMailItems("$SUBJECT") }},
      { label: "$SEVERITY", command: (event) => { me.addMailItems("$SEVERITY") }},
      { label: "$ALERT_MSG", command: (event) => { me.addMailItems("$ALERT_MSG") }},
      //{ label: "$PRODUCT_NAME", command: (event) => { me.addMailItems("$PRODUCT_NAME") }},
      { label: "$RULE_NAME", command: (event) => { me.addMailItems("$RULE_NAME") }},
      { label: "$ALERT_VALUE", command: (event) => { me.addMailItems("$ALERT_VALUE") }},
      //{ label: "$ALERT_TYPE", command: (event) => { me.addMailItems("$ALERT_TYPE") }},
      { label: "$CONDITION_INFO", command: (event) => { me.addMailItems("$CONDITION_INFO") }},
      { label: "$SUBJECT_ID", command: (event) => { me.addMailItems("$SUBJECT_ID") }},
      { label: "$DASHBOARD_LINK", command: (event) => { me.addMailItems("$DASHBOARD_LINK") }}
    ];

    this.initAction();
  }

  // open() {
  //   const me = this;

  //   me.initAction();

  //   me.isEdit = false;
  //   me.visible = true;
  // }

  initAction() {
    const me = this;

    const email: Email = {
      receiver: "",
      subject: "$SEVERITY : Alert for one of the severely affected indices '$SUBJECT'",
      preText: "",
      postText: "",
      dashboardLink: "",
      dashboardGraphTime: 0,
      singleWidget: false
    }

    const sms: SMS = {
      receiver: ""
    }

    const chart: Chart = {
      enable: false,
      type: 1,
      duration: 30,
      allGraphs: true,
      singleGraph: false,
      pattern: false,
      maxBaseline: true,
      catalogueName: "",
      maxNumOfChart: 5,
      inversePattern: true,
      threshold: 80
    }

    const report: Report = {
      enable: false,
      type: "Tabular",
      duration: 30,
      chartInclude: false,
      allGraph: true,
      chartType: "LINE",
      fromUserGraph: false,
      metricsType: "",
      favOrTempType: "",
      attachment: false,
    }
    const heapDump: DiagnosticDump = {
      execute: 2,
      interval: 10,
      timeout: 5
    }

    const threadDump: DiagnosticDump = {
      execute: 2,
      interval: 10,
      timeout: 5
    }

    const cpuProfiling: DiagnosticDump = {
      execute: 2,
      interval: 10,
      timeout: 5
    }

    const jfr: JFR = {

      sTime: 10,
      sTimePrefix: "s",
      path: "/tmp/",
      fileSize: 10,
      fileSizePrefix: "M",
      timeout: 20,
      timeOutPrefix: "s"
  }

    const snmp: SNMP = {

    }

  const tcpDump: TcpDump = {
    interfaceName: "eth0",
    command: "",
    duration: 120,
    fileSize: 10,
    port: 80,
    packetNum: 6400
}

  const command: Command = {
    type: -1,
    name: "",
    script: "",
    runOnServer: -1
  }

  // const actions: Action = {
    const actions: ActionType[] = [{
      type: 1,
      email: email,
      sms: sms,
      heapDump: heapDump,
      threadDump: threadDump,
      tcpDump: tcpDump,
      jfr: jfr,
      chart: chart,
      report: report,
      snmp: snmp,
      cpuProfiling: cpuProfiling,
      command: command
    }]

  me.action = {
    name: "",
    id: -1,
    actions: actions

  }
}

getFreshMailObject(): Email {
  return {
    receiver: "",
    subject: "",
    preText: "",
    postText: "",
    dashboardLink: "",
    dashboardGraphTime: -1,
    singleWidget: false
  }

}

addEmailConf(email: Email) {
  const me = this;
  me.action.actions[0].email = email;
}

editAction(row: any) {
  const me = this;
  this._actionService.showHideDialogue = true;

  this.sendAnEmail = false;
  let rowData: Action = JSON.parse(JSON.stringify(row));
  console.log("rowData", rowData);
  //me.action = rowData;
  me.action.name = rowData.name;
  me.action.id = rowData.id;

  rowData.actions.forEach(element => {
    if (element.type == CONS.ACTION_TYPE.EMAIL)
    {
      this.sendAnEmail = true;
      me.action.actions[0].email = element.email;
    }

    if (element.type == CONS.ACTION_TYPE.SMS)
    {
      this.sendAnSms = true;
      me.action.actions[0].sms = element.sms;
    }

    if (element.type == CONS.ACTION_TYPE.SNMPTRAP)
    {
      this.sendSnmpTraps = true;
      me.action.actions[0].snmp = element.snmp;
    }

    if (element.type == CONS.ACTION_TYPE.SEND_TO_EXTENSION)
    {
      this.forwardAlertsTo = true;
      me.action.actions[0].extensionName = element.extensionName;
    }

    if (element.type == CONS.ACTION_TYPE.THREAD_DUMP)
    {
      this.threadDump = true;
      me.action.actions[0].threadDump = element.threadDump;
    }

    if (element.type == CONS.ACTION_TYPE.HEAP_DUMP)
    {
      this.heapDump = true;
      me.action.actions[0].heapDump = element.heapDump;
    }

    if (element.type == CONS.ACTION_TYPE.TCP_DUMP)
    {
      me.tcpDump = true;
      me.action.actions[0].tcpDump = element.tcpDump;
    }

    if (element.type == CONS.ACTION_TYPE.CPU_PROFILING)
    {
      me.cpuProfiling = true;
      me.action.actions[0].cpuProfiling = element.cpuProfiling;
    }

    if (element.type == CONS.ACTION_TYPE.RUN_SCRIPT)
    {
      me.remediation = true;
      me.action.actions[0].command = element.command;
    }
  });

  me.isEdit = true;
}

actionApply() {
  const me = this;

  let specialCharsForName = "|\\,";
  let mailformat = /^[\W]*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4}[\W]*,{1}[\W]*)*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4})[\W]*$/;
  let phoneNoFormat = /^(^[1-9][0-9]{9})$|^((^[1-9][0-9]{9})+\@([A-Za-z0-9]{1,20})+\.([A-Za-z0-9.]{1,120}))$/;

  if(me.action.name == undefined || me.action.name === "" || me.action.name.length == 0)
    {
      me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Action name should not be empty.Please enter proper action name.' });
      return;
    }
    var format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
    if (me.action.name.trim().match(format)) {
      me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Action name with only special character are not allowed. Please enter valid Action Name.' });
      return;
    }
    if (specialCharsForName.length != 0) {
      for (let i = 0; i < specialCharsForName.length; i++) {
        if (me.action.name.indexOf(specialCharsForName[i]) > -1) {
          me.messageService.add({ severity: 'error', summary: 'Error', detail: 'This Characters \\ , | and , are not allowed in action name. Please enter a valid Action name.' });
          return;
        }
      }
    }

    for(let i = 0; i < this.actionList.length; i++)
    {
      if((this.actionList[i].name.trim() === me.action.name.trim()))
      {
        me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Action name already exists. Please enter different action name.' });
        return;
      }
    }

    if(!this.sendAnEmail && !this.sendAnSms && !this.sendSnmpTraps && !this.forwardAlertsTo && !this.heapDump && !this.threadDump && !this.cpuProfiling && !this.javaFlightRecorder && !this.tcpDump && !this.remediation)
    {
      me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select at least one action from notification type or diagnostic type or remediation type.' });
      return;
    }

    if(this.sendAnEmail)
    {
      if(this.action.actions[0].email.receiver == "" || this.action.actions[0].email.receiver == undefined || !this.action.actions[0].email.receiver.match(mailformat))
      {
        me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Email id in Email receiver is either empty or invalid. Please enter valid email id in email receiver.' });
        return;
      }
      // if(((this.action.actions[0].email.subject !== undefined && this.action.actions[0].email.subject !== '' && this.action.actions[0].email.subject.indexOf("$INDICES_ID") >= 0)))// || (this.action.actions[0].email.preText !== undefined && this.action.actions[0].email.preText !== '' && this.action.actions.email.preText.indexOf("$INDICES_ID") >= 0) || (this.action.email.postText !== undefined && this.action.email.postText !== '' && this.action.email.postText.indexOf("$INDICES_ID") >= 0)) && (this.action.indicesPattern === undefined || this.action.indicesPattern === null || this.action.indicesPattern === ""))
      // {
      //   me.messageService.add({ severity: 'error', summary: 'Error', detail: "Indices identifier in advanced configuration is either empty or invalid. Please enter valid indices identifier in email receiver."});
      //   return;
      // }
      /**if(((this.action.email.subject !== undefined && this.action.email.subject !== '' && this.action.email.subject.indexOf("$DASHBOARD_LINK") >= 0) || (this.action.email.preText !== undefined && this.action.preText !== '' && this.action.preText.indexOf("$DASHBOARD_LINK") >= 0) || (this.action.postText !== undefined && this.action.postText !== '' && this.action.postText.indexOf("$DASHBOARD_LINK") >= 0)) && (!this.action.favLink))
      {
        me.messageService.add({ severity: 'error', summary: 'Error', detail: "Favorite link option in advanced configuration is disable. Please enable.");
        return;
      }
      if(!this.isSaveConfigChart)
        this.action.actionChartConfig = new AlertActionChartDTO();

      if(!this.isSaveReportConfig)
        this.action.reportConfig = new AlertActionReportDTO();
      else
      {
         if(this.action.reportConfig.reportOn && this.action.reportConfig.allGraph)
         {
           this.action.reportConfig.metricsType = "";
           this.action.reportConfig.favOrTempName = "";
         }
      } */
    }

    if(this.sendAnSms)
    {
      if(this.action.actions[0].sms.receiver == "" || this.action.actions[0].sms.receiver == undefined || (this.action.actions[0].sms.receiver.split(",").length == 1 && !this.action.actions[0].sms.receiver.match(phoneNoFormat)) || (this.action.actions[0].sms.receiver.split(",").length > 1 && this.validateSMS(this.action.actions[0].sms.receiver, phoneNoFormat) > 0))
      {
        me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Phone number in SMS receiver is invalid. Please enter valid phone number.' });
        return;
      }
    }

    if(this.sendSnmpTraps)
    {
      if(this.action.actions[0].snmp.server == undefined || !this.action.actions[0].snmp.server.match(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/))
      {
        me.messageService.add({ severity: 'error', summary: 'Error', detail: "Server IP is invalid. Please enter valid server IP."});
        return;
      }

      if(this.action.actions[0].snmp.port == undefined || this.action.actions[0].snmp.port <= 0 || this.action.actions[0].snmp.port > 65535)
      {
          me.messageService.add({ severity: 'error', summary: 'Error', detail: "SNMP Port is invalid. Please enter value between 1 to 65535."});
          return;
        }

        if(this.action.actions[0].snmp.version == undefined || this.action.actions[0].snmp.version == -1)
        {
          me.messageService.add({ severity: 'error', summary: 'Error', detail: "SNMP versions is not selected. please select either v1 or v2c or v3."});
          return;
        }
        if((this.action.actions[0].snmp.version == CONS.SNMP_ACTION_CONS.SNMP_VERSION_V1 || this.action.actions[0].snmp.version == CONS.SNMP_ACTION_CONS.SNMP_VERSION_V2C) && (this.action.actions[0].snmp.community == undefined || this.action.actions[0].snmp.community == ""))
        {
          me.messageService.add({ severity: 'error', summary: 'Error', detail: "Community field is empty. Please enter community name."});
          return;
        }

        if(this.action.actions[0].snmp.version == CONS.SNMP_ACTION_CONS.SNMP_VERSION_V3 && this.action.actions[0].snmp.level == -1)
        {
          me.messageService.add({ severity: 'error', summary: 'Error', detail: "SNMP security level is not selected. Please select either of the security level."});
          return;
        }

        if(this.action.actions[0].snmp.version == CONS.SNMP_ACTION_CONS.SNMP_VERSION_V3)
        {
          if(this.action.actions[0].snmp.user == undefined || this.action.actions[0].snmp.user == "")
          {
            me.messageService.add({ severity: 'error', summary: 'Error', detail: "Username is empty. Please enter valid username."});
            return;
          }

          if(this.action.actions[0].snmp.level == CONS.SNMP_ACTION_CONS.SNMP_SECURITY_AUTH_NO_PRIV || this.action.actions[0].snmp.level == CONS.SNMP_ACTION_CONS.SNMP_SECURITY_AUTH_PRIV)
          {
            if(this.action.actions[0].snmp.authProtocol == -1)
            {
              me.messageService.add({ severity: 'error', summary: 'Error', detail: "Authentication Protocol is not selected. Plese select Authentication Protocol."});
              return;
            }

            if(this.action.actions[0].snmp.authPass == undefined || this.action.actions[0].snmp.authPass == "" || this.action.actions[0].snmp.authPass.length <= 7)
            {
              me.messageService.add({ severity: 'error', summary: 'Error', detail: "Authentication password is either empty or invalid. Please enter valid authentication password."});
              return;
            }
          }

          if(this.action.actions[0].snmp.level == CONS.SNMP_ACTION_CONS.SNMP_SECURITY_AUTH_PRIV)
          {
            if(this.action.actions[0].snmp.privProtocol == -1)
            {
              me.messageService.add({ severity: 'error', summary: 'Error', detail: "Plese select any privacy protocol."});
              return;
            }

            if(this.action.actions[0].snmp.privPass == undefined || this.action.actions[0].snmp.privPass == "" || this.action.actions[0].snmp.privPass.length <= 7)
            {
              me.messageService.add({ severity: 'error', summary: 'Error', detail: "Privacy password is either empty or invalid. Please enter valid privacy password."});
              return;
            }
          }
        }
      }

      if(this.forwardAlertsTo && (this.action.actions[0].extensionName == undefined || this.action.actions[0].extensionName.length <= 0))
      {
        me.messageService.add({ severity: 'error', summary: 'Error', detail: "Extension is not selected. Please select extension."});
        return;
      }

      if(this.threadDump)
      {
        if(this.action.actions[0].threadDump.execute == undefined || this.action.actions[0].threadDump.execute <= 0)
        {
          me.messageService.add({ severity: 'error', summary: 'Error', detail: "Value in 'Number of Thread/Heap dumps' field is invalid. Please enter value greater than 0"});
          return;
        }
        if(this.action.actions[0].threadDump.interval == undefined || this.action.actions[0].threadDump.interval <= 0)
        {
          me.messageService.add({ severity: 'error', summary: 'Error', detail: "Value in interval field is invalid. Please enter value greater than 0 Second(s)."});
          return;
        }
        if(this.action.actions[0].threadDump.timeout == undefined || this.action.actions[0].threadDump.timeout <= 0) {
          me.messageService.add({ severity: 'error', summary: 'Error', detail: "Value in timeout field is invalid. Please enter value greater than 0 Minute(s)."});
          return;
        }
      }

      if(this.heapDump)
      {
        if(this.action.actions[0].heapDump.execute == undefined || this.action.actions[0].heapDump.execute <= 0)
        {
          me.messageService.add({ severity: 'error', summary: 'Error', detail: "Value in 'Number of Thread/Heap dumps' field is invalid. Please enter value greater than 0"});
          return;
        }
        if(this.action.actions[0].heapDump.interval == undefined || this.action.actions[0].heapDump.interval <= 0)
        {
          me.messageService.add({ severity: 'error', summary: 'Error', detail: "Value in interval field is invalid. Please enter value greater than 0 Second(s)."});
          return;
        }
        if(this.action.actions[0].heapDump.timeout == undefined || this.action.actions[0].heapDump.timeout <= 0) {
          me.messageService.add({ severity: 'error', summary: 'Error', detail: "Value in timeout field is invalid. Please enter value greater than 0 Minute(s)."});
          return;
        }
      }

      if(this.cpuProfiling && (this.action.actions[0].cpuProfiling.interval == undefined || this.action.actions[0].cpuProfiling.interval <= 0))
      {
        me.messageService.add({ severity: 'error', summary: 'Error', detail: "Value in duration field is invalid. Please enter value greater than 0 second."});
        return;
      }

      if(this.tcpDump)
      {
        if(this.action.actions[0].tcpDump.interfaceName == undefined || this.action.actions[0].tcpDump.interfaceName == "" || this.action.actions[0].tcpDump.interfaceName.length <= 0)
        {
          me.messageService.add({ severity: 'error', summary: 'Error', detail: "Interface name in TCP Dump is empty. Please enter valid interface name."});
          return;
        }

        if(this.action.actions[0].tcpDump.fileSize == undefined || this.action.actions[0].tcpDump.fileSize <= 0)
        {
          me.messageService.add({ severity: 'error', summary: 'Error', detail: "File size is 0. Please enter file size greater than 0."});
          return;
        }

        if(this.action.actions[0].tcpDump.packetNum == undefined || this.action.actions[0].tcpDump.packetNum <= 0)
        {
          me.messageService.add({ severity: 'error', summary: 'Error', detail: "Number of packets is either empty or 0. Please enter 'Number of Packets' greater than 0."});
          return;
        }

        if(this.action.actions[0].tcpDump.duration == undefined || this.action.actions[0].tcpDump.duration <= 0)
        {
          me.messageService.add({ severity: 'error', summary: 'Error', detail: "Max Duration is either empty or 0. Please enter 'Max Duration' greater than 0."});
          return;
        }

        if(this.action.actions[0].tcpDump.port == undefined || this.action.actions[0].tcpDump.port <= 0 || this.action.actions[0].tcpDump.port > 65535)
        {
          me.messageService.add({ severity: 'error', summary: 'Error', detail: "Port field for TCP dump is invalid. Please enter value of TCP port between 1 to 65535."});
          return;
        }
      }

      if(this.javaFlightRecorder)
      {
        if(!this.action.actions[0].jfr.sTime)
        {
          me.messageService.add({ severity: 'error', summary: 'Error', detail: "Please provide duration to take Java Flight Recorder(JFR)."});
          return;
        }
        else if(this.action.actions[0].jfr.sTime < 1)
        {
          me.messageService.add({ severity: 'error', summary: 'Error', detail: "Please provide Positive(+) duration and it's value should be > 0."});
          return;
        }

        if(!this.action.actions[0].jfr.path)
        {
          me.messageService.add({ severity: 'error', summary: 'Error', detail: "Please provide path Name to take Java Flight Recorder(JFR)."});
          return;
        }
        else if(this.action.actions[0].jfr.path)
        {
          if(this.action.actions[0].jfr.path.split('/').pop())
          {
            me.messageService.add({ severity: 'error', summary: 'Error', detail: "Please provide only path Name to take Java Flight Recorder(JFR)."});
            return;
          }
        }

        if(!this.action.actions[0].jfr.fileSize)
        {
          me.messageService.add({ severity: 'error', summary: 'Error', detail: "Please provide file size to take Java Flight Recorder(JFR)."});
          return;
        }
        else if(this.action.actions[0].jfr.fileSize < 1)
        {
          me.messageService.add({ severity: 'error', summary: 'Error', detail: "Please provide Positive(+) file size and it's value should be > 0."});
          return;
        }

        if(!this.action.actions[0].jfr.timeout)
        {
          me.messageService.add({ severity: 'error', summary: 'Error', detail: "Please provide waiting time to take Java Flight Recorder(JFR)."});
          return;
        }
        else if(this.action.actions[0].jfr.timeout < 1)
        {
          me.messageService.add({ severity: 'error', summary: 'Error', detail: "Please provide Positive(+) waiting time and it's value should be > 0."});
          return;
        }
      }

    let actions: Action [] = [];
    const tempAction: Action = new Action();
    //const temp: ActionType = new ActionType();
      if(this.sendAnEmail)
      {
        const temp1: ActionType = new ActionType();
        temp1.email = this.action.actions[0].email;
        tempAction.name = this.action.name;
        temp1.type = CONS.ACTION_TYPE.EMAIL;
        tempAction.actions.push(temp1);
      }
      if(this.sendAnSms)
      {
        const temp1: ActionType = new ActionType();
        temp1.sms = this.action.actions[0].sms;
        tempAction.name = this.action.name;
        temp1.type = CONS.ACTION_TYPE.SMS;
        tempAction.actions.push(temp1)
      }
      if(this.sendSnmpTraps)
      {
        const temp: ActionType = new ActionType();
        temp.snmp = this.action.actions[0].snmp;
        tempAction.name = this.action.name;
        temp.type = CONS.ACTION_TYPE.SNMPTRAP;
        tempAction.actions.push(temp)
      }
      if(this.forwardAlertsTo)
      {
        const temp: ActionType = new ActionType();
        temp.extensionName = this.action.actions[0].extensionName;
        tempAction.name = this.action.name;
        temp.type = CONS.ACTION_TYPE.SEND_TO_EXTENSION;
        tempAction.actions.push(temp)
      }
      if(this.threadDump)
      {
        const temp: ActionType = new ActionType();
        temp.threadDump = this.action.actions[0].threadDump;
        tempAction.name = this.action.name;
        temp.type = CONS.ACTION_TYPE.THREAD_DUMP;
        tempAction.actions.push(temp)
      }
      if(this.tcpDump)
      {
        const temp: ActionType = new ActionType();
        temp.tcpDump = this.action.actions[0].tcpDump;
        tempAction.name = this.action.name;
        temp.type = CONS.ACTION_TYPE.TCP_DUMP;
        tempAction.actions.push(temp)
      }
      if(this.heapDump)
      {
        const temp: ActionType = new ActionType();
        temp.heapDump = this.action.actions[0].heapDump;
        tempAction.name = this.action.name;
        temp.type = CONS.ACTION_TYPE.HEAP_DUMP;
        tempAction.actions.push(temp)
      }
      if(this.cpuProfiling)
      {
        const temp: ActionType = new ActionType();
        temp.cpuProfiling = this.action.actions[0].cpuProfiling;
        tempAction.name = this.action.name;
        temp.type = CONS.ACTION_TYPE.CPU_PROFILING;
        tempAction.actions.push(temp)
      }
      if(this.javaFlightRecorder)
      {
        const temp: ActionType = new ActionType();
        temp.jfr = this.action.actions[0].jfr;
        tempAction.name = this.action.name;
        temp.type = CONS.ACTION_TYPE.JAVA_FLIGHT_RECORDER;
        tempAction.actions.push(temp)
      }
      if(this.remediation)
      {
        const temp: ActionType = new ActionType();
        temp.command = this.action.actions[0].command;
        tempAction.name = this.action.name;
        temp.type = CONS.ACTION_TYPE.RUN_SCRIPT;
        tempAction.actions.push(temp)
      }

      actions.push(tempAction);
      console.log("actions----->>> ", actions);

      this._actionService.genericActionPayload(actions, CONS.ACTION_OPERATONS.ADD_ACTIONS).subscribe(
    (state: Store.State) => {
      if (state instanceof ActionResponseLoadingState) {
        me.onActionLoading();
        return;
      }
      if (state instanceof ActionResponseLoadedState) {
        me.onActionAdded(state.data);
        return true;
      }
    },
    (state: ActionResponseLoadeErrorState) => {
      me.onActionAddingError(state);
    }
  );
}

actionUpdated() {
  const me = this;

  console.log(this.actionList);
  for(let i = 0; i < this.actionList.length; i++)
  {
    if((this.actionList[i].name.trim() === me.action.name.trim()) && (this.actionList[i].id != me.action.id))
    {
      me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Action name already exists. Please enter different action name.' });
      return;
    }
  }

  //let actions: Action[] = [me.action];
  let actions: Action [] = [];
    const tempAction: Action = new Action();
    //const temp: ActionType = new ActionType();
    tempAction.name = this.action.name;
      tempAction.id = this.action.id;
      if(this.sendAnEmail)
      {
        const temp1: ActionType = new ActionType();
        temp1.email = this.action.actions[0].email;
        temp1.type = CONS.ACTION_TYPE.EMAIL;
        tempAction.actions.push(temp1);
      }
      if(this.sendAnSms)
      {
        const temp1: ActionType = new ActionType();
        temp1.sms = this.action.actions[0].sms;
        temp1.type = CONS.ACTION_TYPE.SMS;
        tempAction.actions.push(temp1)
      }
      if(this.sendSnmpTraps)
      {
        const temp: ActionType = new ActionType();
        temp.snmp = this.action.actions[0].snmp;
        temp.type = CONS.ACTION_TYPE.SNMPTRAP;
        tempAction.actions.push(temp)
      }
      if(this.forwardAlertsTo)
      {
        const temp: ActionType = new ActionType();
        temp.extensionName = this.action.actions[0].extensionName;
        temp.type = CONS.ACTION_TYPE.SEND_TO_EXTENSION;
        tempAction.actions.push(temp)
      }
      if(this.threadDump)
      {
        const temp: ActionType = new ActionType();
        temp.threadDump = this.action.actions[0].threadDump;
        temp.type = CONS.ACTION_TYPE.THREAD_DUMP;
        tempAction.actions.push(temp)
      }
      if(this.tcpDump)
      {
        const temp: ActionType = new ActionType();
        temp.tcpDump = this.action.actions[0].tcpDump;
        temp.type = CONS.ACTION_TYPE.TCP_DUMP;
        tempAction.actions.push(temp)
      }
      if(this.heapDump)
      {
        const temp: ActionType = new ActionType();
        temp.heapDump = this.action.actions[0].heapDump;
        temp.type = CONS.ACTION_TYPE.HEAP_DUMP;
        tempAction.actions.push(temp)
      }
      if(this.cpuProfiling)
      {
        const temp: ActionType = new ActionType();
        temp.cpuProfiling = this.action.actions[0].cpuProfiling;
        temp.type = CONS.ACTION_TYPE.CPU_PROFILING;
        tempAction.actions.push(temp)
      }
      if(this.javaFlightRecorder)
      {
        const temp: ActionType = new ActionType();
        temp.jfr = this.action.actions[0].jfr;
        temp.type = CONS.ACTION_TYPE.JAVA_FLIGHT_RECORDER;
        tempAction.actions.push(temp)
      }
      if(this.remediation)
      {
        const temp: ActionType = new ActionType();
        temp.command = this.action.actions[0].command;
        temp.type = CONS.ACTION_TYPE.RUN_SCRIPT;
        tempAction.actions.push(temp)
      }

      actions.push(tempAction);
  console.log("actionUpdated---->>> ", actions)
  this._actionService.genericActionPayload(actions, CONS.ACTION_OPERATONS.UPDATE_ACTIONS).subscribe(
    (state: Store.State) => {
      if (state instanceof ActionResponseLoadingState) {
        me.onActionLoading();
        return;
      }
      if (state instanceof ActionResponseLoadedState) {
        me.onActionAdded(state.data);
        return true;

      }
    },
    (state: ActionResponseLoadeErrorState) => {
      me.onActionAddingError(state);
    }
  )
}

onActionAddingError(state: ActionResponseLoadeErrorState) {
  //throw new Error('Method not implemented.');
}

onActionAdded(data: ActionResponse) {
  const me = this;
  console.log("onActionAdded----->>>> ", data)
  //me.action = data.actions[0];

  me.addActionData.emit(data);
  me.closeDialog();

  if (data.opType == CONS.ACTION_OPERATONS.ADD_ACTIONS)
    me.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Alert action added successfully',
    });
  else
    me.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Alert action updated successfully',
    });
}

onActionLoading() {
  const me = this;
  me.loading = true;
}

closeDialog() {
  this._actionService.showHideDialogue = false;

  this.sendAnSms = false;
  this.sendSnmpTraps = false;
  this.forwardAlertsTo = false;

  this.threadDump = false;
  this.heapDump = false;
  this.cpuProfiling = false;
  this.tcpDump = false;
  this.javaFlightRecorder = false;
  this.remediation = false;
}

switchNotification(value) {
  if (value == 'sendAnEmail') {
    this.action.actions[0].type = CONS.ACTION_TYPE.EMAIL;
  }
  if (value == 'sendAnSms') {
    this.action.actions[0].type = CONS.ACTION_TYPE.SMS;
  }
  if (value == 'sendSnmpTraps') {
    this.action.actions[0].type = CONS.ACTION_TYPE.SNMPTRAP;
  }
  if (value == 'forwardAlertsTo') {
    this.action.actions[0].type = CONS.ACTION_TYPE.SEND_TO_EXTENSION;
  }
}

switchDiagnostics(value) {
  if (value == 'threadDump') {
    this.action.actions[0].type = CONS.ACTION_TYPE.THREAD_DUMP;
  }
  if (value == 'heapDump') {
    this.action.actions[0].type = CONS.ACTION_TYPE.HEAP_DUMP;
  }
  if (value == 'cpuProfiling') {
    this.action.actions[0].type = CONS.ACTION_TYPE.CPU_PROFILING;
  }
  if (value == 'tcpDump') {
    this.action.actions[0].type = CONS.ACTION_TYPE.TCP_DUMP;
  }
  if (value == 'javaFlightRecorder') {
    this.action.actions[0].type = CONS.ACTION_TYPE.JAVA_FLIGHT_RECORDER;
  }
}

  switchRemediation(value) {
    if (value == 'remediation') {
      this.action.actions[0].type = CONS.ACTION_TYPE.RUN_SCRIPT;
    }
  }

validateSMS(smsString, pattern)
  {
    let counter: number = 0;
    let smsArray = new Array();
    if(smsString !== undefined)
    {
      smsArray = smsString.split(",");
    }
    else
    {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please enter some value in sms receiver field.' });
      return;
    }
    smsArray.forEach(element => {
      if(!element.match(pattern))
      {
        counter++;
      }
    });

    return counter;
  }

  resetTextPosition(res)
  {
    if(res == "startingPositionOfMailText")
    {
      this.startingPositionOfPreText = -1;
      this.startingPositionOfPostText = -1;
    }
    else if(res == "startingPositionOfPreText")
    {
      this.startingPositionOfMailText = -1;
      this.startingPositionOfPostText = -1;
    }
    else if(res == "startingPositionOfPostText")
    {
      this.startingPositionOfMailText = -1;
      this.startingPositionOfPreText = -1;
    }
    else
    {
      this.startingPositionOfMailText = -1;
      this.startingPositionOfPreText = -1;
      this.startingPositionOfPostText = -1;
    }
  }

  addMailItems(res)
  {
    if(this.textno == 1)
    {
      if(this.action.actions[0].email.subject == undefined)
      {
        this.action.actions[0].email.subject = "" + res;
        if(this.setFocus(this.textno, this.action.actions[0].email.subject.length))
          return;
      }
      else if(this.action.actions[0].email.subject != undefined && this.action.actions[0].email.subject != "" && this.startingPositionOfMailText >= 0)
      {
        this.action.actions[0].email.subject = [this.action.actions[0].email.subject.slice(0, this.startingPositionOfMailText), res, this.action.actions[0].email.subject.slice(this.startingPositionOfMailText)].join('');
        this.startingPositionOfMailText = this.startingPositionOfMailText + res.length;
        if(this.setFocus(this.textno, this.startingPositionOfMailText))
          return;
      }
      else
      {
        this.action.actions[0].email.subject = this.action.actions[0].email.subject + res;
        this.startingPositionOfMailText = this.action.actions[0].email.subject.length;
        if(this.setFocus(this.textno, this.action.actions[0].email.subject.length))
          return;
      }
      this.resetTextPosition("startingPositionOfMailText");
    }
    else if(this.textno == 2)
    {
      if(this.action.actions[0].email.preText == undefined)
      {
        this.action.actions[0].email.preText = "" + res;
        if(this.setFocus(this.textno, this.action.actions[0].email.preText.length))
          return;
      }
      else if(this.action.actions[0].email.preText != undefined && this.action.actions[0].email.preText != "" && this.startingPositionOfPreText >= 0)
      {
        this.action.actions[0].email.preText = [this.action.actions[0].email.preText.slice(0, this.startingPositionOfPreText), res, this.action.actions[0].email.preText.slice(this.startingPositionOfPreText)].join('');
        this.startingPositionOfPreText = this.startingPositionOfPreText + res.length;
        if(this.setFocus(this.textno, this.startingPositionOfPreText))
          return;
      }
      else
      {
        this.action.actions[0].email.preText = this.action.actions[0].email.preText + res;
        this.startingPositionOfPreText = this.action.actions[0].email.preText.length;
        if(this.setFocus(this.textno, this.action.actions[0].email.preText.length))
          return;
      }
      this.resetTextPosition("startingPositionOfPreText");
    }
    else if(this.textno == 3)
    {
      if(this.action.actions[0].email.postText == undefined)
      {
        this.action.actions[0].email.postText = "" + res;
        if(this.setFocus(this.textno, this.action.actions[0].email.postText.length))
          return;
      }
      else if(this.action.actions[0].email.postText != undefined && this.action.actions[0].email.postText != "" && this.startingPositionOfPostText >= 0)
      {
        this.action.actions[0].email.postText = [this.action.actions[0].email.postText.slice(0, this.startingPositionOfPostText), res, this.action.actions[0].email.postText.slice(this.startingPositionOfPostText)].join('');
        this.startingPositionOfPostText = this.startingPositionOfPostText + res.length;
        if(this.setFocus(this.textno, this.startingPositionOfPostText))
          return;
      }
      else
      {
        this.action.actions[0].email.postText = this.action.actions[0].email.postText + res;
        this.startingPositionOfPostText = this.action.actions[0].email.postText.length;
        if(this.setFocus(this.textno, this.action.actions[0].email.postText.length))
          return;
      }
      this.resetTextPosition("startingPositionOfPostText");
    }
  }

  setFocus(textno: number, textLength: number) {
    setTimeout(()=>{
      if(textno == 1)
      {
        this.mailInp.nativeElement.selectionStart = this.mailInp.nativeElement.selectionEnd = textLength;
        //this.renderer.selectRootElement(this.mailInp.nativeElement).scrollIntoView();
        //invokeElementMethod(this.mailInp.nativeElement, 'focus');
        (this.mailInp.nativeElement as any)['focus'].apply(this.mailInp.nativeElement);
      }
      else if(textno == 2)
      {
        this.preInp.nativeElement.selectionStart = this.preInp.nativeElement.selectionEnd = textLength;
        //this.renderer.selectRootElement(this.mailInp.nativeElement).scrollIntoView();
        (this.preInp.nativeElement as any)['focus'].apply(this.preInp.nativeElement);
      }
      else if(textno == 3)
      {
        this.postInp.nativeElement.selectionStart = this.postInp.nativeElement.selectionEnd = textLength;
        //this.renderer.selectRootElement(this.mailInp.nativeElement).scrollIntoView();
        (this.postInp.nativeElement as any)['focus'].apply(this.postInp.nativeElement);
      }
  }, 100);
    return true;
  }

  addMailItemToInput(event, overlaypanel: OverlayPanel, res, divRef?)
   {
        overlaypanel.show(event, divRef);
        this.textno = res;
   }

  /**
  * This method is used to test pattern on given string
  */
   testPattern()
   {
    try{

      if(this.action.actions[0].indicesPattern === undefined || this.action.actions[0].indicesPattern.length <= 0 || this.patternString === undefined || this.patternString.length <= 0)
       {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Either indices identifier or test string is empty. Please fill those before test!!"});
         return;
       }

     let baseString = this.patternString;
     baseString = baseString.replace(/\n/g , ';');
    //  this.commonServices.showProgressBar("Going to compile pattern. Please wait...")
     let subs = this._actionService.patternTest(this.action.actions[0].indicesPattern, baseString).subscribe(res =>{

       this.outputString = "";//res.result.replace(/;/g , '\n');
     },()=>{
       subs.unsubscribe();
     });
    }catch(e){
      console.log("Exception in testPattern()--",e);
    }
   }
}
