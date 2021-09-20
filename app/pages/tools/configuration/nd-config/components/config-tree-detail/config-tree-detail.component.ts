import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params, Router, NavigationEnd } from '@angular/router';
import { ConfigTopologyService } from '../../services/config-topology.service';
import { TopologyInfo, TierGroupInfo, TierInfo, ServerInfo, InstanceInfo, AutoInstrSettings, AutoIntrDTO } from '../../interfaces/topology-info';
import * as CONS from '../../constants/config-constant';
import { ConfigUtilityService } from '../../services/config-utility.service';
import { SelectItem } from 'primeng/api';
import { ConfigProfileService } from '../../services/config-profile.service';
import { ProfileInfo } from '../../interfaces/profile-info';
import { ROUTING_PATH } from '../../constants/config-url-constant';
import { NodeData } from '../../containers/node-data';
import { Subscription } from 'rxjs';
import { ConfigKeywordsService } from '../../services/config-keywords.service';
import { ConfigHomeService } from '../../services/config-home.service';
import { ConfigRestApiService } from '../../services/config-rest-api.service';
import * as URL from '../../constants/config-url-constant';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-config-tree-detail',
  templateUrl: './config-tree-detail.component.html',
  styleUrls: ['./config-tree-detail.component.css']
})
export class ConfigTreeDetailComponent implements OnInit {

  className: string = "Tree Detail Component";

  errDialog: boolean = false;
  msg = [];
  errMsg = [];
  agentType: string = "";
  serverDisplayName: string = "";

  perm: boolean;
  noProfilePerm: boolean;
  isAIPerm: boolean;
  t_s_i_name: string;

  passAIDDSettings: any[];
  passAIDDserverEntity: ServerInfo;
  routingFromAIGui: boolean;
  isOpenMemProfDialog: boolean = false;
  memProfServerEntity: ServerInfo;
  memProfSettings: any [];

  isOpenMutexLockDialog: boolean = false;
  mutexLockSettings: any [];
  mutexLockServerEntity: ServerInfo;

  constructor(private configTopologyService: ConfigTopologyService,
    private configKeywordsService: ConfigKeywordsService,
    private route: ActivatedRoute,
    private configUtilityService: ConfigUtilityService,
    private configProfileService: ConfigProfileService,
    private router: Router,
    private configHomeService: ConfigHomeService,
    private _restApi: ConfigRestApiService
  ) {
    this.loadProfileList();
    this.loadTopologyData();
    this.loadDLAppliedProfile();
  }

  /* holds current topo data [either topo data /tier /server /instance data a/c to the screen] */
  topologyData: any[];
  topologyDataAIInstanceLevel: any[];
  showserverinstance: string;

  tableHeaderInfo: any[];
  currentEntity: string = CONS.TOPOLOGY.TOPOLOGY;

  //for table header name
  selectedEntityArr: string;

  topologyEntity: TopologyInfo;
  tierGroupEntity: TierGroupInfo;
  tierEntity: TierInfo;
  serverEntity: ServerInfo;
  instanceEntity: InstanceInfo;
  selectedTopologyData: any[];

  /**For open/close edit dialog of topologies*/
  changeProf: boolean = false;
  topoData: any;

  //Dialog for auto instrumenatation configuration
  showInstr: boolean = false;

  topologyName: string;
  tierGroupName: string;
  tierName: string;
  serverName: string;

  /**SelectItem for Profile */
  profileSelectItem: SelectItem[];

  profileData: ProfileInfo[];

  ROUTING_PATH = ROUTING_PATH;

  //used when topology is screen comes from application
  dcId: number

  //used when topology screen comes from its topology show All screen or home screen
  topoId: number

  url: string;
  subscription: Subscription;

  currentInstanceName: string;
  currentInsId: number;
  currentInsType: string;

  serverId: any;

  // to show info dialog
  infoDialog: boolean = false;
  infoMsg: any[] = [];
  
  //Check to see if user wants to override all levels or not
  isOverride: boolean = false;

  //DL applied profile list
  dlAppliedProfileList = [];
  ngOnInit() {

    this.showserverinstance = sessionStorage.getItem("showserverinstance");

    if (this.showserverinstance == "false")
      this.routingFromAIGui = true;

    this.topologyData = [];

    if (+sessionStorage.getItem("ApplicationAccess") == 4 || +sessionStorage.getItem("TopologyAccess") == 4)
      this.perm = true;
    else
      this.perm = false;
    this.noProfilePerm = +sessionStorage.getItem("ProfileAccess") == 0 ? true : false;
    if (+sessionStorage.getItem("ApplicationAccess") == 4 || +sessionStorage.getItem("AutoDiscoverAccess") == 4 || +sessionStorage.getItem("AutoDiscoverAccess") == 0) {
      this.isAIPerm = true;
    }
    else
      this.isAIPerm = false;
    this.selectedEntityArr = CONS.TOPOLOGY.TOPOLOGY;
    //no need to call when store used [TO DO's]
  }

  loadTopologyData(): void {
    this.getTableHeader();
    // let url;
    this.route.params.subscribe((params: Params) => {
      this.dcId = params['dcId']
      this.topoId = params['topoId']
    });

    /**below route function is always called whenever routing changes
     * SO handling the case that required service is hit only when url contains 'tree-main' in the url.
     *
     */

    this.subscription = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      this.url = event["url"];
      let arr = this.url.split("/");

      if (arr.indexOf("tree-main") != -1) {
        if (arr.indexOf("topology") != -1) {
          this.configTopologyService.getTopologyStructureTableData(this.topoId).subscribe(data => {
            if (this.showserverinstance == "false")
              this.topologyData = data;
            else
              this.topologyDataAIInstanceLevel = data
          });
        }
        else {
          this.configTopologyService.getTopologyDetail(this.dcId).subscribe(data => {
            //only show Instance level data in topology detail gui if showserverinstance is true
            if (this.showserverinstance == "false")
              this.topologyData = data;
            else {
              this.topologyDataAIInstanceLevel = data
            }
          });
        }
      }
    })
  }

  loadProfileList() {
    this.configProfileService.getProfileList().subscribe(data => {
      this.createProfileSelectItem(data);
    });
  }

  /**For close change Profile dialog box */
  closeDialog(): void {
    this.changeProf = false;
  }

  /** For getting entity(TierGroup, Tier, Server, Instance) data  **/

  getData(event): void {
    if (sessionStorage.getItem("showserverinstance") == "false")
      this.showserverinstance = "false";

    this.selectedTopologyData = [];

    //When collapsing at topology level
    if (event.data.currentEntity == CONS.TOPOLOGY.TOPOLOGY && event.data.nodeExpanded == true) {
      this.topologyName = event.data.nodeLabel;
      this.currentEntity = CONS.TOPOLOGY.TOPOLOGY;
      if (this.dcId != undefined)
        this.configTopologyService.getTopologyDetail(this.dcId).subscribe(data => this.topologyData = data);
      else
        this.configTopologyService.getTopologyStructureTableData(this.topoId).subscribe(data => this.topologyData = data);
      this.selectedEntityArr = event.data.nodeLabel
    }

    //When expanding at topology level
    else if (event.data.currentEntity == CONS.TOPOLOGY.TOPOLOGY && !event.data.nodeExpanded) {
      this.topologyName = event.data.nodeLabel;

      this.currentEntity = CONS.TOPOLOGY.TIERGROUP;

      //only show Instance level data in topology detail gui if showserverinstance is true
      if (this.showserverinstance == "false")
        this.topologyData.filter(row => { if (row.topoId == event.data.nodeId) this.topologyEntity = row })
      else
        this.topologyDataAIInstanceLevel.filter(row => { if (row.topoId == event.data.nodeId) this.topologyEntity = row })

      sessionStorage.setItem("topoId", event.data.nodeId);
      this.configTopologyService.getTierGroupDetail(event.data.nodeId, this.topologyEntity).subscribe(data => {
        if (this.showserverinstance == "false") {
          this.routingFromAIGui = true;
          this.topologyData = data;
          this.selectedEntityArr = event.data.nodeLabel + " : " + CONS.TOPOLOGY.TIERGROUP;
        }
        else {
          this.routingFromAIGui = false;
          this.topologyDataAIInstanceLevel = data;
          if (this.topologyDataAIInstanceLevel.length == 0) {
            this.routingFromAIGui = true;
            this.configUtilityService.successMessage("Current Topology doesn't contains any TierGroups, Select other Topology.");
            sessionStorage.setItem("showserverinstance", "false");
            this.selectedEntityArr = event.data.nodeLabel + " : " + CONS.TOPOLOGY.TIERGROUP;
          }
        }
      });
    }

    //When collapsing at TierGroup level
    else if (event.data.currentEntity == CONS.TOPOLOGY.TIERGROUP && event.data.nodeExpanded == true) {
      this.tierGroupName = event.data.nodeLabel;
      this.currentEntity = CONS.TOPOLOGY.TIERGROUP;
      // this.topologyData.filter(row => { if (row.topoId == event.data.nodeId) this.topologyEntity = row })
      this.configTopologyService.getTierGroupDetail(+(sessionStorage.getItem("topoId")), this.topologyEntity).subscribe(data => this.topologyData = data);
      this.selectedEntityArr = event.data.nodeLabel + " : " + CONS.TOPOLOGY.TIERGROUP;
    }

    //When expanding at TierGroup level
    else if (event.data.currentEntity == CONS.TOPOLOGY.TIERGROUP && !event.data.nodeExpanded) {
      this.tierGroupName = event.data.nodeLabel;
      this.currentEntity = CONS.TOPOLOGY.TIER;
      /*only show Instance level data in topology detail gui if showserverinstance is true */
      if (this.showserverinstance == "false") {
        this.topologyData.filter(row => { if (row.tierGroupName == event.data.nodeLabel) this.tierGroupEntity = row })
      }
      else {
        this.topologyDataAIInstanceLevel.filter(row => { if (row.tierGroupName == event.data.nodeLabel) this.tierGroupEntity = row })
      }
      sessionStorage.setItem("tierGroupName", event.data.nodeLabel);
      this.configTopologyService.getTierDetail(event.data.nodeLabel, this.tierGroupEntity, this.topologyName).subscribe(data => {
        if (this.showserverinstance == "false") {
          this.routingFromAIGui = true;
          this.topologyData = data;
          this.selectedEntityArr = this.topologyName + "  >  " + event.data.nodeLabel + " : " + CONS.TOPOLOGY.TIER;
        }
        else {
          this.routingFromAIGui = false;
          this.topologyDataAIInstanceLevel = data;
          if (this.topologyDataAIInstanceLevel.length == 0) {
            this.routingFromAIGui = true;
            this.configUtilityService.successMessage("Current Tier Group doesn't contains any Tier, Select other Tier Group.");
            sessionStorage.setItem("showserverinstance", "false");
            this.selectedEntityArr = this.topologyName + "  >  " + event.data.nodeLabel + " : " + CONS.TOPOLOGY.TIER;
          }
        }
      });
    }

    //When collapsing at Tier level
    else if (event.data.currentEntity == CONS.TOPOLOGY.TIER && event.data.nodeExpanded == true) {
      this.tierName = event.data.nodeLabel;
      this.currentEntity = CONS.TOPOLOGY.TIER;
      // this.topologyData.filter(row => { if (row.topoId == event.data.nodeId) this.topologyEntity = row })
      this.configTopologyService.getTierDetail((sessionStorage.getItem("tierGroupName")), this.tierGroupEntity, this.topologyName).subscribe(data => this.topologyData = data);
      this.selectedEntityArr = event.data.nodeLabel + " : " + CONS.TOPOLOGY.TIER;
    }

    //When expanding at Tier level
    else if (event.data.currentEntity == CONS.TOPOLOGY.TIER && !event.data.nodeExpanded) {
      //this.selectedTopologyData :TierInfo[];
      this.tierName = event.data.nodeLabel;
      this.currentEntity = CONS.TOPOLOGY.SERVER;
      //only show Instance level data in topology detail gui if showserverinstance is true
      if (this.showserverinstance == "false") {
        this.topologyData.filter(row => { if (row.tierId == event.data.nodeId) this.tierEntity = row })
      }
      else {
        this.topologyDataAIInstanceLevel.filter(row => { if (row.tierId == event.data.nodeId) this.tierEntity = row })
      }
      sessionStorage.setItem("serverId", event.data.nodeId);
      this.configTopologyService.getServerDetail(event.data.nodeId, this.tierEntity, this.topologyName).subscribe(data => {
        if (this.showserverinstance == "false") {
          this.routingFromAIGui = true;
          this.topologyData = data;
          this.selectedEntityArr = this.topologyName + "  >  " + sessionStorage.getItem("tierGroupName") + " > " + event.data.nodeLabel + " : " + CONS.TOPOLOGY.SERVER;
        }
        else {
          this.routingFromAIGui = false;
          this.topologyDataAIInstanceLevel = data;
          if (this.topologyDataAIInstanceLevel.length == 0) {
            this.routingFromAIGui = true;
            this.configUtilityService.successMessage("Current Tier doesn't contains any Server, Select other Tier, Tier Group or Topology.");
            sessionStorage.setItem("showserverinstance", "false");
            this.selectedEntityArr = this.topologyName + "  >  " + sessionStorage.getItem("tierGroupName") + " > " + event.data.nodeLabel + " : " + CONS.TOPOLOGY.SERVER;
          }
        }
      });
    }

    //When collapsing at Server level
    else if (event.data.currentEntity == CONS.TOPOLOGY.SERVER && event.data.nodeExpanded == true) {
      this.serverName = event.data.nodeLabel;
      this.currentEntity = CONS.TOPOLOGY.SERVER;
      // this.topologyData.filter(row => { if (row.serverId == event.data.nodeId) this.serverEntity = row })
      this.configTopologyService.getServerDetail(+(sessionStorage.getItem("serverId")), this.tierEntity, this.topologyName).subscribe(data => this.topologyData = data);
      this.selectedEntityArr = this.topologyName + "  >  " + sessionStorage.getItem("tierGroupName") + " > " + event.data.nodeLabel + " : " + CONS.TOPOLOGY.SERVER;
    }

    //When expanding at server level
    else if (event.data.currentEntity == CONS.TOPOLOGY.SERVER && !event.data.nodeExpanded) {
      let that = this;
      this.serverName = event.data.nodeLabel;
      this.currentEntity = CONS.TOPOLOGY.INSTANCE;
      //only show Instance level data in topology detail gui if showserverinstance is true

      if (this.showserverinstance == "false")
        this.topologyData.filter(row => { if (row.serverId == event.data.nodeId) this.serverEntity = row })
      else
        this.topologyDataAIInstanceLevel.filter(row => { if (row.serverId == event.data.nodeId) this.serverEntity = row })
      this.serverId = event.data.nodeId;


      //Update the status of AI and icon when AI process id completed when its duration is completed
      this.configTopologyService.durationCompletion().subscribe(data => {
        that.configTopologyService.getInstanceDetail(event.data.nodeId, that.serverEntity, this.topologyName).subscribe(data => {
          that.topologyData = data;
          this.routingFromAIGui = true;
          if ((that.topologyData.length == 0) && (this.showserverinstance == "true")) {
            sessionStorage.setItem("showserverinstance", "false");
            this.configUtilityService.successMessage("Current Server doesn't contains any Instance, Select other Server, Tier, Tier Group or Topology.");
          }
          if (data.length != 0) {
            that.configTopologyService.getServerDisplayName(data[0].instanceId, +sessionStorage.getItem("topoId")).subscribe(data2 => {
              that.serverDisplayName = data2;
            })
          }
        });
      })
      this.selectedEntityArr = this.topologyName + "  >  " + sessionStorage.getItem("tierGroupName") + " > " + this.tierName + "  >  " + event.data.nodeLabel + "  :  " + CONS.TOPOLOGY.INSTANCE;
    }

    // this.selectedEntityArr = [this.selectedEntityArr.join(": ")];
    //For Table header Name
    if (this.showserverinstance == "true") {
      setTimeout(() => { this.getTableHeader() }, 250)
    }
    else
      this.getTableHeader();
  }

  /**For Display table header object */
  getTableHeader(): void {
    let tableHeaderInfo = [];

    //Default for topology detail
    let colField = [];
    let colHeader = ["Name", "Description", "Profile applied"];
    if (this.showserverinstance == "false" || sessionStorage.getItem("showserverinstance") == "false") {

      if (this.currentEntity == CONS.TOPOLOGY.TOPOLOGY) {
        colHeader = ["Name", "Profile applied"];
        colField = ["topoName", "profileName"];
      }
      else if (this.currentEntity == CONS.TOPOLOGY.TIERGROUP) {
        colHeader = ["Name", " Tier Group Defination", "Profile applied"];
        colField = ["tierGroupName", "tierGroupDefination", "profileName"];
      }
      else if (this.currentEntity == CONS.TOPOLOGY.TIER) {
        colHeader = ["Name", "Description", "Profile applied"];
        colField = ["tierName", "tierDesc", "profileName"];
      }
      else if (this.currentEntity == CONS.TOPOLOGY.SERVER) {
        colHeader = ["Display name", "Actual name", "Profile applied"];
        colField = ["serverDisplayName", "serverName", "profileName"];
      }
      else if (this.currentEntity == CONS.TOPOLOGY.INSTANCE) {

        // check whether it is application topology screen or topology details screen
        if (this.url.includes("/tree-main/topology/")) {
          colHeader = ["Display name", " Name", "Description", "Profile applied"];
          colField = ["instanceDisplayName", "instanceName", "instanceDesc", "profileName"];
        }
        else {
          colHeader = ["Display name", " Name", "Description", "Profile applied", "Actions"];
          colField = ["instanceDisplayName", "instanceName", "instanceDesc", "profileName", "aiEnable"];
        }
      }
    }
    else {
      if (this.currentEntity == CONS.TOPOLOGY.INSTANCE) {
        // check whether it is application topology screen or topology details screen
        if (this.url.includes("/tree-main/topology/")) {
          colHeader = ["Display name", " Name", "Description", "Profile applied"];
          colField = ["instanceDisplayName", "instanceName", "instanceDesc", "profileName"];
        }
        else {
          colHeader = ["Display name", " Name", "Description", "Profile applied", "Actions"];
          colField = ["instanceDisplayName", "instanceName", "instanceDesc", "profileName", "aiEnable"];
        }
      }
    }


    //Hiding toggle at instance level
    // else if (this.currentEntity == CONS.TOPOLOGY.INSTANCE) {

    //   // check whether it is application topology screen or topology details screen
    //   if (this.url.includes("/tree-main/topology/")) {
    //     colHeader = ["Display name", " Name", "Description", "Profile applied", "Enabled"];
    //     colField = ["instanceDisplayName", "instanceName", "instanceDesc", "profileName", "enabled"];
    //   }
    //   else {
    //     colHeader = ["Display name", " Name", "Description", "Profile applied", "Enabled", "Auto-Instrumentation"];
    //     colField = ["instanceDisplayName", "instanceName", "instanceDesc", "profileName", "enabled", "aiEnable"];
    //   }
    // }
    for (let i = 0; i < colField.length; i++) {
      tableHeaderInfo.push({ field: colField[i], header: colHeader[i] });
    }

    this.tableHeaderInfo = tableHeaderInfo;
  }

  editDialog(): void {
    if (!this.selectedTopologyData || this.selectedTopologyData.length < 1) {
      this.configUtilityService.errorMessage("Select a row to edit profile");
      return;
    }
    else if (this.selectedTopologyData.length > 1) {
      this.configUtilityService.errorMessage("Select only one row to edit profile");
      return;
    }
    else if (this.selectedTopologyData[0].tierGroupName == 'default') {
      this.configUtilityService.errorMessage("Tier group(default) profile change is not applicable.");
      return;
    }

    //    for (let i = 0; i < this.selectedTopologyData.length; i++) {
    //      if (this.selectedTopologyData[0]["instanceType"] == "Java") {
    //        this.configProfileService.getJavaTypeProfileList().subscribe(data => {
    //          this.createProfileSelectItem1(data);
    //        });
    //      }
    //      else if (this.selectedTopologyData[0]["instanceType"] == "Dot Net") {
    //        this.configProfileService.getDotNetTypeProfileList().subscribe(data => {
    //          this.createProfileSelectItem1(data);
    //        });
    //      }
    //      else if (this.selectedTopologyData[0]["instanceType"] == "NodeJS") {
    //        this.configProfileService.getNodeJSTypeProfileList().subscribe(data => {
    //          this.createProfileSelectItem1(data);
    //        });
    //      }
    //    }
    this.changeProf = true;
    this.topoData = Object.assign({}, this.selectedTopologyData[0]);
    this.topoData.profileId = +this.selectedTopologyData[0].profileId
    // this.selectedTopologyData.empty();

  }


  //To check if any profile is apready appied at child levels or not
  checkForChildProfile() {

    //Sending NoGroup to backend if selected entity is other than tierGroup
    if (this.currentEntity == CONS.TOPOLOGY.TOPOLOGY) {
      this.configTopologyService.checkChildProfile(this.topoData.topoId, this.currentEntity, "NoGroup", this.topologyName).subscribe(data => {
        this.showInfo(data);
      })
    }
  else if (this.currentEntity == CONS.TOPOLOGY.TIERGROUP) {
    let id = -1;
    if(this.topoData.tierGroupId != null){
      id = this.topoData.tierGroupId;
    }
    this.configTopologyService.checkChildProfile(id, this.currentEntity, this.topoData.tierGroupName, this.topologyName).subscribe(data => { 
      this.showInfo(data);

    })
  }
      else if (this.currentEntity == CONS.TOPOLOGY.TIER) {
        this.configTopologyService.checkChildProfile(this.topoData.tierId, this.currentEntity, "NoGroup", this.topologyName).subscribe(data => {
          this.showInfo(data);

        })
      }
    else if (this.currentEntity == CONS.TOPOLOGY.SERVER) {
      this.configTopologyService.checkChildProfile(this.topoData.serverId, this.currentEntity, "NoGroup", this.topologyName).subscribe(data => {
        this.showInfo(data);

      })
    }
    else if (this.currentEntity == CONS.TOPOLOGY.INSTANCE) {
      this.configTopologyService.checkChildProfile(this.topoData.instanceId, this.currentEntity, "NoGroup", this.topologyName).subscribe(data => {
        this.showInfo(data);

      })
    }
  }

  //Show dialog at all levels if any profile is applied at any level
  showInfo(data: string[]) {
    if(data.includes("None")){
      this.saveEditProfile()
    }
    else{ 
      this.infoDialog = true;
      this.infoMsg = data;
    }
  }

  saveEditProfile(): void {
    if (this.currentEntity == CONS.TOPOLOGY.TOPOLOGY)
      {
        const url = `${URL.ATTACH_PROFTO_TOPO}/${this.topoData.dcTopoId}/${this.topoData.profileId}/${this.isOverride}/${this.configHomeService.trData.switch}/${sessionStorage.getItem("isTrNumber")}`;
            let that = this
            this.sendRunTimeChange(url, function (rtcMsg, rtcErrMsg) {
              that.msg = rtcMsg;
              that.errMsg = rtcErrMsg;
    
              //Showing partialError messages in dialog
              if (that.msg.length > 0 || that.errMsg.length > 0) {
                that.errDialog = true;
              }
            })
      }
      else if (this.currentEntity == CONS.TOPOLOGY.TIERGROUP)
      {
        const url = `${URL.ATTACH_PROFTO_TIER_GROUP}/${this.topoData.tierGroupName}/${this.topoData.profileId}/${this.topologyName}/${this.isOverride}/${this.configHomeService.trData.switch}/${sessionStorage.getItem("isTrNumber")}`;
            let that = this
            this.sendRunTimeChange(url, function (rtcMsg, rtcErrMsg) {
              that.msg = rtcMsg;
              that.errMsg = rtcErrMsg;
    
              //Showing partialError messages in dialog
              if (that.msg.length > 0 || that.errMsg.length > 0) {
                that.errDialog = true;
              }
            })
      }
    else if (this.currentEntity == CONS.TOPOLOGY.TIER)
    {
      const url = `${URL.ATTACH_PROFTO_TIER}/${this.topoData.tierId}/${this.topoData.profileId}/${this.topologyName}/${this.isOverride}/${this.configHomeService.trData.switch}/${sessionStorage.getItem("isTrNumber")}`;
        let that = this
        this.sendRunTimeChange(url, function (rtcMsg, rtcErrMsg) {
          that.msg = rtcMsg;
          that.errMsg = rtcErrMsg;

          //Showing partialError messages in dialog
          if (that.msg.length > 0 || that.errMsg.length > 0) {
            that.errDialog = true;
          }
        })
    }
    else if (this.currentEntity == CONS.TOPOLOGY.SERVER)
    {
      const url = `${URL.ATTACH_PROFTO_SERVER}/${this.topoData.serverId}/${this.topoData.profileId}/${this.topologyName}/${this.isOverride}/${this.configHomeService.trData.switch}/${sessionStorage.getItem("isTrNumber")}`;
        let that = this
        this.sendRunTimeChange(url, function (rtcMsg, rtcErrMsg) {
          that.msg = rtcMsg;
          that.errMsg = rtcErrMsg;

          //Showing partialError messages in dialog
          if (that.msg.length > 0 || that.errMsg.length > 0) {
            that.errDialog = true;
          }
        })
    }
    else if (this.currentEntity == CONS.TOPOLOGY.INSTANCE)
    {
      const url = `${URL.ATTACH_PROFTO_INSTANCE}/${this.topoData.instanceId}/${this.topoData.profileId}/${this.topologyName}/${this.configHomeService.trData.switch}/${sessionStorage.getItem("isTrNumber")}`;
        let that = this
        this.sendRunTimeChange(url, function (rtcMsg, rtcErrMsg) {
          that.msg = rtcMsg;
          that.errMsg = rtcErrMsg;

          //Showing partialError messages in dialog
          if (that.msg.length > 0 || that.errMsg.length > 0) {
            that.errDialog = true;
          }
        })
    }
      this.infoDialog = false;
    // this.configUtilityService.successMessage("Saved Successfully");
  }

  //in this method we are updating current table data with new values
  updateTopo(data) {
    let that = this;
    this.topologyData.forEach(function (val) {
      if (that.currentEntity == CONS.TOPOLOGY.TOPOLOGY && val.dcTopoId == data.dcTopoId) {
        val.profileId = data.profileId
        val.profileName = data.profileName
      }
      else if (that.currentEntity == CONS.TOPOLOGY.TOPOLOGY && val.topoId == data.topoId) {
        val.profileId = data.profileId
        val.profileName = data.profileName
      }
      else if (that.currentEntity == CONS.TOPOLOGY.TIERGROUP && val.tierGroupName == data.tierGroupName) {
        val.profileId = data.profileId
        val.profileName = data.profileName
      }
      else if (that.currentEntity == CONS.TOPOLOGY.TIER && val.tierId == data.tierId) {
        val.profileId = data.profileId
        val.profileName = data.profileName
      }
      else if (that.currentEntity == CONS.TOPOLOGY.SERVER && val.serverId == data.serverId) {
        val.profileId = data.profileId
        val.profileName = data.profileName
      }
      else if (that.currentEntity == CONS.TOPOLOGY.INSTANCE && val.instanceId == data.instanceId) {
        val.profileId = data.profileId
        val.profileName = data.profileName
      }
    })
    this.selectedTopologyData.length = 0;
    //after submitting vales closing the dialog
    this.changeProf = false;
  }

  /**This method is used to creating topology/tier/server select item object */
  createProfileSelectItem(data) {
    this.profileSelectItem = [];
    let arr = []; //This variable is used to sort Profiles
    for (let i = 0; i < data.length; i++) {
      arr.push(data[i].profileName);
    }
    arr.sort();
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < data.length; j++) {
        //      if (data[j].agent == "Java" || data[j].agent == "-") {
        if (data[j].profileName == arr[i]) {
          this.profileSelectItem.push({ label: arr[i], value: data[j].profileId });
        }
        //      }
      }
    }
  }

  /**This method is used to creating instance select item object */
  //  createProfileSelectItem1(data) {
  //    this.profileSelectItem = [];
  //    let arr = []; //This variable is used to sort Profiles
  //    for (let i = 0; i < data.length; i++) {
  //      arr.push(data[i].profileName);
  //    }
  //    arr.sort();
  //    for (let i = 0; i < arr.length; i++) {
  //      for (let j = 0; j < data.length; j++) {
  //        if (data[j].profileName == arr[i]) {
  //          this.profileSelectItem.push({ label: arr[i], value: data[j].profileId });
  //        }
  //      }
  //    }
  //  }


  // routeToConfiguration(selectedProfileId, selectedProfileName) {
  //   //Observable profile name
  //   this.configProfileService.profileNameObserver(selectedProfileName);
  //   this.router.navigate([this.ROUTING_PATH + '/profile/configuration', selectedProfileId]);
  // }

  routeToConfiguration(entity) {

    if ('topoId' in entity) {
      this.configProfileService.nodeData = { 'nodeType': 'topology', 'nodeId': entity.topoId, 'nodeName': entity.topoName, 'topologyName': this.topologyName };
    }
    else if ('tierGroupId' in entity) {
      this.configProfileService.nodeData = { 'nodeType': 'tierGroup', 'nodeId': entity.tierGroupId, 'nodeName': entity.tierGroupName, 'topologyName': this.topologyName };
    }
    else if ('tierId' in entity) {
      this.configProfileService.nodeData = { 'nodeType': 'tier', 'nodeId': entity.tierId, 'nodeName': entity.tierName, 'topologyName': this.topologyName };
    }
    else if ('serverId' in entity) {
      this.configProfileService.nodeData = { 'nodeType': 'server', 'nodeId': entity.serverId, 'nodeName': entity.serverDisplayName, 'topologyName': this.topologyName };
    }
    else if ('instanceId' in entity) {
      this.configProfileService.nodeData = { 'nodeType': 'instance', 'nodeId': entity.instanceId, 'nodeName': entity.instanceDisplayName, 'topologyName': this.topologyName };
    }

    //Observable profile name
    this.configProfileService.profileNameObserver(entity.profileName);
    this.configProfileService.getProfileAgent(entity.profileName).subscribe(data => {
      sessionStorage.setItem("agentType", data);
      if (this.url.includes("/tree-main/topology/")) {
        this.router.navigate([this.ROUTING_PATH + '/tree-main/topology/profile/configuration', entity.profileId]);
      }
      else {
        this.router.navigate([this.ROUTING_PATH + '/tree-main/profile/configuration', entity.profileId]);
      }
    })

  }


  disableProfInstance(instanceId, flag, profileID) {
    this.configTopologyService.disableProfInstance(instanceId, flag, profileID).subscribe(data => {
      if (data.enabled == "true") {
        this.configUtilityService.infoMessage("Instance enabled sucessfully.");
      }
      else {
        this.configUtilityService.infoMessage("Instance disabled sucessfully.");
      }
    });
  }

  //To open auto instr configuration dialog
  openAutoInstrDialog(name, id, type, profileId, profileName) {

    if (this.configHomeService.trData.status == null) {
      this.configUtilityService.errorMessage("Could not start instrumentation, Session is not running")
      return;
    }
    if (sessionStorage.getItem("isSwitch") === 'false') {
      this.configUtilityService.errorMessage("Please enable Session toggle button for AI");
      return;
    }
    if (type == "Java" || type == "DotNet" || type == "Dot Net" || type == "java" || type == "PHP" || type == "Php" || type == "php") {
      this.passAIDDserverEntity = this.serverEntity;
      this.passAIDDSettings = [name, id, type, this.tierName, this.serverName, this.serverId, profileId, "btName", "ND ConfigUI", "running", sessionStorage.getItem("isTrNumber")];
      this.showInstr = true;
    }
    else {
      this.configUtilityService.errorMessage("Could not start AI, supported only for Java, Php and Dot Net");
      return;
    }
  }

  closeAIDDDialog(isCloseAIDDDialog) {
    this.showInstr = isCloseAIDDDialog;
  }

  closeMemoryProfileDialog(isClosedMemProfDialog) {
    this.isOpenMemProfDialog = isClosedMemProfDialog;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  setTopologyData(data) {
    this.showInstr = false;
    this.topologyData = data;
  }

  //To stop auto-insrumentation
  stopInstrumentation(instanceName, id, agentType) {
    let desc: any = "";
    let that = this;
    let strSetting = "";
    this.currentInsId = id
    //if test is offline mode, return (no run time changes)
    if (this.configHomeService.trData.switch == false || this.configHomeService.trData.status == null) {
      return;
    }

    else {
      //Getting keywords data whose values are different from default values
      const url = `${URL.RUNTIME_CHANGE_AUTO_INSTR}`;
      //Getting the type of AI process running(AI/DD)
      this.configTopologyService.getInstanceDesc(id, +sessionStorage.getItem("topoId")).subscribe(data => {
        desc = data.toString();
        //If radio button for AI is selected
        if (desc.endsWith("#AI"))
          strSetting = "enableAutoInstrSession=0;"

        //If radio button for DD is selected
        else {
          strSetting = "enableDDAI=0;";
        }
        this.t_s_i_name = this.splitTierServInsName(instanceName)
        let name = this.createTierServInsName(instanceName)
        //Merging configuration and instance name with #
        strSetting = strSetting + "#" + this.createTierServInsName(instanceName) + "#" + agentType;

        //Saving settings in database
        let success = this.configTopologyService.sendRTCTostopAutoInstr(url, strSetting, name, this.t_s_i_name, function (data) {

          //Check for successful RTC connection  
          if (data.length != 0 || !data[0]['contains']) {
            that.configTopologyService.updateAIEnable(that.currentInsId, false, "stop", that.topologyName).subscribe(data => {
              that.configTopologyService.getInstanceDetail(that.serverId, that.serverEntity, that.topologyName).subscribe(data => {

                that.topologyData = data;
              });
              that.configHomeService.getAIStartStopOperationValue(false);
            })
          }
        })
      })
    }
  }

  // Create Tier_Server_Instance name
  splitTierServInsName(instanceName) {
    this.t_s_i_name = this.tierName + "_" + this.serverName + "_" + instanceName
    // this.sessionName = this.t_s_i_name
    return this.t_s_i_name;
  }

  // Create Tier>Server>Instance name
  createTierServInsName(instanceName) {
    let name = this.tierName + ">" + this.serverName + ">" + instanceName
    return name;
  }
  accessMessage() {
    this.configUtilityService.errorMessage("Permission Denied!!!")
  }
 
  displayToastMsg(data, trNo, trSwitch, isRunningApp)
  {
    if(typeof(isRunningApp) != "string")
      isRunningApp = isRunningApp.toString();
    if(data.profileName != null && (trNo == "null" || !trSwitch || isRunningApp == "false"))
      this.configUtilityService.successMessage("Saved Successfully"); 
    else if(data.profileName != null && trNo != "null" && trSwitch && isRunningApp == "true")
      this.configUtilityService.successMessage("Saved and RTC applied Successfully");
    else
      this.configUtilityService.errorMessage("No runtime changes applied");
  }

  sendRunTimeChange(url, callback) {
    let rtcMsg
    let rtcErrMsg;
    let rtcInfo;
    let URL = `${url}`;
    this._restApi.getDataByGetReq(URL).subscribe(
      data => {
        if (this.currentEntity == CONS.TOPOLOGY.TOPOLOGY)
        {
            this.updateTopo(data);
            this.displayToastMsg(data, sessionStorage.getItem("isTrNumber"), this.configHomeService.trData.switch, data.runningApp);
	  if(data.runTimeInfo != "NA")
            rtcInfo = data.runTimeInfo; 
        }
        else
        {
          this.updateTopo(data.topoDetailsInfo);  
          rtcInfo = data.runTimeInfo[0];
          this.displayToastMsg(data.topoDetailsInfo, sessionStorage.getItem("isTrNumber"), this.configHomeService.trData.switch, data.runningApp);
        }
        //For partial RTC
        /**
         * nd_control_rep:action=modify;result=PartialError;NodeJS:Mew:Instance1=48978;
         * NodeJS:Mew:Instance2=Currently disconnected trying to reconnect;
         */
        if (rtcInfo.includes("PartialError")) {
          let arrPartialErr = []
          let arrPartialID = []
          let arr = rtcInfo.split(";");
          for (let i = 2; i < arr.length - 1; i++) {

            //if instance is equal to numeric, then RTC is applied on that insatnce
            if (isNaN(parseInt(arr[i].substring(arr[i].lastIndexOf("=") + 1))))
              arrPartialErr.push(arr[i]);
            else
              arrPartialID.push(arr[i]);
          }
          rtcMsg = arrPartialID;
          rtcErrMsg = arrPartialErr;
        }

        //When runtime changes are applied then result=Ok
        else if (rtcInfo.includes("result=OK") || rtcInfo.includes("result=Ok")) {
          // this.configUtilityService.infoMessage("Saved and Runtime changes applied successfully");
          let that = this;

          //Setting timeout of 2 seconds 
          setTimeout(function () {
            // Whatever you want to do after the wait 
          }, 1000);

          rtcMsg = [];
          rtcErrMsg = [];
        }
        else if (rtcInfo.includes("NoChangesInConfiguration")) {
          // this.configUtilityService.errorMessage("No changes in Configuration !!!");
          rtcMsg = [];
          rtcErrMsg = [];
        }
        //When result=Error, then no RTC applied
        else {
          // this.configUtilityService.errorMessage(" No runtime changes applied");
          rtcMsg = [];
          rtcErrMsg = [];
        }
        callback(rtcMsg, rtcErrMsg);
      },
      error => {
        //When runtime changes are not applied
        this.configUtilityService.errorMessage("Error : See the agent logs");
        return;
      }
    );
  }
  //This method is used to fetch the DL applied profile list
  loadDLAppliedProfile()
  {
    this.configProfileService.getDLAppliedProfName().subscribe(data => {
      this.dlAppliedProfileList = data;
    });
  }

  openMemProf(instanceName, instanceId, type, profileId) {
    if (this.configHomeService.trData.status == null) {
      this.configUtilityService.errorMessage("Could not start Memory Profiling, Session is not running")
      return;
    }
    if (sessionStorage.getItem("isSwitch") === 'false') {
      this.configUtilityService.errorMessage("Please enable Session toggle button for Memory Profiling");
      return;
    }
    if (type == "Java") {
      this.memProfServerEntity = this.serverEntity;
      this.memProfSettings = [instanceName, instanceId, type, this.tierName, this.serverName, this.serverId, this.topologyEntity.topoName, "running", sessionStorage.getItem("isTrNumber")];
      this.isOpenMemProfDialog = true;
    }
    else {
      this.configUtilityService.errorMessage("Could not start Memory Profiling, supported only for Java.");
      return;
    }
  }

  setServerData(data) {
    this.topologyData = data;
    this.isOpenMemProfDialog = false;
  }

  openMutexLock(instanceName, instanceId, type, profileId) {
    if (this.configHomeService.trData.status == null) {
      this.configUtilityService.errorMessage("Could not start Mutex Lock Profiling, Session is not running.")
      return;
    }
    if (sessionStorage.getItem("isSwitch") === 'false') {
      this.configUtilityService.errorMessage("Please enable Session toggle button for Mutex Lock Profiling.");
      return;
    }
    if (type == "Java") {
      this.mutexLockServerEntity = this.serverEntity;
      this.mutexLockSettings = [instanceName, instanceId, type, this.tierName, this.serverName, this.serverId, this.topologyEntity.topoName, "running", sessionStorage.getItem("isTrNumber")];
  
      this.isOpenMutexLockDialog = true;
    }
    else {
      this.configUtilityService.errorMessage("Could not start ML, supported only for Java.");
      return;
    }
  }

  closeMutexLockDialog(isClosedMutexLockDialog) {
    this.isOpenMutexLockDialog = isClosedMutexLockDialog;
  }

  setServerAndTopoData(data) {
    this.topologyData = data;
    this.isOpenMutexLockDialog = false;
  }
}
