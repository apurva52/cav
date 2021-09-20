
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Message, SelectItem } from 'primeng/primeng';

import { MutexLockData, MutexLockSettings } from '../../interfaces/mutex-lock-info';
import { MutexLockDTO } from '../../interfaces/mutex-lock-info';
import * as URL from '../../constants/config-url-constant';
import { ConfigUiUtility } from '../../utils/config-utility';
import { ConfigProfileService } from '../../services/config-profile.service';
import { ConfigHomeService } from '../../services/config-home.service';
import { ConfigTopologyService } from '../../services/config-topology.service';
import { ConfigUtilityService } from '../../services/config-utility.service';
import { ConfigKeywordsService } from '../../services/config-keywords.service';
import { ServerInfo } from '../../interfaces/topology-info';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ConfigMemoryProfileService } from '../../services/config-memory-profile.service';
import { data } from 'jquery';
import { MemoryProfilerData } from '../../interfaces/memory-profile-info';

@Component({
    selector: 'app-config-mutex-lock',
    templateUrl: './config-mutex-lock.component.html',
    styleUrls: ['./config-mutex-lock.component.css']
})
export class ConfigMutexLockComponent implements OnInit {
    @Output() closemutexLockGui: EventEmitter<any> = new EventEmitter();
    @Output() serverData: EventEmitter<Object> = new EventEmitter();
    @Input() mutexLockSettings: any;
    @Input() mutexLockServerEntity: ServerInfo;

    mutexLockObj: MutexLockSettings;
    agentType: string;
    memProfData: MemoryProfilerData;
    mutexLockSessionData: MutexLockSettings[] = [];
    message: Message[] = [];

    mutexLockDto: MutexLockDTO;
    mutexLockData: MutexLockData;
    settings: any;
    t_s_i_name: string;
    txnId: number;
    msgBody: string[];
    currentInsId: number;
    serverEntity: ServerInfo;
    topoName: string = "";
    serverId: number;
    duration: number = 15;

    constructor(private configMemProfService: ConfigMemoryProfileService, private configKeywordsService: ConfigKeywordsService, private configTopologyService: ConfigTopologyService, private configProfileService: ConfigProfileService, private configHomeService: ConfigHomeService, private configUtilityService: ConfigUtilityService) {
    }
    ngOnInit() {
        this.mutexLockDto = new MutexLockDTO();
        this.mutexLockData = new MutexLockData();
        this.mutexLockDto.name = this.mutexLockSettings[3] + "_" + this.mutexLockSettings[4] + "_" + this.mutexLockSettings[0];
        this.t_s_i_name = this.mutexLockSettings[3] + "_" + this.mutexLockSettings[4] + "_" + this.mutexLockSettings[0];
        this.mutexLockObj = new MutexLockSettings();
        this.mutexLockDto.name = this.mutexLockSettings[3] + "_" + this.mutexLockSettings[4] + "_" + this.mutexLockSettings[0];
        this.mutexLockObj.instanceName = this.mutexLockSettings[0];
        this.mutexLockObj.instanceId = +this.mutexLockSettings[1];
        this.mutexLockObj.agentType = this.mutexLockSettings[2];
        this.mutexLockObj.tierName = this.mutexLockSettings[3];
        this.mutexLockObj.serverName = this.mutexLockSettings[4];
        this.mutexLockObj.topoName = this.mutexLockSettings[6];
        this.agentType = this.mutexLockSettings[2];
        this.topoName = this.mutexLockSettings[6];
        this.currentInsId = +this.mutexLockSettings[1];
        this.serverEntity = this.mutexLockServerEntity;
        this.serverId = this.serverEntity.serverId;
        this.getMutexLockData();
    }

    getMutexLockData() {
        this.configMemProfService.getMemProfSessionData("mutexLock").subscribe(data => {
            this.mutexLockSessionData = data
        });
    }

    startMutexLockSession() {
	//Checking if the session name already exists.
        for (let i = 0; i < this.mutexLockSessionData.length; i++) {
            if (this.mutexLockDto.name == this.mutexLockSessionData[i].sessionName) {
                this.configUtilityService.errorMessage("Session Name already exists.");
                return;
            }
        }
        this.mutexLockObj.appName = sessionStorage.getItem("selectedApplicationName");
        this.mutexLockObj.sessionName = this.mutexLockDto.name;
        this.mutexLockDto.duration = this.duration * 60;
        this.settings = this.createConfiguration(this.mutexLockDto);
        this.mutexLockObj.configuration = this.settings;
        this.mutexLockObj.triggerScreen = "mutexLock";
        this.mutexLockObj.description = this.mutexLockDto.description;
        this.mutexLockObj.duration = this.mutexLockDto.duration;
        this.mutexLockData.agentType = this.agentType;
        this.mutexLockData.instanceName = this.mutexLockSettings[0];
        this.mutexLockData.ndMsgName = 'lock_profile_session_request';
        this.mutexLockData.serverName = this.mutexLockSettings[4];
        this.mutexLockData.tierName = this.mutexLockSettings[3];
        this.configMemProfService.saveConfiguration(this.mutexLockObj).subscribe(data => {
            this.mutexLockDto.id = data.id;
            this.mutexLockData.reqBody = JSON.stringify(this.mutexLockDto);
            this.getNDCConnection(data);
        });
    }
    createConfiguration(data) {
        let settings = "";

        if (this.agentType == 'Java') {
	    // Creating setting string for saving the configuration.
            settings += "name=" + data.name + ";duration=" + data.duration + ";topNMutexlocks=" + data.topNmutexlocks + ";sessionOverhead=" + data.sessionOverhead
                + ";durTopMutexlocksFind=" + data.durTopMutexlocksFind + ";maxlockcount=" + data.maxlockcount + ";maxthreadcount=" + data.maxthreadcount
                + ";maxstacktracecount=" + data.maxstacktracecount + ";";

        }

        return settings;
    }

    resetToDefault() {
	//Resetting every settings to default.
        this.mutexLockDto = new MutexLockDTO();
        this.mutexLockDto.name = this.t_s_i_name;
	this.duration = 15;
    }

    closeMutexLockDialog() {
        this.closemutexLockGui.emit(false);
    }

    getNDCConnection(data) {
	this.closeMutexLockDialog();
        this.configMemProfService.memProfNDCConn(this.mutexLockData).subscribe(result => {
	    this.msgBody = ["MutexProfiling_01_" + data.sessionName + "_" + data.id + "_" + data.tierName + "_" + data.serverName + "_" + data.instanceName + ".json", 
"mutexLock", "MutexProfiling_02_" + data.sessionName + "_" + data.id + "_" + data.tierName + "_" + data.serverName + "_" + data.instanceName + ".properties"];
            if (result.msg.includes("Ok")) {
                this.txnId = +result.msg.match(/(\d+)/)[0];
		//this.msgBody = ["MutexLock_01_"+ data.sessionName + "_" + data.id + "_" + data.tierName+"_"+data.serverName+"_"+data.instanceName+".json", "mutexLock"];
                // this.configMemProfService.updateMemProfTxnId(+data.id, this.txnId).subscribe(res => {
                //     console.log("Txn Data ====> ", res);
                // });
                this.configTopologyService.updateAIEnable(this.currentInsId, true, "ML", this.topoName).subscribe(data => {
                    this.configTopologyService.getInstanceDetail(this.serverId, this.serverEntity, this.topoName).subscribe(data => {
                        this.serverData.emit(data);
                    });
                })
                //To show NDC message
                this.configUtilityService.successMessage('Session has been started successfully.');
            }
            else {

                this.configMemProfService.deleteMemProfSession(+data.id, this.msgBody).subscribe(recData => {
                });
                //To show NDC message
                this.configUtilityService.errorMessage(result.msg);
            }
        })
    }
    
}
