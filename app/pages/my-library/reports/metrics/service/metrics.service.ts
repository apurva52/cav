import { Cctx } from './../../../../../shared/aggregated-virtual-metrices/service/aggregated-virtual-metric.model';
import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import {
    MetricsTableLoadingState,
    MetricsTableLoadedState,
    MetricsTableLoadingErrorState,
    DeleteReportLoadedState,
    DeleteReportLoadingState,
    DeleteReportLoadingErrorState,
    ReuseReportLoadedState,
    ReuseReportLoadingErrorState,
    onDownloadLoadingState,
    onDownloadLoadedState,
    onDownloadLoadingErrorState
  } from './metrics.state';
import { MetricsHeaderCols, MetricsTableHeader, MetricsTable, DeleteReport, ReuseReport} from './metrics.model';
import { environment } from 'src/environments/environment';
import { SessionService } from 'src/app/core/session/session.service';
import { Router } from '@angular/router';
import { TABLE_JSON } from './metrics.dummy';

@Injectable({
    providedIn: 'root',
  })

export class MetricsService extends Store.AbstractService {
    path = environment.api.dashboard.tree.endpoint;
    duration: any;
    reportListArray: any;
    reportType :string;
    reportListData;
    rowData:any;
    isEditCompare = false;
    dataTobeEdit:any;
    previousTempName:any;
    paginateEventReport:any;
    checkForCompare:boolean=false;
	  takeDataOfEdit:any;
    constructor(private sessionService: SessionService,private router: Router,) {
      super();
    }
    loadMetricsTable(timeperiod: any): Observable<Store.State> {
        const me = this;
        const output = new Subject<Store.State>();
    
        setTimeout(() => {
          output.next(new MetricsTableLoadingState());
        }, 0);
    
        const path = environment.api.report.availableReports.endpoint;
        const base = environment.api.core.defaultBase;
        const payload = {
          cctx:{
            cck: me.sessionService.session.cctx.cck,
            pk: me.sessionService.session.cctx.pk,
            u: me.sessionService.session.cctx.u,
            prodType: me.sessionService.session.cctx.prodType
          },
          tR:me.sessionService.testRun.id
        };
        me.controller.post(path, payload).subscribe(
          (data: MetricsTable[]) => {
            this.reportListArray = data;
            output.next(new MetricsTableLoadedState(data));
            output.complete();
          },
          (e: any) => {
            output.error(new MetricsTableLoadingErrorState(e));
            output.complete();
            me.logger.error('loading failed', e);
          }
        );
        this.router.navigate(['/reports']);
        return output;
      }
      getReuseReportData(row): Observable<Store.State>{
        const me = this;
        this.rowData =row;
        const output = new Subject<Store.State>();
        setTimeout(() => {
          output.next(new MetricsTableLoadingState());
        }, 0);
        const path = environment.api.report.msrInfo.endpoint;
        const base = environment.api.core.defaultBase;
        const payload = {
          cctx:{
            cck: me.sessionService.session.cctx.cck,
            pk: me.sessionService.session.cctx.pk,
            u: me.sessionService.session.cctx.u,
            prodType: me.sessionService.session.cctx.prodType
          },
          tR:me.sessionService.testRun.id,
          rptInfo: [
            {
                rN: row['rN'],
                rT: row['rT']
            }
        ]
        };
        me.controller.post(path, payload).subscribe(
          (data: ReuseReport[]) => {
            output.next(new ReuseReportLoadedState(data));
            output.complete();
          },
          (e: any) => {
            output.error(new ReuseReportLoadingErrorState(e));
            output.complete();
            me.logger.error('loading failed', e);
          }
        );
        return output;
      }

      getDeleteReportData(rptInfoList): Observable<Store.State>{
        const me = this;
        const output = new Subject<Store.State>();
        
        const path = environment.api.report.deleteReports.endpoint;
        const base = environment.api.core.defaultBase;
        const payload = {
          cctx:{
            cck: me.sessionService.session.cctx.cck,
            pk: me.sessionService.session.cctx.pk,
            u: me.sessionService.session.cctx.u,
            prodType: me.sessionService.session.cctx.prodType
          },
          tR:me.sessionService.testRun.id,
          rptInfo: rptInfoList
        };
        me.controller.post(path, payload).subscribe(
          (data: DeleteReport[]) => {
            output.next(new DeleteReportLoadedState(data));
            output.complete();
            },
          (e: any) => {
            output.error(new DeleteReportLoadingErrorState(e));
            output.complete();
            me.logger.error('loading failed', e);
          }
        );

        return output;
      }

	downloadTableData(type, dataArr,header,skipColumn):Observable<Store.State>{
        const me = this;
        const output = new Subject<Store.State>();
        
        setTimeout(() => {
          output.next(new onDownloadLoadingState());
        }, 0);
    
        let arrData = [];
        for (let i = 0; i < dataArr.length; i++) {
          let rowDataObj = dataArr[i];
          let rowDataArr :any []=[];
          rowDataArr.push((i+1).toString);
          rowDataArr.push(rowDataObj.rN);
          rowDataArr.push(rowDataObj.rT);
          rowDataArr.push(rowDataObj.mO);
          rowDataArr.push(rowDataObj.rS);
          rowDataArr.push(rowDataObj.uN);
          rowDataArr.push(rowDataObj.cD);
          arrData.push(rowDataArr);
        }
        const payload = {
          testRun: me.sessionService.session.testRun.id,
          type: type,
          skipColumn: skipColumn.join(),
          rowData: arrData,
          cctx: me.sessionService.session.cctx,
          title: "Report",
          header: header,
          colWidth: [125,125,125,125,125,125,125,125],
         };
        const path = environment.api.downloadData.load.endpoint;
        const base = environment.api.core.defaultBase;
    
        me.controller.post(path,payload).subscribe((data) => {
    
          output.next(new onDownloadLoadedState(data));
          output.complete();
          },
          (e: any) => {
            output.error(new onDownloadLoadingErrorState(e));
            output.complete();
            me.logger.error('loading failed', e);
          }
        );
        return output;
      }
      paginate(event){
        this.paginateEventReport = event;
      }
}
