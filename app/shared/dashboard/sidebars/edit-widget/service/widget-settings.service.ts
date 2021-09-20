import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ChartType } from '../../../widget/constants/chart-type.enum';
import { GraphType, GraphTypeValue } from '../../../widget/constants/graph-type.enum';

@Injectable({
  providedIn: 'root'
})
export class WidgetSettingService {
 widget:any;
 getWidget(){
   return this.widget;
 }
 setWidget(widget:any){
   this.widget=widget;
 }

  deleteOtherTypeWidget(currentWidgetType) {
    let type;
    switch (currentWidgetType) {
      case 'GRAPH': type = 'graph'
        break;
      case 'DATA': type = 'data'
        break;
      case 'TABULAR': type = 'table'
        break;
      case 'SYSTEM_HEALTH': type = 'systemHealth'
        break;
      case 'LABEL': type = 'text'
        break;
    }
    return type;
  }

  giveSelectedTypeWidget(currentWidgetType) {
    let type;
    switch (currentWidgetType) {
      case 'GRAPH': type = 'graph'
        break;
      case 'DATA': type = 'data'
        break;
      case 'TABULAR': type = 'tabular'
        break;
      case 'SYSTEM_HEALTH': type = 'system_health'
        break;
      case 'LABEL': type = 'label'
        break;
    }
    return type;
  }


  getChartIdBasedOnChartType(selectedGraphType, selectedChartType) {
    try {

      const me = this;
      let chartId = -1;
      if (selectedGraphType === GraphTypeValue.PERCENTILE_GRAPH) {
        switch (selectedChartType) {

          case 'line': chartId = ChartType.PERCENTILE_GRAPH;
            break;
          case 'area': chartId = ChartType.PERCENTILE_AREA_CHART;
            break;
          case 'stacked_area': chartId = ChartType.PERCENTILE_STACKED_AREA_CHART;
            break;
          case 'stacked_bar': chartId = ChartType.PERCENTILE_STACKED_BAR_CHART;
            break;
          case 'donut': chartId = ChartType.PERCENTILE_DONUT_CHART;
            break;
          case 'dual_axis_line': chartId = ChartType.PERCENTILE_DUAL_AXIS_LINE;
            break;
          case 'dual_axis_bar_line': chartId = ChartType.PERCENTILE_DUAL_LINE_BAR;
            break;
         case 'line_stacked_bar': chartId = ChartType.PERCENTILE_LINE_STACKED_BAR;
            break;
          case 'bar': chartId = ChartType.PERCENTILE_BAR_CHART;
            break;
          case 'pie': chartId = ChartType.PERCENTILE_PIE_CHART;
            break;
          case 'dial': chartId = ChartType.PERCENTILE_DIAL_CHART;
            break;
          case 'meter': chartId = ChartType.PERCENTILE_METER_CHART;
            break;
          case 'dual_axis_area_line': chartId = ChartType.PERCENTILE_DUAL_AXIS_AREA_LINE;
            break;
          case 'dual_axis_stacked_bar': chartId = ChartType.PERCENTILE_DUAL_AXIS_STACKED_BAR;
            break;
          case 'dual_axis_stacked_area': chartId = ChartType.PERCENTILE_DUAL_AXIS_STACKED_AREA;
            break;
          default: chartId = ChartType.PERCENTILE_GRAPH;
        }
        return chartId;
      }
      else if (selectedGraphType === GraphTypeValue.SLAB_COUNT_GRAPH) {

        switch (selectedChartType) {
          case 'line': chartId = ChartType.SLAB_COUNT_LINE_CHART;
            break;
          case 'area': chartId = ChartType.SLAB_COUNT_AREA_CHART;
            break;
          case 'stacked_area': chartId = ChartType.SLAB_COUNT_STACKED_AREA_CHART;
            break;
          case 'stacked_bar': chartId = ChartType.SLAB_COUNT_STACKED_BAR_CHART;
            break;
          case 'donut': chartId = ChartType.SLAB_COUNT_DONUT_CHART;
            break;
          case 'dual_axis_line': chartId = ChartType.SLAB_COUNT_DUAL_AXIS_LINE;
            break;
          case 'dual_axis_bar_line': chartId = ChartType.SLAB_COUNT_DUAL_LINE_BAR;
            break;
          case 'line_stacked_bar': chartId = ChartType.SLAB_COUNT_LINE_STACKED_BAR;
            break;
          case 'bar': chartId = ChartType.SLAB_COUNT_GRAPH;
            break;
          case 'pie': chartId = ChartType.SLAB_COUNT_PIE_CHART;
            break;
          case 'dial': chartId = ChartType.SLAB_COUNT_DIAL_CHART;
            break;
          case 'meter': chartId = ChartType.SLAB_COUNT_METER_CHART;
            break;
          case 'dual_axis_area_line': chartId = ChartType.SLAB_COUNT_DUAL_AXIS_AREA_LINE;
            break;
          case 'dual_axis_line_stacked_bar': chartId = ChartType.SLAB_COUNT_DUAL_AXIS_STACKED_BAR;
            break;
          case 'dual_axis_stacked_area': chartId = ChartType.SLAB_COUNT_DUAL_AXIS_STACKED_AREA;
            break;
          default: chartId = ChartType.SLAB_COUNT_GRAPH;
        }
        return chartId;
      } else if (selectedGraphType === GraphTypeValue.CATEGORY_GRAPH) {

        switch (selectedChartType) {
          case 'stacked_area': chartId = ChartType.CATEGORY_STACKED_AREA_CHART;
            break;
          case 'stacked_bar': chartId = ChartType.CATEGORY_STACKED_BAR_CHART;
            break;
          default: chartId = ChartType.CATEGORY_STACKED_AREA_CHART;
        }
        return chartId;

      } else if (selectedGraphType === GraphTypeValue.CORRELATED_GRAPH) {

        switch (selectedChartType) {
          case 'line': chartId = ChartType.CORRELATED_MULTI_AXES_CHART_LINE;
            break;
          case 'bar': chartId = ChartType.CORRELATED_MULTI_AXES_CHART_BAR;
            break;
          case 'area': chartId = ChartType.CORRELATED_MULTI_AXES_CHART_AREA;
            break;
          default: chartId = ChartType.CORRELATED_MULTI_AXES_CHART;
        }
        return chartId;
      } else {

        switch (selectedChartType) {
          case 'line': chartId = ChartType.LINE_CHART;
            break;
          case 'area': chartId = ChartType.AREA_CHART;
            break;
          case 'stacked_area': chartId = ChartType.STACKED_AREA_CHART;
            break;
          case 'stacked_bar': chartId = ChartType.STACKED_BAR_CHART;
            break;
          case 'donut': chartId = ChartType.DONUT_CHART_AVG;
            break;
          case 'dual_axis_line': chartId = ChartType.DUAL_AXIS_LINE;
            break;
          case 'dual_axis_bar_line': chartId = ChartType.DUAL_LINE_BAR;
            break;
          case 'line_stacked_bar': chartId = ChartType.LINE_STACKED;
            break;
          case 'dual_axis_area_line': chartId = ChartType.DUAL_AXIS_AREA_LINE;
            break;
          case 'dual_axis_stacked_bar': chartId = ChartType.DUAL_AXIS_STACKED_BAR;
            break;
          case 'dual_axis_stacked_area': chartId = ChartType.DUAL_AXIS_STACKED_AREA;
            break;
          case 'bar': chartId = ChartType.BAR_CHART_AVG_ALL;
            break;
          case 'pie': chartId = ChartType.PIE_CHART_AVG_ALL;
            break;
          case 'dial': chartId = ChartType.DIAL_CHART_AVG;
            break;
          case 'meter': chartId = ChartType.METER_CHART_AVG;
            break;
          case 'geo_map' : chartId = ChartType.GEO_MAP_AVG;
            break;
          default: chartId = ChartType.LINE_CHART;
        }
        return chartId;
      }
    } catch (error) {
      console.error("Error in finding chartId , returning 0")
      return 0;
    }

  }

  getChartTypeBasedOnChartId(selectedChartId) {
    try {
      if (selectedChartId === ChartType.LINE_CHART || selectedChartId === ChartType.PERCENTILE_GRAPH || selectedChartId === ChartType.SLAB_COUNT_LINE_CHART || selectedChartId === ChartType.CORRELATED_MULTI_AXES_CHART_LINE) {
        return 'line';
      } else if (selectedChartId === ChartType.PIE_CHART_AVG_TOP5 || selectedChartId === ChartType.PIE_CHART_AVG_TOP10 ||
        selectedChartId === ChartType.PIE_CHART_LAST_TOP5 || selectedChartId === ChartType.PIE_CHART_LAST_TOP10 ||
        selectedChartId === ChartType.PIE_CHART_LAST_ALL || selectedChartId === ChartType.PIE_CHART_AVG_ALL ||
        selectedChartId === ChartType.PIE_CHART_LAST_BOTTOM10 || selectedChartId === ChartType.PIE_CHART_AVG_BOTTOM10 ||
        selectedChartId === ChartType.PERCENTILE_PIE_CHART || selectedChartId === ChartType.SLAB_COUNT_PIE_CHART) {
        return 'pie';
      } else if (selectedChartId === ChartType.BAR_CHART_AVG_ALL || selectedChartId === ChartType.BAR_CHART_AVG_TOP5 ||
        selectedChartId === ChartType.BAR_CHART_AVG_TOP10 || selectedChartId === ChartType.PERCENTILE_BAR_CHART ||
        selectedChartId === ChartType.BAR_CHART_AVG_BOTTOM10 || selectedChartId === ChartType.SLAB_COUNT_GRAPH || selectedChartId === ChartType.CORRELATED_MULTI_AXES_CHART_BAR) {
        return 'bar';
      } else if (selectedChartId === ChartType.AREA_CHART || selectedChartId === ChartType.PERCENTILE_AREA_CHART ||
        selectedChartId === ChartType.SLAB_COUNT_AREA_CHART || selectedChartId === ChartType.CORRELATED_MULTI_AXES_CHART_AREA) {
        return 'area';
      } else if (selectedChartId === ChartType.STACKED_AREA_CHART || selectedChartId === ChartType.PERCENTILE_STACKED_AREA_CHART ||
        selectedChartId === ChartType.SLAB_COUNT_STACKED_AREA_CHART || selectedChartId === ChartType.CATEGORY_STACKED_AREA_CHART) {
        return 'stacked_area';
      } else if (selectedChartId === ChartType.STACKED_BAR_CHART || selectedChartId === ChartType.PERCENTILE_STACKED_BAR_CHART
        || selectedChartId === ChartType.SLAB_COUNT_STACKED_BAR_CHART || selectedChartId === ChartType.CATEGORY_STACKED_BAR_CHART) {
        return 'stacked_bar';
      } else if (selectedChartId === ChartType.METER_CHART_AVG || selectedChartId === ChartType.METER_CHART_LAST
        || selectedChartId === ChartType.PERCENTILE_METER_CHART || selectedChartId === ChartType.SLAB_COUNT_METER_CHART) {
        return 'meter';
      } else if (selectedChartId === ChartType.DIAL_CHART_AVG || selectedChartId === ChartType.DIAL_CHART_LAST
        || selectedChartId === ChartType.PERCENTILE_DIAL_CHART || selectedChartId === ChartType.SLAB_COUNT_DIAL_CHART) {
        return 'dial';
      } else if (selectedChartId === ChartType.DONUT_CHART_AVG || selectedChartId === ChartType.DONUT_CHART_LAST
        || selectedChartId === ChartType.PERCENTILE_DONUT_CHART || selectedChartId === ChartType.SLAB_COUNT_DONUT_CHART) {
        return 'donut';
      } else if (selectedChartId === ChartType.DUAL_AXIS_LINE || selectedChartId === ChartType.PERCENTILE_DUAL_AXIS_LINE
        || selectedChartId === ChartType.SLAB_COUNT_DUAL_AXIS_LINE) {
        return 'dual_axis_line';
      } else if (selectedChartId === ChartType.DUAL_LINE_BAR || selectedChartId === ChartType.PERCENTILE_DUAL_LINE_BAR
        || selectedChartId === ChartType.SLAB_COUNT_DUAL_LINE_BAR) {
        return 'dual_axis_bar_line';
      } else if (selectedChartId === ChartType.LINE_STACKED || selectedChartId === ChartType.PERCENTILE_LINE_STACKED_BAR
        || selectedChartId === ChartType.SLAB_COUNT_LINE_STACKED_BAR) {
        return 'line_stacked_bar';
      } else if (selectedChartId === ChartType.DUAL_AXIS_AREA_LINE || selectedChartId === ChartType.PERCENTILE_DUAL_AXIS_AREA_LINE
        || selectedChartId === ChartType.SLAB_COUNT_DUAL_AXIS_AREA_LINE) {
        return 'dual_axis_area_line';
      } else if (selectedChartId === ChartType.GEO_MAP_AVG || selectedChartId === ChartType.GEO_MAP_LAST || selectedChartId === ChartType.GEO_MAP_MAX ||
        selectedChartId === ChartType.GEO_MAP_MAX_OF_AVG) {
        return 'geo_map';
      } else if (selectedChartId === ChartType.GEO_MAP_EXTENDED_AVG || selectedChartId === ChartType.GEO_MAP_EXTENDED_LAST ||
        selectedChartId === ChartType.GEO_MAP_EXTENDED_MAX) {
        return 'geo_map_extended';
      } else if (selectedChartId === ChartType.DUAL_AXIS_STACKED_AREA || selectedChartId === ChartType.PERCENTILE_DUAL_AXIS_STACKED_AREA || selectedChartId === ChartType.SLAB_COUNT_DUAL_AXIS_STACKED_AREA) {
        return 'dual_axis_stacked_area';
      } else if (selectedChartId === ChartType.DUAL_AXIS_STACKED_BAR || selectedChartId === ChartType.PERCENTILE_DUAL_AXIS_STACKED_BAR || selectedChartId === ChartType.SLAB_COUNT_DUAL_AXIS_STACKED_BAR) {
        return 'dual_axis_stacked_bar';
      }
    }
    catch (e) {
      console.error(e);
    }
  }

  getGraphTypeBasedOnChartId(selectedChartId) {
    try {
      if (selectedChartId === ChartType.PERCENTILE_GRAPH || selectedChartId === ChartType.PERCENTILE_PIE_CHART ||
        selectedChartId === ChartType.PERCENTILE_BAR_CHART || selectedChartId === ChartType.PERCENTILE_AREA_CHART ||
        selectedChartId === ChartType.PERCENTILE_STACKED_AREA_CHART || selectedChartId === ChartType.PERCENTILE_STACKED_BAR_CHART ||
        selectedChartId === ChartType.PERCENTILE_METER_CHART || selectedChartId === ChartType.PERCENTILE_DIAL_CHART ||
        selectedChartId === ChartType.PERCENTILE_DONUT_CHART || selectedChartId === ChartType.PERCENTILE_DUAL_AXIS_LINE ||
        selectedChartId === ChartType.PERCENTILE_DUAL_LINE_BAR || selectedChartId === ChartType.PERCENTILE_LINE_STACKED_BAR
        || selectedChartId === ChartType.PERCENTILE_DUAL_AXIS_AREA_LINE || selectedChartId === ChartType.PERCENTILE_DUAL_AXIS_STACKED_AREA ||
        selectedChartId === ChartType.PERCENTILE_DUAL_AXIS_STACKED_BAR) {
        return 'percentile_graph';
      } else if (selectedChartId === ChartType.SLAB_COUNT_LINE_CHART || selectedChartId === ChartType.SLAB_COUNT_PIE_CHART ||
        selectedChartId === ChartType.SLAB_COUNT_GRAPH || selectedChartId === ChartType.SLAB_COUNT_AREA_CHART ||
        selectedChartId === ChartType.SLAB_COUNT_STACKED_AREA_CHART || selectedChartId === ChartType.SLAB_COUNT_STACKED_BAR_CHART ||
        selectedChartId === ChartType.SLAB_COUNT_METER_CHART || selectedChartId === ChartType.SLAB_COUNT_DIAL_CHART ||
        selectedChartId === ChartType.SLAB_COUNT_LINE_STACKED_BAR || selectedChartId === ChartType.SLAB_COUNT_DUAL_LINE_BAR ||
        selectedChartId === ChartType.SLAB_COUNT_DUAL_AXIS_LINE || selectedChartId === ChartType.SLAB_COUNT_DONUT_CHART ||
        selectedChartId === ChartType.SLAB_COUNT_DUAL_AXIS_AREA_LINE || selectedChartId === ChartType.SLAB_COUNT_DUAL_AXIS_STACKED_AREA ||
        selectedChartId === ChartType.SLAB_COUNT_DUAL_AXIS_STACKED_BAR) {
        return 'slab_count_graph';
      } else if (selectedChartId === ChartType.CORRELATED_MULTI_AXES_CHART_AREA || selectedChartId === ChartType.CORRELATED_MULTI_AXES_CHART_BAR || selectedChartId === ChartType.CORRELATED_MULTI_AXES_CHART_LINE) {
        return 'correlated_graph';
      } else if (selectedChartId === ChartType.CATEGORY_STACKED_AREA_CHART || selectedChartId === ChartType.CATEGORY_STACKED_BAR_CHART) {
        return 'category_graph';
      } else {
        return 'normal_graph';
      }
    } catch (e) {
      console.error(e);
      return 'normal_graph';
    }
  }

  getGraphStatsType(value) {
    try {
      let graphStatsArray = [];
      if (value === null || value === 'NA' || value === undefined) {
        graphStatsArray.push('average');
      } else {
        let newgraphstatstype = value.split(',');
        for (let i in newgraphstatstype) {
          if (parseInt(newgraphstatstype[i]) === ChartType.GRAPH_STATS_MIN) {
            graphStatsArray.push('minimum');
          } else if (parseInt(newgraphstatstype[i]) === ChartType.GRAPH_STATS_MAX) {
            graphStatsArray.push('maximum');
          } else if (parseInt(newgraphstatstype[i]) === ChartType.GRAPH_STATS_COUNT) {
            graphStatsArray.push('count');
          } else if (parseInt(newgraphstatstype[i]) === ChartType.GRAPH_STATS_SUMCOUNT) {
            graphStatsArray.push('sum_count');
          } else if (parseInt(newgraphstatstype[i]) === ChartType.GRAPH_STATS_LAST) {
            graphStatsArray.push('last');
          }else if (parseInt(newgraphstatstype[i]) === ChartType.GRAPH_STATS_SUM) {
            graphStatsArray.push('sum');
          } else {
            graphStatsArray.push('average');
          }
        }
      }
      return graphStatsArray;
    } catch (e) {
      console.error(e);
    }
  }

  getDataTypeBasedOnDataAttrName(dataType) {
    try {
      let type = '';
      switch (dataType) {
        case 'avg':
          case 'average': type = 'avg';
          break;
        case 'min':
          case 'minimum': type = 'min';
          break;
        case 'max':
          case 'maximum': type = 'max';
          break;
        case 'stdDev':
          case 'standard_deviation' : type = 'stdDev';
          break;
        case 'lastSample': type = 'lastSample';
          break;
        case 'sampleCount':
          case 'count' :  type = 'count';
          break;
        case 'vectorCount':
            case 'vector_count': type = 'vector_count';
            break;
        case 'sum':
          type = 'sum';
          break;
        default: type = 'avg';
      }
      return type;
    } catch (e) {
      console.log(e);
      return '';
    }
  }

  getTableType(tableType) {
    try {
      let type = '';
      switch (tableType) {
        case '0': type = 'graph_stats_based';
          break;
        case '1': type = 'vector_based';
          break;
        default: type = 'graph_stats_based';
      }
      return type;
    }
    catch (e) {
      console.log(e);
      return '';
    }
  }

  getSelectedTableFieldType(colsValue) {
    let selectedFields = [];
    for (let i = 1; i < colsValue.length; i++) {
      if(colsValue[i].displayName !== "Metric Name"){
      selectedFields.push(colsValue[i].field.split("summary.")[1]);
      }
    }
    return selectedFields;
  }

  getCriticalThresholdValues(healthWidgetSeverityDef) {
    let criticalThreshold: number = 0;
    if (healthWidgetSeverityDef != null) {
      if (healthWidgetSeverityDef.criticalValue === -1) {
        criticalThreshold = null;
      } else {
        criticalThreshold = healthWidgetSeverityDef.criticalValue;
      }
    }
    return criticalThreshold;
  }

  getMajorThresholdValues(healthWidgetSeverityDef) {
    let majorThreshold: number = 0;
    if (healthWidgetSeverityDef != null) {
      if (healthWidgetSeverityDef.majorValue === -1) {
        majorThreshold = null;
      } else {
        majorThreshold = healthWidgetSeverityDef.majorValue;
      }
    }
    return majorThreshold;
  }

  getAxisValues(value) {

    if (value == true) {
      return false;
    } else if (value == false) {
      return true;
    }
  }

}
