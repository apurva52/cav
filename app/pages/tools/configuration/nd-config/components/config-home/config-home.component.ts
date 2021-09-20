import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationInfo } from '../../interfaces/application-info';
import { ConfigHomeService } from '../../services/config-home.service';
import { ConfigProfileService } from '../../services/config-profile.service'
import { ConfigApplicationService } from '../../services/config-application.service';
import { ConfigUtilityService } from '../../services/config-utility.service';
import { ConfigKeywordsService } from './../../services/config-keywords.service';

import { MainInfo } from '../../interfaces/main-info';
import { EntityInfo } from '../../interfaces/entity-info';
import { NDAgentInfo } from '../../interfaces/nd-agent-info';
import { ROUTING_PATH } from '../../constants/config-url-constant';
import { ConfigUiUtility } from '../../utils/config-utility';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { ImmutableArray } from '../../utils/immutable-array';
import { CavConfigService } from '../../services/cav-config.service';
import {HttpErrorResponse} from '@angular/common/http';
// import { CavCommonUtils } from "../../services/cav-common-utils.service";

import {ConfigRestApiService} from '../../services/config-rest-api.service';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-config-home',
  templateUrl: './config-home.component.html',
  styleUrls: ['./config-home.component.css']
})
export class ConfigHomeComponent implements OnInit {

  /**It stores application Info */
  applicationInfo: EntityInfo[];
  /**It stores topology Info */
  topologyInfo: EntityInfo[];
  /**It stores profile Info */
  profileInfo: EntityInfo[];
  // It stores all the information regarding ND agents
  agentsInfo: NDAgentInfo[];
  //For showing import technologies dialog
  importTopo: boolean = false;
  ROUTING_PATH = ROUTING_PATH;

  applicationMsg: string;
  profileInfoMsg: string;
  topologyInfoMsg: string;
  topologyList = [];
  selectedTopology: string;
  topoPermission:boolean;
  appPerm: boolean;
  profilePerm: boolean;
  noProfilePerm: boolean;
  noAppPerm: boolean;
  noTopoPerm:boolean;
  isHomePermDialog: boolean;
    //Applied profile list
    appliedProfileList = [];
    //DL applied profile list
    dlAppliedProfileList = [];
    //To store running application
    runningApp: string = "";
  
  refreshIntervalTime = 30000;
  subscription: Subscription;
  breadcrumb: BreadcrumbService; 
  constructor(private configKeywordsService: ConfigKeywordsService, private http: HttpClient,private configHomeService: ConfigHomeService, private configUtilityService: ConfigUtilityService, private configProfileService: ConfigProfileService, private configApplicationService: ConfigApplicationService, private router: Router,private _config: CavConfigService,private configRestApiService : ConfigRestApiService, breadcrumbService: BreadcrumbService) {
    this.breadcrumb = breadcrumbService;
  }

  ngOnInit() {
	this.breadcrumb.removeAll();
	this.breadcrumb.add({label: 'Agent Config', routerLink: '/nd-agent-config/homee'});
    this.configHomeService.getTestRunStatus().subscribe(data => 
      {
      sessionStorage.setItem("isTrNumber", data.trData.trNo);

	/** Get list of applied profile in the application */
        this.configProfileService.getListOfAppliedProfile((data) => {
          this.appliedProfileList = data
          this.appliedProfileList = this.appliedProfileList.filter((name) => {
            if(name != 'default_Java' && name != 'default_NodeJS' && name != 'default_DotNet' && name != 'default_Php' && name != 'default_Python' )
              return name;
          })
    //this.configHomeService.getAIStartStopOperationOnHome();
    var userName = sessionStorage.getItem('sesLoginName');
   // var passWord =  sessionStorage.getItem('sesLoginPass');
   // let productKey = this._config.$productKey;
    let productKey=sessionStorage.getItem('productKey');
    // let url = this._config.getURLByActiveDC();
    // url = this.configRestApiService.getURLRegardingMultiDCForPermission(url);
    // url = url + '/DashboardServer/acl/user/authenticateNDConfigUI?userName=' + userName +  '&productKey=' +productKey;
    // this.http.get(url).map(res =><any> res).subscribe(data => {
          sessionStorage.setItem("ProfileAccess",'6');
          sessionStorage.setItem("ApplicationAccess",'6');
          sessionStorage.setItem("TopologyAccess",'6');
          sessionStorage.setItem("InstrProfAccess",'6');
          sessionStorage.setItem("AutoDiscoverAccess",'6');
          this.appPerm=+sessionStorage.getItem("ApplicationAccess") == 4 ? true: false;
          this.profilePerm=+sessionStorage.getItem("ProfileAccess") == 4 ? true: false;
          this.topoPermission=+sessionStorage.getItem("TopologyAccess") == 4 ? true: false;
          this.noProfilePerm=+sessionStorage.getItem("ProfileAccess") == 0 ? true: false;
          this.noAppPerm=+sessionStorage.getItem("ApplicationAccess") == 0 ? true: false;
          this.noTopoPerm=+sessionStorage.getItem("TopologyAccess") == 0 ? true: false;
          if(this.noProfilePerm && this.noAppPerm && this.noTopoPerm)
            this.isHomePermDialog=true;
          this.loadHomeData();
	  this.loadDLAppliedProfile();
  //        },
	// error => {
  //           if (error.status === 400) {
  //             this._utils.clearSessiononSessionClose();
  //           }
        // });
});
        //If test is running then get the running application name
        let trNo = sessionStorage.getItem("isTrNumber");
        if(trNo != "null")
          this.loadRunningApp(trNo);
});
  }

  //To get the running application name when test is running
  loadRunningApp(trNo): any {
    this.configHomeService.getRunningApp(trNo).subscribe(data => {
      this.runningApp = data;
    })
  }

  /**Getting topology list , application list and profile list. */
  loadHomeData(): void {
    // this.loadTopologyList();
    this.configHomeService.getTopologyList().subscribe(data => {
      data = data.sort();
      this.topologyList = ConfigUiUtility.createListWithKeyValue(data, data);
      this.configApplicationService.addTopoDetails(data).subscribe(data => {
        this.configHomeService.getMainData()
        .subscribe(data => {
	
	  //Method to sort data on the basis of timeStamp.
          data.homeData[0].value.sort(function(a, b){
            var keyA = new Date(a.timestamp),
                keyB = new Date(b.timestamp);
            // Compare the 2 dates
            if(keyA < keyB) return -1;
            if(keyA > keyB) return 1;
            return 0;
          });

          if (data.homeData[0].value.length > 5) {
            this.applicationMsg = "(Last 5 Modified)";
            this.applicationInfo = (data.homeData[0].value).slice(data.homeData[0].value.length - 5, data.homeData[0].value.length).reverse();
          }
          else
          this.applicationInfo = (data.homeData[0].value).splice(0, data.homeData[0].value.length).reverse();
          
      /**    // This is done to remove default profiles if we are having the other profiles to show in home screen
          let tempArray = [];
        for (let i = 0; i < data.homeData[1].value.length; i++) {
          if (+data.homeData[1].value[i]["id"] == 1 || +data.homeData[1].value[i]["id"] == 777777 || +data.homeData[1].value[i]["id"] == 888888) {
            tempArray.push(data.homeData[1].value[i]);
          }
        }

        data.homeData[1].value.splice(0,5);
        for(let j=0;j<tempArray.length;j++){
          data.homeData[1].value=ImmutableArray.push(data.homeData[1].value, tempArray[j]);
        }
        if (data.homeData[1].value.length >= 5) {
		this.profileInfoMsg = "(Last 5/"+data.homeData[1].value.length+" Modified)";
	        this.profileInfo = (data.homeData[1].value).splice(0, 5);
          //  Commenting below line as we are reciecing profiles in descending order from backend.
          // this.profileInfo = (data.homeData[1].value).slice(data.homeData[1].value.length - 5, data.homeData[1].value.length).reverse();
        }
        else
        this.profileInfo = (data.homeData[1].value).splice(0, data.homeData[1].value.length);  */

	//Method to sort data on the basis of timeStamp.
          data.homeData[1].value.sort(function(a, b){
            var keyA = new Date(a.timestamp),
                keyB = new Date(b.timestamp);
            // Compare the 2 dates
            if(keyA < keyB) return -1;
            if(keyA > keyB) return 1;
            return 0;
          });

        if (data.homeData[1].value.length > 5) {
          this.profileInfoMsg = "(Last 5/"+data.homeData[1].value.length+" Modified)";
          this.profileInfo = (data.homeData[1].value).slice(data.homeData[1].value.length - 5, data.homeData[1].value.length).reverse();
        }
        else
        this.profileInfo = (data.homeData[1].value).splice(0, data.homeData[1].value.length).reverse();

	//Method to sort data on the basis of timeStamp.
        data.homeData[2].value.sort(function(a, b){
            var keyA = new Date(a.timestamp),
                keyB = new Date(b.timestamp);
            // Compare the 2 dates
            if(keyA < keyB) return -1;
            if(keyA > keyB) return 1;
            return 0;
        });
        
        if (data.homeData[2].value.length > 5) {
          this.topologyInfoMsg = "(Last 5 Modified)";
          this.topologyInfo = (data.homeData[2].value).slice(data.homeData[2].value.length - 5, data.homeData[2].value.length).reverse();
        }
        else
        this.topologyInfo = (data.homeData[2].value).splice(0, data.homeData[2].value.length).reverse();
          
        this.agentsInfo = data.agentData;
      })
    })
  })
    }

// importTopologyDialog() {
  //  this.loadTopologyList();
    //this.selectedTopology = "";
    //this.importTopo = true;
 // }

  importTopology(): void {
    this.configHomeService.importTopology(this.selectedTopology).subscribe(data => {
      for(let i=0;i<data.length;i++){
        if(data[i].timestamp==null)
          data[i].timestamp="-";
      } 
      if (data.length > 5) {
        this.topologyInfoMsg = "(Last 5 Modified)";
        this.topologyInfo = (data).slice(data.length - 5, data.length).reverse();
      }
      else
        this.topologyInfo = (data).splice(0, data.length).reverse();

      this.configUtilityService.infoMessage("Topology imported successfully");
    });
    this.importTopo = false;
  }

  routeToTreemain(selectedTypeId, selectedName, type) {
    sessionStorage.setItem("agentType", "");
     sessionStorage.setItem("showserverinstance", "false");
	sessionStorage.setItem("isAppliedProfile", "false");
    //Observable application name
    if (type == 'topology') {
      //it routes to (independent) topology screen
      this.configApplicationService.applicationNameObserver(selectedName);
      this.router.navigate([this.ROUTING_PATH + '/tree-main/topology', selectedTypeId]);
      this.breadcrumb.add({label: 'Topology List', routerLink: `/nd-agent-config/topology-list`});
    }
    else {
      this.configApplicationService.applicationNameObserver(selectedName);
      this.router.navigate([this.ROUTING_PATH + '/tree-main', selectedTypeId]);
      this.breadcrumb.add({label: 'Application List', routerLink: `/nd-agent-config/topology-list`});
    }
    this.breadcrumb.add({label: 'Topology Details', routerLink: `/nd-agent-config/tree-main/topology/${selectedTypeId}`});
  }

  routeToConfiguration(selectedProfileId, selectedProfileName, entity,selectedProfileAgent) {
  sessionStorage.setItem("agentType", selectedProfileAgent);
      //Check if the selected profile is applied at running application or not if yes then set in session
      if(this.appliedProfileList.includes(selectedProfileName)){
        sessionStorage.setItem("isAppliedProfile", "true");
      }
      else{
        sessionStorage.setItem("isAppliedProfile", "false");
      }
    if (!('topoId' in entity) && !('tierId' in entity) && !('serverId' in entity) && !('instanceId' in entity))
      this.configProfileService.nodeData = { 'nodeType': null, 'nodeId': null, 'nodeName' : null, 'topologyName' : null };

    //Observable profile name
    this.configProfileService.profileNameObserver(selectedProfileName);
    this.router.navigate([this.ROUTING_PATH + '/profile/configuration', selectedProfileId]);
    this.breadcrumb.add({label: 'Profile List', routerLink: '/nd-agent-config/profile/profile-list'});
  }
  redirectToPage(){
    if(+sessionStorage.getItem("AutoDiscoverAccess") != 0)
      this.router.navigate(['/home/config/auto-discover']);
    else
      this.router.navigate(['/home/config/instrumentation-profile-maker']);
    this.isHomePermDialog=false;
  }
/**
 * Purpose : To invoke the service responsible to open Help Notification Dialog 
 * related to the current component.
 * @param value 
 */
  sendHelpNotification(value:string) {
    if(value == "Application"){
      this.configKeywordsService.getHelpContent("Home","Application" ,"");
    }
    if(value == "Profile"){
      this.configKeywordsService.getHelpContent("Home","Profile","");
    }
    if(value == "Topology"){
      this.configKeywordsService.getHelpContent("Home","Topology","");
    }
}

   //This method is used to fetch the DL apllied profile list
   loadDLAppliedProfile()
  {
    this.configProfileService.getDLAppliedProfName().subscribe(data => {
      this.dlAppliedProfileList = data;  
     }); 
  }
}
