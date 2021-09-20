import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { FilterUtils } from 'primeng/utils';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { CompareMethodTimingComponent } from '../compare-method-timing.component';
import { ServiceMethodTimingData } from './service/service-method-timing.model';
import { ServiceMethodTimingService } from './service/service-method-timing.service';
import {
  ServiceMethodTimingLoadedState,
  ServiceMethodTimingLoadingErrorState,
  ServiceMethodTimingLoadingState,
} from './service/service-method-timing.state';

@Component({
  selector: 'app-service-method-timing',
  templateUrl: './service-method-timing.component.html',
  styleUrls: ['./service-method-timing.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ServiceMethodTimingComponent implements OnInit {
  data: ServiceMethodTimingData;
  error: AppError;
  loading: boolean;
  empty: boolean;
  menu: MenuItem[];

  isShow: boolean;
  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  qtd: any[] = [];

  isCheckbox: boolean;

  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  finalValue: boolean;
  isOn: boolean=true;

  @Output() arrowClick = new EventEmitter<boolean>();

  constructor(private serviceMethodTimingService: ServiceMethodTimingService) {}

  ngOnInit() {
    const me = this;
    me.load();

    me.menu = [
      {
        label: 'Merge Stack Trace',
      },
    ];
  }

  load() {
    const me = this;
    me.serviceMethodTimingService.load().subscribe(
      (state: Store.State) => {
        if (state instanceof ServiceMethodTimingLoadingState) {
          me.onLoading(state);
          return;
        }
        if (state instanceof ServiceMethodTimingLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: ServiceMethodTimingLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: ServiceMethodTimingLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: ServiceMethodTimingLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }

  private onLoaded(state: ServiceMethodTimingLoadedState) {
    const me = this;
    me.data = state.data;
    me.error = null;
    me.loading = false;
    console.log('Data : ', me.data);

    me.cols = me.data.smtData.headers[0].cols;
    for (const c of me.data.smtData.headers[0].cols) {
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
  }

  filter() {
    const me = this;
    FilterUtils['custom'] = (value, filter): boolean => {
      if (filter === undefined || filter === null || filter.trim() === '') {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      } else {
        let operator1 = filter.slice(0, 2);
        let operator2 = filter.slice(0, 1);

        // Filter if value >= ,<=, =
        if (
          operator1.length === 2 &&
          (operator1 === '>=' || operator1 === '<=' || operator1 === '==')
        ) {
          if (operator1 === '>=') {
            me.finalValue =
              value >= parseFloat(filter.slice(2, filter.length)).toFixed(3);
          } else if (operator1 === '<=') {
            me.finalValue =
              value <= parseFloat(filter.slice(2, filter.length)).toFixed(3);
          } else if (operator1 === '==') {
            me.finalValue =
              value == parseFloat(filter.slice(2, filter.length)).toFixed(3);
          }
        } else if (
          operator2.length === 1 &&
          (operator2 === '>' || operator2 === '<' || operator2 === '=')
        ) {
          if (operator2 === '>') {
            me.finalValue =
              value > parseFloat(filter.slice(1, filter.length)).toFixed(3);
          } else if (operator2 === '<') {
            me.finalValue =
              value < parseFloat(filter.slice(1, filter.length)).toFixed(3);
          } else if (operator2 === '=') {
            me.finalValue =
              parseFloat(filter.slice(1, filter.length)).toFixed(3) == value;
          }
        } else if (filter !== '' && filter.indexOf('-') >= 1) {
          const stIndex = filter.substr(0, filter.indexOf('-'));
          const enIndex = filter.substr(filter.indexOf('-') + 1, filter.length);

          if (
            parseFloat(stIndex) <= parseFloat(enIndex) &&
            enIndex.indexOf('-') == -1
          ) {
            if (
              parseFloat(stIndex) <= parseFloat(value) &&
              parseFloat(enIndex) >= parseFloat(value)
            ) {
              me.finalValue = true;
            } else {
              me.finalValue = false;
            }
          } else if (
            parseFloat(stIndex) >= parseFloat(enIndex) &&
            enIndex.indexOf('-') == -1
          ) {
            if (
              parseInt(stIndex, 0) >= parseInt(value, 0) &&
              parseInt(enIndex, 0) <= parseInt(value, 0)
            ) {
              me.finalValue = true;
            } else {
              me.finalValue = false;
            }
          } else {
            me.finalValue = false;
          }
        } else {
          me.finalValue = value >= parseFloat(filter).toFixed(3);
        }
      }
      return me.finalValue;
    };
  }

  @Input() get selectedColumns(): any[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  hotspotSummary($event) {
    this.isOn = $event;
  }

  backToMethodTiming() {
    //alert(this.isOn);
    this.isOn = false;
    this.arrowClick.emit(this.isOn);
    
  }
}
