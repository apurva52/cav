import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CavConfigService } from '../../../configuration/nd-config/services/cav-config.service';
import { DashboardRESTDataAPIService } from '../../../actions/dumps/service/dashboard-rest-data-api.service';

@Injectable()
export class RetentionPolicyCommonService {

  /** action to identify call */
  public action = '';
  globalAddPath = '';
  /**Observable tier name string for middle component */
  public retentionPolicyInfo = new Subject<any>();
  public getDataBroadCasterForFileExplorer = new Subject<any>();
  getDataObserverForRetention$ = this.getDataBroadCasterForFileExplorer.asObservable();
  /*Service Observable for getting Tier name*/
  retentionPolicyProvider$ = this.retentionPolicyInfo.asObservable();

  constructor(
    public _cavConfig: CavConfigService,
    private _cavApi: DashboardRESTDataAPIService,
  ) { }

  /**Getting Test Run Number*/
  getTestRun() {
    try {
      let url = '//' + this._cavConfig.$host +
        ':' + this._cavConfig.$port + '/DashboardServer/web/NOandNFDataService/getTrList';

      /**send a request to get a list of admin */
      let unsub = this._cavApi.getDataByRESTAPI(url, '').subscribe(
        result => {
          this.action = 'GETTR';
          console.log('data in getting a nDE purge data--- ', result);
          this.retentionPolicyInfo.next(result);
        },
        error => {
          unsub.unsubscribe();
          console.error('error in getting a retention policy data', error);
        },
        () => {
          unsub.unsubscribe();
        }
      );
    } catch (error) {
      console.error('error in getting a retention policy data', error)
    }
  }

  startProg() {
    // this.ngProgress.start();
  }

  destroyProg() {
    //  this.ngProgress.complete();
  }
}

