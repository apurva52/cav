import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash';
import { ConfirmationService, MenuItem, MessageService, TreeNode } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { NVAppConfigService } from 'src/app/pages/home/home-sessions/common/service/nvappconfig.service';
import { NvhttpService, NVPreLoadedState, NVPreLoadingState, NVPreLoadingErrorState } from 'src/app/pages/home/home-sessions/common/service/nvhttp.service';
import { environment } from 'src/environments/environment';
import { UxService } from './service/ux.service';

@Component({
  selector: 'app-ux',
  templateUrl: './ux.component.html',
  styleUrls: ['./ux.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UxComponent implements OnInit {
  uxItems: MenuItem[];
  activeTab: MenuItem;

  selectedTab = "general";

  loading: boolean;
  error: Error | AppError;

  generalReports: TreeNode[];
  customReports: TreeNode[];

  selectedGeneralReport: TreeNode;
  selectedCustomReport: TreeNode;

  customCRQ: any;
  generalCRQ: any;
  selectedCRQ: any;

  specialFilters: any;

  contextItems: MenuItem[] = [
    { label: 'Delete', icon: 'icons8 icons8-trash', command: (event) => { this.deleteCustomReport(this.selectedCustomReport); } }
  ]
  userName: string = null;


  constructor(
    private http: NvhttpService,
    private sessionService: SessionService,
    private appConfigService: NVAppConfigService,
    private uxService: UxService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    // laod supporting scripts.
    this.loadLibrary();
    this.getGeneralReports();
    this.getAppConfig();

    // get logged in username
    this.userName = this.sessionService.session.cctx.u;

    this.uxItems = [
      {
        label: 'General',
        command: () => {
          this.selectedTab = 'general';
        },
      },
      {
        label: 'Special',
        command: () => {
          this.selectedTab = 'special';
        },
      },
      {
        label: 'Custom',
        command: () => {
          this.selectedTab = 'custom';
        },
      },

    ];

    this.activeTab = this.uxItems[0];
  }

  getAppConfig() {
    this.appConfigService.getdata().subscribe(data => {
      this.uxService.appConfig = data;
    });
  }

  getGeneralReports() {
    this.http.getGeneralReport().subscribe((state: Store.State) => {
      if (state instanceof NVPreLoadingState) {
        this.loading = state.loading;
        this.error = state.error;
      }

      if (state instanceof NVPreLoadedState) {
        this.loading = state.loading;
        this.error = state.error;

        let standardReports = [];
        let defaultReports = [];
        let customReports = [];

        if (state.data) {
          if (state.data.standard) {
            standardReports = state.data.standard;
          }

          if (state.data.default) {
            defaultReports = state.data.default;
          }
        }

        // merge both reports for general reports
        standardReports = standardReports.concat(defaultReports);
        // show reports in tree structure
        this.generalReports = this.createReportsTree(standardReports);


        if (state.data[this.userName]) {
          customReports = state.data[this.userName];
        }

        this.customReports = this.createReportsTree(customReports);
        // default select the first report
        if (this.generalReports.length) {
          this.generalReports[0].expanded = true;
          this.selectedGeneralReport = this.generalReports[0].children[0];
          this.generalCRQ = JSON.parse(JSON.stringify(this.selectedGeneralReport.data));
        }

        if (this.customReports.length) {
          this.customReports[0].expanded = true;
          this.selectedCustomReport = this.customReports[0].children[0];

          this.customCRQ = JSON.parse(JSON.stringify(this.selectedCustomReport.data));
        }

      }
    }, (state: Store.State) => {
      if (state instanceof NVPreLoadingErrorState) {
        this.loading = state.loading;
        this.error = state.error;
      }
    });
  }

  loadLibrary() {

    const host = environment.api.netvision.base.base;
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = host + 'netvision/reports/nvCustomReportMetaData.jsp';
    document.head.appendChild(s);

    const p = document.createElement('script');
    p.type = 'text/javascript';
    p.src = host + 'netvision/js/reportUtil.js';
    document.head.appendChild(p);

    const r = document.createElement('script');
    r.type = 'text/javascript';
    r.src = host + 'netvision/reports/customReportsMetaData.js';
    document.head.appendChild(r);
  }


  createReportsTree(reports: any[]): TreeNode[] {
    const items: TreeNode[] = [];

    // remove duplicate groups from the reports 
    const groups = [];
    for (const report of reports) {
      if (groups.indexOf(report.group) === -1) {
        groups.push(report.group);
      }
    }

    // push the report groupwise in the tree
    for (const group of groups) {
      const childItems: TreeNode[] = [];

      // ISSUE: https://github.com/primefaces/primeng/issues/7397
      // so need to insert key in each node
      items.push({
        label: group,
        key: group,
        expandedIcon: 'pi pi-folder-open',
        collapsedIcon: 'pi pi-folder',
        selectable: false,
        children: childItems
      });

      for (const report of reports) {
        if (group === report.group) {
          childItems.push({
            label: report.name,
            key: report.name,
            icon: 'pi pi-file',
            data: report
          });
        }
      }
    }

    return items;
  }

  onNodeSelect(node, type) {
    console.log('node selected : ', node);
    if (node.parent) {
      if (type === 'general') {
        this.generalCRQ = JSON.parse(JSON.stringify(node.data));

      } else {
        this.customCRQ = JSON.parse(JSON.stringify(node.data));
      }
    }
  }


  deleteCustomReport(report) {

    const reportName = report.label;


    this.confirmationService.confirm({
      message: `Are you sure that you want to delete report ${reportName}?`,
      key: 'deleteReport',
      accept: () => {
        this.http.deleteReport(reportName, this.userName).subscribe((state: Store.State) => {
          if (state instanceof NVPreLoadingState) {
            this.loading = state.loading;
            this.error = state.error;
            this.customReports = [];
          }

          if (state instanceof NVPreLoadedState) {
            this.loading = state.loading;
            this.error = state.error;
            this.getGeneralReports();
          }
        }, (state: Store.State) => {
          if (state instanceof NVPreLoadingErrorState) {
            this.loading = state.loading;
            this.error = state.error;

            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete the report' });
          }
        });
      }
    });
  }


  onSubmit(e): void {
    this.specialFilters = e;
  }
}
