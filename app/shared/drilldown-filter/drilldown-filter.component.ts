import { ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { TreeNode } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { TransactionsTrendComponent } from 'src/app/pages/drilldown/transactions-trend/transactions-trend.component';
import { PageSidebarComponent } from '../page-sidebar/page-sidebar.component';
import { DrillDownFilterData } from './service/drilldown-filter.model';
import { DrillDownFilterService } from './service/drilldown-filter.service';
import { DrillDownFilterLoadedState, DrillDownFilterLoadingErrorState, DrillDownFilterLoadingState } from './service/drilldown-filter.state';

@Component({
  selector: 'app-drilldown-filter',
  templateUrl: './drilldown-filter.component.html',
  styleUrls: ['./drilldown-filter.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DrilldownFilterComponent extends PageSidebarComponent
  implements OnInit {

  classes = 'page-sidebar';
  data: DrillDownFilterData;
  error: AppError;
  loading: boolean;
  empty: boolean;
  noFilteredData = false;
  inputValue: any;
  drillDownFilterEnableApply: boolean = false;
  bTransaction;
  isOpen = false;

  constructor(
    private drillDownFilterService: DrillDownFilterService
  ) {
    super();
  }

  ngOnInit(): void {
    const me = this;
    me.load();
  }

  load() {
    const me = this;
    me.drillDownFilterService.load().subscribe(
      (state: Store.State) => {

        if (state instanceof DrillDownFilterLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof DrillDownFilterLoadedState) {
          me.onLoaded(state);
          return;
        }

      },
      (state: DrillDownFilterLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: DrillDownFilterLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: DrillDownFilterLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }

  private onLoaded(state: DrillDownFilterLoadedState) {
    const me = this;
    me.data = state.data;
    me.error = null;
    me.loading = false;
  }

  closeClick() {
    const me = this;
    super.hide();
  }

  drillDownFilterApply() { }

  drillDownFilterReset() { }

}
