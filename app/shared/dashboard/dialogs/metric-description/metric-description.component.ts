import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';
import { MetricDescriptionService } from './service/metric-description.service';
import { DownloadReportLoadedState, DownloadReportLoadingErrorState, DownloadReportLoadingState, MetricDescLoadedState, MetricDescLoadingErrorState, MetricDescLoadingState } from './service/metric-description.state';
import { MetricDescHeaderCols } from './service/metric-description.model';
import { SessionService } from 'src/app/core/session/session.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-metric-description',
  templateUrl: './metric-description.component.html',
  styleUrls: ['./metric-description.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MetricDescriptionComponent extends PageDialogComponent implements OnInit {

  isVisible: boolean = false;
  fromDerived: boolean = false;
  displayBasic2 = false;
  data: any[];
  loading: boolean = false;
  empty: boolean;
  error: AppError;
  downloadOptions: MenuItem[];
  groupName = "";
  groupDesc = "";
  searchText = "";
  globalFilterFields: string[] = [];
  cols: MetricDescHeaderCols[] = [];
  _selectedColumns: MetricDescHeaderCols[] = [];
  visible: boolean;


  constructor(private metricDescriptionService: MetricDescriptionService, private sessionService: SessionService,private ref: ChangeDetectorRef) {
  super();
  }

  ngOnInit(): void {
    const me = this;
    me.downloadOptions = [
      {
        label: 'word',
        icon: "icons8-doc",
        command: () => {
          const me = this;
          me.downloadShowDescReports(me.downloadOptions[0].label);
        }
      },
      {
        label: 'excel',
        icon:"icons8-xml-file",
        command: () => {
          const me = this;
          me.downloadShowDescReports(me.downloadOptions[1].label);
        }
      },
      {
        label: 'pdf',
        icon: "icons8-pdf-2",
        command: () => {
          const me = this;
          me.downloadShowDescReports(me.downloadOptions[2].label);
        }
      }
    ]
  }

  show() {
    super.show();
    this.isVisible= true;
  }

  // Form Model Close
  apply() {
    this.isVisible = false;
  }


  closeDialog() {
    const me = this;
    me.isVisible = false;
  }

  loadShowDesc(treeData, duration , fromDerived) {
    const me = this;
    me.isVisible = true;
    me.fromDerived = fromDerived;
    try {
    me.cols = [
      { label: 'Metrics Name', valueField: 'name', classes: 'text-left', isSort: true },
      { label: 'Metrics Description', valueField: 'description', classes: 'text-left', isSort: true },
    ];
    for (const c of me.cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
      me.data=[];
      let graphDescPayload = {};
      let treeNode = treeData;
      if(!me.fromDerived) {
        treeNode = treeData.selectedFile[0];
        let name = treeNode.name;
        let typeId = treeNode.typeId;
        let treeId = treeNode.id;
        let groupMgId = treeId.substr(32, 4);
        let idPad = "0100";
        let globalbmgId = idPad + groupMgId;
        graphDescPayload = {
          opType: 5,
          cctx: me.sessionService.session.cctx,
          duration: duration,
          tr: me.sessionService.testRun.id,
          clientId: "Default",
          appId: "Default",
          mgId: 23,
          glbMgId: globalbmgId

        };
        if (typeId == 5) {
          graphDescPayload['grpName'] = name;
        }
        else if (typeId == 3) {
          graphDescPayload['graphName'] = name;
        }
      }else {
        graphDescPayload = {
          opType: 17,
          cctx: me.sessionService.session.cctx,
          duration: duration,
          tr: me.sessionService.testRun.id,
          clientId: "Default",
          appId: "Default",
          mgId: treeNode.mgId,
          glbMgId: treeNode.glbMgId,
          grpName: ""
        };
      }



      me.metricDescriptionService.loadShowDesc(graphDescPayload).subscribe(
        (state: Store.State) => {
          if (state instanceof MetricDescLoadingState) {
            me.onLoading(state);
            this.ref.detectChanges();
            return;
          }

          if (state instanceof MetricDescLoadedState) {
            me.onLoaded(state, treeNode);
            return;
          }
        },
        (state: MetricDescLoadingErrorState) => {
          me.onLoadingError(state);
        }
      );
    } catch (err) {
      console.log("Exception in loadShowDesc method in metric description component :", err);
    }
  }

  private onLoading(state: MetricDescLoadingState) {
    const me = this;
    me.error = null;
    me.data = null;
    me.loading = true;


  }
  private onLoadingError(state: MetricDescLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
    this.ref.detectChanges();
  }
  private onLoaded(state: MetricDescLoadedState, treeNode) {
    const me = this;
    let graphData: any = state.data;
    if(!me.fromDerived) {
      if (treeNode.typeId === 3) {
        let graphArr = [];
        let len = graphData.graph.length;
        for (let i = 0; i < len; i++) {
          if (graphData.graph[i].name === treeNode.name) {
            graphArr.push(graphData.graph[i]);
           break;
          }
        }
        me.data = [...graphArr];
        me.groupDesc = graphData.groupDesc;
        me.groupName = graphData.groupName;
        me.error = null;
        me.loading = false;
      }

      else if (treeNode.typeId === 5) {

        me.data = [...graphData.graph];
        me.groupDesc = graphData.groupDesc;
        me.groupName = graphData.groupName;
        me.error = null;
        me.loading = false;
      }
    } else {
      if (treeNode.metricId >= 0) {
        let graphArr = [];
        let len = graphData.graph.length;
        for (let i = 0; i < len; i++) {
          if (graphData.graph[i].name === treeNode.metric) {
            graphArr.push(graphData.graph[i]);
           break;
          }
        }
        me.data = [...graphArr];
        me.groupDesc = graphData.groupDesc;
        me.groupName = graphData.groupName;
        me.error = null;
        me.loading = false;
      }

      else if (treeNode.metricId === -1) {

        me.data = [...graphData.graph];
        me.groupDesc = graphData.groupDesc;
        me.groupName = graphData.groupName;
        me.error = null;
        me.loading = false;
      }
    }


    this.ref.detectChanges();
  }


  downloadShowDescReports(label) {
    const me = this;
    let tableData = me.data;
    try {
      me.metricDescriptionService.downloadShowDescReports(label, tableData).subscribe(
        (state: Store.State) => {
          if (state instanceof DownloadReportLoadingState) {
            me.onLoadingReport(state);

            return;
          }

          if (state instanceof DownloadReportLoadedState) {
            me.onLoadedReport(state);
            return;
          }
        },
        (state: DownloadReportLoadingErrorState) => {
          me.onLoadingReportError(state);

        }
      );
    } catch (err) {
      console.log("Exception in downloadShowDescReports method in metric description component :", err);
    }
  }

  private onLoadingReport(state: DownloadReportLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }
  private onLoadedReport(state: DownloadReportLoadedState) {
    const me = this;
    me.error = null;
    me.loading = false;
    let path = state.data.comment.trim();
    let url = window.location.protocol + '//' + window.location.host;
    path = url + "/common/" + path;
    window.open(path + "#page=1&zoom=85", "_blank");

  }
  private onLoadingReportError(state: DownloadReportLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }

}

