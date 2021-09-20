import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { SelectItem } from 'primeng';
import {
  WidgetTypeLoadedState,
  GraphTypeLoadedState,
  ChartTypeLoadedState,
  DataFieldLoadedState,
  TableTypeLoadedState,
  FormulaTypeLoadedState,
  SelectFieldLoadedState,
  LegendPositionLoadedState,
  SeverityOperatorLoadedState,
  HealthSeverityOptionsLoadedState,
  HealthSeverityOperatorLoadedState,
  WidgetDrillDownOptionLoadedState,
  CampareTrendsOptionsLoadedState,
  FontFamilyLoadedState,
  FontSizeLoadedState,
  EnablePanelSelectedValueLoadedState,
  EPSelectedValueBasedOnLoadedState,
  EnableGraphSelectedValueLoadedState,
  EnableGraphSelectGraphLoadedState,
  DataSourceLoadedState,
  EnvironmentTypeLoadedState,
  IndexPatternLoadedState,
  QueryTypeLoadedState,
  GridLineWidthValueLoadedState
} from './select-item.state';

@Injectable({
  providedIn: 'root'
})
export class DashboardWidgetTypeService extends Store.AbstractService {
  // Action: Load

  loadDataSource(): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();

    // output.next(new TireLoadingState());

    // /// DEV CODE ----------------->
    const dataSourceType: SelectItem[] = [
      { label: 'Metric', value: 'metric' },
      { label: 'Log', value: 'log' }
    ];

    // EROR STATE
    // setTimeout(() => {
    //     output.next(new SelectItemLoadingErrorState(new Error('Some random error for development.')));
    // }, 2000);

    // SUCCESS STATE
    setTimeout(() => {
      output.next(new DataSourceLoadedState(dataSourceType));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = me.controller.replaceVariables(environment.api.dashboard.load.endpoint, { 'id': id });

    // me.controller.get(path).subscribe((data: Dashboard) => {

    //     output.next(new SelectItemLoadedState(data));
    //     output.complete();

    // }, (e: any) => {

    //     output.error(new SelectItemLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('loading failed', e);
    // });

    return output;
  }

  loadWidgetType(): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();

    // output.next(new SelectItemLoadingState());

    // /// DEV CODE ----------------->
    const widgetTypeData: SelectItem[] = [
      {
        label: 'Graph',
        value: 'graph',
      },
      {
        label: 'Data',
        value: 'data',
      },
      {
        label: 'Tabular',
        value: 'tabular',
      },
      {
        label: 'System Health',
        value: 'system_health',
      },
      {
        label: 'Label',
        value: 'label',
      },
    ];

    // EROR STATE
    // setTimeout(() => {
    //     output.next(new SelectItemLoadingErrorState(new Error('Some random error for development.')));
    // }, 2000);

    // SUCCESS STATE
    setTimeout(() => {
      output.next(new WidgetTypeLoadedState(widgetTypeData));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = me.controller.replaceVariables(environment.api.dashboard.load.endpoint, { 'id': id });

    // me.controller.get(path).subscribe((data: Dashboard) => {

    //     output.next(new SelectItemLoadedState(data));
    //     output.complete();

    // }, (e: any) => {

    //     output.error(new SelectItemLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('loading failed', e);
    // });

    return output;
  }

  loadGraphType(): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();

    // output.next(new TireLoadingState());

    // /// DEV CODE ----------------->
    const graphTypeData: SelectItem[] = [
      {
        label: 'Normal Graph',
        value: 'normal_graph',
      },
      {
        label: 'Percentile Graph',
        value: 'percentile_graph',
      },
      {
        label: 'Slab Count Graph',
        value: 'slab_count_graph',
      },
      {
        label: 'Category Graph',
        value: 'category_graph',
      },
      {
        label: 'Correlated Graph',
        value: 'correlated _graph',
      },
    ];

    // EROR STATE
    // setTimeout(() => {
    //     output.next(new SelectItemLoadingErrorState(new Error('Some random error for development.')));
    // }, 2000);

    // SUCCESS STATE
    setTimeout(() => {
      output.next(new GraphTypeLoadedState(graphTypeData));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = me.controller.replaceVariables(environment.api.dashboard.load.endpoint, { 'id': id });

    // me.controller.get(path).subscribe((data: Dashboard) => {

    //     output.next(new SelectItemLoadedState(data));
    //     output.complete();

    // }, (e: any) => {

    //     output.error(new SelectItemLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('loading failed', e);
    // });

    return output;
  }

  loadChartType(): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();

    // output.next(new TireLoadingState());

    // /// DEV CODE ----------------->
    const chartTypeData: SelectItem[] = [
      {
        label: 'Line',
        value: 'line',
      },
      {
        label: 'Bar',
        value: 'bar',
      },
      {
        label: 'Pie',
        value: 'pie',
      },
      {
        label: 'Area',
        value: 'area',
      },
      {
        label: 'Stacked Area',
        value: 'stacked_area',
      },
      {
        label: 'Stacked Bar',
        value: 'stacked_bar',
      },
      {
        label: 'Dial',
        value: 'dial',
      },
      {
        label: 'Meter',
        value: 'meter',
      },
      {
        label: 'Donut',
        value: 'donut',
      },
      {
        label: 'Dual Axis Line',
        value: 'dual_axis_line',
      },
      {
        label: 'Dual Axis Bar Line',
        value: 'dual_axis_bar_line',
      },
      {
        label: 'Dual Axis Area Line',
        value: 'dual_axis_area_line',
      },
      {
        label: 'Dual Axis Stacked Bar',
        value: 'dual_axis_stacked_bar',
      },
      {
        label: 'Line Stacked Bar',
        value: 'line_stacked_bar',
      },
      {
        label: 'Geo Map',
        value: 'geo_map',
      },
      {
        label: 'Geo Map Extended',
        value: 'geo_map_extended',
      }
    ];

    // EROR STATE
    // setTimeout(() => {
    //     output.next(new SelectItemLoadingErrorState(new Error('Some random error for development.')));
    // }, 2000);

    // SUCCESS STATE
    setTimeout(() => {
      output.next(new ChartTypeLoadedState(chartTypeData));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = me.controller.replaceVariables(environment.api.dashboard.load.endpoint, { 'id': id });

    // me.controller.get(path).subscribe((data: Dashboard) => {

    //     output.next(new SelectItemLoadedState(data));
    //     output.complete();

    // }, (e: any) => {

    //     output.error(new SelectItemLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('loading failed', e);
    // });

    return output;
  }

  loadDataFieldType(): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();

    // output.next(new TireLoadingState());

    // /// DEV CODE ----------------->
    const dataFieldOptions: SelectItem[] = [
      { label: 'Minimum', value: 'minimum' },
      { label: 'Maximum', value: 'maximun' },
      { label: 'Average', value: 'avarage' },
      { label: 'Standard Deviation', value: 'standard_deviation' },
      { label: 'Last Sample', value: 'last_sample' },
      { label: 'Sample Count', value: 'sample_count' },
      { label: 'Vector Count', value: 'vector_count' }
    ];

    // EROR STATE
    // setTimeout(() => {
    //     output.next(new SelectItemLoadingErrorState(new Error('Some random error for development.')));
    // }, 2000);

    // SUCCESS STATE
    setTimeout(() => {
      output.next(new DataFieldLoadedState(dataFieldOptions));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = me.controller.replaceVariables(environment.api.dashboard.load.endpoint, { 'id': id });

    // me.controller.get(path).subscribe((data: Dashboard) => {

    //     output.next(new SelectItemLoadedState(data));
    //     output.complete();

    // }, (e: any) => {

    //     output.error(new SelectItemLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('loading failed', e);
    // });

    return output;
  }

  loadTableType(): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();

    // output.next(new TireLoadingState());

    // /// DEV CODE ----------------->
    const tableTypeData: SelectItem[] = [
      { label: 'Graph Stats Based', value: 'graph_stats_based' },
      { label: 'Vector Based', value: 'vector_based' },
    ];

    // EROR STATE
    // setTimeout(() => {
    //     output.next(new SelectItemLoadingErrorState(new Error('Some random error for development.')));
    // }, 2000);

    // SUCCESS STATE
    setTimeout(() => {
      output.next(new TableTypeLoadedState(tableTypeData));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = me.controller.replaceVariables(environment.api.dashboard.load.endpoint, { 'id': id });

    // me.controller.get(path).subscribe((data: Dashboard) => {

    //     output.next(new SelectItemLoadedState(data));
    //     output.complete();

    // }, (e: any) => {

    //     output.error(new SelectItemLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('loading failed', e);
    // });

    return output;
  }

  loadFormulaType(): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();

    // output.next(new TireLoadingState());

    // /// DEV CODE ----------------->
    const formulaTypeData: SelectItem[] = [
      { label: 'Min', value: 'Min' },
      { label: 'Max', value: 'Max' },
      { label: 'Avg', value: 'Avg' },
      { label: 'Count', value: 'Count' },
      { label: 'Sum Count', value: 'Sum Count' },
    ];

    // EROR STATE
    // setTimeout(() => {
    //     output.next(new SelectItemLoadingErrorState(new Error('Some random error for development.')));
    // }, 2000);

    // SUCCESS STATE
    setTimeout(() => {
      output.next(new FormulaTypeLoadedState(formulaTypeData));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = me.controller.replaceVariables(environment.api.dashboard.load.endpoint, { 'id': id });

    // me.controller.get(path).subscribe((data: Dashboard) => {

    //     output.next(new SelectItemLoadedState(data));
    //     output.complete();

    // }, (e: any) => {

    //     output.error(new SelectItemLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('loading failed', e);
    // });

    return output;
  }

  loadSelectField(): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();

    // output.next(new TireLoadingState());

    // /// DEV CODE ----------------->
    const selectFieldData: SelectItem[] = [
      { label: 'Minimum', value: 'minimum' },
      { label: 'Maximum', value: 'maximum' },
      { label: 'Average', value: 'average' },
      { label: 'Standard Deviation', value: 'standard_deviation' },
      { label: 'Last Sample', value: 'last_sample' },
      { label: 'Sample Count', value: 'sample_count' }
    ];

    // EROR STATE
    // setTimeout(() => {
    //     output.next(new SelectItemLoadingErrorState(new Error('Some random error for development.')));
    // }, 2000);

    // SUCCESS STATE
    setTimeout(() => {
      output.next(new SelectFieldLoadedState(selectFieldData));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = me.controller.replaceVariables(environment.api.dashboard.load.endpoint, { 'id': id });

    // me.controller.get(path).subscribe((data: Dashboard) => {

    //     output.next(new SelectItemLoadedState(data));
    //     output.complete();

    // }, (e: any) => {

    //     output.error(new SelectItemLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('loading failed', e);
    // });

    return output;
  }

  loadEnvironmentType(): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();

    // output.next(new TireLoadingState());

    // /// DEV CODE ----------------->
    const environmentTypeData: SelectItem[] = [

    ];

    // EROR STATE
    // setTimeout(() => {
    //     output.next(new SelectItemLoadingErrorState(new Error('Some random error for development.')));
    // }, 2000);

    // SUCCESS STATE
    setTimeout(() => {
      output.next(new EnvironmentTypeLoadedState(environmentTypeData));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = me.controller.replaceVariables(environment.api.dashboard.load.endpoint, { 'id': id });

    // me.controller.get(path).subscribe((data: Dashboard) => {

    //     output.next(new SelectItemLoadedState(data));
    //     output.complete();

    // }, (e: any) => {

    //     output.error(new SelectItemLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('loading failed', e);
    // });

    return output;
  }

  loadIndexPattern(): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();

    // output.next(new TireLoadingState());

    // /// DEV CODE ----------------->
    const indexPatternData: SelectItem[] = [

    ];

    // EROR STATE
    // setTimeout(() => {
    //     output.next(new SelectItemLoadingErrorState(new Error('Some random error for development.')));
    // }, 2000);

    // SUCCESS STATE
    setTimeout(() => {
      output.next(new IndexPatternLoadedState(indexPatternData));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = me.controller.replaceVariables(environment.api.dashboard.load.endpoint, { 'id': id });

    // me.controller.get(path).subscribe((data: Dashboard) => {

    //     output.next(new SelectItemLoadedState(data));
    //     output.complete();

    // }, (e: any) => {

    //     output.error(new SelectItemLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('loading failed', e);
    // });

    return output;
  }

  loadQueryType(): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();

    // output.next(new TireLoadingState());

    // /// DEV CODE ----------------->
    const queryTypeData: SelectItem[] = [
      { label: 'Custom Query', value: 'custom_query' },
      { label: 'Saved Query', value: 'saved_query' }
    ];

    // EROR STATE
    // setTimeout(() => {
    //     output.next(new SelectItemLoadingErrorState(new Error('Some random error for development.')));
    // }, 2000);

    // SUCCESS STATE
    setTimeout(() => {
      output.next(new QueryTypeLoadedState(queryTypeData));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = me.controller.replaceVariables(environment.api.dashboard.load.endpoint, { 'id': id });

    // me.controller.get(path).subscribe((data: Dashboard) => {

    //     output.next(new SelectItemLoadedState(data));
    //     output.complete();

    // }, (e: any) => {

    //     output.error(new SelectItemLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('loading failed', e);
    // });

    return output;
  }

  loadLegendPositionOptions(): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();

    // output.next(new TireLoadingState());

    // /// DEV CODE ----------------->
    const legendPositionData: SelectItem[] = [
      { label: 'Bottom', value: 'bottom' },
      { label: 'Left', value: 'left' },
      { label: 'Right', value: 'right' },
    ];

    // EROR STATE
    // setTimeout(() => {
    //     output.next(new SelectItemLoadingErrorState(new Error('Some random error for development.')));
    // }, 2000);

    // SUCCESS STATE
    setTimeout(() => {
      output.next(new LegendPositionLoadedState(legendPositionData));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = me.controller.replaceVariables(environment.api.dashboard.load.endpoint, { 'id': id });

    // me.controller.get(path).subscribe((data: Dashboard) => {

    //     output.next(new SelectItemLoadedState(data));
    //     output.complete();

    // }, (e: any) => {

    //     output.error(new SelectItemLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('loading failed', e);
    // });

    return output;
  }

  loadSeverityOptions(): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();

    // output.next(new TireLoadingState());

    // /// DEV CODE ----------------->
    const severityOperators: SelectItem[] = [
      { label: '<', value: '<' },
      { label: '>', value: '>' },
      { label: '<=', value: '<=' },
      { label: '=>', value: '=>' }
    ];

    // EROR STATE
    // setTimeout(() => {
    //     output.next(new SelectItemLoadingErrorState(new Error('Some random error for development.')));
    // }, 2000);

    // SUCCESS STATE
    setTimeout(() => {
      output.next(new SeverityOperatorLoadedState(severityOperators));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = me.controller.replaceVariables(environment.api.dashboard.load.endpoint, { 'id': id });

    // me.controller.get(path).subscribe((data: Dashboard) => {

    //     output.next(new SelectItemLoadedState(data));
    //     output.complete();

    // }, (e: any) => {

    //     output.error(new SelectItemLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('loading failed', e);
    // });

    return output;
  }

  loadHelathSeverityOptions(): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();

    // output.next(new TireLoadingState());

    // /// DEV CODE ----------------->
    const healthSeverityOptions: SelectItem[] = [
      { label: 'Select Operator', value: 'select_operator' },
      { label: 'Critical', value: 'critical' },
      { label: 'Major', value: 'major' }
    ];

    // EROR STATE
    // setTimeout(() => {
    //     output.next(new SelectItemLoadingErrorState(new Error('Some random error for development.')));
    // }, 2000);

    // SUCCESS STATE
    setTimeout(() => {
      output.next(new HealthSeverityOptionsLoadedState(healthSeverityOptions));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = me.controller.replaceVariables(environment.api.dashboard.load.endpoint, { 'id': id });

    // me.controller.get(path).subscribe((data: Dashboard) => {

    //     output.next(new SelectItemLoadedState(data));
    //     output.complete();

    // }, (e: any) => {

    //     output.error(new SelectItemLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('loading failed', e);
    // });

    return output;
  }

  loadHelathSeverityOpertaors(): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();

    // output.next(new TireLoadingState());

    // /// DEV CODE ----------------->
    const healthSeverityOptions: SelectItem[] = [
      { label: 'AND', value: '&&' },
      { label: 'OR', value: '||' }
    ];

    // EROR STATE
    // setTimeout(() => {
    //     output.next(new SelectItemLoadingErrorState(new Error('Some random error for development.')));
    // }, 2000);

    // SUCCESS STATE
    setTimeout(() => {
      output.next(new HealthSeverityOperatorLoadedState(healthSeverityOptions));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = me.controller.replaceVariables(environment.api.dashboard.load.endpoint, { 'id': id });

    // me.controller.get(path).subscribe((data: Dashboard) => {

    //     output.next(new SelectItemLoadedState(data));
    //     output.complete();

    // }, (e: any) => {

    //     output.error(new SelectItemLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('loading failed', e);
    // });

    return output;
  }

  loadWidgetDrillDownOption(): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();

    // output.next(new TireLoadingState());

    // /// DEV CODE ----------------->
    const widgetDrillDownOption: SelectItem[] = [
      { label: 'test', value: 'test' }
    ];

    // EROR STATE
    // setTimeout(() => {
    //     output.next(new SelectItemLoadingErrorState(new Error('Some random error for development.')));
    // }, 2000);

    // SUCCESS STATE
    setTimeout(() => {
      output.next(new WidgetDrillDownOptionLoadedState(widgetDrillDownOption));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = me.controller.replaceVariables(environment.api.dashboard.load.endpoint, { 'id': id });

    // me.controller.get(path).subscribe((data: Dashboard) => {

    //     output.next(new SelectItemLoadedState(data));
    //     output.complete();

    // }, (e: any) => {

    //     output.error(new SelectItemLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('loading failed', e);
    // });

    return output;
  }

  loadCompareTrendsOptions(): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();

    // output.next(new TireLoadingState());

    // /// DEV CODE ----------------->
    const compareTrendsOptions: SelectItem[] = [
      { label: 'Daily Trends', value: 'daily_trends' },
      { label: 'Weekly Trends', value: 'weekly_trends' },
      { label: 'Fix Trends', value: 'fix_trends' }
    ];

    // EROR STATE
    // setTimeout(() => {
    //     output.next(new SelectItemLoadingErrorState(new Error('Some random error for development.')));
    // }, 2000);

    // SUCCESS STATE
    setTimeout(() => {
      output.next(new CampareTrendsOptionsLoadedState(compareTrendsOptions));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = me.controller.replaceVariables(environment.api.dashboard.load.endpoint, { 'id': id });

    // me.controller.get(path).subscribe((data: Dashboard) => {

    //     output.next(new SelectItemLoadedState(data));
    //     output.complete();

    // }, (e: any) => {

    //     output.error(new SelectItemLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('loading failed', e);
    // });

    return output;
  }

  loadFontFamily(): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();

    // output.next(new TireLoadingState());

    // /// DEV CODE ----------------->
    const fontFamilyData: SelectItem[] = [
      { label: 'Arial', value: 'Arial' },
      { label: 'Calibri', value: 'Calibri' },
      { label: 'Cambria', value: 'Cambria' },
      { label: 'Courier', value: 'Courier' },
      { label: 'Courier-BoldOblique', value: 'Courier-BoldOblique' },
      { label: 'Helvetica', value: 'Helvetica' },
      { label: 'Helvetica-BoldOblique', value: 'Helvetica-BoldOblique' },
      { label: "'Montserrat', sans-serif", value: "'Montserrat', sans-serif" },
      { label: "'Noto Sans', sans-serif", value: "'Noto Sans', sans-serif" },
      { label: "'Poppins', sans-serif", value: "'Poppins', sans-serif" },
      { label: 'Roboto', value: 'Roboto' },
      { label: 'Times-Roman', value: 'Times-Roman' }

    ];

    // EROR STATE
    // setTimeout(() => {
    //     output.next(new SelectItemLoadingErrorState(new Error('Some random error for development.')));
    // }, 2000);

    // SUCCESS STATE
    setTimeout(() => {
      output.next(new FontFamilyLoadedState(fontFamilyData));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = me.controller.replaceVariables(environment.api.dashboard.load.endpoint, { 'id': id });

    // me.controller.get(path).subscribe((data: Dashboard) => {

    //     output.next(new SelectItemLoadedState(data));
    //     output.complete();

    // }, (e: any) => {

    //     output.error(new SelectItemLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('loading failed', e);
    // });

    return output;
  }

  loadFontSize(): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();

    // output.next(new TireLoadingState());

    // /// DEV CODE ----------------->
    const fontSizeData: SelectItem[] = [
      { label: '8', value: '8' },
      { label: '10', value: '10' },
      { label: '12', value: '12' },
      { label: '14', value: '14' },
      { label: '15', value: '15' },
      { label: '16', value: '16' },
      { label: '18', value: '18' },
      { label: '20', value: '20' },
      { label: '22', value: '22' },
      { label: '24', value: '24' },
      { label: '26', value: '26' },
      { label: '28', value: '28' },
      { label: '30', value: '30' },
      { label: '32', value: '32' },
      { label: '34', value: '34' },
      { label: '36', value: '36' },
      { label: '38', value: '38' },
      { label: '40', value: '40' },
      { label: '42', value: '42' },
      { label: '44', value: '44' },
      { label: '46', value: '46' },
      { label: '48', value: '48' },
      { label: '50', value: '50' }
    ];

    // EROR STATE
    // setTimeout(() => {
    //     output.next(new SelectItemLoadingErrorState(new Error('Some random error for development.')));
    // }, 2000);

    // SUCCESS STATE
    setTimeout(() => {
      output.next(new FontSizeLoadedState(fontSizeData));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = me.controller.replaceVariables(environment.api.dashboard.load.endpoint, { 'id': id });

    // me.controller.get(path).subscribe((data: Dashboard) => {

    //     output.next(new SelectItemLoadedState(data));
    //     output.complete();

    // }, (e: any) => {

    //     output.error(new SelectItemLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('loading failed', e);
    // });

    return output;
  }

  loadEnablePanelSelectedValue(): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();

    // output.next(new TireLoadingState());

    // /// DEV CODE ----------------->
    const epSelectedValueData: SelectItem[] = [
      { label: '=', value: '=' },
      { label: '>=', value: '>=' },
      { label: '<=', value: '<=' },
      { label: 'In-Between', value: 'In-Between' },
      { label: 'Top', value: 'Top' },
      { label: 'Bottom', value: 'Bottom' }
    ];

    // EROR STATE
    // setTimeout(() => {
    //     output.next(new SelectItemLoadingErrorState(new Error('Some random error for development.')));
    // }, 2000);

    // SUCCESS STATE
    setTimeout(() => {
      output.next(new EnablePanelSelectedValueLoadedState(epSelectedValueData));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = me.controller.replaceVariables(environment.api.dashboard.load.endpoint, { 'id': id });

    // me.controller.get(path).subscribe((data: Dashboard) => {

    //     output.next(new SelectItemLoadedState(data));
    //     output.complete();

    // }, (e: any) => {

    //     output.error(new SelectItemLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('loading failed', e);
    // });

    return output;
  }

  loadEPSelectedValueBasedOn(): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();

    // output.next(new TireLoadingState());

    // /// DEV CODE ----------------->
    const epSelectedBaseData: SelectItem[] = [
      { label: 'Avg', value: 'avg' },
      { label: 'Min', value: 'min' },
      { label: 'Max', value: 'max' },
      { label: 'Count', value: 'count' }
    ];

    // EROR STATE
    // setTimeout(() => {
    //     output.next(new SelectItemLoadingErrorState(new Error('Some random error for development.')));
    // }, 2000);

    // SUCCESS STATE
    setTimeout(() => {
      output.next(new EPSelectedValueBasedOnLoadedState(epSelectedBaseData));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = me.controller.replaceVariables(environment.api.dashboard.load.endpoint, { 'id': id });

    // me.controller.get(path).subscribe((data: Dashboard) => {

    //     output.next(new SelectItemLoadedState(data));
    //     output.complete();

    // }, (e: any) => {

    //     output.error(new SelectItemLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('loading failed', e);
    // });

    return output;
  }

  loadEnableGraphSelectedValue(): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();

    // output.next(new TireLoadingState());

    // /// DEV CODE ----------------->
    const enableGraphSelectedData: SelectItem[] = [
      { label: '>=', value: '>=' },
      { label: '<=', value: '<=' },
      { label: 'In-Between', value: 'In-Between' }
    ];

    // EROR STATE
    // setTimeout(() => {
    //     output.next(new SelectItemLoadingErrorState(new Error('Some random error for development.')));
    // }, 2000);

    // SUCCESS STATE
    setTimeout(() => {
      output.next(new EnableGraphSelectedValueLoadedState(enableGraphSelectedData));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = me.controller.replaceVariables(environment.api.dashboard.load.endpoint, { 'id': id });

    // me.controller.get(path).subscribe((data: Dashboard) => {

    //     output.next(new SelectItemLoadedState(data));
    //     output.complete();

    // }, (e: any) => {

    //     output.error(new SelectItemLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('loading failed', e);
    // });

    return output;
  }

  loadEGSelectGraphData(): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();

    // output.next(new TireLoadingState());

    // /// DEV CODE ----------------->
    const enableGraphSelectGraphData: SelectItem[] = [
      { label: 'Requests/Min', value: 'requests_min' }
    ];

    // EROR STATE
    // setTimeout(() => {
    //     output.next(new SelectItemLoadingErrorState(new Error('Some random error for development.')));
    // }, 2000);

    // SUCCESS STATE
    setTimeout(() => {
      output.next(new EnableGraphSelectGraphLoadedState(enableGraphSelectGraphData));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = me.controller.replaceVariables(environment.api.dashboard.load.endpoint, { 'id': id });

    // me.controller.get(path).subscribe((data: Dashboard) => {

    //     output.next(new SelectItemLoadedState(data));
    //     output.complete();

    // }, (e: any) => {

    //     output.error(new SelectItemLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('loading failed', e);
    // });

    return output;
  }

  loadGridLineWidthValue(): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();

    // output.next(new TireLoadingState());

    // /// DEV CODE ----------------->
    const gridLineWidthValueData: SelectItem[] = [
      { label: '0.0', value: 0.0 },
      { label: '0.2', value: 0.2 },
      { label: '0.4', value: 0.4 },
      { label: '0.6', value: 0.6 },
      { label: '0.8', value: 0.8 },
      { label: '1.0', value: 1.0 },
      { label: '1.2', value: 1.2 },
      { label: '1.4', value: 1.4 },
      { label: '1.6', value: 1.6 },
      { label: '1.8', value: 1.8 },
      { label: '2.0', value: 2.0 },
    ];

    // EROR STATE
    // setTimeout(() => {
    //     output.next(new SelectItemLoadingErrorState(new Error('Some random error for development.')));
    // }, 2000);

    // SUCCESS STATE
    setTimeout(() => {
      output.next(new GridLineWidthValueLoadedState(gridLineWidthValueData));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = me.controller.replaceVariables(environment.api.dashboard.load.endpoint, { 'id': id });

    // me.controller.get(path).subscribe((data: Dashboard) => {

    //     output.next(new SelectItemLoadedState(data));
    //     output.complete();

    // }, (e: any) => {

    //     output.error(new SelectItemLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('loading failed', e);
    // });

    return output;
  }
}
