// import { Injectable } from '@angular/core';
// import { CavConfigService } from "./cav-config.service";
// import { Router } from '@angular/router';
// import { BlockUI, NgBlockUI } from 'ng-block-ui';

// @Injectable()
// export class CavCommonUtils {
//    @BlockUI() blockUI: NgBlockUI;
//   critical: any;     
//   major: any;        
//   normal: any;
//   constructor(private _cavConfig : CavConfigService,
//   private _router : Router) { 
//       this.critical = {
//       dataImgName: 'assessment',
//       bgColor: '#d60f02',
//       fontColor: 'white'
//     };
//     this.major = {
//       dataImgName: 'assessment',
//       bgColor: '#f97d1d',
//       fontColor: 'white'
//     };
//     this.normal = {
//       dataImgName: 'assessment',
//       bgColor: '#009973',
//       fontColor: 'white'
//     };
//   }

//   /**Redirected to the m/c build release informations */
//   buildReleaseInfo() {
//     try {
//        let serialNumber =sessionStorage.getItem('serialNumber');
//        let productname = this._cavConfig.$productName.toLowerCase();
//         let machineIP = this._cavConfig.$host;
//          let url = 'http://www.cavisson.com/product-release/';
//         let machineInfo = {'serialNumber': serialNumber, 'productName': productname, 'machineIP': machineIP};
//         this.post(url, machineInfo, 'post')
//     } catch (error) {
//       console.log('error in open a build release info', error);
//     }
//   }
 
   
//   helppage()
//   {
//       try {
//         let serialNumber =sessionStorage.getItem('serialNumber');
//         let productname = this._cavConfig.$productName.toLowerCase();
//         let machineIP = this._cavConfig.$host;
//         let machineInfo = {'serialNumber':serialNumber, 'productName':productname, 'machineIP':machineIP};
//         this.post('https://www.cavisson.com/product-help',machineInfo,'post')
//         } 
//         catch (error) {
//         }
//   }
//   post(path, params, method) {
//     method = method || "post"; // Set method to post by default if not specified.
//     var form = document.createElement("form");
//   // Set attributes to specify the form properties.
//     form.setAttribute("method", method);
//     form.setAttribute("action", path);
//     form.setAttribute("target", "_blank");


//     for(var key in params) {
//         if(params.hasOwnProperty(key)) {
//             var hiddenField = document.createElement("input");
//             hiddenField.setAttribute("type", "hidden");
//             hiddenField.setAttribute("name", key);
//             hiddenField.setAttribute("value", params[key]);

//             form.appendChild(hiddenField);
//         }
//     }

//     document.body.appendChild(form);
//     form.submit();
//    }
//    /**Method is used for showing the notification message on TOP/Bottom. */
//   showNotificationMessage(message: string, msgType: string, msgPosition = 'bottom', fixed = false, durationMS = 10000) {
//      try {

//   //  this._notify.show(message, {
//   //        type: msgType,
//   //        duration: durationMS,
//   //        position: msgPosition,
//   //        sticky: fixed
//   //     });

//     } catch (e) {
//       console.error('Error while displaying notificationp.', e);
//     }
//   }
 
// clearSessiononSessionClose() {
//    this.showNotificationMessage('Session has been closed so no further operations can be performed. This may be due to idle timeout  or session has been closed forcefully.','error','top',true); 
//                  this.blockUI.stop();
//                   if(this._cavConfig.$samlEnabled){
//                    window.open(this._cavConfig.$serverIP+"/ProductUI/resources/pages/SamlLogout.html","_self");
//                  }
//                  else{
//                   this._router.navigate(['/login']);
//                 }
//                   let _sqlUserName = localStorage.getItem('userName') + '@sql';
//                   let _sqlUserDefaultDS = localStorage.getItem(_sqlUserName);
//                   localStorage.clear();
//                   if (_sqlUserDefaultDS) {
//                   localStorage.setItem(_sqlUserName, _sqlUserDefaultDS);
//                  }
//                   sessionStorage.removeItem("sessUserName");		// Removing User Name
//                  sessionStorage.removeItem("sessUserPass");		// Removing user Password
//                   sessionStorage.clear();
//  }
//  clearSessiononDCDown(){
//     this.showNotificationMessage('One or More  Dc has been down so no further operations can be performed.','error','top',true); 
//                  this.blockUI.stop();
//                   this._router.navigate(['/login']);
//                   localStorage.clear();
//                   sessionStorage.removeItem("sessUserName");		// Removing User Name
//                  sessionStorage.removeItem("sessUserPass");		// Removing user Password
//                   sessionStorage.clear();
//  }

//     geterrorMessages () {
//       this.showNotificationMessage('You are accessing unauthenticated links hence closing this session  ','error','top',true); 
//                   localStorage.clear();
//                   sessionStorage.removeItem("sessUserName");		// Removing User Name
//                  sessionStorage.removeItem("sessUserPass");		// Removing user Password
//                   sessionStorage.clear();
      
//    }
// }

