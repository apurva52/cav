import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
// import * as URL from '../constants/mon-url-constants';
// import { CavConfigService } from '../../../main/services/cav-config.service';
// import { CavTopPanelNavigationService } from '../../../main/services/cav-top-panel-navigation.service';
// import * as MODE from '../constants/mon-constants';
// import { CavLayoutService } from "../../../main/services/cav-layout-provider.service";
// import { CavCommonUtils } from '../../../main/services/cav-common-utils.service';

@Injectable({
  providedIn: 'root',
})

export class MonDataService extends Store.AbstractService{
    productType: string = 'NS';

    userName: string = 'cavisson';
    groupType: string = 'cavisson';
    userRole: string = 'guest';

    //testRun number
    testRunNum: number = -1;
    monMode: number = 0; //0 - Edit, 1- View Mode, 2 test run offline mode and 3 - run time changes

    isFromWebDashboard: boolean = false;

    selectedTopoName: string = "";
    
    productKey:string;
    productMode:string;

    isFromEdit: boolean = false;  //used to show the  monitor groups button in the monitor configuration screen

    private serviceURL: string = "";

   constructor() {
    super();
    }

     public initConfiguration()
     {
       try
        {
        // this.productKey = this._productConfig.$productKey;
        // this.productType = this._productConfig.$productMode
          /*Checking for availability of session. */
        //   if (this._productConfig.$userName == null) {
        //     // this.log.info('Session not available. Restoring session.');
        //     this._productConfig.restoreConfiguration();
        //    }

        //   this.userName = this._productConfig.$userName;

          //This is done to handle a case when page is reloaded then by default user role was set to guest bug id: 70184
        //   if(this._productConfig.$allfeaturePermissionList) {
        //       //need to changes
        //     // let featurePermList = this._productConfig.$allfeaturePermissionList["ProductUI"];
        //     let obj = featurePermList.find((ele)=>{
        //         return ele["feature"] ==  "Start/Stop Test";
        //     });
      
        //     if(obj["permission"] == 7) {
        //         this.userRole = 'admin';
        //     }
        //     else if(obj["permission"] > 4 && obj["permission"] < 7) {
        //       this.userRole = 'normal';
        //     }
        //     else {
        //       this.userRole = 'guest';
        //     }
        //   }
        }
        catch(e) {
            console.error('initConfiguration | exception e = ', e);
        }
    }

    setTestRunNum(testRunNum: number) {
        this.testRunNum = testRunNum;
    }

//   getTestRunNum(): number {
//       if(this.cavLayoutService.getMonTestRun() != -1) {
//         this.testRunNum = this.cavLayoutService.getMonTestRun();
//       }
//         return this.testRunNum;
//     }



    getTestRunNum(): number {
    // if(this.cavLayoutService.getMonTestRun() != null && this.cavLayoutService.getMonTestRun() != -1)
    // {
    //   this.testRunNum = this.cavLayoutService.getMonTestRun();
    //   sessionStorage.setItem("testRun",this.testRunNum + "");
    // }
    // else 
    // {
     if(sessionStorage.getItem("testRun") != null)
     {
       this.testRunNum = Number(sessionStorage.getItem("testRun"));
     }
     else 
       sessionStorage.setItem("testRun",this.testRunNum + "");
    // }
     return this.testRunNum;
    }


    getMonMode(): number {
      if(sessionStorage.getItem("monMode") != null)
      {
       this.monMode = Number(sessionStorage.getItem("monMode"));
      }
      else
      {
       sessionStorage.setItem("monMode",this.monMode + "");
      }
      return this.monMode;
    }

    setMonMode(mode: number) {
        this.monMode = mode;
        sessionStorage.setItem("monMode",this.monMode + "");
    }

    getProductType() {
        return this.productType;
    }

    setProductType(type: string) {
        this.productType = type;
        sessionStorage.setItem("productType",this.productType + "");
    }

    getUserName(): string {

        // if(sessionStorage.getItem("userName") != null || sessionStorage.getItem("userName") != "null" )
        // {
        //  this.userName = sessionStorage.getItem("userName");
        // }
        // else
        //   sessionStorage.setItem("userName",sessionStorage.getItem("userName"))

        return this.userName;
    }

    setUserName(username: string) {
        this.userName = username;
    }

    public get $userRole(): string {
        return this.userRole;
    }

    public set $userRole(value: string) {
        this.userRole = value;
    }

     
    /**Method for getting the service url in case of multiDC as well single DC case */
    // getserviceURL(): string {
    //   let url = this._productConfig.getINSAggrPrefix() + this._navService.getDCNameForScreen('monConf') + URL.REST_API_PATH ;
    //   return url;
    // }

    setServiceURL(url: string) {
        this.serviceURL = url;
    }


    setSelectedtopology(selectedTopoName: string) {
        this.selectedTopoName = selectedTopoName;
        sessionStorage.setItem("selectedTopoName", this.selectedTopoName);
    }

    public getWebDashboardFlag() {
        return this.isFromWebDashboard;
    }

    public setWebDashboardFlag(flag: boolean) {
        this.isFromWebDashboard = flag;
    }

    getProductKey(): string {
        return this.productKey;
    }


 /*This method is used to set the mode -
  * 0 - Edit, 1- View Mode,
  * 2 test run offline mode , When Mnitor UI is open from testRun specific but test run is not running
  * and 3 - run time changes,When it is online mode i.e test run is in running mode
  */
//   monModeStatus() : boolean
//   {
//     if (this.monMode == MODE.VIEW_MODE || this.monMode == MODE.TEST_RUN_MODE)
//     return true;
//   }

  /**
 * This method is used to get the value whether it is user 
 * has been from configuration screen or has clicked the monitor groups button
 */
 getEditMonFlag() {
    return this.isFromEdit;
}


/**
 * This method is used to set the value whether it is user 
 * has been from configuration screen or has clicked the monitor groups button
 */
 setEditMonFlag(flag: boolean) {
    this.isFromEdit = flag;
}

/**
 * Method to get the running Test run changes in case of DC change for multiDC case.
 * @param dcName 
 */
getRunningTRForDcChange(dcName: string)
{
  try
  {
    if(!sessionStorage.getItem('isMultiDCMode'))
      return;

    this.changeParameters(dcName);
  } 
  catch(e) 
  {
    console.log("MonDataService|getRunningTRForDcChange|Exception:",e);
  }
}
/**Method to change the test run no. and other parameters as per change in DC for multiDC case.*/
changeParameters(dcName: string)
{
    // let testRun = this._productConfig.getTestRunForDC(dcName);

    // this._productConfig.$dashboardTestRun= testRun;
    // this.cavLayoutService.setMonTestRun(testRun); // when DC is changed need to change test run and set in this service for use in Monitor UI screens.
    // this._commonUtils.openMonConfGui('Monitors'); // need to open Monitor UI based on DC change as well as change in test run no. for the selected DC.
}

	
   /**
    * Close all session and redirect on Login UI in case of bad request (400)
    * and response status of '117' which is for authentication failure.
    * Bugid-80565(Monitor UI is getting hanged when other user is opening same Session with same UserName and Password)
    */
   closeAllSessionAndLogin(error) {
    // if(error.status == 400 && error['error']['status'] == 117)
    //    this._commonUtils.clearSessiononSessionClose();
   }
}
