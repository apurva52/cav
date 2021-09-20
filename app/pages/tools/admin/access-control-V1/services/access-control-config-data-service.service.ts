import { Injectable } from '@angular/core';
import { CavConfigService } from '../../../configuration/nd-config/services/cav-config.service';
import { ACCESSCONTROLLIST_REST_API_PATH } from '../constants/rest-api-constant';;
import { CavTopPanelNavigationService } from '../../../configuration/nd-config/services/cav-top-panel-navigation.service';

@Injectable()
export class AccessControlConfigDataServiceService {
  private host = 'localhost';
  private port = '8003';
  // private clientConnectionKey: string;
  private userName = 'netstorm';
  private userGroup = 'netstorm';
  private productName = 'netstorm';
  /* Configuration from server through REST API. */
  private timeZone = 'Asia/Kolkata';
  private accessControlRight: string;
  constructor(private _productConfig: CavConfigService,private _navService: CavTopPanelNavigationService
  ) {
    if (_productConfig.$userName == null) {
      console.log('Session not available. Restoring session.');
      _productConfig.restoreConfiguration();
    }
    /* Initializing configuration with product ui configuration. */
    this.userName = _productConfig.$userName;
    this.host = _productConfig.$host;
    this.port = _productConfig.$port;
    this.productName = _productConfig.$productName;
    this.userGroup = _productConfig.$userGroup;
    this.accessControlRight = _productConfig.$aclAccessRight;

  }

  public getHostURL() {
    try {
      return '//' + this.host + ':' + this.port;
    } catch (e) {
      console.log("error", e)
      return null;
    }
  }

  /** Method is used for getting URL by REST API name. */
  public getURLWithBasicParamByRESTAPI(apiName: string): string {
    return this.getHostURL() + this.getURLParamByRESTAPIName(apiName);
  }
  public getURLParamByRESTAPIName(apiName: string) {
    try {

      return ACCESSCONTROLLIST_REST_API_PATH + apiName; //+ '&userName=' + this.userName +   '&prodType=' + this.productName;
    } catch (e) {
      console.log("error", e)
      return null;
    }
  }

  /** Method is used for getting URL by REST API name for logs. */
  public getURLWithBasicParamByRESTAPIForGettingLogsInMultiDC(apiName: string): string {
    return ;
    //this._productConfig.getINSAggrPrefix()+this._navService.getDCNameForScreen('auditLog') + this.getURLParamByRESTAPIName(apiName);
  }
  public get $host(): string {
    return this.host;
  }

  public set $host(value: string) {
    this.host = value;
  }

  public get $port(): string {
    return this.port;
  }

  public set $port(value: string) {
    this.port = value;
  }
  public get $userName(): string {
    return this.userName;
  }

  public set $userName(value: string) {
    this.userName = value;
  }
  public get $userGroup(): string {
    return this.userGroup;
  }

  public set $userGroup(value: string) {
    this.userGroup = value;
  }
  public get $productName(): string {
    return this.productName;
  }

  public set $productName(value: string) {
    this.productName = value;
  }
  public get $timeZone(): string {
    return this.timeZone;
  }

  public set $timeZone(value: string) {
    this.timeZone = value;
  }
  public get $accessControlRight(): string {
    return this.accessControlRight;
  }

  public set $accessControlRight(value: string) {
    this.accessControlRight = value;
  }
}
