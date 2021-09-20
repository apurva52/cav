
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SelectItem } from 'primeng/primeng';

import { TopologyInfo, TierInfo, InstanceInfo, AutoInstrSettings, AutoIntrDTO, DDAIInfo } from '../../../../pages/tools/configuration/nd-config/interfaces/topology-info';
import * as URL from '../../../../pages/tools/configuration/nd-config/constants/config-url-constant';
import { ConfigUiUtility } from '../../../../pages/tools/configuration/nd-config/utils/config-utility';
import { ConfigProfileService } from '../../../../pages/tools/configuration/nd-config/services/config-profile.service';
import { ConfigHomeService } from '../../../../pages/tools/configuration/nd-config/services/config-home.service';
import { ConfigTopologyService } from '../../../../pages/tools/configuration/nd-config/services/config-topology.service';
import { ConfigUtilityService } from '../../../../pages/tools/configuration/nd-config/services/config-utility.service';
import { ConfigKeywordsService } from '../../../../pages/tools/configuration/nd-config/services/config-keywords.service';

@Component({
    selector: 'app-dynamic-diagnostics',
    templateUrl: './dynamic-diagnostics.component.html',
    styleUrls: ['./dynamic-diagnostics.component.css']
})
export class DynamicDiagnosticsComponent implements OnInit {
    @Output() topologyData: EventEmitter<Object> = new EventEmitter();
    @Output() closeAIDDGui: EventEmitter<any> = new EventEmitter();
    @Output() resultAfterStart: EventEmitter<String> = new EventEmitter<String>();
    @Input() passAIDDSettings: string;
    @Input() passAIDDserverEntity: ServerInfo;
    className: string = "Dynamic Diagnostics Component";
    //  AutoInstrument Object creation
    autoInstrObj: AutoInstrSettings;
    autoInstrDto: AutoIntrDTO;
    ddAIData: DDAIInfo;

    retainchanges: boolean = true

    currentInstanceName: string;
    currentInsId: number;
    currentInsType: string;
    other: string = "";

    t_s_i_name: string = "";
    insName: string = ""; //to store tier, server and instacne name with >
    sessionName: string = "";

    //Dialog for auto instrumenatation configuration
    showInstr: boolean = false;

    serverId: any;
    // topologyData: any[];
    topologyEntity: TopologyInfo;
    tierEntity: TierInfo;
    serverEntity: ServerInfo;
    instanceEntity: InstanceInfo;
    topologyName: string;
    tierName: string;
    serverName: string;
    profileId: number;
    saveChanges: boolean = true;
    deleteFromServer: boolean = true;

    AIDDGUI: number;
    btNameList: SelectItem[];

    DDOrAIGUI: string;
    accordionTab: number;
    agentTypes: string;
    trStatus:string;
    topoName: string;
    instanceFileId: string;
    testRunNo:string;

    enableAutoInstrMethodLevel: boolean = false;
    ddAiCount1: number = 35;
    ddAiCount2: number[] = [35, 60];
    ddAiCount3: number[] = [60, 85];

    AICount1: number = 35;
    AICount2: number[] = [35, 60];
    AICount3: number[] = [60, 85];
    tabIndex: number = 0;

    constructor(private configKeywordsService: ConfigKeywordsService, private configTopologyService: ConfigTopologyService, private configProfileService: ConfigProfileService, private configHomeService: ConfigHomeService, private configUtilityService: ConfigUtilityService) {
        console.log("AI/DD SEttings ====> ");
    }
    ngOnInit() {
        console.log("AI/DD SEttings ====> ");
        this.AIDDGUI = 0;
        this.DDOrAIGUI = this.passAIDDSettings[8];

        this.serverEntity = this.passAIDDserverEntity;
        this.profileId = +this.passAIDDSettings[6];
        this.serverId = this.passAIDDSettings[5];
        this.serverName = this.passAIDDSettings[4];
        this.tierName = this.passAIDDSettings[3];
        this.trStatus = this.passAIDDSettings[9];
        this.testRunNo = this.passAIDDSettings[10];
        
        this.loadAIDDGUI(this.passAIDDSettings[0], this.passAIDDSettings[1], this.passAIDDSettings[2]);
    }
    // this method is for AI and GUI Setting 
    loadAIDDGUI(name, id, type) {
        this.agentTypes = type;
        this.autoInstrObj = new AutoInstrSettings();
        this.autoInstrDto = new AutoIntrDTO();
        this.ddAIData = new DDAIInfo();
    
        //Check if agent is Java or DotNet, change their default values
        if (this.agentTypes != "Java") {
            this.ddAIData.instrPct = 60;
            this.ddAIData.removeInstrPct = 80;
	    this.ddAIData.stackDepthFilter = 2;
        }
        if (this.DDOrAIGUI != "ND ConfigUI") {
           // this.other = this.passAIDDSettings[7];
            this.ddAIData.bt = this.passAIDDSettings[7];
        }

        let key = ['ALL'];
        this.configKeywordsService.fetchBtNames(this.profileId).subscribe(data => {
            if (data.length > 0) {
                key = key.concat(data)
                
                //Remove duplicate bt names
                key = Array.from(new Set(key))

                //Remove - from bt names array
                if(key.indexOf("-") != -1)
                    key.splice(key.indexOf("-"), 1)
            
            }
	    key.push('Sequential')
            key.push('Custom')
            this.btNameList = ConfigUiUtility.createListWithKeyValue(key, key);
            this.currentInsId = id;
            this.currentInsType = type;
            this.currentInstanceName = name;
            this.autoInstrDto.appName = sessionStorage.getItem("selectedApplicationName");
            //Getting data of settings from database if user has already saved this instance settings
            let instanceName = this.splitTierServInsName(this.currentInstanceName);
            this.insName = this.createTierServInsName(this.currentInstanceName);
            this.autoInstrDto.sessionName = instanceName;
            this.autoInstrDto.instanceId = this.currentInsId;
            this.autoInstrDto.type = this.currentInsType;

            if (this.DDOrAIGUI == "ND ConfigUI")
                this.ddAIData.sessionName = this.tierName + "_" + "ALL";
            else
                this.ddAIData.sessionName = this.tierName + "_" + this.passAIDDSettings[7];

            this.ddAIData.agentType = type;
            this.configTopologyService.getAutoInstr(this.autoInstrDto.appName, instanceName, this.sessionName).subscribe(data => {
	        //Get settings from data if not null else create a new object
                if (data != "")
                    this.splitSettings(data);
                // this.showInstr = true;
                this.configKeywordsService.getTopoName(this.testRunNo, this.passAIDDSettings[0]).subscribe(data => {
                    let arr = data.split("#");
                    this.topoName = arr[0];
                    this.instanceFileId = arr[1];
                    if(this.DDOrAIGUI == "DDR"){
                        this.currentInsId = +this.instanceFileId;
                        this.autoInstrDto.instanceId = this.currentInsId;
                } 
                })
            })
        })
    }

    /** To split the settings and assign to dialog
  * enableAutoInstrSession=1;minStackDepthAutoInstrSession=10;autoInstrTraceLevel=1;autoInstrSampleThreshold=120;
  * autoInstrPct=60;autoDeInstrPct=80;autoInstrMapSize=100000;autoInstrMaxAvgDuration=2;autoInstrClassWeight=10;
  * autoInstrSessionDuration=1800;autoInstrRetainChanges=0;blackListForDebugSession=NA;
  */
    splitSettings(data) {
        let arr = data.split("=");
        if (arr.length > 12) {
            //For enableAutoInstrSession
            if (arr[1].substring(0, arr[1].lastIndexOf(";")) == 1)
                this.autoInstrObj.enableAutoInstrSession = true;
            else
                this.autoInstrObj.enableAutoInstrSession = false;

            //For minStackDepthAutoInstrSession
            this.autoInstrObj.minStackDepthAutoInstrSession = arr[2].substring(0, arr[2].lastIndexOf(";"))

            //For autoInstrTraceLevel
            this.autoInstrObj.autoInstrTraceLevel = arr[3].substring(0, arr[3].lastIndexOf(";"))

            //For autoInstrSampleThreshold
            this.autoInstrObj.autoInstrSampleThreshold = arr[4].substring(0, arr[4].lastIndexOf(";"))

            //For autoInstrPct
            this.autoInstrObj.autoInstrPct = arr[5].substring(0, arr[5].lastIndexOf(";"))

            //For autoDeInstrPct
            this.autoInstrObj.autoDeInstrPct = arr[6].substring(0, arr[6].lastIndexOf(";"))

            //For autoInstrMapSize
            this.autoInstrObj.autoInstrMapSize = arr[7].substring(0, arr[7].lastIndexOf(";"))

            //For autoInstrMaxAvgDuration
            this.autoInstrObj.autoInstrMaxAvgDuration = arr[8].substring(0, arr[8].lastIndexOf(";"))

            //For autoInstrClassWeight
            this.autoInstrObj.autoInstrClassWeight = arr[9].substring(0, arr[9].lastIndexOf(";"))

            //For autoInstrSessionDuration
            this.autoInstrObj.autoInstrSessionDuration = arr[10].substring(0, arr[10].lastIndexOf(";"));

            //For autoInstrRetainChanges
            if (arr[11].substring(0, arr[11].lastIndexOf(";")) == 1)
                this.autoInstrObj.autoInstrRetainChanges = false;
            else
                this.autoInstrObj.autoInstrRetainChanges = true;

            //For blackListForDebugSession
            if (arr[12].substring(0, arr[12].lastIndexOf(";")) == "Path")
                this.autoInstrObj.blackListForDebugSession = true;
            else
                this.autoInstrObj.blackListForDebugSession = false;
		
	    if (this.agentTypes == 'Java') {
                if (arr[13] == "0") {
                    this.autoInstrObj.enableAutoInstrMethodLevel = false;
                } else {
                    this.autoInstrObj.enableAutoInstrMethodLevel = true;
                }
            }
        }
    }

    //To apply auto instrumentation
    applyAutoInstr() {
	if(this.autoInstrObj['enableAutoInstrMethodLevel']) {
            if(this.autoInstrObj['count1'] + this.autoInstrObj['count2'] + this.autoInstrObj['count3'] > 100) {
                this.configUtilityService.errorMessage("Sum of the method % level fields of AI method caputring should not be greater than 100.");
                return;
            } else if(this.autoInstrObj['count1'] + this.autoInstrObj['count2'] + this.autoInstrObj['count3'] == 0) {
                this.configUtilityService.errorMessage("Sum of the method % level fields of AI method caputring should not be equal to 0.");
                return;
            }
        }
        //Setting Tier>Server>Instane in instance name
        this.autoInstrDto.instanceName = this.createTierServInsName(this.currentInstanceName)

        //Merging all the settings in the format( K1=Val1;K2=Val2;K3=Val3... )
        this.autoInstrDto.configuration = this.createSettings(this.autoInstrObj);

        this.autoInstrDto.appName = sessionStorage.getItem("selectedApplicationName");
        this.sessionName = this.autoInstrDto.sessionName

        this.autoInstrDto.duration = this.autoInstrObj.autoInstrSessionDuration.toString()

	if(!this.autoInstrObj['enableAutoInstrMethodLevel']) {
            this.AICount1 = 35;
            this.AICount2 = [35, 60];
            this.AICount3 = [60, 85];
	    this.autoInstrObj.count1 = 35;
            this.autoInstrObj.count2 = 25;
            this.autoInstrObj.count3 = 25;
        }

        this.startAutoInstrumentation(this.autoInstrObj, this.autoInstrDto, "AI");
    }

    //When test is running the send RTC 
    startAutoInstrumentation(data, autoInstrDto, type) {
        let that = this
        console.log(this.className, "constructor", "this.configHomeService.trData.switch", this.configHomeService.trData);
        console.log(this.className, "constructor", "this.configProfileService.nodeData", this.configProfileService.nodeData);

        //if test is offline mode, return (no run time changes)
        if (this.trStatus.toLowerCase() != 'running') {
            console.log(this.className, "constructor", "No NO RUN TIme Changes");
            return;
        }
        else {
            //Getting keywords data whose values are different from default values
            let strSetting = this.getSettingForRTC(data);
            console.log(this.className, "constructor", "MAKING RUNTIME CHANGES this.nodeData", this.configProfileService.nodeData);
            const url = `${URL.RUNTIME_CHANGE_AUTO_INSTR}`;

            //Merging configuration and instance name with #
            strSetting = strSetting + "#" + this.insName + "#" + this.agentTypes;

            if (type == "AI") {
                //Saving settings in database
                let success = this.configTopologyService.sendRTCAutoInstr(url, strSetting, autoInstrDto, function (success) {
                    //Check for successful RTC connection
                    if (success == "success") {
                        that.configTopologyService.updateAIEnable(that.currentInsId, true, "AI", that.topoName).subscribe(data => {
                            that.configTopologyService.getInstanceDetail(that.serverId, that.serverEntity, that.topoName).subscribe(data => {
                                that.topologyData.emit(data);
                            });
                            that.configHomeService.getAIStartStopOperationValue(true);
                        })
                    }
                })
            }
            else {
                this.configTopologyService.applyDDAI(data, this.currentInsId).subscribe(res => {
                    //Check for successful RTC connection
                    if (res.includes("result=Ok")) {
                        this.configUtilityService.infoMessage("Auto Instrumentation started");
                        this.resultAfterStart.emit("Auto Instrumentation started");
                        that.configTopologyService.updateAIEnable(that.currentInsId, true, "DD", this.topoName).subscribe(data => {
                            that.configTopologyService.getInstanceDetail(that.serverId, that.serverEntity, that.topoName).subscribe(data => {
                                that.topologyData.emit(data);
                            });
                            that.configHomeService.getAIStartStopOperationValue(true);
                        })
                    }
                    else {
                        var msg = res.toString();
                        this.resultAfterStart.emit("Could not start:" + msg.substring(msg.lastIndexOf('Error') + 5, msg.length));
                        this.configUtilityService.errorMessage("Could not start:" + msg.substring(msg.lastIndexOf('Error') + 5, msg.length))
                        this.closeAIDDGui.emit(false);
                        return
                    }
                })
            }
        }
    }

    applyDDAI() {
	if(this.enableAutoInstrMethodLevel) {
            if(this.ddAIData['count1'] + this.ddAIData['count2'] + this.ddAIData['count3'] > 100) {
                this.configUtilityService.errorMessage("Sum of the method % level fields of DD method capturing should not be greater than 100.");
                return;
            } else if(this.ddAIData['count1'] + this.ddAIData['count2'] + this.ddAIData['count3'] == 0) {
                this.configUtilityService.errorMessage("Sum of the method % level fields of DD method capturing should not be equal to 0.");
                return;
            }
        }
        // this.ddAIData.sessionName = this.splitTierServInsName(this.currentInstanceName)

        //Assigning - to cinfiguration as there is no need to add these settings in database
        this.autoInstrDto.configuration = "-"
        this.ddAIData.tier = this.tierName
        this.ddAIData.server = this.serverName
        this.ddAIData.instance = this.currentInstanceName
        this.ddAIData.testRun = +sessionStorage.getItem("isTrNumber");
        this.autoInstrDto.appName = sessionStorage.getItem("selectedApplicationName");
        this.sessionName = this.autoInstrDto.sessionName
        if (this.ddAIData.bt == 'Custom') {
            this.ddAIData.bt = this.other
        }
        if (this.retainchanges == true)
            this.ddAIData.retainchanges = 0
        else
            this.ddAIData.retainchanges = 1

        if (this.saveChanges == true)
            this.ddAIData.saveAppliedChanges = 1
        else
            this.ddAIData.saveAppliedChanges = 0

        if (this.deleteFromServer == true)
            this.ddAIData.deleteFromServer = 1
        else
            this.ddAIData.deleteFromServer = 0

        this.autoInstrDto.duration = this.ddAIData.duration.toString();

	if (this.agentTypes == 'Java') {
            if (this.enableAutoInstrMethodLevel == true) {
                this.ddAIData.enableAutoInstrMethodLevel = 1;
            } else {
                this.ddAIData.enableAutoInstrMethodLevel = 0;
		this.ddAiCount1 = 35;
                this.ddAiCount2 = [35, 60];
                this.ddAiCount3 = [60, 85];
		this.ddAIData.count1 = 35;
                this.ddAIData.count2 = 25;
                this.ddAIData.count3 = 25;
            }
        }

        this.startAutoInstrumentation(this.ddAIData, this.autoInstrDto, "DD");
    }

    //Reset the values of auto instrumentation settings to default
    resetToDefault() {
        this.autoInstrObj = new AutoInstrSettings();
        this.autoInstrDto = new AutoIntrDTO();
        this.ddAIData = new DDAIInfo();
	this.autoInstrDto.type = this.passAIDDSettings[2];
        //Check if agent is Java or DotNet, change their default values
        
	if(this.agentTypes == 'Java') {
	    if(!this.autoInstrObj['enableAutoInstrMethodLevel']) {
                this.AICount1 = 35;
                this.AICount2 = [35, 60];
                this.AICount3 = [60, 85];
		this.autoInstrObj.count1 = 35;
                this.autoInstrObj.count2 = 25;
                this.autoInstrObj.count3 = 25;
            }
            this.enableAutoInstrMethodLevel = false;
            this.ddAIData.enableAutoInstrMethodLevel = 0;
            this.ddAiCount1 = 35;
            this.ddAiCount2 = [35, 60];
            this.ddAiCount3 = [60, 85];
	    this.ddAIData.count1 = 35;
            this.ddAIData.count2 = 25;
            this.ddAIData.count3 = 25;
        }

	if (this.agentTypes != "Java") {
            this.ddAIData.instrPct = 60;
            this.ddAIData.removeInstrPct = 80;
            this.ddAIData.stackDepthFilter = 2;
        }
        this.autoInstrDto.sessionName = this.t_s_i_name;
        
        if (this.DDOrAIGUI != "ND ConfigUI")
        {
         this.ddAIData.bt = this.passAIDDSettings[7];
         this.ddAIData.sessionName = this.tierName + "_" + this.passAIDDSettings[7];
        }
        else
          this.ddAIData.sessionName = this.tierName + "_" + this.ddAIData.bt;
    }

    // Create Tier_Server_Instance name
    splitTierServInsName(instanceName) {
        this.t_s_i_name = this.tierName + "_" + this.serverName + "_" + instanceName
        this.sessionName = this.t_s_i_name
        return this.t_s_i_name;
    }

    // Create Tier>Server>Instance name
    createTierServInsName(instanceName) {
        let name = this.tierName + ">" + this.serverName + ">" + instanceName
        return name;
    }


    //Create auto instrumentation settings by merging them
    createSettings(data) {
        let setting;
        if (data.autoInstrRetainChanges == true) {
            if (data.blackListForDebugSession == true)
                if(this.agentTypes == 'PHP' || this.agentTypes == 'Php' || this.agentTypes == 'php')
                    setting = "enableAutoInstrSession=1" + ";autoInstrTraceLevel=" + data.autoInstrTraceLevel + ";autoInstrPct=" + data.autoInstrPctPhp + ";autoDeInstrPct=" + data.autoDeInstrPctPhp + ";autoInstrMapSize=" + data.autoInstrMapSize
                    + ";autoInstrMaxAvgDuration=" + data.autoInstrMaxAvgDuration + ";autoInstrSessionDuration=" + data.autoInstrSessionDuration + ";autoInstrRetainChanges=0;blackListForDebugSession=Path";
                else
                    setting = "enableAutoInstrSession=1;minStackDepthAutoInstrSession=" + data.minStackDepthAutoInstrSession
                    + ";autoInstrTraceLevel=" + data.autoInstrTraceLevel + ";autoInstrSampleThreshold=" + data.autoInstrSampleThreshold
                    + ";autoInstrPct=" + data.autoInstrPct + ";autoDeInstrPct=" + data.autoDeInstrPct + ";autoInstrMapSize=" + data.autoInstrMapSize
                    + ";autoInstrMaxAvgDuration=" + data.autoInstrMaxAvgDuration + ";autoInstrClassWeight=" + data.autoInstrClassWeight
                    + ";autoInstrSessionDuration=" + data.autoInstrSessionDuration + ";autoInstrRetainChanges=0;blackListForDebugSession=Path";
            else
                if(this.agentTypes == 'PHP' || this.agentTypes == 'Php' || this.agentTypes == 'php')
                    setting = "enableAutoInstrSession=1" + ";autoInstrTraceLevel=" + data.autoInstrTraceLevel + ";autoInstrPct=" + data.autoInstrPctPhp + ";autoDeInstrPct=" + data.autoDeInstrPctPhp + ";autoInstrMapSize=" + data.autoInstrMapSize
                    + ";autoInstrMaxAvgDuration=" + data.autoInstrMaxAvgDuration + ";autoInstrSessionDuration=" + data.autoInstrSessionDuration + ";autoInstrRetainChanges=0";
                else
                    setting = "enableAutoInstrSession=1;minStackDepthAutoInstrSession=" + data.minStackDepthAutoInstrSession
                    + ";autoInstrTraceLevel=" + data.autoInstrTraceLevel + ";autoInstrSampleThreshold=" + data.autoInstrSampleThreshold
                    + ";autoInstrPct=" + data.autoInstrPct + ";autoDeInstrPct=" + data.autoDeInstrPct + ";autoInstrMapSize=" + data.autoInstrMapSize
                    + ";autoInstrMaxAvgDuration=" + data.autoInstrMaxAvgDuration + ";autoInstrClassWeight=" + data.autoInstrClassWeight
                    + ";autoInstrSessionDuration=" + data.autoInstrSessionDuration + ";autoInstrRetainChanges=0";
        }
        else {
            if (data.blackListForDebugSession == true)
                if(this.agentTypes == 'PHP' || this.agentTypes == 'Php' || this.agentTypes == 'php')
                    setting = "enableAutoInstrSession=1" + ";autoInstrTraceLevel=" + data.autoInstrTraceLevel + ";autoInstrPct=" + data.autoInstrPctPhp + ";autoDeInstrPct=" + data.autoDeInstrPctPhp + ";autoInstrMapSize=" + data.autoInstrMapSize
                    + ";autoInstrMaxAvgDuration=" + data.autoInstrMaxAvgDuration + ";autoInstrSessionDuration=" + data.autoInstrSessionDuration + ";autoInstrRetainChanges=1;blackListForDebugSession=Path";
                else
                    setting = "enableAutoInstrSession=1;minStackDepthAutoInstrSession=" + data.minStackDepthAutoInstrSession
                    + ";autoInstrTraceLevel=" + data.autoInstrTraceLevel + ";autoInstrSampleThreshold=" + data.autoInstrSampleThreshold
                    + ";autoInstrPct=" + data.autoInstrPct + ";autoDeInstrPct=" + data.autoDeInstrPct + ";autoInstrMapSize=" + data.autoInstrMapSize
                    + ";autoInstrMaxAvgDuration=" + data.autoInstrMaxAvgDuration + ";autoInstrClassWeight=" + data.autoInstrClassWeight
                    + ";autoInstrSessionDuration=" + data.autoInstrSessionDuration + ";autoInstrRetainChanges=1;blackListForDebugSession=Path";
            else
                if(this.agentTypes == 'PHP' || this.agentTypes == 'Php' || this.agentTypes == 'php')
                    setting = "enableAutoInstrSession=1" + ";autoInstrTraceLevel=" + data.autoInstrTraceLevel + ";autoInstrPct=" + data.autoInstrPctPhp + ";autoDeInstrPct=" + data.autoDeInstrPctPhp + ";autoInstrMapSize=" + data.autoInstrMapSize
                    + ";autoInstrMaxAvgDuration=" + data.autoInstrMaxAvgDuration + ";autoInstrSessionDuration=" + data.autoInstrSessionDuration + ";autoInstrRetainChanges=1";
                else
                    setting = "enableAutoInstrSession=1;minStackDepthAutoInstrSession=" + data.minStackDepthAutoInstrSession
                    + ";autoInstrTraceLevel=" + data.autoInstrTraceLevel + ";autoInstrSampleThreshold=" + data.autoInstrSampleThreshold
                    + ";autoInstrPct=" + data.autoInstrPct + ";autoDeInstrPct=" + data.autoDeInstrPct + ";autoInstrMapSize=" + data.autoInstrMapSize
                    + ";autoInstrMaxAvgDuration=" + data.autoInstrMaxAvgDuration + ";autoInstrClassWeight=" + data.autoInstrClassWeight
                    + ";autoInstrSessionDuration=" + data.autoInstrSessionDuration + ";autoInstrRetainChanges=1";

        }
	
	if (this.agentTypes == 'Java') {
		if (data.enableAutoInstrMethodLevel == true) {
	            setting = setting + ";autoInstrMethodLevel=1%20" + data.count1 + "%20" + data.count2 + "%20" + data.count3;
        	} else {
		    setting = setting + ";autoInstrMethodLevel=0%2035%2025%2025";
      		}
	}

        return setting;

    }

    //Getting the settings value which are different from default values
    getSettingForRTC(data) {
        let strSetting = "";
        //Storing enableAutoInstrSession keyword value as it will always be different from default value i.e., 0
        strSetting = "enableAutoInstrSession=1%20" + this.sessionName;

        //Comparing all the setting's value with their default value, if they dont match then append in strSetting variable
        if(this.agentTypes == 'Java' || this.agentTypes == 'Dot Net' || this.agentTypes == 'DotNet')
            if (data.minStackDepthAutoInstrSession != 10)
                strSetting = strSetting + ";minStackDepthAutoInstrSession=" + data.minStackDepthAutoInstrSession

        if (data.autoInstrTraceLevel != 1)
            strSetting = strSetting + ";autoInstrTraceLevel=" + data.autoInstrTraceLevel

        if(this.agentTypes == 'Java' || this.agentTypes == 'Dot Net' || this.agentTypes == 'DotNet')
            if (data.autoInstrSampleThreshold != 120)
                strSetting = strSetting + ";autoInstrSampleThreshold=" + data.autoInstrSampleThreshold

        if(this.agentTypes == 'Java' || this.agentTypes == 'Dot Net' || this.agentTypes == 'DotNet')
            if (data.autoInstrPct != 60)
                strSetting = strSetting + ";autoInstrPct=" + data.autoInstrPct
        
        if(this.agentTypes == 'Php' || this.agentTypes == 'php' || this.agentTypes == 'php')
        {
            if (data.autoInstrPctPhp != 80)
            {
                strSetting = strSetting + ";autoInstrPct=" + data.autoInstrPctPhp
            }
        }

        if(this.agentTypes == 'Java' || this.agentTypes == 'Dot Net' || this.agentTypes == 'DotNet')
            if (data.autoDeInstrPct != 80)
                strSetting = strSetting + ";autoDeInstrPct=" + data.autoDeInstrPct

        if(this.agentTypes == 'Php' || this.agentTypes == 'php' || this.agentTypes == 'php')
        {
            if (data.autoDeInstrPctPhp != 60)
                strSetting = strSetting + ";autoDeInstrPct=" + data.autoDeInstrPctPhp
        }

        if (data.autoInstrMapSize != 100000)
            strSetting = strSetting + ";autoInstrMapSize=" + data.autoInstrMapSize

        if (data.autoInstrMaxAvgDuration != 2)
            strSetting = strSetting + ";autoInstrMaxAvgDuration=" + data.autoInstrMaxAvgDuration

        if(this.agentTypes == 'Java' || this.agentTypes == 'Dot Net' || this.agentTypes == 'DotNet')
            if (data.autoInstrClassWeight != 10)
                strSetting = strSetting + ";autoInstrClassWeight=" + data.autoInstrClassWeight

        if (data.autoInstrSessionDuration != 1800)
            strSetting = strSetting + ";autoInstrSessionDuration=" + data.autoInstrSessionDuration

        if (data.autoInstrRetainChanges != true)
            strSetting = strSetting + ";autoInstrRetainChanges=1"

        if (data.blackListForDebugSession == true)
            strSetting = strSetting + ";blackListForDebugSession=Path"

        // else
        //   strSetting = strSetting + ";blackListForDebugSession=NA"

	if (data.enableAutoInstrMethodLevel == true) {
             strSetting = strSetting + ";autoInstrMethodLevel=1%20" + data.count1 + "%20" + data.count2 + "%20" + data.count3;
        }

        return strSetting;

    }

    createSessionName(bt) {
        if (bt != 'Custom') {
            this.ddAIData.sessionName = this.tierName + "_" + bt
        }
        else
            this.ddAIData.sessionName = this.tierName + "_" + this.other
    }

    //Close AI and DD Dialog 
    closeAutoInstrDDDialog() {
        this.closeAIDDGui.emit(false);
    }

    onTabOpen(e) {
        if (e.index == 0)
            this.accordionTab = 1;

        console.log("Accordion Open Event ====> ", e);
        this.tabIndex = e.index;
    }
    onTabClose(e) {
        if (e.index == 0)
            this.accordionTab = 0;
        
        console.log("Accordion close Event ====> ", e);
        this.tabIndex = e.index;
    }
    
    getDDSlider1Value(value) {
	//For DD Sliders
        if(this.enableAutoInstrMethodLevel) {
            let temp1 = this.ddAiCount2[1];
            let temp2 = this.ddAiCount3[1];
            this.ddAiCount2 = [];
            this.ddAiCount3 = [];
            this.ddAiCount2[1] = temp1;
            this.ddAiCount3[1] = temp2;
	    //Set slider 2 and slider 3's value to 100 if slider 1's value is 100. 
            if(value.value == 100) {
                this.ddAiCount2 = [100, 100];
                this.ddAIData['count2'] = 0;
                this.ddAiCount3 = [100, 100];
                this.ddAIData['count3'] = 0;
            } else {
		//Slider 1's value will be set to slider 2's initial value.
                this.ddAiCount2[0] = value.value;
                if(this.ddAiCount2[0] > this.ddAiCount2[1]) {
		    //If slider 1's value == slider 2's final value, then slider 2's final value will increase by 25.
                    this.ddAiCount2[1] = this.ddAiCount2[0] +25;
                    if(this.ddAiCount2[1] > 100) {
                        this.ddAiCount2 = [this.ddAiCount2[0], 100];
                        this.ddAIData['count2'] = this.ddAiCount2[1] - this.ddAiCount2[0];
                    }
                }
		//Slider 2's final value will be set to slider 3's initial value.
                this.ddAiCount3[0] = this.ddAiCount2[1];
                if(this.ddAiCount3[0] > this.ddAiCount3[1]) {
		    //If slider 2's final value == slider 3's final value, then slider 3's final value will increase by 25.
                    this.ddAiCount3[1] = this.ddAiCount3[0]+25;
                    if(this.ddAiCount3[0] > 100) {
                        this.ddAiCount3 = [100, 100];
                    } else if(this.ddAiCount3[1] > 100) {
                        this.ddAiCount3 = [this.ddAiCount3[0], 100];
                        this.ddAIData['count3'] = this.ddAiCount3[1] - this.ddAiCount3[0];
                    }
                }
            }
	    //Setting the Slider data into DTO.
            this.ddAIData['count1'] = this.ddAiCount1;
            this.ddAIData['count2'] = this.ddAiCount2[1] - this.ddAiCount2[0];
            this.ddAIData['count3'] = this.ddAiCount3[1] - this.ddAiCount3[0];
        }
	//For AI Sliders
	if(this.autoInstrObj['enableAutoInstrMethodLevel']) {
            let aiTemp1 = this.AICount2[1];
            let aiTemp2 = this.AICount3[1];
            this.AICount2 = [];
            this.AICount3 = [];
            this.AICount2[1] = aiTemp1;
            this.AICount3[1] = aiTemp2;
	    //Set slider 2 and slider 3's value to 100 if slider 1's value is 100.
            if(value.value == 100) {
                this.AICount2=[100, 100];
                this.AICount3=[100, 100];
            }else {
		//Slider 1's value will be set to slider 2's initial value.
                this.AICount2[0] = value.value;
                if(this.AICount2[0] > this.AICount2[1]) {
		    //If slider 1's value == slider 2's final value, then slider 2's final value will increase by 25.
                    this.AICount2[1] = this.AICount2[0] + 25;
                    if(this.AICount2[0] > 100) {
                        this.AICount2 = [100, 100];
                    } else if(this.AICount2[1] > 100) {
                        this.AICount2 = [this.AICount2[0], 100];
                    }
                }
		//Slider 2's final value will be set to slider 3's initial value.
                this.AICount3[0] = this.AICount2[1];
                if(this.AICount3[0] > this.AICount3[1]) {
		    //If slider 2's final value == slider 3's final value, then slider 3's final value will increase by 25.
                    this.AICount3[1] = this.AICount3[0] + 25;
                    if(this.AICount3[0] > 100) {
                        this.AICount3 =[100, 100];
                    } else if(this.AICount3[1] > 100) {
                        this.AICount3 = [this.AICount3[0], 100];
                    }
                }
            }
	    //Setting the slider values into AI Dto.
            this.autoInstrObj['count1'] = this.AICount1;
            this.autoInstrObj['count2'] = this.AICount2[1] - this.AICount2[0];
            this.autoInstrObj['count3'] = this.AICount3[1] - this.AICount3[0];
        }
    }

    getDDSlider2Value(value) {
        if(this.enableAutoInstrMethodLevel) {
	    //if slider 2's initial value is not 0, then set the slider 1's value to slider 2's initial value, otherwise set 0.
            this.ddAiCount1 = value.values[0] != 0 ? (value.values[0]) : 0;
            let temp = this.ddAiCount3[1];
            this.ddAiCount3 = [];
            this.ddAiCount3[1] = temp;
	    //if final value of slider 2 is set to 100, then set the slider 3's value to [100, 100].
            if(value.values[1] == 100) {
                this.ddAiCount3 = [100, 100]
                this.ddAIData['count3'] = 0;
            } else {
		//slider 3's initial value will be equal to slider 2's final value.
                this.ddAiCount3[0] = value.values[1];
                if(this.ddAiCount3[1] < this.ddAiCount3[0]) {
		    //if slider 2's final value = slider 3's final value, then slider 3's final value will be increased by 25.
                    this.ddAiCount3[1] = this.ddAiCount3[0]+25;
                    if(this.ddAiCount3[1] > 100) {
                        this.ddAiCount3 = [this.ddAiCount3[0], 100];
                        this.ddAIData['count3'] = this.ddAiCount3[1] - this.ddAiCount3[0];
                    }
                }
            }
	    //setting the slider value into DD Dto.
            this.ddAIData['count1'] = this.ddAiCount1;
            this.ddAIData['count2'] = this.ddAiCount2[1] - this.ddAiCount2[0];
            this.ddAIData['count3'] = this.ddAiCount3[1] - this.ddAiCount3[0];
        }
        //For AI Sliders.
        if(this.autoInstrObj['enableAutoInstrMethodLevel']) {
            let aiTemp = this.AICount3[1];
	    //if slider 2's initial value is not 0, then set the slider 1's value to slider 2's initial value, otherwise set 0.
            this.AICount1 = value.values[0] != 0 ? value.values[0] : 0;
            this.AICount3 = []
            this.AICount3[1] = aiTemp;
	    //if final value of slider 2 is set to 100, then set the slider 3's value to [100, 100].
            if(value.values[1] == 100) {
                this.AICount3 = [100, 100];
            } else {
		//slider 3's initial value will be equal to slider 2's final value.
                this.AICount3[0] = value.values[1];
                if(this.AICount3[1] < this.AICount3[0]) {
		    //if slider 2's final value = slider 3's final value, then slider 3's final value will be increased by 25.
                    this.AICount3[1] = this.AICount3[0] + 25;
                    if(this.AICount3[0] > 100) {
                        this.AICount3 = [100, 100];
                    } else if(this.AICount3[1] > 100) {
                        this.AICount3 = [this.AICount3[0], 100];
                    }
                }
            }
	    //setting the slider value into DD Dto.
            this.autoInstrObj['count1'] = this.AICount1;
            this.autoInstrObj['count2'] = this.AICount2[1] - this.AICount2[0];
            this.autoInstrObj['count3'] = this.AICount3[1] - this.AICount3[0];
        }
    }

    getDDSlider3Value(value) {
	//set Slider values for DD.
        if(this.enableAutoInstrMethodLevel) {
            let temp = this.ddAiCount2[0];
            this.ddAiCount2 = [];
            this.ddAiCount2[0] = temp;
	    //if initial value of slider 3 is set to 0, then slider 1 and slider 2 will be 0.
            if(value.values[0] == 0) {
                this.ddAiCount1 = 0;
                this.ddAiCount2 = [0, 0];
                this.ddAIData['count2'] = 0;
                this.ddAIData['count1'] = 0;
            } else {
		//slider 2's last position will be equal to slider 3's initial position
                this.ddAiCount2[1] = value.values[0];
                if(this.ddAiCount2[1] < this.ddAiCount2[0]){
		    //if slider 3's initial value is equal to slider 2's initial value, then slider 2's initial value will be decreased by 25.
                    this.ddAiCount2[0] = this.ddAiCount2[1] - 25;
                    if(this.ddAiCount2[0] < 0) {
                        this.ddAiCount2[0] = 0;
                    }
                }
		//slider 2's initial value will be equal to slider 1's value, otherwise 0.
                this.ddAiCount1 = (this.ddAiCount2[0] - 1) <= 0 ? 0 : this.ddAiCount2[0];
            }
	    //setting the Slider values into DDAI DTO.
            this.ddAIData['count1'] = this.ddAiCount1;
            this.ddAIData['count2'] = this.ddAiCount2[1] - this.ddAiCount2[0];
            this.ddAIData['count3'] = this.ddAiCount3[1] - this.ddAiCount3[0];
        }
	//set Slider values for AI.
        if(this.autoInstrObj['enableAutoInstrMethodLevel']) {
            let aiTemp = this.AICount2[0];
            this.AICount2 = [];
            this.AICount2[0] = aiTemp;
	    //if initial value of slider 3 is set to 0, then slider 1 and slider 2 will be 0.
            if(value.values[0] == 0) {    
                this.AICount1 = 0;
                this.AICount2 = [0, 0];
            } else {
		//slider 2's last position will be equal to slider 3's initial position.
                this.AICount2[1] = value.values[0];
                if(this.AICount2[1] < this.AICount2[0]) {
                    this.AICount2[0] = this.AICount2[1] - 25;
                    if(this.AICount2[0] < 0) {
                        this.AICount2[0] = 0;
                    }
                }
                this.AICount1 = (this.AICount2[0] <= 0) ? 0 : this.AICount2[0];
            }
	    //set Slider values for AI.
            this.autoInstrObj['count1'] = this.AICount1;
            this.autoInstrObj['count2'] = this.AICount2[1] - this.AICount2[0];
            this.autoInstrObj['count3'] = this.AICount3[1] - this.AICount3[0];            
        }
    }

    open(serverData, ddaiSettings) {
        this.passAIDDSettings = ddaiSettings;
        this.serverEntity = serverData;
    }
}
export interface ServerInfo {
    serverId: number;
    serverFileId: number;
    serverDesc: string;
    serverDisplayName: string;
    serverName: string;
    profileId: number;
    profileName: string;
}
