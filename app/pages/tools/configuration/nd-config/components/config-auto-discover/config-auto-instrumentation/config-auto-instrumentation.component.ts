import { Component, OnInit } from '@angular/core';
import { AutoIntrDTO, AutoInstrSummaryData } from '../../../interfaces/topology-info';
import { ConfigTopologyService } from '../../../services/config-topology.service';
import { ConfigHomeService } from '../../../services/config-home.service';
import { ConfigUtilityService } from '../../../services/config-utility.service';
import * as URL from '../../../constants/config-url-constant';
import { Router } from '@angular/router';
import { ROUTING_PATH } from '../../../constants/config-url-constant';
import { ConfigApplicationService } from '../../../services/config-application.service';



@Component({
  selector: 'app-config-auto-instrumentation',
  templateUrl: './config-auto-instrumentation.component.html'
  //   styleUrls: ['./config-auto-instrumentation.component.css']
})
export class ConfigAutoInstrumentationComponent implements OnInit {
  ROUTING_PATH = ROUTING_PATH;
  /* To show Active Auto instrumentation list */
  autoIntrActive: AutoIntrDTO[] = [];
  selectedAutoIntrActive: AutoIntrDTO;

  /* To show Complete auto instrumented list */
  autoIntrComplete: AutoIntrDTO[] = [];
  selectedAutoIntrComplete: AutoIntrDTO[];
  activeCount: string;
  isAutoPerm: boolean;
  isTestRun: boolean;
  className: string = "Auto Instrument Component";
  autoInstrumentationDialog : boolean;
  autoInstrSummaryData : AutoInstrSummaryData[] = [];
  sessionFileNameForAISummary:string;

  cols = [
    { field: 'instanceName', header: 'Instance Name' },
    { field: 'sessionName', header: 'Session Name' },
      { field: 'startTime', header: 'Start Time' },
      { field: 'duration', header: 'Duration(in sec)' },
      { field: 'endTime', header: 'Expected End Time' },
      { field: 'elapsedTime', header: 'Elapsed Time (in HH:MM:SS)'}
      
    ]; 

    column = [
      { field: 'instanceName', header: 'Instance Name' },
      { field: 'sessionName', header: 'Session Name' },
      { field: 'startTime', header: 'Start Time' },
      { field: 'endTime', header: 'End Time' },
      { field: 'duration', header: 'Duration(in sec)' }
      ];

  constructor(private configTopologyService: ConfigTopologyService, private router: Router, private configUtilityService: ConfigUtilityService,
    private configHomeService: ConfigHomeService, private configApplicationService: ConfigApplicationService
  ) { }

  ngOnInit() {
    let TrNumber = sessionStorage.getItem("isTrNumber");
    if (TrNumber == null || TrNumber == "null" || TrNumber == undefined || TrNumber == '')
      this.isTestRun = false;
    else
      this.isTestRun = true;

    this.isAutoPerm = +sessionStorage.getItem("AutoDiscoverAccess") == 4 ? true : false;
    let that = this;
    this.configTopologyService.updateAIDetails().subscribe(data => {
    this.checkForCompleteOrActive(data)
    })

  }

  //Updating Active and Complete tables
  checkForCompleteOrActive(data) {
    let autoIntrComplete = [];
    let autoIntrActive = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].status == "complete") {
        autoIntrComplete.push(data[i])
        autoIntrComplete = autoIntrComplete.sort()
        //  this.configHomeService.AIStartStopOpertationValueList(false);
      }
      else {
        autoIntrActive.push(data[i]);
        this.configHomeService.AIStartStopOpertationValueList(true);
      }
    }
    if (autoIntrActive.length == 0) {
      this.configHomeService.AIStartStopOpertationValueList(false);
    }
    this.autoIntrComplete = autoIntrComplete;
    this.autoIntrActive = autoIntrActive;
    this.activeCount = "(Active: " + this.autoIntrActive.length + ")"
  }

  //To stop auto-insrumentation
  stopInstrumentation(instanceName, sessionName, triggerScreen, agentType) {
    let that = this;
    console.log(this.className, "constructor", "this.configHomeService.trData.switch", this.configHomeService.trData);
    let strSetting = "";
    //Getting keywords data whose values are different from default values
    console.log(this.className, "constructor", "MAKING RUNTIME CHANGES this.nodeData");
    const url = `${URL.RUNTIME_CHANGE_AUTO_INSTR}`;
    if(triggerScreen == "ND ConfigUI AI")
      strSetting = "enableAutoInstrSession=0;"
    else
      strSetting = "enableDDAI=0;";
    //Merging configuration and instance name with #
    strSetting = strSetting + "#" + instanceName + "#" + agentType;

    //Saving settings in database
    this.configTopologyService.sendRTCTostopAutoInstr(url, strSetting, instanceName, sessionName, function (data) {
      if (data.length != 0 && data[0]['id']) {
        that.checkForCompleteOrActive(data);
        that.configHomeService.AIStartStopOpertationValueList(false);
      }
    })
    // }
  }

  openGUIForAutoInstrumentation(sessionFileName,AgentType) {
    let sessionFileNameWithAgentType : string;
    sessionFileNameWithAgentType = sessionFileName + "_AI.txt" + "#" + AgentType;

    this.configTopologyService.getSessionFileExistOrNot(sessionFileNameWithAgentType).subscribe(data => {
      var status = data.split("#");
      if (status[1] == "NotEmpty" && status[0] == "Empty") {
        this.router.navigate([ROUTING_PATH + '/auto-discover/auto-instrumentation', sessionFileNameWithAgentType]);
      }
      else if (status[0] == "Fail") {
        this.configUtilityService.errorMessage("Session file does not exists. Download it ");
        return;
      }
      else if (status[0] == "Empty") {
        this.configUtilityService.errorMessage("Session file is empty.");
        return;
      }
      else if (status[0] == "WrongPattern") {
        this.configUtilityService.errorMessage("Wrong Pattern: select another file");
        return;
      }
      sessionFileName = sessionFileName + "_AI.txt";
      this.router.navigate([ROUTING_PATH + '/auto-discover/auto-instrumentation', sessionFileNameWithAgentType]);
    });

  }

  getAIStatus(instance, session, triggerScreen) {
    //Combining instance and session name with #
    instance = instance + "#" + session
    if(triggerScreen == "ND ConfigUI AI"){
      var type = "AI"
    }
    else
    var type = "DD"
    this.configTopologyService.getAIStatus(instance,type).subscribe(data => {
      if (data == "complete") {
        this.configUtilityService.infoMessage("Auto-Instrumentation completed")
        this.configTopologyService.updateAIDetails().subscribe(data => {
          this.checkForCompleteOrActive(data);
          this.configHomeService.AIStartStopOpertationValueList(false);
        })
      }
      else {
        this.autoIntrActive[0].elapsedTime = data;
      }
    })
  }

  downloadFile(instance, session, agentType) {
    let data = instance + "|" + sessionStorage.getItem("isTrNumber") + "|" + session + "#" + agentType;
    this.configTopologyService.downloadFile(data).subscribe(data => {
    if (data.includes("Error"))
        this.configUtilityService.errorMessage("Error while downloading files")
      else
        this.configUtilityService.successMessage("File downloaded successfully");
    })
  }

  delete(sessionName, instanceName, agentType, instanceId) {
    let that = this;
    this.configTopologyService.deleteAI(sessionName + "#" + instanceName + "#" + agentType, instanceId).subscribe(data => {
      this.configUtilityService.infoMessage("Deleted successfully");
      this.configTopologyService.updateAIDetails().subscribe(data => {
        that.checkForCompleteOrActive(data)
      })
    })
  }

  redirectGuiAIToInstance() {
    let dcId;
    let testRunNo = sessionStorage.getItem("isTrNumber");
    if(testRunNo == "null")
    {
     this.configUtilityService.errorMessage("Run a Session to Start Auto Instrumentation");
     return;
    }

    if (sessionStorage.getItem("isSwitch") === 'false') 
    {
      this.configUtilityService.errorMessage("Please enable Session toggle button for AI");
      return;
    }

    if(this.configHomeService.getTestRunStatus)
     this.configTopologyService.getTopologyDCID(testRunNo).subscribe(data => {
      dcId = data;
     
      sessionStorage.setItem("showserverinstance", "true");
      this.configApplicationService.getApplicationList().subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].dcId.toString() == dcId)
          {
            this.configApplicationService.applicationNameObserver(data[i].appName)
            this.router.navigate([ROUTING_PATH + '/tree-main/' + dcId]);
          }
        }
      });
    })
  }
  /**
   * autoInstrSummary method is used for Auto-Instrumentation Summary
   * It will further invoke loadAutoInstrSummaryData method which retrieve the data from
   * server and show on GUI
   * @param sessionFileName 
   * @param AgentType 
   */
  autoInstrSummary(sessionFileName,AgentType){
      this.sessionFileNameForAISummary = sessionFileName;
      let sessionFileNameWithAgentType : string;
      sessionFileNameWithAgentType = sessionFileName + "_AI.txt" + "#" + AgentType;
      this.configTopologyService.getSessionFileExistOrNot(sessionFileNameWithAgentType).subscribe(data => {
        var status = data.split("#");
        if (status[0] == "Fail") {
          this.configUtilityService.errorMessage("Session file does not exists. Download it ");
          return;
        }
        else if (status[0] == "Empty") {
          this.configUtilityService.errorMessage("Session file is empty.");
          return;
        }
        else if (status[0] == "WrongPattern") {
          this.configUtilityService.errorMessage("Wrong Pattern: select another file");
          return;
        }
        else{
             this.loadAutoInstrSummaryData(sessionFileNameWithAgentType);
        }
      });
  }
  

  loadAutoInstrSummaryData(sessionFileNameWithAgentType){
    this.configTopologyService.getAutoInstrumentationData(sessionFileNameWithAgentType).subscribe(data => {
          if(data == undefined || data.length == 0){
             this.configUtilityService.errorMessage("File is empty");
             return;
          }
           this.autoInstrumentationDialog = true;
           this.autoInstrSummaryData =  data;
    })
  }
}
