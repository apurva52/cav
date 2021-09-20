import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { NGXLogger } from "ngx-logger";
// import { MatDialog } from '@angular/material';
import { tap } from "rxjs/operators";
import { map, catchError } from 'rxjs/operators'

@Injectable()
export class DashboardRESTDataAPIService {

  constructor(private http: HttpClient, private logger: NGXLogger ) { }

  /*Getting Data Through REST API by using GET Method.*/
  getDataByRESTAPI( url: string, param: string) :Observable<any> {
    try {
      
      this.logger.info('Getting data from url = ' + url + ', param = ' + param);
    
      return this.http.get(url + param )
        .pipe(map((response) => response),
        catchError((e) => {
           if(e.status == 400){
            // this._dialog.closeAll();
            // this._utils.clearSessiononSessionClose();
          }
          return Observable.throw(
            new Error(`${ e.status } ${ e.statusText }`)
          );
        }));
    } catch (e) {
      this.logger.error('Error while getting data from REST API. url = ' + url + ', param = ' + param);
      this.logger.error(e);
    }
  }

  /*Getting Data Through REST API by using GET Method.*/
  getDataFromRESTUsingPOSTReq( url: string, param: string, data: any): Observable<any> {
    try {
      let productKeyperms;
    
      this.logger.info('Getting data from url = ' + url + ', param = ' + param);

      return this.http.post(url + param ,data)
        .pipe(map((response) => response),
        catchError((e) => {
            if(e.status == 400  ){
              //  this._dialog.closeAll();
            // this._utils.clearSessiononSessionClose();
          }
          /**this is done so in case of when user is uploading any content which is not supported than in that case this status 
           * code will come.
           */
          if (e.status == 415) {
           let result = '9';
            return result;
          }
          return Observable.throw(
            new Error(`${ e.status } ${ e.statusText }`)
          );
        }));
    } catch (e) {
      this.logger.error('Error while getting data from REST API. url = ' + url + ', param = ' + param);
      this.logger.error(e);
    }
  }

/*Getting Data Through REST API by using GET Method.*/
  getDataByRESTAPIForDerived( url: string, param: string) : Observable<any>{
    try {

      this.logger.info('Getting data from url = ' + url + ', param = ' + param);
     
      return this.http.get(url +param )
        .pipe(map(response => response),
         catchError((e) => {

             if(e.status == 400 ){
                // this._dialog.closeAll();
            // this._utils.clearSessiononSessionClose();
          }
          return Observable.throw(
            new Error(`${ e.status } ${ e.statusText }`)
          );
        }));
    } catch (e) {
      this.logger.error('Error while getting data from REST API. url = ' + url + ', param = ' + param);
      this.logger.error(e);
    }
  }

 /*Getting Data Through REST API by using GET Method in String format*/
  getDataByRESTAPIInString( url: string, param: string) : Observable<any> {
    try {

      this.logger.info('Getting data from url = ' + url + ', param = ' + param);

      return this.http.get(url + param, {responseType: 'text'}).pipe(
      tap( // Log the result or error
        data => data
              )
        
       );
    } catch (e) {
      this.logger.error('Error while getting data from REST API. url = ' + url + ', param = ' + param);
      this.logger.error(e);
    }
  }

  getDataByRESTAPIInStringUsingPost(url : string  ,data: any) :Observable<any>{
    // this.logger.info('Getting data from url = ' + url + ', param = ' + param);
    try{
      return this.http.post(url , data,{responseType: 'text'} ,).pipe(
      tap( // Log the result or error
        data => data
              )
        
       );
    } catch (e) {
      this.logger.error('Error while getting data from REST API. url = ' + url + ', param = ' );
      this.logger.error(e);
    }
  }

}
