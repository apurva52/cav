import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Subject } from 'rxjs';
// import 'rxjs/add/operator/map'
import { CavConfigService } from './cav-config.service';
import { CavTopPanelNavigationService } from './cav-top-panel-navigation.service';
import { map } from 'rxjs/operators';
/**importing a progress bar object */

@Injectable()
export class AuthenticationService {
    private userNameWithPass: String;
    private ServiceBroadcaster = new Subject<Array<any>>();
    ServiceProvide = this.ServiceBroadcaster.asObservable();

    private canDeactivatelogoutFlag: boolean; /* This tells deactivate method of routing guard that logout button is clicked*/

    constructor(private http: HttpClient,
        private _config: CavConfigService,
        private _navigation: CavTopPanelNavigationService,
        private _http: HttpClient ) {

    }

    login(username: string) {
        console.log('login method called..');
        if(username === undefined || username === null || username === ' '){
           username = this._config.$userName;
        }
        return this.http.get(this._config.$serverIP +
            'ProductUI/productSummary/SummaryWebService/authenticate?queryString=' + username + '&productKey='+this._config.$productKey)
            .pipe(map(response =><any> response));
    }
  
    createJspSession(Url: string) {
        console.log('createJspSession method called -- ', Url);
        return this.http.get(Url).pipe(map(res =><any> res)).subscribe(res => (this.doAssignValueTestRun(res)));
    }

    doAssignValueTestRun(res) {
        console.log(res);
    }

    logout() {
        console.log('Going to remove navigation links on log out');
        this._navigation.setNavigationLinksonLogOut([]);
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }

    // getting Data from server
    getServiceData(jsonData) {
        try {
            let url = this._config.$serverIP +
                'DashboardServer/web/NOandNFDataService/getDataforNOandNF?productKey=' + this._config.$productKey;
    //   let subscribeJson =  this._cavDataApiService.getDataFromRESTUsingPOSTReq(url, '' , jsonData)
    //             .subscribe(
    //                 result => {
    //                     if (result != undefined && result != null) {
    //                          this.ServiceBroadcaster.next(result);
    //                          this._progressBar.stopProgressBar();
    //                          this._common.isDataAvail = true;
    //                     } else {
    //                         //  this._common.changeGraphType();
    //                           this._common.isDataAvail = false;
    //                          this._progressBar.stopProgressBar();
    //                     }
    //                 },
    //                 error => {
    //                     console.log('error in getting data from server --> ', error);
    //                     this._progressBar.stopProgressBar();
    //                 },
    //                 () => {
    //                     this._progressBar.stopProgressBar();
    //                     subscribeJson.unsubscribe();
    //                 }
    //             );
        } catch (error) {
            console.log('error in getting data from server --> ', error);
        }
    }

    validatExternalLink(userName :string,requestFrom : string,productKey : string){
     try {
          let requestForLogin = true;
          if(!productKey||productKey == 'undefined') {
           productKey =userName;
          }
          if(requestFrom == 'Reports') {
           requestForLogin = false;     
          }
          let url = this._config.$serverIP + 'DashboardServer/acl/user/authenticateExtLink?requestFrom=' + requestFrom+'&userName='+userName +'&isRequestFrmLogin='+requestForLogin + '&productKey='+productKey;      
          return this._http.get(url).pipe(map(res =><any> res)) ;

     } catch (error) {
         console.error('error in while validatExternalLink  --> ', error);
     }
    }

    validateUserBeforeLogin(userName: string, passWord: string, publicMetaKey: string) {
        console.log('validateUserBeforeLogin method called..');
        try {

            /**Checking if encryption keys are available. */
	    this._config.$serverCurrentTime = (+this._config.$serverCurrentTime);
            this._config.$clientTimeStamp = (+this._config.$clientTimeStamp);
            let timeDiff = new Date().getTime()  - this._config.$clientTimeStamp;

            timeDiff  = this._config.$serverCurrentTime + timeDiff;
            passWord += '_' + timeDiff;
            if (publicMetaKey !== 'NA') {
             //   let encryptAPI = new encrypt.JSEncrypt();
                // encryptAPI.setKey(publicMetaKey);
                // passWord = encryptAPI.encrypt(passWord);
            }
            let prms = { 'user': userName, 'token': passWord };
            return this.http.post(this._config.$serverIP + 'DashboardServer/acl/user/authenticateUser?productKey=' + userName + "&userName=" + userName +'&isRequestFrmLogin=' + true , prms)
            .pipe(map(response =><any> response));



        } catch (error) {
            console.log('error in while validating user --> ', error);
        }
    }


    public get $canDeactivatelogoutFlag(): boolean {
        return this.canDeactivatelogoutFlag;
    }

    public set $canDeactivatelogoutFlag(value: boolean) {
        this.canDeactivatelogoutFlag = value;
    }


  removeSessiononForcefullyLogOut(userName){
            var Url = this._config.$serverIP + 'DashboardServer/acl/user/removeUserSessionOnForcedLogout?userName=' +userName + '&isRequestFrmLogin=' + true;         
      return  this.http.get(Url).pipe(map(res =><any> res)) ;
      
    }
}
