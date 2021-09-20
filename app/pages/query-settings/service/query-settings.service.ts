
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { environment } from 'src/environments/environment';
import { QuerySettingsLoadedState, QuerySettingsLoadingErrorState, QuerySettingsLoadingState, updateQuerySettingsLoadedState, updateQuerySettingsLoadingErrorState } from './query-settings.state';


// const httpOptions = {
// headers: new HttpHeaders({
// // "Access-Control-Allow-Origin":"*",
// // "Access-Control-Allow-Credentials": "true",
// // 'Access-Control-Allow-Headers': 'Accept, Access-Control-Allow-Headers, X-Opaque-Id, Authorization, Content-Type',

// 'Content-Type': 'application/json',

// // 'content-type': 'text/plain',
// // 'Accept': 'application/json, text/plain, */*'


// // 'Accept': '*/*'
// })
// };

@Injectable({
providedIn: 'root'
})
export class QuerySettingsService extends Store.AbstractService{

constructor() {
super()

}
initialsettings(): Observable<Store.State> {
// let initialsettings_url="LOG_MON/querysettings"
// return this.http.get(initialsettings_url, httpOptions)
const output = new Subject<Store.State>();

setTimeout(() => {
output.next(new QuerySettingsLoadingState());
}, 0);

const path = environment.api.logs.initialsettings.endpoint;
let payload={"requestType":"querysettings"}
this.controller.post(path,payload).subscribe((data)=>{
console.log(data)

output.next(new QuerySettingsLoadedState(data));
output.complete();
},
(e: any) => {
output.error(new QuerySettingsLoadingErrorState(e));
output.complete();
this.logger.error('loading failed', e);
});
return output



}


updatesettings(value):Observable<Store.State>{
let payload=value
Object.assign(payload,{"requestType":"querysettings/updatesettings"})
console.log(payload)
// let updatesettings_url="LOG_MON/querysettings/updatesettings"
const output = new Subject<Store.State>();

setTimeout(() => {
output.next(new QuerySettingsLoadingState());
}, 0);

const path = environment.api.logs.updatesettings.endpoint;
this.controller.post(path,payload).subscribe((data)=>{
console.log(data)

output.next(new updateQuerySettingsLoadedState(data));
output.complete();
},
(e: any) => {
output.error(new updateQuerySettingsLoadingErrorState(e));
output.complete();
this.logger.error('loading failed', e);
});
return output



}
}
// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
// import { Observable } from 'rxjs';


// const httpOptions = {
//   headers: new HttpHeaders({
//     // "Access-Control-Allow-Origin":"*",
//     // "Access-Control-Allow-Credentials": "true",
//     // 'Access-Control-Allow-Headers': 'Accept, Access-Control-Allow-Headers, X-Opaque-Id, Authorization, Content-Type',

//     'Content-Type': 'application/json',

//     // 'content-type': 'text/plain',
//     // 'Accept': 'application/json, text/plain, */*'


//     // 'Accept': '*/*'
//   })
// };

// @Injectable({
//   providedIn: 'root'
// })
// export class QuerySettingsService {

//   constructor(private http: HttpClient) {

//   }
//   initialsettings(): Observable<any> {
//     let initialsettings_url = "LOG_MON/querysettings"
//     return this.http.get(initialsettings_url, httpOptions)

//   }

//   updatesettings(value): Observable<any> {
//     let payload = value
//     let updatesettings_url = "LOG_MON/querysettings/updatesettings"
//     return this.http.post(updatesettings_url, payload, httpOptions)
//   }
// }