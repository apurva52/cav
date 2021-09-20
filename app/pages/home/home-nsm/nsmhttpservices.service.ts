import { Injectable } from '@angular/core'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { environment } from 'src/environments/environment'; 
import { Store } from 'src/app/core/store/store';  
import { map } from 'rxjs/operators';

export class NSMPreLoadedState<T> extends Store.AbstractIdealState<T> { }
export class NSMPreLoadingState<T> extends Store.AbstractLoadingState<T> { }
export class NSMPreLoadingErrorState<T> extends Store.AbstractErrorState<T> { }


@Injectable({
  providedIn: 'root'
})
export class NsmhttpservicesService {
  //http: HttpClient;
  constructor( private http: HttpClient) { }
  
   getsummery() {
     return this.http.get("/NCServerManagement/webapi/nsm/home/summary");
   } 
  getControllers() {  
   
    let url = "/NCServerManagement/webapi/nsm/home/controller"; 
    
    return this.http.get(url);
  } 
  getmaps() {
    return this.http.get("/NCServerManagement/webapi/nsm/home/maps"); 

  } 
  getmasterserver(){
    return this.http.get("/NCServerManagement/webapi/nsm/servers/master/servers");
  }  

  getMasterBlades(){
    return this.http.get("NCServerManagement/webapi/nsm/servers/master/blades");

  } 
  getProjectTeam(){
    return this.http.get("/NCServerManagement/webapi/nsm/projects/teams");
  } 

  getVenders(){
    return this.http.get("/NCServerManagement/webapi/nsm/vendors");
  } 

  getActionLogs(action){
    return this.http.get("/NCServerManagement/webapi/nsm/logs?action="+action);
  } 
  getmserver(): Observable<any>{
    return this.http.get("/NCServerManagement/webapi/nsm/manage/servers/blades");
  } 
  getmlocation(){
    return this.http.get("/NCServerManagement/webapi/nsm/manage/location/list");
  }
  getmvender(){
    return this.http.get("/NCServerManagement/webapi/nsm/vendors");
  } 
  getmteam(){
    return this.http.get("/NCServerManagement/webapi/nsm/manage/team/list");
  } 
  getmchannel(){
    return this.http.get("/NCServerManagement/webapi/nsm/manage/team/list");
  } 
  getmatadatforvenders(){
    return this.http.get("/NCServerManagement/webapi/nsm/metadata/vendors");
  } 
  getmatadatforteam(){
    return this.http.get("/NCServerManagement/webapi/nsm/metadata/team");
  } 
  getmatadatforloaction(){
    return this.http.get("/NCServerManagement/webapi/nsm/metadata/location");
  } 
  getmatadatforchannel(){
    return this.http.get("/NCServerManagement/webapi/nsm/metadata/team-channel");
  } 
  getmatadatforatribute(){
    return this.http.get("/NCServerManagement/webapi/nsm/metadata/db_attributes");
  }  
  
  postadddatamangeserver(postdata) {
    let url = "/NCServerManagement/webapi/nsm/manage/servers/add"
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const options = {
      headers
    };
    const data = (postdata);
    return this.http.post(url, data, options).pipe(map((response: Response) => response));
  }
  posteditdatamangeserver(postdata) {
    let url = "/NCServerManagement/webapi/nsm/manage/servers/edit"
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const options = {
      headers
    };
    const data = (postdata);
    return this.http.post(url, data, options).pipe(map((response: Response) => response));
  }  
  
  getdeletedservers(servername){
    let url ="/NCServerManagement/webapi/nsm/manage/servers/delete?name="+servername; 
    return this.http.get(url);
  }
  // venders are mange from here
  getaddvenders( vendername) {
    let url = "/NCServerManagement/webapi/nsm/manage/vendors/add?name="+vendername;
    
    return this.http.get(url)
  } 
  getdeletvenders(delvname) {
    let url = "/NCServerManagement/webapi/nsm/manage/vendors/delete?name="+delvname;
    
    return this.http.get(url)
  }  
 // location are mange from here
  postaddlocation(postdata) {
    let url = "/NCServerManagement/webapi/nsm/manage/location/add";
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const options = {
      headers
    };
    const data = (postdata);
    return this.http.post(url, data, options).pipe(map((response: Response) => response));
  } 

  postdeletelocation(postdata) {
    let url = "/NCServerManagement/webapi/nsm/manage/location/delete";
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const options = {
      headers
    };
    const data = (postdata);
    return this.http.post(url, data, options).pipe(map((response: Response) => response));
  }

 // channel are mange from here 
  postaddchannel(postdata) {
    let url = "/NCServerManagement/webapi/nsm/manage/channel/add";
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const options = {
      headers
    };
    const data = (postdata);
    return this.http.post(url, data, options).pipe(map((response: Response) => response));
  } 
  postdeletechannel(postdata) {
    let url = "/NCServerManagement/webapi/nsm/manage/channel/delete";
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const options = {
      headers
    };
    const data = (postdata);
    return this.http.post(url, data, options).pipe(map((response: Response) => response));
  } 

  //team manage from here 
  postdeleteteam( teamname) {
    let url = "/NCServerManagement/webapi/nsm/manage/team/delete?name="+teamname;
   
    return this.http.get(url);
  } 
  postaddteam(postdata) {
    let url = "/NCServerManagement/webapi/nsm/manage/team/add";
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const options = {
      headers
    };
    const data = (postdata);
    return this.http.post(url, data, options).pipe(map((response: Response) => response));
  }
}
