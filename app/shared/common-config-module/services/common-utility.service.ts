import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
// import { Message, SelectItem } from 'primeng/primeng';
// import { DashboardMenuDef } from '../../modules/dashboard/containers/dashboard-menu-def';
// import { FeaturePermission } from '../../modules/dashboard/constants/feature-permission.enum';
// import {DISABLE_CONFIGURATION_TITLE, DISABLED_MENU_TITLE,DISABLE_MENU_ITEMS_FOR_SECURITY, NVSM_URL_LABEL} from '../../main/constants/cav-actions.constants'
// import { Logger } from '../../../vendors/angular2-logger/core';

@Injectable()
export class CommonUtilityService {
    
    // private classname = 'common-utility-service';

    // constructor(private log: Logger) { }

    // private isRevertDialog = new Subject();
    // isRevertDialog$ = this.isRevertDialog.asObservable();

    // public emitIsRevertDialog(data){
    //    this.isRevertDialog.next(data); 
    // }
    // /**It's for showing mesages */
    // private _message: Message[];

    // /*Observable for update message sources.*/
    // private _messageObser = new Subject<Message[]>();

    // /*Service message commands.*/
    // messageEmit(message) {
    //     this._messageObser.next(message);
    // }
    // /*Service Observable for getting update message.*/
    // messageProvider$ = this._messageObser.asObservable();


    /*Observable for update progress bar sources.*/
    private _progressBarObser = new Subject();

    /*Service message commands.*/
    progressBarEmit(flag) {
        this._progressBarObser.next(flag);
    }
    /*Service Observable for getting update message.*/
//     progressBarProvider$ = this._progressBarObser.asObservable();


//     public errorMessage(detail: string, summary?: string) {

//         if (summary == undefined)
//             this._message = [{ severity: 'error', detail: detail }];
//         else
//             this._message = [{ severity: 'error', summary: summary, detail: detail }];

//         this.messageEmit(this._message);
//     }

//     public infoMessage(detail: string, summary?: string) {

//         if (summary == undefined)
//             this._message = [{ severity: 'info', detail: detail }];
//         else
//             this._message = [{ severity: 'info', summary: summary, detail: detail }];

//         this.messageEmit(this._message);
//     }

//     public successMessage(detail: string, summary?: string) {

//         if (summary == undefined)
//             this._message = [{ severity: 'success', detail: detail }];
//         else
//             this._message = [{ severity: 'success', summary: summary, detail: detail }];

//         this.messageEmit(this._message);
//     }

//    // This is used for create drop down only with label
//     static createDropdown(list: any): SelectItem[] {
//         let selectItemList: SelectItem[] = [];

//         for (let index in list) {
//             if (list[index].indexOf("--Select") != -1) {
//                 selectItemList.push({ label: list[index], value: '' });
//             }
//             else {
//                 selectItemList.push({ label: list[index], value: list[index] });
//             }
//         }

//         return selectItemList;
//     }
   
//      // This is used for create drop down with label and value
//     static createListWithKeyValue(arrLabel: string[], arrValue: string[]): SelectItem[] {
//         let selectItemList = [];

//         for (let index in arrLabel) {
//             selectItemList.push({ label: arrLabel[index], value: arrValue[index] });
//         }

//         return selectItemList;
//     }

//     /*This method is used for get the permission on the basis of Feature*/
//     getPermissionforFeaturebyName (featurePermissionList:any[],featureName:string){
//       if(featurePermissionList == undefined|| featurePermissionList.length == 0) {
//         return FeaturePermission.READ_PERMISSION;
//       }
//       let index = featurePermissionList.map(function(e){return e.feature}).indexOf(featureName);
//       if(index> -1) {
//         if(featurePermissionList[index].permission != undefined ){
//           return featurePermissionList[index].permission;
//         }
//       }else {
//         return FeaturePermission.READ_PERMISSION;
//       }
  
//     }

//     findLabelInJSON(label, json) {
//       try {
      
//         if (label == json.label) {
//           return json;
//         } 
//         else if (Object.prototype.toString.call(json) === '[object Array]') {
      
//           for (var i = 0; i < json.length; i++) {
//             var obj = json[i];
//             var output = this.findLabelInJSON(label, obj);
//             if (output) {
//               return output;
//             }
      
//          };
      
//        } else if (json.items) {
      
//         for (var i = 0; i < json.items.length; i++) {
//           var obj = json.items[i];
//           var output = this.findLabelInJSON(label, obj);
//           if (output) {
//             return output;
//           }
//        };
//       } else {
//         return undefined;
//       }
      
//       } catch (e) {
//         this.log.error(this.classname, ' Method fillDataInComp. Exception ', e);
//       }
//     }

//     /*This is used for disabling the menu items on the basis of ACL Permissions*/
//     makeProductMenuOnBasisOfACLPermission(arrNavMenu, featurePermissionList) {
//       try {
//         for(let i=0;i<arrNavMenu.length;i++)
//         {
//           let featureName = arrNavMenu[i].feature;
//           if(featureName && featureName !== "")  {
//             if(this.getPermissionforFeaturebyName(featurePermissionList,featureName) < FeaturePermission.READ_PERMISSION) {
//               arrNavMenu[i].disabled = true;
//               arrNavMenu[i].title = DISABLED_MENU_TITLE;
//             }
//           }
             
//           if(arrNavMenu[i].items && arrNavMenu[i].items.length > 0)
//           {
//             this.makeProductMenuOnBasisOfACLPermission(arrNavMenu[i].items, featurePermissionList);
//           }
              
//        }
//       } catch (e) {
//         this.log.error(this.classname, ' Method makeProductMenuOnBasisOfACLPermission. Exception ', e);
//       }
//     }

//     /*This Method is used for configure the Sub menus of Reports. */
//     configureSubMenuForReports(arrNavMenu, showSummaryReports, readyReportsObj, drillDownReport, isOnlineTest) {
//       try {
//         if(arrNavMenu && arrNavMenu.length > 0 ) {
//           let reportsMenu = this.findLabelInJSON("Reports", arrNavMenu);
//           let reportSubMenu = reportsMenu.items;
//           if(reportSubMenu && reportSubMenu.length > 0) {
//             for(let i = 0 ; i < reportSubMenu.length; i++) {
//               if(reportSubMenu[i].label === "Metrics") {
//                   let metricsSubMenu = reportSubMenu[i].items;
//                   if(metricsSubMenu && metricsSubMenu.length > 0) {
//                     for(let j = 0 ; j < metricsSubMenu.length ; j++) {
//                       if(metricsSubMenu[j].label === "Summary Report" && showSummaryReports) {
//                         metricsSubMenu[j].disabled = true;
//                         metricsSubMenu[j].title = DISABLE_CONFIGURATION_TITLE;
//                         break;
//                       }
//                     }
//                   }
//               }else if(reportSubMenu[i].label === "Detailed") {
//                 let detailSubMenu = reportSubMenu[i].items;
//                 if(detailSubMenu && detailSubMenu.length > 0) {
//                   for(let j = 0 ; j < detailSubMenu.length ; j++) {
//                     if(detailSubMenu[j].label === "Drill Down" && parseInt(drillDownReport,10) <=1) {
//                       detailSubMenu[j].disabled = true;
//                       detailSubMenu[j].title = DISABLE_CONFIGURATION_TITLE;
//                     }
//                   }
//                 } 
//               }else if(reportSubMenu[i].label === "Ready") {
//                 let readyReports = reportSubMenu[i].items;
//                 if(readyReports && readyReports.length > 0) {
//                   for(let j = 0 ; j < readyReports.length ; j++) {
//                     if(readyReports[j].label === "Ready Application") {
//                       this.configureReadyReportsSubMenu(readyReports[j].items, readyReportsObj, isOnlineTest);
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }

//       } catch (e) {
//         this.log.error(this.classname, ' Method configureSubMenuForReports. Exception ', e);
//       }
//     }

//     /* This Menthod is used for configure the Report submenus contains under Ready Reports. */
//     configureReadyReportsSubMenu(item , reportObj, isOnlineTest) {
//       try {
//         if(item && item.length > 0) {
//           for(let i = 0 ; i < item.length ; i ++) {
//             if(item[i].label == "Page Detail Report" && (!reportObj.isHarpDirAvail || reportObj.isHarpDirAvail.toLowerCase() == "unavailable" || reportObj.isHarpDirAvail.toLowerCase() == "false")) {
//               item[i].disabled = true;
//               item[i].title = DISABLE_CONFIGURATION_TITLE;
//             }
//             else if(item[i].label == "Light House Report" && (!reportObj.isLHAvail || reportObj.isLHAvail.toLowerCase() == "unavailable" || reportObj.isLHAvail.toLowerCase() == "false")){
//               item[i].disabled = true;
//               item[i].title = DISABLE_CONFIGURATION_TITLE;
//             }
//             else if(item[i].label == "Detailed Report" && (!reportObj.rptDet || reportObj.rptDet.toLowerCase() == "unavailable")){
//               item[i].disabled = true;
//               item[i].title = DISABLE_CONFIGURATION_TITLE;
//             }
//             else if(item[i].label == "Failure Report" && (!reportObj.rptFail || reportObj.rptFail.toLowerCase() == "unavailable")){
//               item[i].disabled = true;
//               item[i].title = DISABLE_CONFIGURATION_TITLE;
//             }
//             else if(item[i].label == "Page Dump Report" && (!reportObj.rptPageDump || reportObj.rptPageDump.toLowerCase() == "unavailable")){
//               item[i].disabled = true;
//               item[i].title = DISABLE_CONFIGURATION_TITLE;
//             }
//             else if(item[i].label == "Page Breakdown Report" && (!reportObj.rptPgBrDown || reportObj.rptPgBrDown.toLowerCase() == "unavailable")){
//               item[i].disabled = true;
//               item[i].title = DISABLE_CONFIGURATION_TITLE;
//             }
//             else if(item[i].label == "Progress Report" && (!reportObj.rptProg || reportObj.rptProg.toLowerCase() == "unavailable")){
//               item[i].disabled = true;
//               item[i].title = DISABLE_CONFIGURATION_TITLE;
//             }
//             else if(item[i].label == "Detailed User Report" && (!reportObj.rptUser || reportObj.rptUser.toLowerCase() == "unavailable")){
//               item[i].disabled = true;
//               item[i].title = DISABLE_CONFIGURATION_TITLE;
//             }
//             else if (item[i].label == "Scheduler") {
//               if ((sessionStorage.getItem('productType') == "netcloud") || (sessionStorage.getItem('productType') == "netstorm")) {
//                 if (!isOnlineTest) {
//                   item[i].disabled = true;
//                   item[i].title = DISABLE_CONFIGURATION_TITLE;
//                 }
//               }
//             }

//           }
//         }
//       } catch (error) {
        
//       }
//     }

//     /* This Method is used for disabling the menu on the basis of configuration permissions.*/
//     makeProductMenuOnBasisOfConfigurationPermission(arrNavMenu ,cmMode, isOnlineTest, txStatsGraphsAvail, productType, sType,enableEventViewerSet, dbTypeList, perfDashboard , netHavoc, nvsmUrl,nctesttype) {
//       try {
//         for(let i=0;i<arrNavMenu.length;i++)
//         {
//           let label = arrNavMenu[i].label;
//           if(label && label !== "")  {
//             this.setConfiguration(label,arrNavMenu[i], cmMode, isOnlineTest, txStatsGraphsAvail, productType, sType,enableEventViewerSet, perfDashboard , dbTypeList , netHavoc, nvsmUrl,nctesttype);
//           }
             
//           if(arrNavMenu[i].items && arrNavMenu[i].items.length > 0)
//           {
//             this.makeProductMenuOnBasisOfConfigurationPermission(arrNavMenu[i].items, cmMode, isOnlineTest, txStatsGraphsAvail, productType, sType,enableEventViewerSet,dbTypeList, perfDashboard , netHavoc, nvsmUrl,nctesttype);
//           }
              
//        }
//       } catch (e) {
//         this.log.error(this.classname, ' Method makeProductMenuOnBasisOfConfigurationPermission. Exception ', e);
//       }
//     }

//     /* This Method is used to set the menus according to the configuration Permission */
//     setConfiguration(label,json, cmMode, isOnlineTest, txStatsGraphsAvail, productType, sType,enableEventViewerSet, perfDashboard, dbTypeList , netHavoc, nvsmUrl,nctesttype) {
//       let serverType = sessionStorage.getItem("strServerType");
//       let sessionRole = sessionStorage.getItem('sesRole');
//       if(label === "Scenario" || label === "Stats" || label === "Update User/Session Rate" || label === "Update Data File" || label === "Update Running Scenario" || label === "Update Session") {
//         if(!(!cmMode && isOnlineTest)) {
//           json.disabled = true;
//           json.title = DISABLE_CONFIGURATION_TITLE; 
//         }
//       }else if(label == "Virtual User Trace"){
//         if(nctesttype){
//               json.disabled = true;
//               json.title = DISABLE_CONFIGURATION_TITLE; 
//              }else{
//               if(!(!cmMode && isOnlineTest&& !nctesttype)){
//                 json.disabled = true;
//                 json.title = DISABLE_CONFIGURATION_TITLE;
//               }
//              }
//     }else if(label === "Run Logic Progress" || label === "Test Output" || label === "Pause Resume Log") {
//         if(cmMode) {
//           json.disabled = true;
//           json.title = DISABLE_CONFIGURATION_TITLE; 
//         }
//       }else if(label === "NS Transactions" || label === "Transactions") {
//         if(!txStatsGraphsAvail &&isOnlineTest) {
//           json.disabled = true;
//           json.title = DISABLE_CONFIGURATION_TITLE; 
//           setTimeout(() => {
//             json.disabled = false;
//             json.title= "";
//            }, 120000);
//         }
         
//       }else if (label === "Debug Trace Log" || label === "Execution Trace Log") {
//         if(!(!cmMode && productType.toLowerCase() !== "netcloud")) {
//           json.disabled = true;
//           json.title = DISABLE_CONFIGURATION_TITLE; 
//         }

//       }else if (label === "Generator Information") {
//           if(!(productType.toLowerCase() === "netcloud")) {
//             json.disabled = true;
//             json.title = DISABLE_CONFIGURATION_TITLE; 
//           }
//       }else if (label === "Kubernetes" || label === "Peripheral Device" || label === "RBU Access Log" || label === "Server Health" || label === "Alert Action History") {
        
        
//         if(!enableEventViewerSet) {
//           json.disabled = true;
//           json.title = DISABLE_CONFIGURATION_TITLE; 
//         }else if(enableEventViewerSet.indexOf(label) == -1) {
//           json.disabled = true;
//           json.title = DISABLE_CONFIGURATION_TITLE; 
//         }
        
//       }else if (label === "Manage VUser(s)") {
//          if(!(isOnlineTest && (serverType === "NC" || serverType === "NS" || serverType === "NS>NO") && (sType == "FIX_SESSION_RATE" || sType == "FIX_CONCURRENT_USERS" || sType == "MIXED_MODE"))) {
//           json.disabled = true;
//           json.title = DISABLE_CONFIGURATION_TITLE; 
//          }
//       }else if (label === "Running Generator Information") {
//         if(!(isOnlineTest && nctesttype)) {
//           json.disabled = true;
//           json.title = DISABLE_CONFIGURATION_TITLE;  
//         }

//       }else if (label === "Import data from Access Log file") {
//         if(!(sessionStorage.getItem("sessServerCheck") != "NDE")) {
//           json.disabled = true;
//           json.title = DISABLE_CONFIGURATION_TITLE; 
//         }
//       }else if (label === "Update Monitors") {
//         if(!isOnlineTest) {
//           json.disabled = true;
//           json.title = DISABLE_CONFIGURATION_TITLE; 
//         }
//       }else if (label === "Behaviour") {
//         if(serverType === "NC" || serverType === "NS" || serverType === "NS>NO") {
//           json.disabled = true;
//           json.title = DISABLE_CONFIGURATION_TITLE; 
//         }

//       }
//       // else if (label === "MS SQL Monitoring") {

//       //   if(!(dbTypeList && dbTypeList.length >0 && dbTypeList.indexOf("mssql") !== -1)){
//       //     json.disabled = true;
//       //     json.title = DISABLE_CONFIGURATION_TITLE; 
//       //   }
//       // }else if (label === "Postgres Monitoring") {
//       //   if(!(dbTypeList && dbTypeList.length >0 && dbTypeList.indexOf("POSTGRESQL") !== -1)) {
//       //     json.disabled = true;
//       //     json.title = DISABLE_CONFIGURATION_TITLE; 
//       //   }
//       // }else if (label === "MySQL Monitoring") {
//       //   if(!(dbTypeList && dbTypeList.length >0 && dbTypeList.indexOf("MYSQL") !== -1)) {
//       //     json.disabled = true;
//       //     json.title = DISABLE_CONFIGURATION_TITLE; 
//       //   }
//       // }else if (label === "Postgres Stats") {
//       // 	}
//         else if (label === "Web Dashboard" || label === "Dashboard") {
//         // if (serverType === 'NS' || serverType === 'NS>NO') {
//         //   json.disabled = true;
//         //   json.title = COMMONCONST.DISABLED_MENU_TITLE_CONF; 
//         // }
//       }else if (label === "IP Management" || label === "Timeslot Management" || label === "Data File Management") {
//         if(!(!sessionStorage.getItem('ContinuousMode') || sessionStorage.getItem('ContinuousMode') === 'false')) {
//           json.disabled = true;
//           json.title = DISABLE_CONFIGURATION_TITLE; 
//         }
//       }else if (label === "Tier Group" || label === "Tier Assignment Rules") {
//           if(!(sessionStorage.getItem('isAdminUser') == "true")) {
//             json.disabled = true;
//             json.title = DISABLE_CONFIGURATION_TITLE;
//           }
//       }else if (label === "Server" || label === "LDAP Server Settings" || label === "Manage Controllers" || label === "GIT Configuration" || label === "NDE Purge" || label === "Settings" || label === "Manage Controllers" || label === "Access Control" || label === "Agent Info" || label === "GIT Settings" || label === "Retention Policy") {
//         if (sessionStorage.getItem('saasEnabled') === '1'){
//           if(!(sessionStorage.getItem('isEnterpriseUser') === 'true') && !(sessionStorage.getItem('isAdminUser') === 'true') )
//           {
//            json.disabled = true;
//            json.title = DISABLE_CONFIGURATION_TITLE;
//           }
//  }
//   else{
//    if(!(sessionStorage.getItem('isAdminUser') === 'true') ) {
//      json.disabled = true;
//      json.title = DISABLE_CONFIGURATION_TITLE;
//    }
//   }  
//       }else if(label === "Projects" || label === "Servers"){
//           if(!(sessionStorage.getItem('isAdminUser') === 'true')) {
//                 json.disabled = true;
//                 json.title = DISABLE_CONFIGURATION_TITLE;
//           }
//           else if(sessionStorage.getItem('enableSecurityMode') === '1'){
//                 json.disabled = true;
//                 json.title = DISABLE_MENU_ITEMS_FOR_SECURITY;
//           }
//       }else if(label === "Topology" || label === "Batch Jobs" || label === "Event Definition" || label === "System Events"){
//         if(sessionStorage.getItem('enableSecurityMode') === '1'){
//           json.disabled = true;
//           json.title = DISABLE_MENU_ITEMS_FOR_SECURITY;
//         }
//       }
//       else if(label === "Test Suite" || label === "Test Report" || label === "Test Case"){
//           let obj = JSON.parse(sessionStorage.getItem('commonMenuConfigData'));
//           // if((obj['testsuite_angular_keyword'] === true) && (sessionStorage.getItem('enableSecurityMode') === '1')){
//           //   json.disabled = true;
//           //   json.title = DISABLE_MENU_ITEMS_FOR_SECURITY;
//           // }

//       }else if(label === 'Automation'){
//         let featurePermission = JSON.parse(sessionStorage.getItem('featurePermission')).ProductUI;
//         let AutomationPermission = featurePermission.find(o => o.feature === 'Automation').permission; 
//         if(AutomationPermission < '4'){  
//           json.disabled = true;
//           json.title = DISABLE_CONFIGURATION_TITLE;
//         }
//       }
//       else if (label === "KPI" || label === "Graphical KPI") {
//         if (!((sessionStorage.getItem('productMode') !== '0' && sessionStorage.getItem('runningtest') !== '' &&
//         sessionStorage.getItem('runningtest') !== null && sessionStorage.getItem('runningtest') !== '-1') && sessionStorage.getItem("enableKPI") === "1")) {
//           json.disabled = true;
//           json.title = DISABLE_CONFIGURATION_TITLE;
//         }
//       }else if (label === "System Status") {
//         if(!(sessionStorage.getItem('productMode') !== '0')) {
//           json.disabled = true;
//           json.title = DISABLE_CONFIGURATION_TITLE;
//         } 
//       }else if (label === "Geo Map") {
//         if (!(sessionStorage.getItem('enableGEOKPI') !== '0')) {
//           json.disabled = true;
//           json.title = DISABLE_CONFIGURATION_TITLE;
//         }
//       }else if (label === "Application End-to-End View") {
//         if(!(sessionStorage.getItem('productMode') !== '0' && sessionStorage.getItem('runningtest') && sessionStorage.getItem('runningtest') !== '-1' && (sessionStorage.getItem('enableTierStatus') == "true" || sessionStorage.getItem('enableTierStatus') == '1'))) {
//           json.disabled = true;
//           json.title = DISABLE_CONFIGURATION_TITLE;
//         }
//       }else if (label === "NetHavoc") {
//         if(! netHavoc) {
//           sessionStorage.setItem("enableNetHavocKeyword","false")
//           json.disabled = true;
//           json.title = DISABLE_CONFIGURATION_TITLE;  
//         }
//         else
//         {
//           sessionStorage.setItem("enableNetHavocKeyword","true")

//         }
//       }else if (label === "Generator Management") {
//         if(!(sessionStorage.getItem('productType') == "netcloud")) {
//          json.disabled = true;
//          json.title = DISABLE_CONFIGURATION_TITLE;
//         }
//      }else if(label === "Infrastructure View") {
//        if(!(perfDashboard && sessionStorage.getItem("sessServerCheck") == "NDE")) {
//           json.disabled = true;
//          json.title = DISABLE_CONFIGURATION_TITLE;
//        }
//     }else if(label === "Account-Project Management" || label === "EnterPrise Home" ){
//       if(sessionStorage.getItem('saasEnabled') == '0' || sessionStorage.getItem('saasEnabled') == '2'){
//         json.disabled = true;
//         json.title = DISABLE_MENU_ITEMS_FOR_SECURITY;
//       }  
//     }
     
//      else if(label === "Run Time Changes Logs"){
//       if(cmMode){
//        json.disabled = true;
//        json.title = DISABLE_CONFIGURATION_TITLE;
//       }
//     }else if(label == "Home" || label == "Check Profile" || label == "Summary"){
//       console.log("in home check --");
//       // if(testsuite_angular_keyword){
//       //   console.log("keyword is 1 i.e. JSP--");
//       //   json.visible = false;
//       // }else{
//       //   console.log("keyword is 0 or not present --");
//       //   json.visible = true;
//       // }
//       json.visible = true;
//     }
//     else if(label == "Download Script Manager"){
//       if(sessionStorage.getItem('SMAvailable') == 'false')
//        {
//          json.disabled = true;
//          json.title = DISABLE_CONFIGURATION_TITLE;
//        }
//     }else if(label == NVSM_URL_LABEL) {
//       if(nvsmUrl && nvsmUrl !== "") {
//         json.visible = true;
//       }else {
//         json.visible = false;
//       }  
//     }

//     }

//     /*This Method is used for make the menu Json for the respective modules. */
//     getNavMenuByProductMenuJson(productmenuJson, moduleName) {

//         try {
//         let JsonObject;
//         let navMenuArray = [];
//         if(productmenuJson && productmenuJson.length > 0)  {
//           let index = -1;
//            for(let i = 0 ; i < productmenuJson.length; i++) {
//              if(moduleName === productmenuJson[i].label) {
//                index = i;
//                break;
//              }
//            }
    
//            if(index !== -1) {
//             JsonObject = productmenuJson[index];
//             if(JsonObject) {
//               for (var key in JsonObject) {
//                 if (JsonObject.hasOwnProperty(key)) {
//                   if(key == "items") {
//                     let arr = JsonObject[key];
//                     if(arr.length > 0) {
//                       for(let j = 0 ; j < arr.length ; j++) {
//                         if(arr[j].label === "Favorites")
//                           {
//                             let favMenu = new DashboardMenuDef('Favorites', 'fa-star', null, null);
//                             navMenuArray.push(favMenu);
//                           }else {
//                             navMenuArray.push(arr[j]);
//                           }
//                       }
//                     }
//                   }
//                 }
//               }
//             } 
//            }
//         }
    
//         return navMenuArray;
    
//       } catch (e) {
//         this.log.error(this.classname, ' Method getNavMenuByProductMenuJson. Exception ', e);
//         return [];
//       }
    
      
    
//       }
// }

// /**
// var valuesArr = ["v1", "v2", "v3", "v4", "v5"];   
// var removeValFromIndex = [0, 2, 4]; // ascending

// it will return ["v2", "v4"]
// */
// export function deleteMany(array, indexes = []) {
//     return array.filter((item, idx) => indexes.indexOf(idx) === -1);
// }

// export function cloneObject(data) {
    // return JSON.parse(JSON.stringify(data));
}

