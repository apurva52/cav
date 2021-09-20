import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse  } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from "rxjs/operators";
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/observable/of';
// import 'rxjs/add/observable/empty';
@Injectable()
export class DDRRequestService {

    constructor(private http:HttpClient){}

    /* Getting data through RestApi through Get method*/
    getDataUsingGet(url,param?){
     console.log(`Making RestCall and getting data using Get method where url = ${url} and
     params = ${param}`);
     return this.http.get(url).pipe(map((response) => response), catchError((err: HttpErrorResponse) => {
        return this.catchLog(err,url);  
      }));
    }

    /* Getting data through RestApi through Post method*/
    getDataUsingPost(url,paramObj){
        console.log(`Making RestCall and getting data using Post method where url = ${url} and
        params = ${paramObj}`);
        return this.http.post(url,paramObj).pipe(map((response) => response), catchError((err: HttpErrorResponse) => {
            return this.catchLog(err,url);  
          }));

    }

    /*Getting Data Through REST API in String format by using GET Method */
    getDataInStringUsingGet(url,param?){
        console.log(`Making RestCall and getting data using Get method for String where url = ${url} and
        params = ${param}`);
        return this.http.get(url, {responseType: 'text'}).pipe(
            tap( 
              data => data
                    )
             , catchError((err: HttpErrorResponse) => {
                return this.catchLog(err,url);  
              }));
    }

    /*Getting Data Through REST API in String format by using Post Method */
    getDataInStringUsingPost(url,paramObj){
        console.log(`Making RestCall and getting data using Post method for String where url = ${url} and
        params = ${paramObj}`);
        return this.http.post(url, paramObj, {responseType: 'text'}).pipe(
            tap( 
              data => data
                    )
             , catchError((err: HttpErrorResponse) => {
                return this.catchLog(err,url);  
              }));
    }

    /* Logging Error Function */
    catchLog(err,url){
        if (err.error instanceof Error) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', err.error.message, 'url:', url);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(`Backend returned code ${err.status}, body was: ${err.error}, url:${url}`);
          }
          return throwError(
              new Error(`${ err.status } ${ err.statusText }`)
            );
    }
}
