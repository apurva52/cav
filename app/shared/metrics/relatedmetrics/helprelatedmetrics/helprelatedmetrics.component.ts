import { Component, Input, OnInit } from '@angular/core';
import { AppError } from 'src/app/core/error/error.model';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';
import { HELP_RELATED_METRICS_DATA } from './service/helprelatedmetrics.dummy';
import { HelpRelatedMetricsTableHeaderCols } from './service/helprelatedmetrics.model';

@Component({
  selector: 'app-helprelatedmetrics',
  templateUrl: './helprelatedmetrics.component.html',
  styleUrls: ['./helprelatedmetrics.component.scss']
})
export class HelpRelatedmetricsComponent extends PageDialogComponent
implements OnInit {

  data;
  error: AppError;
  empty: boolean;
  loading: boolean;
  emptyTable: boolean;


  _selectedColumns: HelpRelatedMetricsTableHeaderCols[];
  cols: any[];


  constructor() {
    super();
   }

  ngOnInit(): void {
    const me = this;
    me.data = HELP_RELATED_METRICS_DATA;

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

  open() {
    super.show();
  }

  closeDialog() {
    this.visible = false;
  }
}
