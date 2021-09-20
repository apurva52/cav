import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';

import { environment } from 'src/environments/environment';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';
import { CloudMonitorPayload } from './cloud-monitor.model';
import { DownloadReportLoadedState, DownloadReportLoadingErrorState, DownloadReportLoadingState } from 'src/app/shared/dashboard/dialogs/metric-description/service/metric-description.state';
import { ClientCTX } from 'src/app/core/session/session.model';

export class requestDTO{
  tName:string = ''
  cctx:ClientCTX;
}

@Injectable({
    providedIn: 'root',
  })
  export class cloudMonitorService extends Store.AbstractService {
    productType: string = 'NS';
    reqDTO:requestDTO
    
    statsdtype: string = '';
    constructor(private sessionService: SessionService,
      ) {
      super();
    }
  
    load(clientObj: CloudMonitorPayload): Observable<Store.State> {
      const me = this;
      const output = new Subject<Store.State>();
  
      // setTimeout(() => {
      //   output.next(new MonitorupdownstatusLoadingState());
      // }, 0);
  
  
      // setTimeout(() => {
      //   output.next(new MonitorupdownstatusLoadedState());
      //   output.complete();
      // }, 2000);
  
      // setTimeout(() => {
      //   output.error(new MonitorupdownstatusErrorState(new Error()));
      // }, 2000);
  
      let path = environment.api.allMonitors.load.endpoint;
      const payload  = {
        cctx: me.sessionService.session.cctx,
        tr: Number(me.sessionService.testRun.id),
        sp: clientObj.sp
      }
  
    //   const subscription = me.controller.post(path, payload).subscribe(
    //     (data) => {
  
    //             output.next(new MonitorupdownstatusLoadedState(data));
    //             output.complete();
    //         },
    //         (error: AppError) => {
    //           output.error(new MonitorupdownstatusErrorState(error));
    //           output.complete();
    //         }
    //       );
  
      return output;
    }
  
    downloadShowDescReports(downloadType, tableData, header): Observable<Store.State> {
      try {
        const me = this;
        const output = new Subject<Store.State>();
  
        setTimeout(() => {
          output.next(new DownloadReportLoadingState());
        }, 3000);
  
        let skipColumn = [];
        let downloadDataPayload = {};
        let rowData:any []=[];
  
        for(let i =0;i<tableData.length;i++)
        {
          let rData:string []=[];
          let number = i+1;
          rData.push(number.toString());
          rData.push(tableData[i].time);
          rData.push(tableData[i].agentStartTime);
          rData.push(tableData[i].component);
          rData.push(tableData[i].tier);
          rData.push(tableData[i].hostName);
          rData.push(tableData[i].server);
          rData.push(tableData[i].instance);
          rData.push(tableData[i].icon);
          rowData.push(rData);
        }
  
        downloadDataPayload = {
          "testRun": me.sessionService.testRun.id,
          "clientconnectionkey": me.sessionService.session.cctx.cck,
          "userName": me.sessionService.session.cctx.u,
          "productName": me.sessionService.session.cctx.prodType,
          "downloadType": downloadType,
          "skipColumn": skipColumn,
          "rowData": rowData,
          "header": header,
          "reportTitle": "MONITOR UP/DOWN STATUS"
        }
  
        let downloadPath = environment.api.dashboard.download.endpoint;
        me.controller.post(downloadPath, downloadDataPayload).subscribe((DownloadReportData: any) => {
        output.next(new DownloadReportLoadedState(DownloadReportData));
        output.complete();
        },
          (error: AppError) => {
            output.next(new DownloadReportLoadingErrorState(error));
            output.complete();
          }
        );
        return output;
      } catch (err) {
        console.log("Exception has occured while Downloading Report for Show Description", err);
      }
    }
  
    getProductType() {
        return this.productType;
    }

    setProductType(type: string) {
        this.productType = type;
        sessionStorage.setItem("productType",this.productType + "");
    }

    getAWSProfile() {

      const me = this;
       let url = environment.api.monitor.getAwsProfile.endpoint
       let filters = '?productKey='+ me.sessionService.session.cctx.pk +'&userName=' + me.sessionService.session.cctx.u + "&role="+'admin';
       url = url + filters
       return me.controller.get(url)


    }

    saveAWSProfile(keymode, operation, oldKey, data) {
      let me = this
      let url = environment.api.monitor.saveAWSProfile.endpoint
       url = url + "?productKey=" + me.sessionService.session.cctx.pk + "&keyMode=" + keymode + "&role=" + 'admin' + "&operation=" + operation + "&oldKeyName=" + oldKey + "&userName=" + me.sessionService.session.cctx.u;
      return me.controller.post(url, data);
    }
    
    getAzureProfile() {
      let me = this
      let url = environment.api.monitor.getAzureProfile.endpoint
       url =  url + "?productKey=" + me.sessionService.session.cctx.pk + "&userName=" + me.sessionService.session.cctx.u + "&role=" + 'admin';
      return me.controller.get(url)
    }


    saveAzureProfile(operation, oldSKey, data) {
      let me = this;
      let url = environment.api.monitor.saveAzureProfile.endpoint
       url = url +  "?productKey=" + me.sessionService.session.cctx.pk + "&oldSecret=" + oldSKey + "&role=" + 'admin' + "&operation=" + operation + "&userName=" + me.sessionService.session.cctx.u;
      return me.controller.post(url, data);
    }

    getCloudMonitor(tName){
      
      this.reqDTO = new requestDTO();
      this.reqDTO.tName = tName
      this.reqDTO.cctx = this.sessionService.session.cctx;
      let me = this;
      let url = environment.api.monitor.cloudMonList.endpoint
      return me.controller.post(url,this.reqDTO)
    }
    

    getAWSRegions() {
        let me = this
      let url = environment.api.monitor.getAWSRegion.endpoint
       url = url  + "?productKey=" + me.sessionService.session.cctx.pk + "&role=" + 'admin' + "&userName=" + me.sessionService.session.cctx.u;
      return me.controller.get(url)
    }


    getNewRelicProfile() {
      let me = this;
      let url = environment.api.monitor.getNewRelic.endpoint
       url =  url + "?productKey=" + me.sessionService.session.cctx.pk + "&userName=" + me.sessionService.session.cctx.u;
        + "&role=" + 'admin';
      return me.controller.get(url)
    }

    saveNewRelicProfile(operation, oldKey, oldAPIKey, data) {
      let me = this;
      let url = environment.api.monitor.saveNewRelic.endpoint
       url = url  + "?productKey=" + me.sessionService.session.cctx.pk + "&oldKeyName=" + oldKey + "&oldAPIKeyName=" + oldAPIKey +  "&role=" + 'admin' + "&operation=" + operation + "&userName=" + me.sessionService.session.cctx.u;
      return me.controller.post(url, data);
    }
  
    getDTProfile() {
      let me = this;
      let url = environment.api.monitor.getDTProfile.endpoint
       url = url +  "?productKey=" + me.sessionService.session.cctx.pk + "&userName=" + me.sessionService.session.cctx.u + "&role=" + 'admin';
      return me.controller.get(url)
    }
    saveDTProfile(operation,oldToken, data) {
      const me = this
      let url = environment.api.monitor.saveDTProfile.endpoint
       url = url   + "?productKey=" + me.sessionService.session.cctx.pk +  "&oldToken=" + oldToken +  "&role=" + 'admin' + "&operation=" + operation + "&userName=" + me.sessionService.session.cctx.u;
      return me.controller.post(url, data);
    }

    getGCPProfile() {
      let me = this
      let url = environment.api.monitor.getGcpProfile.endpoint
       url = url    + "?productKey=" + me.sessionService.session.cctx.pk + "&userName=" + me.sessionService.session.cctx.u
        + "&role=" + 'admin';
  
      return me.controller.get(url)
    }
    getDataFromRESTUsingPOSTReq( url: string, param: string, data: any): Observable<any> {
     let me = this
      try {
  
        if (url.indexOf('=') != -1) {
             url = url + '&productKey=' + me.sessionService.session.cctx.pk
         } else {
           url = url + '?productKey=' + me.sessionService.session.cctx.pk
         }
  
  
        //this.log.info('Getting data from url = ' + url + ', param = ' + param);
  
        return me.controller.post(url + param, data)

      } catch (e) {
        //this.log.error('Error while getting data from REST API. url = ' + url + ', param = ' + param);
        //this.log.error(e);
      }
    }
    downloadProfile(profileName) {
      let me = this
      let url = environment.api.monitor.downloadAccount.endpoint
       url =  url  + "?jsonName=" + `${profileName}` + "&userName=" + me.sessionService.session.cctx.u + "&role=" + 'admin' + "&productKey=" + me.sessionService.session.cctx.pk;
      return me.controller.get(url);
    }

    saveGCPProfile(file){
      const me = this
      let url = environment.api.monitor.gcp.endpoint + "?productKey=" + me.sessionService.session.cctx.pk +
                  "&userName=" + me.sessionService.session.cctx.u + "&operation=0"
      return me.controller.post(url, file);
    }
    deleteGCPFile(jsonName){
      let me = this
      let url = environment.api.monitor.deleteGCP.endpoint
      url = url + "?jsonName=" + `${jsonName}`+ "&userName=" + me.sessionService.session.cctx.u +"&productKey=" + me.sessionService.session.cctx.pk
      return me.controller.get(url);
    }
  }
  
