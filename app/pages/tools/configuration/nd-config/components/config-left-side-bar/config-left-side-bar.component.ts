import { Component, OnInit } from '@angular/core';
import { ROUTING_PATH } from '../../constants/config-url-constant';
import{ HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { CavConfigService } from '../../services/cav-config.service';
import { ConfigHomeService } from '../../services/config-home.service';
import { ConfigRestApiService} from '../../services/config-rest-api.service';
@Component({
  selector: 'app-config-left-side-bar',
  templateUrl: './config-left-side-bar.component.html',
  styleUrls: ['./config-left-side-bar.component.css']
})
export class ConfigLeftSideBarComponent implements OnInit {

  navMenuArray = [];
  ROUTING_PATH = ROUTING_PATH;

  noProfilePerm: boolean;
  noAppPerm: boolean;
  noTopoPerm: boolean;
  noAutodisPerm: boolean;
  noInstrProfPerm: boolean;
  noPerm  = [];
  adminMode:boolean;
  //display: boolean = true;
  constructor(private http: HttpClient,private router: Router, private _config: CavConfigService, private configHomeService: ConfigHomeService,private configRestApiService : ConfigRestApiService) { }

  ngOnInit() {
  var userName = sessionStorage.getItem('sesLoginName');
   // var passWord =  sessionStorage.getItem('sesLoginPass');
    //  let productKey = this._config.$productKey;
    // let productKey=sessionStorage.getItem('productKey');
    // let url = this._config.getURLByActiveDC();
    // url = this.configRestApiService.getURLRegardingMultiDCForPermission(url);
    // url = url + '/DashboardServer/acl/user/authenticateNDConfigUI?userName=' + userName  + '&productKey=' +productKey;
    // this.http.get(url).map(res =><any> res).subscribe(data => {
    //   sessionStorage.setItem("ProfileAccess",data["Profile"]);
    //   sessionStorage.setItem("ApplicationAccess",data["Application"]);
    //   sessionStorage.setItem("TopologyAccess",data["Topology"]);
    //   sessionStorage.setItem("InstrProfAccess",data["InstrumentationProfileMaker"]);
    //   sessionStorage.setItem("AutoDiscoverAccess",data["AutoDiscover"]);
      
    //       if(+data["Profile"] == 0)
    //         this.noPerm.push("Profile");

    //       if(+data["Application"] == 0)
    //         this.noPerm.push("Application");

    //       if(+data["Topology"] == 0)
    //         this.noPerm.push("Topology");

    //         if(+data["AutoDiscover"] == 0)
    //         this.noPerm.push("Auto Discover");

    //       if(+data["InstrumentationProfileMaker"] == 0)
    //         this.noPerm.push("Instrumentation Profile Maker");

         this.configHomeService.getMainData().subscribe(data => {
      this.adminMode = data.adminMode;
      /* Main Menu Array.  */
      if(this.adminMode)
          /* Main Menu Array.  */
          this.navMenuArray = [
            { label: "Home", route: `${ROUTING_PATH}/homee`, icon: "icons8 icons8-home", tooltip: "Home" },
            { label: "Application", route: `${ROUTING_PATH}/application-list`, icon: "icons8 icons8-laptop-metrics", tooltip: "Application" },
            { label: "Profile", route: `${ROUTING_PATH}/profile/profile-list`, icon: "icons8 icons8-resume-website", tooltip: "Profile" },
            { label: "Topology", route: `${ROUTING_PATH}/topology-list`, icon: "icons8 icons8-flow-chart", tooltip: "Topology" },
            { label: "Instrumentation Profile Maker" , route: `${ROUTING_PATH}/instrumentation-profile-maker`, icon: "icons8 icons8-sync-settings", tooltip: "Instrumentation Profile Maker"},
	    { label: "Auto Discover", route: `${ROUTING_PATH}/auto-discover`, icon: "icons8 icons8-search-property", tooltip: "Instrumentation Finder" },
            { label: "NDE Cluster Configuration", route: `${ROUTING_PATH}/nde-cluster-config`, icon: "icons8 icons8-tree-structure", tooltip: "NDE Cluster Configuration" },
	    { label: "User Configured Settings", route: `${ROUTING_PATH}/user-configured-keywords`, icon: "icons8 icons8-settings", tooltip: "User Configured Settings" },
      { label: "Download Agent logs", route: `${ROUTING_PATH}/bci-logs`, icon: "icons8 icons8-installing-updates", tooltip: "Download Agent logs" },
	//Memory Profiler and Mutex Lock has been Moved to actions module...
      //{ label: "Memory Profiler", route: `${ROUTING_PATH}/memory-profiler`, icon: 'icons8 icons8-microchip', tooltip: "Memory Profiler" },
      // { label: "Mutex Lock", route: `${ROUTING_PATH}/mutex-lock`, icon: 'icons8 icons8-play', tooltip: "Mutex Lock" },
      { label: "Audit Log", route: `${ROUTING_PATH}/audit-log-view`, icon: "icons8 icons8-spreadsheet-file", tooltip: "Audit Log" },
          ];
      else
	      this.navMenuArray = [
        { label: "Home", route: `${ROUTING_PATH}/homee`, icon: "icons8 icons8-home", tooltip: "Home" },
        { label: "Application", route: `${ROUTING_PATH}/application-list`, icon: "icons8 icons8-laptop-metrics", tooltip: "Application" },
        { label: "Profile", route: `${ROUTING_PATH}/profile/profile-list`, icon: "icons8 icons8-resume-website", tooltip: "Profile" },
        { label: "Topology", route: `${ROUTING_PATH}/topology-list`, icon: "icons8 icons8-flow-chart", tooltip: "Topology" },
        { label: "Instrumentation Profile Maker" , route: `${ROUTING_PATH}/instrumentation-profile-maker`, icon: "icons8-sync-settings", tooltip: "Instrumentation Profile Maker"},
        { label: "Auto Discover", route: `${ROUTING_PATH}/auto-discover`, icon: "icons8 icons8-search-property", tooltip: "Instrumentation Finder" },
        { label: "NDE Cluster Configuration", route: `${ROUTING_PATH}/nde-cluster-config`, icon: "icons8 icons8-tree-structure", tooltip: "NDE Cluster Configuration" },
  { label: "Download Agent logs", route: `${ROUTING_PATH}/bci-logs`, icon: "icons8 icons8-installing-updates", tooltip: "Download Agent logs" },
  //Memory Profiler and Mutex Lock has been Moved to actions module...
  //{ label: "Memory Profiler", route: `${ROUTING_PATH}/memory-profiler`,icon: 'icons8 icons8-microchip', tooltip: "Memory Profiler" },
  // { label: "Mutex Lock", route: `${ROUTING_PATH}/mutex-lock`, icon: 'icons8 icons8-play', tooltip: "Mutex Lock" },
  { label: "Audit Log", route: `${ROUTING_PATH}/audit-log-view`, icon: "icons8 icons8-spreadsheet-file", tooltip: "Audit Log" }
      ];
    }
    );
        
        //   for(let i=0;i<this.navMenuArray.length;i++){
        //     for(let j=0;j<this.noPerm.length;j++){
        //       if (this.navMenuArray[i]['label'] == this.noPerm[j]) {
        //         this.navMenuArray.splice(i,1);
        //         i--;
        //       }
        //     }
        //   }
        //   if(this.navMenuArray.length == 3){
        //     for(let m=0;m<this.navMenuArray.length;m++){
        //     if(this.navMenuArray[m]['label'] == "Auto Discover")
        //       this.router.navigate(['/home/config/auto-discover']);
        //     else if(this.navMenuArray[m]['label'] == "Instrumentation Profile Maker")
        //       this.router.navigate(['/home/config/instrumentation-profile-maker']);
        //     }
        // }
        //   if(+data["Profile"] == 0 && +data["Application"] == 0 && +data["Topology"] == 0){
        //   if(this.navMenuArray.length == 4){
        //     this.router.navigate(['/home/config/auto-discover']);
        //   }
        // }
        //  });
  }

}
