import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { CavConfigService } from '../../../configuration/nd-config/services/cav-config.service';
//import { CavCommonUtils } from "../../../configuration/nd-config/services/cav-common-utils.service";
import { AuthenticationService } from "../../../configuration/nd-config/services/authentication.service";
import { map, catchError } from 'rxjs/operators'
import { SessionService } from 'src/app/core/session/session.service';

@Injectable()
export class AccessControlRestDataApiService {
  

  constructor(private http:HttpClient ,
  private _config : CavConfigService ,
  //private _utils :CavCommonUtils,
  private _auth: AuthenticationService,
  private _http : HttpClient,
  private sessionService: SessionService
   ) { }
  
  /*Getting Data Through REST API by using GET Method.*/
  getDataByRESTAPI( url: string, param: string): Observable<any> {
    try {
    
     console.log('Getting data from url = ' + url + ', param = ' + param);
     let productKeyparms;
     if(param ==''){
       productKeyparms = "?productKey=" + this.sessionService.session.cctx.pk;
     }
     else {
       productKeyparms="&productKey=" + this.sessionService.session.cctx.pk;
     }
     let finalURl = url + param+ productKeyparms;
      return this.http.get(finalURl).pipe(map(res =><any> res),
        catchError((e) => {
          if(e.status == 400 ){
           this._auth.$canDeactivatelogoutFlag = true
         //  this._utils.clearSessiononSessionClose();
             // return   Observable.of(InvalidReq);
          }
          return Observable.throw(
            new Error(`${ e.status } ${ e.statusText }`)
          );
        }));
    } catch (e) {
     console.log('Error while getting data from REST API. url = ' + url + ', param = ' + param);
      console.log(e);
    }
  }
  /*Getting Data Through REST API by using GET Method.*/
  getDataFromRESTUsingPOSTReq( url: string, param: string, data: any): Observable<any> {
    try {

      console.log('Getting data from url = ' + url + ', param = ' + param);
       let productKeyparms;
     if(param ==''){
       productKeyparms = "?productKey=" + this.sessionService.session.cctx.pk;
     }
     else {
       productKeyparms="&productKey=" + this.sessionService.session.cctx.pk;
     }
     let finalURl = url + param+ productKeyparms;
      return this.http.post(finalURl,data).pipe(map((response) => response),
        catchError((e) => {
           if(e.status == 400 ){
              this._auth.$canDeactivatelogoutFlag = true
            //  this._utils.clearSessiononSessionClose();
          }
          return Observable.throw(
            new Error(`${ e.status } ${ e.statusText }`)
          );
        }));
    } catch (e) {
      console.log('Error while getting data from REST API. url = ' + url + ', param = ' + param);
      console.log(e);
    }
  }


getDataByRESTAPIByHttp( url: string, param: string): Observable<any> {
    try {
    
     console.log('Getting data from url = ' + url + ', param = ' + param);
     let productKeyparms;
     if(param ==''){
       productKeyparms = "?productKey=" + this.sessionService.session.cctx.pk;
     }
     else {
       productKeyparms="&productKey=" + this.sessionService.session.cctx.pk;
     }
     let finalURl = url + param+ productKeyparms;
      return this._http.get(finalURl).pipe(map((response) => response),
        catchError((e) => {
          if(e.status == 400 ){
           this._auth.$canDeactivatelogoutFlag = true
         //  this._utils.geterrorMessages();
             // return   Observable.of(InvalidReq);
          }
          return Observable.throw(
            new Error(`${ e.status } ${ e.statusText }`)
          );
        }));
    } catch (e) {
     console.log('Error while getting data from REST API. url = ' + url + ', param = ' + param);
      console.log(e);
    }
  }
}
