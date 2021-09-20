import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ExecDashboardUtil } from '../utils/exec-dashboard-util';
import { SessionService } from 'src/app/core/session/session.service';

@Injectable()
export class ExecDashboardCommonRequestHandler {
    constructor(public _httpClientService: HttpClient
     , public configUtilityService: ExecDashboardUtil,
     public sessionService: SessionService) { }

    /**For post type request */
    getDataFromPostRequest(url, data, callback) {
        this.configUtilityService.progressBarEmit({ flag: true, color: 'warn' });
        this._httpClientService.post(url, data).subscribe(data => {
	    this.configUtilityService.progressBarEmit({ flag: false, color: 'warn' });
            callback(data);
        },
            (err: HttpErrorResponse) => {
		this.configUtilityService.progressBarEmit({ flag: false, color: 'warn' });
		err['displayMsg'] = 'ConnectionRefused';
		this.configUtilityService.progressBarEmit({ flag: false, color: 'warn' });
                console.error("Error occured in getDataFromPostRequest. Url ->", url, ". Error ->", err);
                callback(err);
            });
    }

    /**For get type request */
    getDataFromGetRequest(url, callback) {
	this.configUtilityService.progressBarEmit({ flag: true, color: 'warn' });
		this._httpClientService.get(this.appendURL(url)).subscribe(data => {
            this.configUtilityService.progressBarEmit({ flag: false, color: 'warn' });
            callback(data);
        },
            (err: HttpErrorResponse) => {
		this.configUtilityService.progressBarEmit({ flag: false, color: 'warn' });
		err['displayMsg'] = 'ConnectionRefused';
                console.error("Error occured in getDataFromGetRequest. Url ->", url, ". Error ->", err);
                callback(err);
            });

    }

    getDataForGKPI(url, callback) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
                callback(this.status == 0 || this.responseText.length == 0?null:JSON.parse(this.response));
            }
        };
        xhttp.open("GET", this.appendURL(url), true);
        xhttp.send();
    }

    appendURL(url: string, param: string = "productKey="+this.sessionService.session.cctx.pk + "&userName=" + this.sessionService.session.cctx.u) {
        if (url.includes("?")){
            return url + "&" + param;
        } else {
            return url + "?" + param;
        }
    }
    /**For sys status get type request */
    getSysDataFromGetRequest(url) {
       return this._httpClientService.get(this.appendURL(url)).pipe(res => <any>res).toPromise();
    }

    /** Getting Event Day Date */
    getEventDayDateFromGetRequest(url) {
        return this._httpClientService.get(this.appendURL(url)).pipe(res => <any>res);
    }

    /**For get type request */
    getDataFromGetTextRequest(url, callback) {
        this._httpClientService.get(this.appendURL(url), { responseType: 'text' }).subscribe(data => {
            callback(data);
        },
            (err: HttpErrorResponse) => {
                err['displayMsg'] = 'ConnectionRefused';
                console.error("Error occured in getDataFromGetRequest. Url ->", url, ". Error ->", err);
                callback(err);
            });
    }
    
    //for simply getting observables of the http-get requests
    getRequest(url){
        return this._httpClientService.get(url);
    }
}
