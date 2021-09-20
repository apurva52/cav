import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { MenuService } from 'src/app/shared/dashboard/menu.service';
import { FlowpathDetailsTable } from './service/flowpath-details.model';
import { FlowpathDetailsService } from './service/flowpath-details.service';
import {
  FlowpathDetailsLoadedState,
  FlowpathDetailsLoadingErrorState,
  FlowpathDetailsLoadingState,
} from './service/flowpath-details.state';

@Component({
  selector: 'app-flowpath-details',
  templateUrl: './flowpath-details.component.html',
  styleUrls: ['./flowpath-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FlowpathDetailsComponent implements OnInit {
  data: FlowpathDetailsTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  isShow: boolean;
  _selectedColumns: any;
  cols: any;

  menuOptions: MenuItem[];
  downloadOptions: MenuItem[];
  items1: MenuItem[];
  displayDetails: boolean;
  showFlowpathDetailsModel: boolean = false;
  @Output() arrowClick = new EventEmitter<boolean>();

  constructor(
    private flowpathDetailsService: FlowpathDetailsService,
    private router: Router,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    const me = this;
    me.load();

    me.menuOptions = [
      {
        label: 'Start Instrumentation',
        command: (event: any) => {
          this.showInstrumentationDetails();
        },
      },
      {
        label: 'Copy flowpath Link',
      },
      {
        label: 'Show all flowpath of selected flowpath session',
      },
      {
        label: 'Show all flowpath of selected flowpath NV session',
      },
      {
        label: 'Show all flowpath of selected flowpath instance',
      },
      {
        label: 'Open aggregate method timing for selected flowpaths',
      },
      {
        label: 'Deleted cache data',
      },
    ];
    me.downloadOptions = [
      {
        label: 'Word',
      },
      {
        label: 'Excel',
      },
      {
        label: 'PDF',
      },
    ];
    me.items1 = [
      {
        label: 'Method Timing Reports',
        command: (event: any) => {
          this.router.navigate(['/dashboard-service-req/method-timing']);
        },
      },
      {
        label: 'DB Request Reports',
        command: (event: any) => {
          this.router.navigate(['/dashboard-service-req/db-queries']);
        },
      },

      {
        label: 'Flowpath Analyzer',
        command: (event: any) => {
          this.router.navigate(['/flowpath-analyzer']);
        },
      },
      {
        label: 'BT IP Summary',
        command: (event: any) => {
          this.router.navigate(['/dashboard-service-req/ip-summary']);
        },
      },
    ];
  }

  showInstrumentationDetails() {
    this.displayDetails = true;
    this.showFlowpathDetailsModel = false;
  }

  backDetails() {
    const me = this;
    me.menuService.closeSidePanel(false);
  }

  load() {
    const me = this;
    me.flowpathDetailsService.load().subscribe(
      (state: Store.State) => {
        if (state instanceof FlowpathDetailsLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof FlowpathDetailsLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: FlowpathDetailsLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: FlowpathDetailsLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: FlowpathDetailsLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }

  private onLoaded(state: FlowpathDetailsLoadedState) {
    const me = this;
    me.data = state.data;
    me.error = null;
    me.loading = false;
    me.cols = me.data.headers[0].cols;
    me._selectedColumns = me.cols;
  }

  @Input() get selectedColumns(): any[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  openDownloadFileDialog() {
    const me = this;
    me.showFlowpathDetailsModel = true;
  }
  close() {
    this.showFlowpathDetailsModel = false;
  }
}
