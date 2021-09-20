import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DEVICE_PREF_CHART } from './service/device-preference.dummy';
import { DevicePrefChart } from './service/device-preference.model';
import { ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng';
import { Session } from '../../common/interfaces/session';
import { Store } from 'src/app/core/store/store';
import { DevicePreferenceService } from './service/device-preference.service';
import {
  DevicePreferenceLoadedState, DevicePreferenceLoadingErrorState, DevicePreferenceLoadingState
} from './service/device-preference.state';
import { AppError } from 'src/app/core/error/error.model';
import { SessionStateService } from '../../session-state.service';

@Component({
  selector: 'app-device-preference',
  templateUrl: './device-preference.component.html',
  styleUrls: ['./device-preference.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DevicePreferenceComponent implements OnInit {

  devicePrefChart: DevicePrefChart;
  selectedSession: Session;
  chartoption: SelectItem[];
  data: any;
  showData: boolean = false;
  error: AppError;
  empty: boolean;
  chartvalue: string;
  loading: boolean;
  constructor(private route: ActivatedRoute, private devicepref: DevicePreferenceService, private stateService: SessionStateService) { }

  ngOnInit(): void {
    const me = this;
    me.chartoption = [
      { label: 'Spline', value: 'spline' },
      { label: 'Bar', value: 'bar' }
    ];
    me.chartvalue = 'spline';

    me.route.queryParams.subscribe(params => {
      // TODO: 
    });

    me.stateService.onSessionChange().subscribe((idx: number) => {
      console.log('device-performance, session change - ', idx);

      me.reload();
    });

    me.reload();
  }


  reload() {
    const me = this;
    me.selectedSession = me.stateService.getSelectedSession();
    me.devicepref.LoadDevicePreferenceData(this.selectedSession).subscribe(
      (state: Store.State) => {

        if (state instanceof DevicePreferenceLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof DevicePreferenceLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: DevicePreferenceLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: DevicePreferenceLoadingState) {
    const me = this;
    me.data = null;
    me.empty = false;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: DevicePreferenceLoadingState) {
    const me = this;
    me.data = null;
    me.empty = false;
    me.error = {};
    me.error['error'] = 'error';
    me.error['msg'] = 'Error while loading data.';
    me.loading = false;
  }

  private onLoaded(state: DevicePreferenceLoadedState) {

    const me = this;
    console.log('DEVICE', state.data.data);
    me.devicePrefChart = DEVICE_PREF_CHART;
    me.data = [];
    me.data = state.data.data;
    me.devicePrefChart.charts.forEach(tr => {
      tr.highchart.series.forEach(rt => {
        rt['data'] = [];
      });
    }
    );
    me.data.forEach(element => {
      element.forEach(el => {
        switch (el.name) {
          case 'CPUFrequency':
            el.data.forEach(el2 => {
              me.devicePrefChart.charts[0].highchart.chart.type = me.chartvalue;
              me.devicePrefChart.charts[0].highchart.series[0]['data'].push(el2[1]);
            });
            break;
          case 'CPUusedPercentage':
            el.data.forEach(el2 => {
              me.devicePrefChart.charts[0].highchart.series[1]['data'].push(el2[1]);
            });
            break;
          case 'RAMavailable':
            el.data.forEach(el2 => {
              me.devicePrefChart.charts[1].highchart.series[0]['data'].push(el2[1]);
            });
            break;
          case 'RAMTotal':
            el.data.forEach(el2 => {
              me.devicePrefChart.charts[1].highchart.series[1]['data'].push(el2[1]);
            });
            break;
          case 'RAMUsed':
            el.data.forEach(el2 => {
              me.devicePrefChart.charts[1].highchart.series[2]['data'].push(el2[1]);
            });
            break;
          case 'ROMavailable':
            el.data.forEach(el2 => {
              me.devicePrefChart.charts[2].highchart.series[0]['data'].push(el2[1]);
            });
            break;
          case 'ROMTotal':
            el.data.forEach(el2 => {
              me.devicePrefChart.charts[2].highchart.series[1]['data'].push(el2[1]);
            });
            break;
          case 'ROMUsed':
            el.data.forEach(el2 => {
              me.devicePrefChart.charts[2].highchart.series[2]['data'].push(el2[1]);
            });
            break;
          case 'WifiSignalStrength':
            el.data.forEach(el2 => {
              me.devicePrefChart.charts[3].highchart.series[0]['data'].push(el2[1]);
            });
            break;
          case 'WifiLinkSpeed':
            el.data.forEach(el2 => {
              me.devicePrefChart.charts[3].highchart.series[1]['data'].push(el2[1]);
            });
            break;
          case 'Battarylevel':
            el.data.forEach(el2 => {
              me.devicePrefChart.charts[4].highchart.series[0]['data'].push(el2[1]);
            });
            break;
          case 'NetworkRecivedbytes':
            el.data.forEach(el2 => {
              me.devicePrefChart.charts[5].highchart.series[0]['data'].push(el2[1]);
            });
            break;
          case 'NetworkTransmitBytes':
            el.data.forEach(el2 => {
              me.devicePrefChart.charts[5].highchart.series[1]['data'].push(el2[1]);
            });
            break;

        }
      });
      this.showData = true;
    });


    console.log(me.devicePrefChart);

  }

  changechartoption(e) {
    console.log(e);
    let me = this;
    me.loading = true;
    me.data = null;
    me.showData = false;
    setTimeout(() => {
      me.data = [];
      me.devicePrefChart.charts.forEach((temp, i) => {
        temp.highchart.chart.type = e.value;
      });
      me.showData = true;
    }, 1000);
    console.log(me.devicePrefChart.charts);
  }

}


