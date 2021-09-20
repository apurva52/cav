
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Message, SelectItem } from 'primeng/api';

import { MemoryProfilerData, MemoryProfilerSettings, MemProfDTO } from '../../interfaces/memory-profile-info';
import { ConfigUtilityService } from '../../services/config-utility.service';
import { ServerInfo } from '../../interfaces/topology-info';
import { ConfigHomeService } from '../../services/config-home.service';
import { ConfigMemoryProfileService } from '../../services/config-memory-profile.service';
import { ConfigTopologyService } from '../../services/config-topology.service';

@Component({
    selector: 'app-config-memory-profiling',
    templateUrl: './config-memory-profiling.component.html',
    styleUrls: ['./config-memory-profiling.component.css']
})
export class ConfigMemoryProfilingComponent implements OnInit {
    @Output() closeMemProfGui: EventEmitter<any> = new EventEmitter();
    @Output() serverData: EventEmitter<Object> = new EventEmitter();
    @Input() memProfSettings: string;
    @Input() memProfServerEntity: ServerInfo;

    memProfDto: MemProfDTO;
    memProfObj: MemoryProfilerSettings;
    agentType: string;
    memProfData: MemoryProfilerData;
    memProfSessionData: MemoryProfilerSettings[] = [];
    message: Message[] = [];
    t_s_i_name: string = "";
    msgBody: any[] = [];
    txnId: any;
    currentInsId: number;
    topoName: string = "";
    serverId: number;
    serverEntity: ServerInfo;
    duration: number;
    memProfTypes = [{ label: 'Object Count', value: 1 }, { label: 'Object Duration', value: 2 }, { label: 'Both', value: 3 }];

    constructor(private configMemProfService: ConfigMemoryProfileService, private configUtilityService: ConfigUtilityService, private configTopologyService: ConfigTopologyService, private configHomeService: ConfigHomeService) {
    }
    ngOnInit() {
        this.memProfData = new MemoryProfilerData();
        this.memProfDto = new MemProfDTO();
        //creating the Session Name i.e: SessionName = "TierName_ServerName_InstanceName"
        this.t_s_i_name = this.memProfSettings[3] + "_" + this.memProfSettings[4] + "_" + this.memProfSettings[0];
        this.memProfDto.name = this.t_s_i_name;
        this.memProfObj = new MemoryProfilerSettings();
        //Storing all the data from input array to MemProf DTO.
        this.memProfObj.instanceName = this.memProfSettings[0];
        this.memProfObj.instanceId = +this.memProfSettings[1];
        this.memProfObj.agentType = this.memProfSettings[2];
        this.memProfObj.tierName = this.memProfSettings[3];
        this.memProfObj.serverName = this.memProfSettings[4];
        this.memProfObj.topoName = this.memProfSettings[6]
        this.agentType = this.memProfSettings[2];
        this.currentInsId = +this.memProfSettings[1];
        this.topoName = this.memProfSettings[6];
        this.serverId = +this.memProfSettings[5];
        this.serverEntity = this.memProfServerEntity;
        //Fetching Memory Profiling Data to check if it exists in DB or not.
        this.getMemProfData();
    }

    getMemProfData() {
        this.configMemProfService.getMemProfSessionData('memoryProfiler').subscribe(data => {
            this.memProfSessionData = data
        });
    }

    startMemProfSession() {
        for (let i = 0; i < this.memProfSessionData.length; i++) {
            //Checking if the Given name already exists in DB or not.
            if (this.memProfDto.name == this.memProfSessionData[i].sessionName) {
                this.configUtilityService.errorMessage('Session Name already exists.');
                return;
            }
        }
        //Storing data into DTO to save in the DB.
        this.memProfObj.appName = sessionStorage.getItem("selectedApplicationName");
        this.memProfObj.sessionName = this.memProfDto.name;
        this.duration = this.memProfDto.duration;
        this.memProfDto.duration = this.memProfDto.duration * 60;
        let settings = this.createConfiguration(this.memProfDto);
        this.memProfObj.configuration = settings;
        this.memProfObj.duration = this.memProfDto.duration;
        this.memProfObj.triggerScreen = "memoryProfiler";
        this.memProfData.agentType = this.agentType;
        this.memProfData.bodyContentType = 'json';
        this.memProfData.headerContentType = 'json';
        this.memProfData.instanceName = this.memProfSettings[0];
        this.memProfData.ndMsgName = 'MemoryProfillingRequest';
        this.memProfData.serverName = this.memProfSettings[4];
        this.memProfData.tierName = this.memProfSettings[3];
        this.configMemProfService.saveConfiguration(this.memProfObj).subscribe(data => {
            this.memProfDto.id = data.id;
            this.memProfData.reqBody = JSON.stringify(this.memProfDto);
            this.getNDCConnection(data);
            this.memProfDto.duration = this.duration;
        });
    }

    createConfiguration(data) {
        let settings = "";
        let blackListStr = "";
        let whiteListStr = "";
        if (this.agentType == 'Java') {
            settings += "name=" + data.name + ";duration=" + data.duration + ";frequency=" + data.frequency + ";topNClassToInstrument=" + data.topNClassToInstrument
                + ";durTopClassFind=" + data.durTopClassFind + ";maxStackTraceCount=" + data.maxStackTraceCount + ";stackTraceDepth=" + data.stackTraceDepth + ";"
                + ";memoryProfilerType=" + data.memoryProfilerType + ";";

            for (let i = 0; i < data.blackListClasses.length; i++) {
                blackListStr += data.blackListClasses[i] + ";"
            }
            settings += "blackListClasses=" + blackListStr.substring(0, blackListStr.length - 1) + ";";
            for (let i = 0; i < data.whiteListClasses.length; i++) {
                whiteListStr += data.whiteListClasses[i] + ";"
            }
            settings += "whiteListClasses=" + whiteListStr.substring(0, whiteListStr.length - 1) + ";";
        }
        return settings;
    }
    //Method to close the MemProf Config GUI.
    closeMemProfDialog() {
        this.closeMemProfGui.emit(false);
    }
    //Method to reset the Data of the MemProf Config GUI.
    resetToDefault() {
        this.memProfDto = new MemProfDTO();
        this.memProfDto.name = this.t_s_i_name;
        this.memProfObj.description = "";
    }

    getNDCConnection(data) {
        this.configMemProfService.memProfNDCConn(this.memProfData).subscribe(result => {
            //Creating the File Name for the NDC Connection.
            this.msgBody = ["MemoryProfiling_01_" + data.sessionName + "_" + data.id + "_" + data.tierName + "_" + data.serverName + "_" + data.instanceName + ".json"];
            if (result.msg.includes("Ok")) {
                this.txnId = +result.msg.match(/(\d+)/)[0];
                //this.configMemProfService.updateMemProfTxnId(+data.id, this.txnId).subscribe(res => {
                //    console.log("Txn Data ====> " , res);
                //});
                this.configTopologyService.updateAIEnable(this.currentInsId, true, "MP", this.topoName).subscribe(data => {
                    this.configTopologyService.getInstanceDetail(this.serverId, this.serverEntity, this.topoName).subscribe(data => {
                        this.serverData.emit(data);
                    });
                })
                //To show NDC message
                this.configUtilityService.successMessage('Session has been started successfully.');
            }
            else {
                this.configMemProfService.deleteMemProfSession(+data.id, this.msgBody).subscribe(recData => {
                    console.log("Delete Data ===> ", recData);
                });
                this.closeMemProfGui.emit(false);
                //To show NDC message
                this.configUtilityService.errorMessage(result.msg);
            }
        })
    }

}
