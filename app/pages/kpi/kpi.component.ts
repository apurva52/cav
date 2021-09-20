import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { get } from 'lodash';
import { MessageService, SelectItem } from 'primeng';
import { Subject, Subscription } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { KpiTimeFilterComponent } from 'src/app/shared/kpi-time-filter/kpi-time-filter.component';
import { CurUsdSymDec2Pipe } from 'src/app/shared/pipes/cur-usd-sym-dec-2/cur-usd-sym-dec-2.pipe';
import { CurUsdSymPipe } from 'src/app/shared/pipes/cur-usd-sym/cur-usd-sym.pipe';
import { Dec1Pipe } from 'src/app/shared/pipes/dec-1/dec-1.pipe';
import { Dec2Pipe } from 'src/app/shared/pipes/dec-2/dec-2.pipe';
import { Dec3Pipe } from 'src/app/shared/pipes/dec-3/dec-3.pipe';
import { Lt0Pipe } from 'src/app/shared/pipes/lt-0/lt-0.pipe';
import { Lt1Pipe } from 'src/app/shared/pipes/lt-1/lt-1.pipe';
import { Lt00Pipe } from 'src/app/shared/pipes/lt_0_0/lt-0-0.pipe';
import { NanPipe } from 'src/app/shared/pipes/nan/nan.pipe';
import { NumEnUsDec2Pipe } from 'src/app/shared/pipes/num-en-us-dec-2/num-en-us-dec-2.pipe';
import { NumEnUsPipe } from 'src/app/shared/pipes/num-en-us/num-en-us.pipe';
import { PerSymDec2Pipe } from 'src/app/shared/pipes/per-sym-dec-2/per-sym-dec-2.pipe';
import { PerSymPipe } from 'src/app/shared/pipes/per-sym/per-sym.pipe';
import { SchedulerService } from 'src/app/shared/scheduler/scheduler.service';
import {
  TableHeader,
  TableHeaderColumn,
} from 'src/app/shared/table/table.model';
import { KpiRevenueComponent } from './kpi-revenue/kpi-revenue.component';
import {
  AutoplayConfig,
  KPIDCData,
  KPIPanel,
  KPIPre,
  KPITableDataCol,
  KPITableDataRow,
} from './service/kpi.model';
import { KPIService } from './service/kpi.service';
import {
  KPIDataLoadedState,
  KPIDataLoadingErrorState,
  KPIPreLoadedState,
  KPIPreLoadingErrorState,
  KPIPreLoadingState,
} from './service/kpi.state';
import { FKpiPipe } from 'src/app/shared/pipes/f_kpi/f-kpi.pipe';

@Component({
  selector: 'app-kpi',
  templateUrl: './kpi.component.html',
  styleUrls: ['./kpi.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    MessageService,
    NumEnUsPipe,
    Dec1Pipe,
    NumEnUsDec2Pipe,
    CurUsdSymPipe,
    CurUsdSymDec2Pipe,
    PerSymPipe,
    PerSymDec2Pipe,
    Lt00Pipe,
    Lt0Pipe,
    Lt1Pipe,
    NanPipe,
    Dec2Pipe,
    Dec3Pipe,
    FKpiPipe,
  ],
})
export class KpiComponent implements OnInit, OnDestroy, AfterViewInit {
  // variable declaration
  data: KPIPre;
  dcData: KPIDCData;
  dcEvents: {
    [key: string]: { onError: Subject<void>; onData: Subject<void> };
  };
  tierMap: { [key: string]: string } = {};
  panelOptions: SelectItem[] = [];
  error: boolean;
  loading: boolean;
  collapsed: boolean;

  autoplayConfig: AutoplayConfig;
  autoplayEnabled: boolean;
  autoplayIntervalTimer: any;
  autoplaySeq: number[];
  autoplayInterval: number;
  autoplayCurrentSeqIndex: number;

  selectedPanels: number[] = [];

  @ViewChild(KpiRevenueComponent) revenueComponent: KpiRevenueComponent;

  kpiTimeFilterChangeSubscription: Subscription;

  private timeperiod: string = null;

  constructor(
    private router: Router,
    private kpiService: KPIService,
    private schedulerService: SchedulerService,
    private messageService: MessageService,
    private numEnUsPipe: NumEnUsPipe,
    private dec1Pipe: Dec1Pipe,
    private numEnUsDec2Pipe: NumEnUsDec2Pipe,
    private curUsdSymPipe: CurUsdSymPipe,
    private curUsdSymDec2Pipe: CurUsdSymDec2Pipe,
    private perSymPipe: PerSymPipe,
    private perSymDec2Pipe: PerSymDec2Pipe,
    private lt00Pipe: Lt00Pipe,
    private lt0Pipe: Lt0Pipe,
    private lt1Pipe: Lt1Pipe,
    private nanPipe: NanPipe,
    private dec2Pipe: Dec2Pipe,
    private dec3Pipe: Dec3Pipe,
    private fKpiPipe: FKpiPipe,

    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const me = this;
  }

  ngAfterViewInit(): void {
    const me = this;

    me.route.params.subscribe((params) => {
      if (params && params.tp && me.timeperiod != params.tp) {
        me.loadKPIPre(params.tp);
      }
    });

    KpiTimeFilterComponent.getInstance().subscribe(
      (kpiTimeFilterComponent: KpiTimeFilterComponent) => {
        if (me.kpiTimeFilterChangeSubscription) {
          me.kpiTimeFilterChangeSubscription.unsubscribe();
        }

        me.kpiTimeFilterChangeSubscription = kpiTimeFilterComponent.onChange.subscribe(
          () => {
            setTimeout(() => {
              me.router.navigate([
                'kpi',
                'detailed',
                kpiTimeFilterComponent.getTimePeriod(),
              ]);
            });
          }
        );
      }
    );
  }

  ngOnDestroy(): void {
    const me = this;
    me.disableAutoplay();
    me.autoRefreshEnd();
  }

  private loadKPIPre(timeperiod: string) {
    const me = this;
    me.timeperiod = timeperiod;
    me.kpiService.loadKPIPre(timeperiod).subscribe(
      (state: Store.State) => {
        if (state instanceof KPIPreLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof KPIPreLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: KPIPreLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  autoRefreshStart() {
    const me = this;
    me.schedulerService.subscribe('kpi-data-refresh', () => {
      me.refresh();
    });
    me.refresh();
  }

  autoRefreshEnd() {
    const me = this;
    me.schedulerService.unsubscribe('kpi-data-refresh');
  }

  refresh() {
    const me = this;

    if (me.data) {
      for (const dc of me.data.dcs) {
        me.dcData[dc.name].loading = true;
        me.dcData[dc.name].error = null;

        me.kpiService.loadKPIData(dc, me.timeperiod).subscribe(
          (state: Store.State) => {
            if (state instanceof KPIDataLoadedState) {
              me.dcData[dc.name].data = state.data;
              me.dcData[dc.name].loading = false;
              setTimeout(() => {
                me.dcEvents[dc.name].onData.next();
              });
              return;
            }
          },
          (state: KPIDataLoadingErrorState) => {
            me.dcData[dc.name].data = null;
            me.dcData[dc.name].loading = false;
            me.dcData[dc.name].error = state.error;
            setTimeout(() => {
              me.dcEvents[dc.name].onError.next();
            });

            const errorMessage = 'Error occurred while loading data for "{DC}".'.replace(
              /\{DC\}/,
              dc.name
            );
            const errorDetail =
              me.dcData[dc.name].error.code && me.dcData[dc.name].error.msg
                ? '[Code: ' +
                me.dcData[dc.name].error.code +
                '] ' +
                me.dcData[dc.name].error.msg
                : null;
            me.messageService.add({
              severity: 'error',
              summary: errorMessage,
              detail: errorDetail,
            });
          }
        );
      }
    }
  }

  private onLoading(state: KPIPreLoadingState) {
    const me = this;
    me.data = null;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: KPIPreLoadingState) {
    const me = this;
    me.data = null;
    me.error = true;
    me.loading = false;
  }

  private selectedZoneForPanel(panel: KPIPanel): string[] {
    if (!panel.selectedZones) {
      return [];
    }
    return Object.keys(panel.selectedZones).filter(
      (key) => panel.selectedZones[key]
    );
  }

  private modifyPanelTable(panel: KPIPanel) {
    const me = this;
    const selectedZones: string[] = this.selectedZoneForPanel(panel);

    const panelHeaders: TableHeader[] = JSON.parse(
      JSON.stringify(panel.originalHeaders)
    );
    const firstHeader: TableHeader = panelHeaders[0];
    const middleHeader: TableHeader = panelHeaders[1];
    const lastHeader: TableHeader = panelHeaders[panelHeaders.length - 1];

    // Ignore whole process if there are no zones for panel
    if (selectedZones.length) {
      // Cache the existing cols for duplication zone wise
      let lastColIndex = 0;
      const firstRowToLastRowColsToDuplicate: {
        [key: string]: TableHeaderColumn[];
      } = {};
      for (const iFirstHeaderCol in firstHeader.cols) {
        if (iFirstHeaderCol === '0') {
          continue;
        }
        const columnHeader: TableHeaderColumn =
          firstHeader.cols[iFirstHeaderCol];
        const start = lastColIndex;
        let end = lastColIndex + (columnHeader.colspan || 1);

        if (iFirstHeaderCol === '1') {
          end -= 1;
        }

        firstRowToLastRowColsToDuplicate[
          iFirstHeaderCol
        ] = lastHeader.cols.slice(start, end);

        lastColIndex += columnHeader.colspan;
      }

      // Change Colsan and add extra cols required
      const newLastHeaderCols: TableHeaderColumn[] = [];
      for (const iFirstHeaderCol in firstHeader.cols) {
        if (iFirstHeaderCol === '0') {
          continue;
        }
        const columnHeader: TableHeaderColumn =
          firstHeader.cols[iFirstHeaderCol];

        const orignalColspan: number = columnHeader.colspan;

        for (const iZone in selectedZones) {
          if (selectedZones[iZone]) {
            const currentZone: string = selectedZones[iZone];

            // Last header modification
            if (firstRowToLastRowColsToDuplicate[iFirstHeaderCol]) {
              const duplicateCols: TableHeaderColumn[] = JSON.parse(
                JSON.stringify(
                  firstRowToLastRowColsToDuplicate[iFirstHeaderCol]
                )
              );
              newLastHeaderCols.push(...duplicateCols);
            }

            // Replace Zone in Value {field}
            for (const c of newLastHeaderCols) {
              c.valueField = c.valueField.replace(/\{ZONE\}/g, currentZone);
              c.tooltipField = c.tooltipField.replace(/\{ZONE\}/g, currentZone);
            }

            // Middle header modification
            const zoneColumn: TableHeaderColumn = {
              label: currentZone,
              colspan: firstRowToLastRowColsToDuplicate[iFirstHeaderCol].length,
            };
            const insertionIndex: number =
              iFirstHeaderCol === '1'
                ? middleHeader.cols.length - 1
                : middleHeader.cols.length;
            middleHeader.cols.splice(insertionIndex, 0, zoneColumn);

            // Top header Mmodification
            if (Number(iZone) > 0) {
              columnHeader.colspan += zoneColumn.colspan;
            }
          }
        }

        // Add extra col at the end at last header
        if (iFirstHeaderCol === '1') {
          const s = orignalColspan - 1;
          const e = s + 1;
          newLastHeaderCols.push(...lastHeader.cols.slice(s, e));
        }
      }

      // Replace new last header
      lastHeader.cols = newLastHeaderCols;
      panel.headers = panelHeaders;
    }

    setTimeout(() => {
      me.patchPanelTableData(panel);
    });
  }

  private patchPanelTableData(panel: KPIPanel) {
    const me = this;

    const lastHeader: TableHeader = panel.headers[panel.headers.length - 1];

    // Modify Data Column
    const panelData: any[] = [];
    for (const tierName of panel.tiers) {
      const t: KPITableDataRow = { tier: tierName, cols: [] };
      let i = 0;
      for (const col of lastHeader.cols) {
        if (
          (panel.headers.length === 2 || panel.headers.length === 1) &&
          i === 0
        ) {
          i++;
          continue;
        }
        t.cols.push(me.getDataCol(col, tierName, panel)); // TODO: Load data from DC
        i++;
      }
      panelData.push(t);
    }

    panel.data = panelData;
  }

  private getDataCol(
    col: TableHeaderColumn,
    tier: string,
    panel: KPIPanel
  ): KPITableDataCol {
    const me = this;
    const c: KPITableDataCol = {
      value: null,
      tooltip: null,
      format: null,
      classes: null,
    };
    const dc: string = me.tierMap[tier];
    if (dc && me.dcData[dc] && !me.dcData[dc].loading) {
      let valueField: string = col.valueField + '';
      valueField = valueField.replace(/\{DC\}/g, dc + '.data');
      valueField = valueField.replace(/\{TIER\}/g, tier);

      let tooltipField: string = col.tooltipField + '';
      tooltipField = tooltipField.replace(/\{DC\}/g, dc + '.data');
      tooltipField = tooltipField.replace(/\{TIER\}/g, tier);

      // Fomat Value
      const format: string = col.format;
      c.value = get(me.dcData, valueField, null);
      c.tooltip = get(me.dcData, tooltipField, null);
      c.classes = col.dataClasses;

      // Mapper to format value
      const pipesMapper = {
        num_en_us: me.numEnUsPipe,
        num_en_us_dec_2: me.numEnUsDec2Pipe,
        cur_usd_sys: me.curUsdSymPipe,
        cur_usd_sys_dec_2: me.curUsdSymDec2Pipe,
        per_sys: me.perSymPipe,
        per_sys_dec_2: me.perSymDec2Pipe,
        lt_1: me.lt1Pipe,
        lt_0: me.lt0Pipe,
        lt_0_0: me.lt00Pipe,
        nan: me.nanPipe,
        dec_1: me.dec1Pipe,
        dec_2: me.dec2Pipe,
        dec_3: me.dec3Pipe,
        f_kpi: me.fKpiPipe,
      };

      if (format) {
        if (pipesMapper[format]) {
          c.value = pipesMapper[format].transform(
            get(me.dcData, valueField, null)
          );
        }
      } else {
        if (c.value === null || c.value < '0') {
          c.value = '-';
        }
      }
    }
    return c;
  }

  renderPanels() {
    const me = this;
    if (me.data) {
      me.panelOptions = [];
      me.selectedPanels = [];
      let index = 0;
      for (const panel of me.data.panels) {
        panel.originalHeaders = JSON.parse(JSON.stringify(panel.headers));
        me.panelOptions.push({ label: panel.label, value: ++index });
        me.selectedPanels.push(index);
        panel.selectedZones = {};

        for (const zone of panel.zones) {
          panel.selectedZones[zone] = true;
        }

        for (const dc of panel.dcs) {
          if (me.dcEvents[dc]) {
            me.dcEvents[dc].onData.subscribe(() => {
              me.patchPanelTableData(panel);
            });
          }
        }

        me.modifyPanelTable(panel);
      }
      me.autoRefreshStart();
    }
  }

  private onLoaded(state: KPIPreLoadedState) {
    const me = this;
    me.data = state.data;

    KpiTimeFilterComponent.getInstance().subscribe((kpiTimeFilterComponent: KpiTimeFilterComponent) => {
      kpiTimeFilterComponent.init();
    });

    if (me.data && me.data.dcs && me.data.panels) {
      me.error = false;
      me.loading = false;
      me.autoplayConfig = me.data.autoplay;
      if (me.autoplayConfig) {
        me.autoplayEnabled = me.autoplayConfig.enabled;
        me.autoplayInterval = me.autoplayConfig.timer.selected;
      }

      me.dcData = {};
      me.dcEvents = {};
      for (const dc of me.data.dcs) {
        me.dcData[dc.name] = {
          data: {},
          loading: false,
          error: null,
        };
        me.dcEvents[dc.name] = {
          onData: new Subject(),
          onError: new Subject(),
        };
        for (const tr of dc.tiers) {
          me.tierMap[tr.name] = tr.dc;
        }
      }

      me.renderPanels();
      if (me.revenueComponent) {
        me.revenueComponent.render(me.data);
      }
      if (me.autoplayEnabled) {
        me.enableAutoplay();
      }
    } else {
      me.error = true;
      me.loading = false;
    }
  }

  private generateAutoplaySequence(): number[] {
    const me = this;
    const seq: number[] = [];
    if (me.autoplayConfig && me.selectedPanels && me.selectedPanels.length) {
      const ratio: string = me.autoplayConfig.ratio;
      const panelLength: number = me.selectedPanels.length;
      const splitRatio: string[] = ratio.split(':');
      const ratio1: number = Number(splitRatio[0]);
      const ratio2: number = Number(splitRatio[1]);

      let seqCounter = 0;
      for (let i = 1; i <= panelLength; i++) {
        if (seqCounter === 0) {
          seq.push(0);
          i--;
        } else {
          seq.push(me.selectedPanels[i - 1]);
        }
        seqCounter++;
        if (seqCounter > ratio2) {
          seqCounter = 0;
        }
      }
    }
    return seq;
  }

  private scrollToPanel(index: number) {
    const me = this;
    const el: HTMLInputElement = document.getElementById(
      'panel-' + index
    ) as HTMLInputElement;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  enableAutoplay() {
    const me = this;
    me.scrollToPanel(0);
    me.autoplaySeq = me.generateAutoplaySequence();
    if (!me.autoplaySeq.length) {
      return;
    }
    if (me.autoplayIntervalTimer) {
      clearInterval(me.autoplayIntervalTimer);
    }

    me.autoplayCurrentSeqIndex = 0;
    me.autoplayIntervalTimer = window.setInterval(() => {
      me.scrollToPanel(me.autoplaySeq[me.autoplayCurrentSeqIndex]);
      me.autoplayCurrentSeqIndex++;
      if (me.autoplayCurrentSeqIndex >= me.autoplaySeq.length) {
        me.autoplayCurrentSeqIndex = 0;
      }
    }, me.autoplayInterval);
  }

  disableAutoplay() {
    const me = this;
    clearInterval(me.autoplayIntervalTimer);
  }

  toggleAutoplay() {
    const me = this;
    if (me.autoplayEnabled) {
      me.enableAutoplay();
    } else {
      me.disableAutoplay();
    }
  }

  selectedPanelChange() {
    const me = this;
    if (me.autoplayEnabled) {
      me.disableAutoplay();
      me.enableAutoplay();
    }
  }

  autoplayTimerChanged() {
    const me = this;
    if (me.autoplayEnabled) {
      me.disableAutoplay();
      me.enableAutoplay();
    }
  }

  zoneChange(panel: KPIPanel) {
    const me = this;
    me.modifyPanelTable(panel);
  }

  isZoneCheckboxDisable(panel: KPIPanel, zone: string): boolean {
    const selectedZones: string[] = this.selectedZoneForPanel(panel);
    if (selectedZones.length === 1 && panel.selectedZones[zone]) {
      return true;
    }
    return false;
  }
}
