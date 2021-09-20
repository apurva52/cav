import { Component, OnDestroy, OnInit, ViewChildren } from '@angular/core';
import { SelectItem, Dropdown } from 'primeng';
import { HttpService } from '../../services/httpService';
import { TabNavigatorService } from '../../services/tab-navigator.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RunCommandBeanInterface } from '../../interface/run-command-bean-interface';
import { TabPanel } from 'primeng';
import { Subject, Subscription, timer } from 'rxjs';
import { Message } from 'primeng';
import { SessionService } from 'src/app/core/session/session.service';
import { MessageService } from 'primeng';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RunCmdGraphInfo } from '../runCmd-graph-info/runCmd-graph-info.component';
import { DashboardService } from 'src/app/shared/dashboard/service/dashboard.service';
import { DashboardWidgetComponent } from 'src/app/shared/dashboard/widget/dashboard-widget.component';

@Component({
  selector: 'rumCmd-main',
  templateUrl: 'runCmd-main.component.html',
  styleUrls: ['runCmd-main.component.scss']
})

export class RunCmdMainComponent implements OnInit, OnDestroy{
  @ViewChildren("dynamicCmp") dynamicCmp: any;
  public runCmdObjToCreateTask: any[];
  display: boolean = false; //flag to open the create task window
  displaySchedulerMgmt: boolean = false; //flag to open the scheduler management window
  tiers: SelectItem[] = [];
  selectedTier: string = "";
  grpName: SelectItem[] = [];
  selectedGrp: string;
  servers: SelectItem[] = [];
  selectedServer: string[];
  cmdList: SelectItem[] = [];
  selectedCmd: string;
  filter: SelectItem[] = [];
  selectedFilter: string;
  viewData: SelectItem[] = [];
  viewDataFilter: string = '';
  //  viewDataFilter: string = 'Text';
  delimeter: SelectItem[] = [];
  viewDataDelimeterFilter: string = 'Pipe';
  val: number;
  selectedValues: any[] = [];
  text: string;
  vectorList: Object;
  groupList: Object;
  cmdArr: any[] = [];
  cmdResult: any[] = [];
  serverDisplName: any[] = [];
  commandName: any[] = [];
  serverTime: any[] = [];
  tabs: TabPanel[] = [];
  toggle: boolean = false;
  outputData: any[] = [];
  mainTabularData: any[] = [];
  outputCols: any[] = [];
  seletedOutputTabIndex: number;
  vectorFromWebDash: boolean;
  totalRecords: number;

  headOrTailNum: number = 1;
  saveOutputOnServer: boolean;
  timer: any;
  numberRunCmd: number;
  intervalRunCmd: number;
  sub: Subscription;

  role: string;
  testRunNumber: string;
  userName: string;
  msgs: Message[] = [];
  //Block UI
  blocked: boolean;
  reportType: string = "'Run Command%'";
  timeZone: string = sessionStorage.getItem('timeZone');
  sendDummyData = [];

  /***** These varibales are use only for tooltip for groupName and CommandName   *****/
  groupNameTooltip: string = "";
  commandNameToolTip: string = "";

  /******  Variable to hide dynamic component on command selection *******/
  hideDynamicCommponent: boolean = true;

  /*************** varaible to check user capability  ******************/
  isAdminUser: string = "false";
  /********************* table propery **************************/
  tableRows: number = 10;

  tabularViewFlag: boolean = true;

  expandedItems: Array<any> = new Array<any>();

  /**  variable definition for Run Comand Graph Information **/
  isShowTotal = false;
  isShowRunCommand = false;
  graphBasisIndex = 2;
  yAxisIndex = 3;
  xAxisIndex = 1;
  maxIndex = 0;
  graphIndexValues = [];
  ref: DynamicDialogRef;
  widget:DashboardWidgetComponent = null;
  subsciber:Subscription;

  constructor(private httpService: HttpService,
    private route: ActivatedRoute,
    private router: Router,
    private tabNavigatorService: TabNavigatorService,
    private sessionService: SessionService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private dashboardService:DashboardService
    // private _dialog: MatDialog
  ) {
    this.tiers.push({ label: '-- Select Tier --', value: null });
    this.grpName.push({ label: '-- Select Group --', value: null });
    this.cmdList.push({ label: '-- Select Command --', value: null });
    this.selectedCmd = "";

    //Filter Options
    this.filter = [];
    this.filter.push({ label: '-- Select Line Filter --', value: null });
    this.filter.push({ label: 'Show Top', value: { id: 1, name: 'Show Top' } });
    this.filter.push({ label: 'Show Bottom', value: { id: 1, name: 'Show Bottom' } });

    //View Data Options
    this.viewData = [];
    this.viewData.push({ label: 'Text', value: 'Text' });
    this.viewData.push({ label: 'Tabular', value: 'Tabular' });

    //Delimeter Options
    this.delimeter = [];
    this.delimeter.push({ label: 'Space', value: 'Space' });
    this.delimeter.push({ label: 'Tab', value: 'Tab' });
    this.delimeter.push({ label: 'Pipe', value: 'Pipe' });
    this.delimeter.push({ label: '#', value: '#' });
    this.delimeter.push({ label: '$', value: '$' });
    this.delimeter.push({ label: ',', value: ',' });
    this.delimeter.push({ label: ';', value: ';' });
    this.delimeter.push({ label: ':', value: ':' });
    this.delimeter.push({ label: '-', value: '-' });
    this.delimeter.push({ label: '/', value: '/' });

  }
  ngOnDestroy() {
    //this.subsciber.unsubscribe();
    this.widget= null;
    this.dashboardService.setFromWidgetFlag(false);
  }
  ngOnInit() {
    let me =this;
    if(this.dashboardService.isSelectedWidget() && this.dashboardService.fromWidgetFlag){
   this.subsciber = this.dashboardService.isSelectedWidget().subscribe(value => {
     me.widget =value;
    })
  }

    //console.log("me.widget-------->",me.widget);
    //Session Variables
    //this.role = sessionStorage.getItem("sesRole");
    this.role = "admin";
    //this.userName = sessionStorage.getItem("sesLoginName");
    this.userName = this.sessionService.session.cctx.u;
    //this.testRunNumber = sessionStorage.getItem("testRunNumber");
    this.testRunNumber = this.sessionService.session.testRun.id;
    //this.isAdminUser = sessionStorage.getItem("isAdminUser");
    if (this.sessionService.session && this.sessionService.session.permissions) {
      for (const c of this.sessionService.session.permissions) {
        for (const d of c.permissions) {
          d.permission === 7 ? this.isAdminUser = "true" : this.isAdminUser = "false";
        }
      }
    }


    //Getting OnInit data
    this.runCmdInfoService();

    //If user is not admin, hide repeat option and inc size of output div
    if (this.isAdminUser != "true") {
      document.getElementById("outputMainBodyDiv").style.height = "290px";
    }
  }

  deleteTabs() {
    //initialise the array of the server tabs
    this.serverTabs = [];
    this.cmdResult = [];

    // for disabling maximize and minimize icon if all tabs are deleted
    this.viewDataFilter = '';
    this.toggle = false;
    this.tabularViewFlag = true;
    document.getElementById("outputMainBodyDiv").style.height = "230px";

    //to get minimised screen again if all the tabs are closed in fullscreen view
    var outputDiv = document.querySelector('.panelOutputClass');
    outputDiv.classList.remove("fullscreen");
    outputDiv.classList.toggle('exitfullscreen');

  }

  displayTaskWindow($event) {
    this.display = $event.displayFlag;
  }

  showAlertMsg($event) {
    var msgWithSeverity = $event.msg;
    var severity = String(msgWithSeverity.split(":")[1]);


    if (severity == 'info')
      this.showInfo(msgWithSeverity.split(":")[0]);
    else
      this.showError(msgWithSeverity.split(":")[0]);
  }

  //Getting Vector List (Tier and Server)
  getVectorListFromJSON(res: any) {
    let tmpVectors={};
    res.forEach(element => {
      let serverMachineInfo={};
      Object.keys(element['serverMap']).forEach(function(key) {
        Object.defineProperty(serverMachineInfo,element['serverMap'][key]['serverDisplayName'],{enumerable: true, configurable: true, writable: true});
        serverMachineInfo[element['serverMap'][key]['serverDisplayName']]=[element['serverMap'][key]['serverName'], element['serverMap'][key]['machineType']]
      });
      Object.defineProperty(tmpVectors,tmpVectors[element['tierName']],{enumerable: true, configurable: true, writable: true});
        tmpVectors[element['tierName']]=serverMachineInfo
    });

    this.vectorList = {"Vector_List":tmpVectors};

    if (sessionStorage.getItem("tierName") == "NA") {
      this.showError("No suitable Vector found for selected graph");
      sessionStorage.removeItem("tierName");
    }
    //Pushing Tier
    var tierList = Object.keys(this.vectorList["Vector_List"]);

    for (var i = 0; i < tierList.length; i++) {
      // Added for bug ID 37490
      if (tierList[i] == 'Default' || tierList[i] == 'undefined')
        continue;

      this.tiers.push({
        label: tierList[i], value: tierList[i]
      });
    }

    if (sessionStorage.getItem("tierName") != undefined) {
      var flag = false;
      //Checking if passed tier is in topology list. If found, show tier as selected
      for (var i = 0; i < this.tiers.length; i++) {
        if (this.tiers[i]["label"] == sessionStorage.getItem("tierName")) {
          flag = true;
          break;
        }
        else
          flag = false;
      }
      if (flag) {
        this.tiers.shift();	//Removing First element of Select Server and showing tier name as selected passed from WebDash
        this.selectedTier = sessionStorage.getItem("tierName");

        this.getServer(this.selectedTier);
        this.vectorFromWebDash = true;
      }
    }

    if(this.widget && this.dashboardService.fromWidgetFlag){
      let valueofSubject:any[] =[];
      let subject= this.widget.widget.dataCtx.gCtx[0].subject.tags;
      console.log(tierList);
      subject.forEach((value)=>{
        valueofSubject.push(value.value);
      });
      // if(this.widget.widget.patternMatchBaselineFromLowerPanel){
      //   valueofSubject =[];
      //   let metricName=null;
      //   metricName =this.widget.widget.patternMatchBaselineFromLowerPanel;
      //   valueofSubject =metricName.split(">");
      // }
      for(let i=0;i<tierList.length;i++){
       if(tierList[i]==valueofSubject[0]){
        this.selectedTier =tierList[i];
        break;
       }
      }
      this.getServer(this.selectedTier);
      for(let s=0;s<this.servers.length;s++){
        if(this.servers[s].value ===valueofSubject[1]){
          this.selectedServer[1] =valueofSubject[1];
          break;
        }
      }

    }
  }

  //Getting Grp Name
  getGroupNameFromJSON(res: any) {
    this.groupList = res;
    this.httpService.setcmdGroupList(this.groupList);
    this.httpService

    var TimeInfo = this.groupList["TimeInfo"];
    this.tabNavigatorService.setTimeZoneInfo(TimeInfo);

    //Pushing Group Name
    var grpList = Object.keys(this.groupList["Select_View"]).sort();

    for (var i = 0; i < grpList.length; i++) {
      this.grpName.push({
        label: grpList[i], value: {
          id: i, name: grpList[i]
        }
      })
    }
  }

  //Getting Server of Selected Tier
  getServer(selectedTier) {
    this.servers = [];
    this.selectedServer = [];

    if (this.selectedTier != undefined) {
      var serverList = Object.keys(this.vectorList["Vector_List"][this.selectedTier]).sort(this.naturalCompare);
      for (var i = 0; i < serverList.length; i++) {
        this.servers.push({
          label: serverList[i], value: serverList[i]
        })
        if (sessionStorage.getItem("serverName") != undefined && serverList[i] == sessionStorage.getItem("serverName")) {
          this.selectedServer = [];
          this.selectedServer.push(sessionStorage.getItem("serverName"));
          sessionStorage.removeItem("serverName");
        }
      }
    }
  }

  naturalCompare(a, b) {
    let ax = [], bx = [];

    a.replace(/(\d+)|(\D+)/g, function (_, $1, $2) { ax.push([$1 || Infinity, $2 || '']) });
    b.replace(/(\d+)|(\D+)/g, function (_, $1, $2) { bx.push([$1 || Infinity, $2 || '']) });

    while (ax.length && bx.length) {
      let an = ax.shift();
      let bn = bx.shift();
      let nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
      if (nn) {
        return nn;
      }
    }
    return ax.length - bx.length;
  }

  //getting Cmd List from Selected groupList
  getCmdList() {
    this.cmdList = [];
    this.cmdList.push({ label: '-- Select Command --', value: null });
    if (this.selectedGrp != undefined) {
      var cmdList = Object.keys(this.groupList["Select_View"][this.selectedGrp["name"]]).sort();
      for (var i = 0; i < cmdList.length; i++) {
        if (this.groupList["Select_View"][this.selectedGrp["name"]][cmdList[i]]["serverType"].indexOf(this.vectorList["Vector_List"][this.selectedTier][this.selectedServer[0]][1]) >= 0) {
          if (cmdList[i] == 'Comapre files') {
            cmdList[i] = 'Compare files';
          }
          this.cmdList.push({
            label: cmdList[i].split("$$")[0], value: {
              id: i, name: cmdList[i]
            }
          })
        }
      }

      this.showSelectedCmdGUI({ name: this.cmdList[0]["label"] });
    }
  }

  //Show Dynamic GUI based on selected Cmd Name
  showSelectedCmdGUI(selectedCmd) {
    this.hideDynamicCommponent = true;
    var grpName = this.selectedGrp["name"];
    this.groupNameTooltip = grpName;
    if (grpName != undefined) {
      var cmdName = selectedCmd["name"];
      if (cmdName != undefined) {
        if (this.groupList["Select_View"][grpName][cmdName] != undefined)
          this.cmdArr = this.groupList["Select_View"][grpName][cmdName]["cmdUIArgsJson"];
        this.commandNameToolTip = cmdName;
      }
    }
    /*for(var i = 0; i < this.cmdArr.length; i++)
    {
      if( this.cmdArr[i].type == "spinner" )
        document.getElementById("IterationSpinnerID").style.display = "initial";
      else
       document.getElementById("IterationSpinnerID").style.display = "none";
    }*/
  }

  /**
   * Validate form to execute Run
   */
  validateInputs() {
    if ((this.selectedTier != undefined && this.selectedGrp != undefined) && (this.selectedServer.length != 0 && this.selectedCmd != ""))
      return true;

    return false;
  }

  /**
  * This function is for getting all the inputs from the GUI and run the command
  */
  runCmdObj: Array<RunCommandBeanInterface> = [];
  runCommand(displayCreateTaskWindow: boolean) {
    //Validate inputs
    if (!this.validateInputs()) {
      if (displayCreateTaskWindow == false)
        this.showError("Fill all required fields");
      else
        this.showError("Run the command first, in order to create a task");
      return false;
    }

    this.toggle = true;

    var value = (this.selectedValues.length != 0) ? this.numberRunCmd : 1;
    var timePeriod = (this.selectedValues.length != 0) ? this.intervalRunCmd : 1;

    if (timePeriod == undefined || timePeriod < 1)
      timePeriod = 1;

    this.timer = timer(0, timePeriod * 1000);

    /*Here first of all we check the timer if not present then we'll run single time */
    if (value == undefined || value < 1)
      value = 1;
    this.sub = this.timer.subscribe(t => this.runCommandMultiple(t, value, displayCreateTaskWindow));
  }

  //Method to run command multiple times
  runCommandMultiple(tick, value, displayCreateTaskWindow: boolean) {
    if (tick < value) {
      /*This piece of code run sigle time*/
      if (this.selectedValues && this.selectedServer != undefined && this.selectedServer.length > 0) {
        var actCmdArgs = this.getCommandArguments();
        if (actCmdArgs.indexOf("ERROR") != -1) {
          this.showInfo(actCmdArgs);
          this.sub.unsubscribe();
          return false;
        }

        for (var i = 0; i < this.selectedServer.length; i++) {
          this.runCmdObj[i] = this.getDefaultObj(this.selectedServer[i]);
          if (this.runCmdObj[i].commandName == 'Custom Command') {
            this.runCmdObj[i].actualCommand = this.runCmdObj[i].actualCmdArgs.trim();
            this.runCmdObj[i].actualCmdArgs = '';
            this.runCmdObj[i].searchKeyword = "NA";
          }
        }
      }
      this.blocked = true;
      this.runCmdObjToCreateTask = this.runCmdObj;//passing the runCommand object to create Task window
      this.httpService.runCommandOnServer(this.runCmdObj, this.selectedTier).subscribe(
        res => this.showOutPut(res, displayCreateTaskWindow)
      );
    }
    else {
      this.sub.unsubscribe();
    }
    this.runCmdObj = [];    //Emptying the response array
  }

  /**
   * This methos is to get the valued of dynamic components.
   */
  getValueById(id, type) {
    var components = this.dynamicCmp._results;
    for (var i = 0; i < components.length; i++) {
      if (components[i].nativeElement.firstElementChild.id == id) {
        if (type == 'checkbox' || type == 'radiobutton')
          return components[i].nativeElement.firstElementChild.checked;
        else
          return components[i].nativeElement.firstElementChild.value;
      }
    }
  }

  /**
   * This method is to get the extra arguments provided by the user
   */
  commandUIArguments: string;
  getCommandArguments() {
    this.commandUIArguments = '';
    /*In case the command does not have any extra argument feild*/
    if (this.cmdArr == undefined || this.cmdArr.length < 1)
      return this.commandUIArguments;

    for (var i = 0; i < this.cmdArr.length; i++) {
      var cmdJsonObj = this.cmdArr[i];
      if (cmdJsonObj.type != 'label') {
        if (cmdJsonObj.type == 'radiobutton') {
          this.commandUIArguments = this.commandUIArguments + " " + cmdJsonObj.modal;
        }
        else if (cmdJsonObj.type == 'listbox') {
          this.commandUIArguments = this.commandUIArguments + " " + cmdJsonObj.arg + " " + cmdJsonObj.modal;
        }
        else if (cmdJsonObj.type == 'checkbox') {
          if (cmdJsonObj.modal) {
            this.commandUIArguments = this.commandUIArguments + " " + cmdJsonObj.arg;
          }
        }
        else if (cmdJsonObj.type == 'textboxnumeric' || cmdJsonObj.type == 'spinner') {
          if (cmdJsonObj.modal != undefined) {
            if (typeof parseInt(cmdJsonObj.modal) == 'number') {
              if (parseInt(cmdJsonObj.modal) >= parseInt(cmdJsonObj.minValue) && parseInt(cmdJsonObj.modal) <= parseInt(cmdJsonObj.maxValue)) {
                this.commandUIArguments = this.commandUIArguments + " " + cmdJsonObj.arg + " " + cmdJsonObj.modal;
              }
              else {
                return "ERROR: Provide value between min = " + cmdJsonObj.minValue + " and max = " + cmdJsonObj.maxValue + " value...."
              }
            }
            else {
              return "ERROR: Provide int value...."
            }
          }
        }
        else if (cmdJsonObj.type == 'textbox') {
          if (cmdJsonObj.modal != "") {
            this.commandUIArguments = this.commandUIArguments + " " + cmdJsonObj.arg + " " + cmdJsonObj.modal;
          }
        }
      }
    }
    return this.commandUIArguments;
  }

  //Getting top and bottom line of result
  getHeadOrTailOption() {
    if (this.selectedFilter == undefined)
      return "";

    var headOrTailOption = this.selectedFilter['name'];
    if (headOrTailOption == "Show Top") {
      return "head";
    }
    else if (headOrTailOption == "Show Bottom") {
      return "tail";
    }
  }

  /**
   * This method is to show output of run command.

   */
  serverTabs: any[] = [];
  globalOutputData: any[];
  showOutPut(res: any, displayCreateTaskWindow: boolean) {
    delete res.rsTime;
    var keys = Object.keys(res);
    this.globalOutputData = res;     //Keeping output data as global
    for (var i = 0; i < keys.length; i++) {
      var splitHeaderContent = this.globalOutputData[keys[i]].split("$$$");

      /*if(splitHeaderContent[0].startsWith("ERROR")){
         this.showError(splitHeaderContent[0]);
         this.blocked = false;
         return false;
      }*/
      if (splitHeaderContent[0].startsWith("ERROR")) {
        this.blocked = false;
        if (displayCreateTaskWindow == false) {
          this.showError(splitHeaderContent[0]);
        }
        else {
          this.showError("This command is throwing an error--this task cannot be created");
          displayCreateTaskWindow = false;
        }
        return false;
      }

      //Data to be displayed in Output Screen
      this.serverDisplName.push(keys[i]);

      this.commandName.push(splitHeaderContent[0]);
      var commandDisplayName = splitHeaderContent[3];
      var trimCmdName = "";
      if (splitHeaderContent[0].length > 40) {
        trimCmdName = splitHeaderContent[0].substring(0, 36) + "...";
      }
      else
        trimCmdName = splitHeaderContent[0];

      this.serverTime.push(splitHeaderContent[1]);

      this.cmdResult.push(splitHeaderContent[2]);

      //Default Select View Type, Seperator and Is header Contains Flag
      var cmdType = this.groupList["Select_View"][this.selectedGrp["name"]][this.selectedCmd["name"]]["viewType"];
      var seperator = this.groupList["Select_View"][this.selectedGrp["name"]][this.selectedCmd["name"]]["separator"];
      var isColumnContains = this.groupList["Select_View"][this.selectedGrp["name"]][this.selectedCmd["name"]]["isColumnContains"];

      if (cmdType == 'NA')
        cmdType = "Text";
      this.viewDataFilter = cmdType;

      this.viewDataDelimeterFilter = this.getSeperator(seperator, false);

      if (this.viewDataDelimeterFilter == '|')
        this.viewDataDelimeterFilter = 'Pipe';
      if (this.viewDataDelimeterFilter == '\t')
        this.viewDataDelimeterFilter = 'Tab';

      for (var x = 0; x < this.serverTabs.length; x++) {
        if (this.serverTabs[x].isSelected == true) {
          this.serverTabs[x].isSelected = false;
          break;
        }
      }
      //Creating Output Tab structure
      this.serverTabs.push({
        name: keys[i], viewType: cmdType, viewCmdJSONType: cmdType, seperator: seperator, isColumnContains: isColumnContains, data: splitHeaderContent[2], trimCmdName: trimCmdName, commandDisplayName: commandDisplayName, isSelected: true
      });
      this.seletedOutputTabIndex = this.serverTabs.length - 1;
      if (cmdType == "Tabular") {
        this.outputViewMode(cmdType, seperator, false);
      }
    }
    this.blocked = false;
    this.display = displayCreateTaskWindow; //display the create taskWindow
  }

  /**
   * This method provides the default values for for the interface data members.
   */
  getDefaultObj(serverName): RunCommandBeanInterface {
    return {
      userName: this.userName,
      userDefindCommad: false,
      serverName: this.vectorList["Vector_List"][this.selectedTier][serverName][0],    //actual Server Name
      isOutPutSaveOnServer: this.saveOutputOnServer,
      serverTime: '',
      testRun: this.testRunNumber,
      subOutputOption: this.getHeadOrTailOption(),
      subOutputValue: this.headOrTailNum,
      filerKeyword: this.text,
      serverDisplayName: serverName,
      groupName: this.selectedGrp['name'],
      commandName: this.selectedCmd['name'].split("$$")[0],
      actualCommand: this.groupList["Select_View"][this.selectedGrp['name']][this.selectedCmd['name']]['actualCommand'],
      role: this.groupList["Select_View"][this.selectedGrp['name']][this.selectedCmd['name']]['role'],
      serverType: this.groupList["Select_View"][this.selectedGrp['name']][this.selectedCmd['name']]['serverType'],
      viewType: this.groupList["Select_View"][this.selectedGrp['name']][this.selectedCmd['name']]['viewType'],
      description: this.groupList["Select_View"][this.selectedGrp['name']][this.selectedCmd['name']]['description'],
      searchKeyword: this.groupList["Select_View"][this.selectedGrp['name']][this.selectedCmd['name']]['searchKeyword'],
      isColumnContains: this.groupList["Select_View"][this.selectedGrp['name']][this.selectedCmd['name']]['isColumnContains'],
      cmdUIArgs: this.groupList["Select_View"][this.selectedGrp['name']][this.selectedCmd['name']]['cmdUIArgs'],
      actualCmdArgs: this.commandUIArguments,
      maxInLineArguments: this.groupList["Select_View"][this.selectedGrp['name']][this.selectedCmd['name']]['maxInLineArguments'],
      separator: this.groupList["Select_View"][this.selectedGrp['name']][this.selectedCmd['name']]['separator'],
      iteration: this.numberRunCmd
    };
  }

  /**
 * This methood is to convert the text type view to tabular type
 */
  getTabularView(optput: string, isHeaderContain, seperator: string) {
    try {
      var tableViewOutput = [];
      var arrData = optput.split("\n");
      var arrHeader = [];
      if (isHeaderContain == "true") {
        for (var i = 0; i < arrData.length - 1; i++) {
          var rowKeyValue = {};
          var arrRowTable = arrData[i].split(seperator).filter(function (value) { if (value.trim().length > 0) return value; });
          for (var j = 0; j < arrRowTable.length; j++) {
            if (i == 0) {
              arrHeader[j] = arrRowTable[j];
            }
            else {
              rowKeyValue[arrHeader[j]] = arrRowTable[j];
            }
          }

          if (i > 0)
            tableViewOutput[i - 1] = rowKeyValue;
        }
      }
      else {
        for (var i = 0; i < arrData.length - 1; i++) {
          var rowKeyValue = {};
          var arrRowTable = arrData[i].split(seperator).filter(function (value) { if (value.trim().length > 0) return value; });
          for (var j = 0; j < arrRowTable.length; j++) {
            rowKeyValue["Header-" + (j + 1)] = arrRowTable[j];
          }
          tableViewOutput[i] = rowKeyValue;
        }
      }
      return tableViewOutput;
    }
    catch (error) {
      console.error(error);
    }
  }

  /**
   * Used to handle switching of tabs on close opertaions.
   * @param event
   */
  handleTabClose(event) {
    try {
      if (this.serverTabs.length >= event.index) {
        this.serverTabs.splice(event.index, 1);
      }
      var selectedIndex = 0;
      for (let x = 0; x < this.serverTabs.length; x++) {
        if (this.serverTabs[x].isSelected) {
          selectedIndex = x;
          break;
        }
      }
      if (this.serverTabs[selectedIndex] != undefined)
        this.serverTabs[selectedIndex].isSelected = true;
    } catch (ex) { console.error("Exception - ", ex); }
  }

  /**
   * Handling Output Tab Change
   */
  handleOutputTabChange(e) {
    for (var x = 0; x < this.serverTabs.length; x++) {
      if (this.serverTabs[x].isSelected == true) {
        this.serverTabs[x].isSelected = false;
        break;
      }
    }
    this.serverTabs[e.index].isSelected = true;
    this.seletedOutputTabIndex = e.index;    //getting tab index
    // if(this.serverTabs[this.seletedOutputTabIndex]["viewCmdJSONType"] = "Text")
    //     this.viewData.splice(1,1);
    // else{
    //    this.viewData.splice(1,1);
    //    this.viewData.push({label:'Tabular', value:'Tabular'});
    // }

    var seperator = this.serverTabs[e.index]['seperator'];
    if (this.tabularViewFlag) {
      this.toggle = true;
    }
    this.outputViewMode(this.serverTabs[this.seletedOutputTabIndex]["viewType"], seperator, false);   //iGEtting view Type of tab
  }

  /**
   * Alter Output acc. to delimeter
   */
  showOutputByDelimeter(delimeter) {
    this.outputViewMode(this.serverTabs[this.seletedOutputTabIndex]["viewType"], delimeter, false);
    this.serverTabs[this.seletedOutputTabIndex]["seperator"] = delimeter;
  }

  /**
   * Viewing Output in Text and Tabular Form
   */
  outputViewMode(selectedOutputMode, seprator, isFromTabChanged) {
    if (seprator == '') {
      seprator = this.serverTabs[this.seletedOutputTabIndex]["seperator"];
    }
    this.viewDataDelimeterFilter = seprator;
    this.blocked = true;
    this.outputCols = [];
    //If Tab not changed, put selected tab as length of Tab
    if (this.seletedOutputTabIndex == undefined)
      this.seletedOutputTabIndex = this.serverTabs.length - 1;

    //Getting Seperator
    seprator = this.getSeperator(seprator, isFromTabChanged);
    //Checking Output View Mode
    if (selectedOutputMode == "Tabular") {
      // this.toggle = false;
      //       if(this.tabularViewFlag == true)
      //       this.toggle = false;
      //       else
      //       this.toggle = true;

      //       if(!this.toggle)
      //        this.goFullScreenTableView();

      if (!this.toggle && document.getElementById("runCmdTableView_0") == null) {
        setTimeout(() => {
          for (var i = 0; i < this.serverTabs.length; i++) {
            if (document.getElementById("runCmdTableView_" + i) != null) //Check This
            {
              this.tabularViewFlag = false;
              document.getElementById("runCmdTableView_" + i).style.height = "470px";
            }
          }
          document.getElementById("outputMainBodyDiv").style.height = "630px";
        }, 500);
      }

      //this.goFullScreen();		//Remove after dynamic height of table solved
      this.outputData = this.getTabularView(this.cmdResult[this.seletedOutputTabIndex], this.serverTabs[this.seletedOutputTabIndex]["isColumnContains"], seprator);
      this.totalRecords = this.outputData.length;
      var keys = Object.keys(this.outputData[Math.floor((this.outputData.length - 1) / 2)]);
      let dummyArr = [];
      for (var i = 0; i < keys.length; i++) {
        dummyArr.push({
          field: keys[i], header: keys[i]
        });
      }
      //Changing VIew Type to tabular of selected tabs
      this.serverTabs[this.seletedOutputTabIndex]["viewType"] = "Tabular";

      this.viewDataFilter = this.serverTabs[this.seletedOutputTabIndex]["viewType"];
      this.outputCols = dummyArr;
      this.mainTabularData = this.outputData.slice(0, 10);
    }
    else {
      this.serverTabs[this.seletedOutputTabIndex]["viewType"] = "Text";
      this.viewDataFilter = "Text";
      //this.toggle = true;
      this.cmdResult[this.seletedOutputTabIndex] = this.serverTabs[this.seletedOutputTabIndex]["data"];

      if (!this.toggle) {
        setTimeout(() => {
          for (var i = 0; i < this.serverTabs.length; i++) {
            if (document.getElementById("outputTextArea_" + i) != null)        //Check This
              document.getElementById("outputTextArea_" + i).style.height = "470px";
          }
          document.getElementById("outputMainBodyDiv").style.height = "630px";
        }, 500);
      } else {
        setTimeout(() => {
          for (var i = 0; i < this.serverTabs.length; i++) {
            if (document.getElementById("outputTextArea_" + i) != null)      //Check This
            {
              //If user is not admin
              if (this.isAdminUser != "true")
                document.getElementById("outputTextArea_" + i).style.height = "210px";
              else
                document.getElementById("outputTextArea_" + i).style.height = "145px";
            }
          }
        }, 500);
      }
    }
    //If user is not admin, hide repeat option and inc size of output div
    /*if(this.isAdminUser != "true"){
     document.getElementById("outputMainBodyDiv").style.height = "290px";
   }
   else
      document.getElementById("outputMainBodyDiv").style.height = "230px"; */
    this.blocked = false;
  }

  /**
   *  Loading data on demand
   */
  loadLazy(event) {
    setTimeout(() => {
      if (this.outputData) {
        this.mainTabularData = this.outputData.slice(event.first, (event.first + event.rows));
      }
    }, 250);
  }

  /**
  * Getting Seperator
  */
  getSeperator(separator, isFromTabChanged) {
    //If Tab Changed, get default sperator for data . '||' case is executed when tabular is clicked from gui(no sperator passed)
    if (isFromTabChanged || (separator == undefined || separator == ""))
      separator = "Space"; 		//this.serverTabs[this.seletedOutputTabIndex]["seperator"];

    //Getting Sperator of selected Tab
    var seprator = " ";
    if (separator == "Space")
      seprator = " ";
    else if (separator == "Tab")
      seprator = "\t";
    else if (separator == "Pipe")
      seprator = "|";
    else if (separator == "Dollar")
      seprator = "$";
    else if (separator == "Comma")
      seprator = ",";
    else if (separator == "Semicolon")
      seprator = ";";
    else if (separator == "Hash")
      seprator = "#";
    else if (separator == "Colon")
      seprator = ":";
    else if (separator == "Dash")
      seprator = "-";
    else if (separator == "Backslash")
      seprator = "/";
    else
      seprator = separator;

    return seprator;
  }

  //Navigate to Edit Mode
  editMode() {
    var editTab = { label: 'Command in File Editor', link: 'EditMode', id: "101" }
    this.tabNavigatorService.navigateTabAction(editTab);
    this.router.navigate(['/run-command-V1/EditMode']);
  }

  //Maximizing and Minimizing Output Screen
  goFullScreen() {
    //If for FullScreen, Else for minimize
    if (this.toggle) {
      for (var i = 0; i < this.serverTabs.length; i++) {
        if (document.getElementById("outputTextArea_" + i) != null)        //Check This
          document.getElementById("outputTextArea_" + i).style.height = "470px";
      }
      document.getElementById("outputMainBodyDiv").style.height = "630px";
      var outputDiv = document.querySelector('.panelOutputClass');
      outputDiv.classList.toggle('fullscreen');
      this.toggle = false;
    }
    else {
      //Iterating all tabs and inc height of each text area
      for (var i = 0; i < this.serverTabs.length; i++) {
        if (document.getElementById("outputTextArea_" + i) != null)      //Check This
        {
          //If user is not admin
          if (this.isAdminUser != "true")
            document.getElementById("outputTextArea_" + i).style.height = "210px";
          else
            document.getElementById("outputTextArea_" + i).style.height = "145px";
        }
      }

      //If user is not admin
      if (this.isAdminUser != "true")
        document.getElementById("outputMainBodyDiv").style.height = "230px";
      else
        document.getElementById("outputMainBodyDiv").style.height = "250px";

      var outputDiv = document.querySelector('.panelOutputClass');
      outputDiv.classList.remove("fullscreen");
      outputDiv.classList.toggle('exitfullscreen');
      this.toggle = true;
    }
  }

  /********************************* for table view full screen  *************************************/
  goFullScreenTableView() {
    //this.tabularViewFlag = true;
    if (this.toggle) {      // toggle true in case of full screen
      for (var i = 0; i < this.serverTabs.length; i++) {
        if (document.getElementById("runCmdTableView_" + i) != null) //Check This
        {
          this.tabularViewFlag = false;
          document.getElementById("runCmdTableView_" + i).style.height = "470px";
        }
      }
      document.getElementById("outputMainBodyDiv").style.height = "630px";

      var outputDiv = document.querySelector('.panelOutputClass');
      outputDiv.classList.toggle('fullscreen');

      this.toggle = false;
    }
    else {
      //Iterating all tabs and inc height of each text area
      for (var i = 0; i < this.serverTabs.length; i++) {
        if (document.getElementById("runCmdTableView_" + i) != null)      //Check This
        {
          this.tabularViewFlag = true;
          //If user is not admin
          if (this.isAdminUser != "true")
            document.getElementById("runCmdTableView_" + i).style.height = "210px";
          else
            document.getElementById("runCmdTableView_" + i).style.height = "145px";
        }
      }

      //If user is not admin
      if (this.isAdminUser != "true")
        document.getElementById("outputMainBodyDiv").style.height = "230px";
      else
        document.getElementById("outputMainBodyDiv").style.height = "250px";

      var outputDiv = document.querySelector('.panelOutputClass');
      outputDiv.classList.remove("fullscreen");
      outputDiv.classList.toggle('exitfullscreen');
      this.toggle = true;
    }
  }

  /**
   * Getting refreshed data for topology and added commands
   */
  refreshInfo() {
    this.tiers = []; this.grpName = []; this.cmdList = []; this.servers = [];
    this.tiers.push({ label: '-- Select Tier --', value: null });
    this.grpName.push({ label: '-- Select Group --', value: null });
    this.cmdList.push({ label: '-- Select Command --', value: null });
    this.selectedServer = [];
    this.selectedValues = [];
    this.text = null;

    this.selectedFilter = '-- Select Line Filter --';
    this.headOrTailNum = 1;

    if (this.saveOutputOnServer != null || this.saveOutputOnServer != undefined)
      this.saveOutputOnServer = false;

    //Closing all tabs
    if ((this.serverTabs != undefined || this.serverTabs != null) && this.serverTabs.length > 0)
      this.deleteTabs();

    //remove dynamic gui
    this.hideDynamicCommponent = false;

    //Getting Refreshed data
    this.runCmdInfoService();
  }

  //Run Command Info Services to get onLoad Data
  runCmdInfoService() {
    this.httpService.getVectorList().subscribe(res => this.getVectorListFromJSON(res));
    this.httpService.getCmdGrpList().subscribe(res => this.getGroupNameFromJSON(res));
  }

  downloadFile(type: string) {
    let format = type;

    var keys = Object.keys(this.outputData[Math.floor((this.outputData.length - 1) / 2)]);

    this.httpService.downloadRunCmdData(this.outputData, keys, format).subscribe((res) => {
      if (res['status'] == "true") {
        this.openDownloadReports(res['FileName']);
      }
      else {
        this.showError(res['Error']);
      }
    });
  }

  openDownloadReports(res) {
    window.open("//" + window.location.host + "/common/" + res);
  }

  eventHandler(e) {
    var valid = (e.which >= 48 && e.which <= 57) || (e.which >= 65 && e.which <= 90) || (e.which >= 97 && e.which <= 122);
    if (!valid) {
      e.preventDefault();
    }
  }
  openCreateTaskWindow() {
    this.runCommand(true);
  }

  openSchedulerMgmtkWindow() {
    this.displaySchedulerMgmt = true;
  }

  showInfo(detail) {
    // this.msgs = [];
    // this.msgs.push({ severity: 'info', summary: 'Info Message', detail: detail });
    this.messageService.add({ severity: 'info', summary: 'Info Message', detail: detail });
  }

  showError(detail) {
    // this.msgs = [];
    // this.msgs.push({ severity: 'error', summary: 'Error Message', detail: detail });
    this.messageService.add({ severity: 'error', summary: 'Error Message', detail: detail });
  }

  /*This method is to save the command output to the user machine*/
  saveTextAsFile(content: string) {
    var textToWrite = content;
    var textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' });
    var fileNameToSaveAs = "runCmdOutput.txt";

    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window['webkitURL'] != null) {
      // Chrome allows the link to be clicked
      // without actually adding it to the DOM.
      downloadLink.href = window['webkitURL'].createObjectURL(textFileAsBlob);
    }
    else {
      // Firefox requires the link to be added to the DOM
      // before it can be clicked.
      downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
    }
    downloadLink.click();
  }

  /* This method is used to clear filters every time */
  clearFilter(dropdown: Dropdown) {
    dropdown.resetFilter();
  }


  /**
   * View a Graphs
   */
  viewGraphs() {
    try {

      this.ref = this.dialogService.open(RunCmdGraphInfo, {
        height: 'auto',
        width: '1090px',
        header: 'Graph'
      });

      this.ref.onClose.subscribe(result => {
        console.log('closing pop up', result);
      });

    } catch (error) {
      console.error('érror in view a graphs -- ', error);
    }
  }

  /**
   * Get a Run Command Graph Data
   */
  getRunCommandGraphData() {
    try {


      /**
     * index checking - 0
     *  */
      if (this.xAxisIndex == 0) {
        // this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Please Select X Axis Column Value' }];
        this.showError("Please Select X Axis Column Value");
        return;
      }

      if (this.yAxisIndex == 0) {
        // this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Please Select Y Axis Column Value' }];
        this.showError("Please Select Y Axis Column Value");
        return;
      }

      /** check if max index greater than 2 */
      //  if (this.maxIndex > 2 && this.graphBasisIndex == 0) {
      //   this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Please Select Graph Basis Column Value'}];
      //   return;
      //  }


      /**
       * Multiple fields can not be same
       */

      if (this.xAxisIndex == this.yAxisIndex) {
        // this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Column Index can not be Same' }];
        this.showError("Column Index can not be Same");
        return;
      }

      // if (this.maxIndex > 2) {
      //   if (this.xAxisIndex == this.graphBasisIndex
      //     || this.yAxisIndex == this.graphBasisIndex) {
      //       this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Column Index can not be Same'}];
      //       return;
      //     }
      // }


      /**
       * Graph data save for the command Result
       */
      this.tabNavigatorService.graphData = this.cmdResult[this.seletedOutputTabIndex];


      /**Set a Graph Properties */
      this.tabNavigatorService.xAxisIndex = this.xAxisIndex;
      this.tabNavigatorService.yAxisIndex = this.yAxisIndex;

      if (this.maxIndex > 2)
        this.tabNavigatorService.graphIndex = this.graphBasisIndex;
      else
        this.tabNavigatorService.graphIndex = 0;

      this.tabNavigatorService.showTotal = this.isShowTotal;

      /**Set a Seprator */
      this.tabNavigatorService.seprator = this.getSeperator(this.viewDataDelimeterFilter, false);

      this.isShowRunCommand = false;

      /**
       * View Graph Info
       */
      this.viewGraphs();

    } catch (error) {
      console.error('error in getting a run command graph data ', error);
    }
  }


  /**
   * Open a Graph parameters window
   */
  graphParameters() {
    try {
      // Get a Graph Parameters

      this.graphBasisIndex = 0;
      this.yAxisIndex = 0;
      this.xAxisIndex = 0;
      this.isShowTotal = false;


      /**Get a Graph Paramters */
      let range: any;
      if (this.cmdResult[this.seletedOutputTabIndex] != undefined) {
        let getData = this.cmdResult[this.seletedOutputTabIndex].split('\n');
        range = getData[0].split(this.getSeperator(this.viewDataDelimeterFilter, false));
      }

      if (range != undefined) {
        this.maxIndex = range.length;

        /**validation for the data */
        if (this.maxIndex < 2) {
          this.showError('Data is not compatible to make graph');
          return;
        }

        let count = 0;

        // Set a Default Values
        this.graphIndexValues = [];

        // Set a Initial Default Value
        this.graphIndexValues.push(
          {
            'label': '-- Select Value --',
            'value': 0
          }
        )

        /**Check a Range Length Array */
        for (let i = 0; i < range.length; i++) {
          count++;

          if (range[i] != "" && range[i] != undefined) {
            this.graphIndexValues.push(
              {
                'label': range[i],
                'value': count
              }
            )
          }
        }
      }

      /**
       * Open a Dialog
       */
      this.isShowRunCommand = true;

      if (this.maxIndex <= 2)
        this.graphBasisIndex = 0;

    } catch (error) {
      console.error('Error in open a graph parameters window -- ', error);
    }
  }

  /** validate a Numeric fiels */
  validateQty(event): boolean {
    if ((event.charCode > 31) && ((event.charCode < 48 || event.charCode > 57)))
      return false;
    return true;
  }

}
