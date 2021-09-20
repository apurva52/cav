import { Component, OnInit, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { SelectItem, Dialog } from 'primeng';
import { FormBuilder } from '@angular/forms';
import { ReportsDataService } from './service/reports-data.service';
import { merge } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { ReportTypeLoadedState, ViewTypeLoadedState, WidgetInfoLoadedState } from './service/reports-data.state';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReportsComponent implements OnInit {

  error: boolean;
  loading: boolean;
  isVisible = false;
  displayBasic2 = false;

// Time Perios : FormGroup;
reportTypeOptions: SelectItem[];
@Input() reportType: string;

viewTypeOptions: SelectItem[];
@Input() viewType: string;

widgetinfoOptions: SelectItem[];
@Input() widgetinfo: string;

@ViewChild('dialog', { read: Dialog }) dialog: Dialog;

  constructor(
    private fb: FormBuilder,
    private reportsDataService: ReportsDataService
  ) { }

  ngOnInit(): void {
    const me = this;
    me.load();
  }

  load() {
    const me = this;
    merge(
      me.reportsDataService.loadReportData(),
      me.reportsDataService.loadViewTypeData(),
      me.reportsDataService.loadWidgetInfo()

    ).subscribe((state: Store.State) => {
      if (state instanceof ReportTypeLoadedState) {
        me.onLoaded(state);
        return;
      }
      if (state instanceof ViewTypeLoadedState) {
        me.onLoaded(state);
        return;
      }
      if (state instanceof WidgetInfoLoadedState) {
        me.onLoaded(state);
        return;
      }
    });
  }

  private onLoaded(state: Store.State) {
    const me = this;

    if (state instanceof ReportTypeLoadedState) {
      me.reportTypeOptions = state.data;
    }
    if (state instanceof ViewTypeLoadedState) {
      me.viewTypeOptions = state.data;
    }
    if (state instanceof WidgetInfoLoadedState) {
      me.widgetinfoOptions = state.data;
    }
    me.error = true;
    me.loading = true;
  }

  // Form Modal open
  open() {
    const me = this;
    me.isVisible = true;
  }

  // Form Modal Close
  showBasicDialog2() {
    this.displayBasic2 = true;
  }

}
