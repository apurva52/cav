import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CavConfigService } from 'src/app/pages/tools/configuration/nd-config/services/cav-config.service';
import { AccesControlDataService } from 'src/app/pages/tools/admin/access-control-V1/services/acces-control-data.service';
//import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { SortEvent } from 'primeng/api';
import { SessionService } from 'src/app/core/session/session.service';


export interface TabDetails {
  name: String,
  label: String,
  link: String;
  selectedStatus: boolean;
}

export const left_Tab: TabDetails[] = [
  { name: "Environment List", label: "Environment List", link: "home/EnvironmentTab", selectedStatus: true }
  , { name: "Build Information", label: "Build Information", link: "home/EnterPriseHome", selectedStatus: false },
  // {name:"Usage Information", label:"Usage Information", link:"Usage Information", selectedStatus:false},
  // {name:"Health", label:"Health", link:"Health", selectedStatus:false},
]

@Component({
  selector: 'EnterpriseNode',
  templateUrl: './enterprise-node.component.html',
  styleUrls: ['./enterprise-node.component.scss'],
})
export class EnvironmentNodeComponent implements OnInit {

  //@ViewChild('navSideBar') menuSideNav: MatSidenav;
  //@BlockUI() blockUI: NgBlockUI;
  toUseNodeInfo = new Array();
  cols: any;
  toggleSidebar: boolean = true;
  productKeyEncrypted: String;
  resTabList: TabDetails[];
  forNodeInfoResponse: any;
  resFromService: any;
  tabIndex = 0;
  isMultiDcCluster = false;
  className = "EnvironmentNodeComponent";
  listItems = new Array();
  res: [];
  noOfBuildInfo: number;
  previousIndex = 0;
  nodeCount = 0;
  data: any
  TabDetails: any;
  productKey: String;
  saasDomain: String;
  responseFromRest: any;
  buildInformation = new Array();
  userName: String;
  ipListForBuildService = [];
  saasIpForValidation: any;
  isProjectClusterNotPresent = false;
  saasGroupList: String;
  isAdminUser = false;
  visitedBuildTab = false;
  nodeCountPerCluster: number;
  isEnterPriseUser = false;
  public searchInput: String = '';
  public searchInputForBuild: String = '';
  public searchResult: Array<any> = [];
  public searchResultForBuildInfo: Array<any> = [];
  productKeyFromSaas: String;
  buildDataFlag:boolean=false;
  username: any;
  constructor(private _router: Router, private http: HttpClient, private _config: CavConfigService,private sessionService: SessionService, private _accessControlService: AccesControlDataService) {
    this.productKey =  this.sessionService.session.cctx.pk;
    this.username =  this.sessionService.session.cctx.u;
    if ('true') {
      this.isAdminUser = true;
      this.http.get(_config.$serverIP + 'DashboardServer/acl/EnterPrise/getProjectClusterList?productKey=' + this.productKey).pipe(res => <any>res).subscribe(res => (this.listOfNodeFromService(res)));
    }
    else {
      this.http.get(_config.$serverIP + 'DashboardServer/acl/EnterPrise/getProjectClusersForUser?productKey=' + this.productKey).pipe(res => <any>res).subscribe(res => (this.listOfNodeFromService(res)));
    }
    this.userName = sessionStorage.getItem('sesLoginName');
    if (sessionStorage.getItem('samlEnabled') == '0' || sessionStorage.getItem('samlEnabled') == undefined || sessionStorage.getItem('samlEnabled') == 'undefined')
      this.saasGroupList = sessionStorage.getItem('ndconfigGroup');
    else
      this.saasGroupList = sessionStorage.getItem('oktaGroupList');

    if (sessionStorage.getItem('isEnterpriseUser') == 'true')
      this.isEnterPriseUser = true;

    if ((localStorage.getItem('ipOfSaas') == null) || localStorage.getItem('ipOfSaas').length == 0 || localStorage.getItem('ipOfSaas') == undefined) {
      if (this._config.$port != null && this._config.$port != undefined && this._config.$port != "") {
        this.saasIpForValidation = this._config.$host + ":" + this._config.$port;
      } else {
        this.saasIpForValidation = this._config.$host;
      }
      this.saasDomain = 'https://' + this.saasIpForValidation + '/UnifiedDashboard'
    } else {
      this.saasIpForValidation = localStorage.getItem('ipOfSaas')
      this.saasDomain = 'https://' + localStorage.getItem('ipOfSaas') + '/UnifiedDashboard'
    }
    if ((localStorage.getItem('productKey') == null) || localStorage.getItem('productKey').length == 0 || localStorage.getItem('productKey') == undefined) {
      this.productKeyFromSaas = this.productKey;
    } else {
      this.productKeyFromSaas = localStorage.getItem('productKey');
    }
    this.cols = [
      { field: 'col2', header: 'Machine/Environment Name' },
      { field: 'col3', header: 'Build Version' },
      { field: 'col4', header: 'Upgrade Date/Time (yyyy/mm/dd hh/mm/ss)' }
    ];

    //    this.buildInformation.push({'col2':31, 'col3': '2020-09-08 03:49:12', 'col4':});
    //    this.buildInformation.push( {'col2':34, 'col3': '2020-09-08 03:49:12'})
  }

  listOfNodeFromService(res): void {
    try {
      if (res != null && res.data != null)
        if (!this.isAdminUser && res.data.projectClusterList.length === 1) {
          let ip = res.data.projectClusterList[0]['uiExternalDomain'];
          let port = res.data.projectClusterList[0]['uiPort'];
          let isMaster = false;
          if (res.data.projectClusterList[0]['isMaster'] === 1) {
            isMaster = true;
          }
          let url = `https://{{n.ip}}:{{n.port}}/UnifiedDashboard/sso.html?userName={{userName}}&requestFrom=SAML&oktaGroupList={{saasGroupList}}&saasIpForValidation={{saasIpForValidation}}&productKeyFromSaas={{productKeyFromSaas}}&isMultiDcCluster={{n.isMultiDcCluster}}&saasDomain={{saasDomain}}`;
          console.log('url:' + url);
          sessionStorage.clear;
          localStorage.clear;
          window.open(url, '_self');
          return;
        }
      if (res != null && (res.data == null || res.data.projectClusterList.length === 0)) {
        this.isProjectClusterNotPresent = true;
        return;
      }
      for (let i = 0; i < res.data.projectClusterList.length; i++) {
        this.toUseNodeInfo.push(res.data.projectClusterList[i]);
      }
      this.toFillDetailsOfNodes(this.toUseNodeInfo);
    }
    catch (e) {
      throw new Error("exception in method listOfNodeFromService of " + this.className);
    }
  }

  toFillDetailsOfNodes(nodeInfo) {
    try {
      if (nodeInfo) {
        for (let i = 0; i < nodeInfo.length; i++) {
          if (nodeInfo[i]['isMaster'] == 1) {
            this.isMultiDcCluster = true;
            this.listItems.push({ "ico": "icons8 icons8-tree-structure", "host": nodeInfo[i]['externalDomain'], "ip": nodeInfo[i]['uiExternalDomain'], "port": nodeInfo[i]['uiPort'], 'numberOfNodes': nodeInfo[i]['numberOfNodes'], 'isMultiDcCluster': this.isMultiDcCluster, 'statusFlag': nodeInfo[i]['activeFlag'] })
            this.nodeCount = this.nodeCount + nodeInfo[i]['numberOfNodes']
            this.ipListForBuildService.push(nodeInfo[i]['uiExternalDomain'] + ":" + nodeInfo[i]['uiPort'])
          } else {
            this.isMultiDcCluster = false;
            this.listItems.push({ "ico": "icons8 icons8-computer", "host": nodeInfo[i]['externalDomain'], "ip": nodeInfo[i]['uiExternalDomain'], "port": nodeInfo[i]['uiPort'], 'numberOfNodes': nodeInfo[i]['numberOfNodes'], 'isMultiDcCluster': this.isMultiDcCluster, 'statusFlag': nodeInfo[i]['activeFlag'] })
            this.nodeCount = this.nodeCount + nodeInfo[i]['numberOfNodes']
            this.ipListForBuildService.push(nodeInfo[i]['uiExternalDomain'] + ":" + nodeInfo[i]['uiPort'])
          }
        }
      }
    }
    catch (e) {
      throw new Error("exception in method toFillDetailsOfNodes of " + this.className);
    }
  }

  fetchEnvironments(event: any) {
    if (event.target.value === '')
      return this.searchResult = [];

    this.searchResult = this.listItems.filter((series) => {
      return series.host.toLowerCase().includes(event.target.value.toLowerCase());
    })
  }

  fetchBuildInfo(event: any) {
    if (event.target.value === '')
      return this.searchResultForBuildInfo = [];

    this.searchResultForBuildInfo = this.buildInformation.filter((series) => {
      return series.col2.toLowerCase().includes(event.target.value.toLowerCase());
    })
  }

  handleChangeForTabs(e) {
    if (e.index == 1 && !this.visitedBuildTab) {
      this.getBuildInfoForNodes()
    }
  }

  getBuildInfoForNodes() {
   // this.blockUI.start();
    this.visitedBuildTab = true;
    this.http.get(this._config.$serverIP + 'DashboardServer/acl/EnterPrise/getBuildInfoForNodes?productKey=' + this.productKey + '&listOfAccessPoints=' + this.ipListForBuildService).pipe(res => <any>res).subscribe(res => {
      if (res['status'] == 'success') {

        this.toFillBuildData(res);
      }
      if (res['status'] == 'error') {
        this.buildInformation.push({ 'col2': 'Unable to fetch Node builds', 'col3': 'Unable to fetch Node builds', 'col4': 'Unable to fetch Node builds' });

      }
    });

  }
 toFillBuildData(res) {
    this.noOfBuildInfo = res['data'].length;

    if(this.noOfBuildInfo > 0 && res['data'][0].ip != '' ){

      this.buildDataFlag=true;
      for (let i = 0; i < this.noOfBuildInfo; i++) {
          if (res['data'][i]['buildDataPresent'] == true || res['data'][i]['buildDataPresent'] == 'true')
            this.buildInformation.push({ 'col2': res['data'][i]['ip'], 'col3': res['data'][i]['latestBuild'], 'col4': res['data'][i]['lattestBuildDate'] });
          else
            this.buildInformation.push({ 'col2': res['data'][i]['ip'], 'col3': 'Build Info Not Available', 'col4': 'Build Info Not Available' });
  
        
          }

    }
    else
      this.buildDataFlag=false; 
      
    
    //this.blockUI.stop();
      
    }

  sortTableOfbuildInfo(event: SortEvent) {
    event.data.sort((data1, data2) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      let result = null;

      if (value1 == null && value2 != null)
        result = -1;
      else if (value1 != null && value2 == null)
        result = 1;
      else if (value1 == null && value2 == null)
        result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2);
      else
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

      return (event.order * result);
    });
  }



  ngOnInit() {
    this.resTabList = left_Tab;
    // throw new Error("Method not implemented.");
  }
}


