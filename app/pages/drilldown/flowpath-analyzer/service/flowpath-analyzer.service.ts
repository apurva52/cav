import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { FlowpathAnalyzerData } from './flowpath-analyzer.model';
import { FlowpathAnalyzerLoadedState, FlowpathAnalyzerLoadingErrorState, FlowpathAnalyzerLoadingState, DownloadReportLoadingState, DownloadReportLoadedState, DownloadReportLoadingErrorState } from './flowpath-analyzer.state';
import { SessionService } from 'src/app/core/session/session.service';
import { WidgetDrillDownMenuItem } from 'src/app/shared/dashboard/widget/widget-menu/service/widget-menu.model';
import { ActivatedRoute } from '@angular/router';
import { symlink } from 'fs';
import { environment } from 'src/environments/environment';
import { AppError } from 'src/app/core/error/error.model';

@Injectable({
    providedIn: 'root'
})

export class FlowpathAnalyzerService extends Store.AbstractService {
    isSource: any;
    reportID: any;
    stateID: string;
    getTimeData = [];
    tierName: string;
    startTime: number;
    endTime: number;
    serverName: string;
    instanceName: string;
    btTransaction: string;
    urlName: any;
    BtCategory: any;
    private _filterCriteriaVal: string;


    constructor(
        private sessionService: SessionService,
        private route: ActivatedRoute
    ) {
        super();
        this.route.queryParams.subscribe((params) => {
            this.stateID = params['state']
        });
    }

    load(numPatterns?: string): Observable<Store.State> {
        const me = this;
        const output = new Subject<Store.State>();

        setTimeout(() => {
            output.next(new FlowpathAnalyzerLoadingState());
        }, 0);

        //  if (this.isSource == "widget" && me.reportID == "FPA") {

        const state: WidgetDrillDownMenuItem = me.sessionService.getSetting("ddrMenu");

        for (const subjectInfo of state.state.subject.tags) {
            if (subjectInfo.key == 'Tier') {
                me.tierName = subjectInfo.value;
            } else if (subjectInfo.key == 'Server') {
                me.serverName = subjectInfo.value;
            } else if (subjectInfo.key == 'Instance') {
                me.instanceName = subjectInfo.value;
            } else if (subjectInfo.key == 'Business Transactions') {
                me.btTransaction = subjectInfo.value;
            }
        }
        for (const timeInfo of state.time) {
            me.startTime = timeInfo.startTime;
            me.endTime = timeInfo.endTime;

        }


        /// DEV CODE ----------------->

        // setTimeout(() => {
        // output.next(new FlowpathAnalyzerLoadedState(FLOWPATH_ANALYZER_TABLE));
        // output.complete();
        // }, 2000);

        // setTimeout(() => {
        // output.error(new FlowpathAnalyzerLoadingErrorState(new Error()));
        // }, 2000);

        /// <----------------- DEV CODE

        // const path = environment.api.URL.load.endpoint;
        // const payload = {
        // duration
        // };
        // me.controller.post(path, payload).subscribe(
        // (data: FlowpathAnalyzerData) => {
        // output.next(new FlowpathAnalyzerLoadedState(data));
        // output.complete();
        // },
        // (e: any) => {
        // output.error(new FlowpathAnalyzerLoadingErrorState(e));
        // output.complete();

        // me.logger.error('Flowpath Analyzer Data loading failed', e);
        // }
        // );

        const path = environment.api.analyzerData.load.endpoint;
        const payload = {
            cctx: me.sessionService.session.cctx,
            testRun: me.sessionService.testRun.id,
            tierName: me.tierName,
            serverName: me.serverName,
            appName: me.instanceName,
            numOfPatterns: numPatterns || '5',
            tierId: 'undefined',
            serverId: 'undefined',
            appId: 'undefined',
            strStartTime: me.startTime,
            strEndTime: me.endTime,
            urlName: me.btTransaction,
            // urlIndex: undefined,
            // btcategoryId: undefined,
        };

        /*Harcoded values */
        // "testRun": "4384",
        // "strStartTime": "1503886681000",
        // "strEndTime": "1503901081000",
        // "numOfPatterns": "5",
        // "tierName": "Tier48",
        // "serverName": "AppServer48",
        // "appName": "Atg48",
        // "urlName": "ATGCartSummary"


        me.controller.post(path, payload).subscribe(
            (data: FlowpathAnalyzerData) => {
                output.next(new FlowpathAnalyzerLoadedState(data));
                output.complete();
            },
            (e: any) => {
                output.error(new FlowpathAnalyzerLoadingErrorState(e));
                output.complete();

                me.logger.error('Flow Path Analyzer Data loading failed', e);
            }
        );

        return output;
    }
    public get filterCriteria(): string {
      return this._filterCriteriaVal;
    }
  
    public set filterCriteriaVal(value: string) {
      this._filterCriteriaVal = value;
    }
    downloadShowDescReports(downloadType, rowData, header, title): Observable<Store.State> {
      try {
        const me = this;
        const output = new Subject<Store.State>();

        setTimeout(() => {
          output.next(new DownloadReportLoadingState());
        }, 3000);

        let skipColumn = [];
        let downloadDataPayload = {};

        downloadDataPayload = {
          "testRun": me.sessionService.testRun.id,
          "clientconnectionkey": me.sessionService.session.cctx.cck,
          "userName": me.sessionService.session.cctx.u,
          "productName": me.sessionService.session.cctx.prodType,
          "downloadType": downloadType,
          "skipColumn": skipColumn,
          "rowData": rowData,
          "header": header,
          "reportTitle": title
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
}
