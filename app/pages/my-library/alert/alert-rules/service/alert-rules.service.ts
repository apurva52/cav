import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { ALERT_RULE_DATA } from './alert-rules.dummy';
import { AlertRule, AlertRuleTable } from './alert-rules.model';
import { ALGO_TYPE, CHANGE, COLOR_ARR, CONDITION_TYPE, DATA_TYPE_ANOMALY, DATA_TYPE_THRESHOLD, ForecastModel, ForecastType, OPERATOR, OPERATOR_ANOMALY, PAYLOAD_TYPE, PCT_TYPE, TIME_WINDOW_UNIT, UseMad, Usetheta, WINDOW_TYPE } from '../alert-configuration/service/alert-config.dummy';
import { SelectItem } from 'primeng/api';
import { Actions, RuleConfig, Severity, Tag } from '../alert-configuration/service/alert-config.model';
@Injectable({
  providedIn: 'root',
})
export class AlertRulesService extends Store.AbstractService {
  data: AlertRuleTable;
  actionsList: Tag[] = [];
  extensionsList: SelectItem[] = [];
  //this will holds the dialog display is visible or not, this dialog holds progressbar in it
  displayDialog: boolean;
  //this will holds dialog message when progressbar is running
  dialogMessage: string;
  //this will holds the progressValue to display progressbar
  progressValue: number;
  //this will true when response from server is success
  isHideProgress: boolean;
  constructor() {
    super();
  }

  genericLoad(isLoadCall: boolean, reqType: any, loadingState: any, loadedState: any, loadingErrorState: any, path: any, payload: any): Observable<Store.State>{
    const me = this;
    const output = new Subject<Store.State>();
    setTimeout(() => {
      output.next(new loadingState());
    }, 0);

    /// DEV CODE ----------------->
    /* setTimeout(() => {
      if (reqType == 0)
        output.next(new loadedState(ALERT_RULE_DATA));
      output.complete();
    }, 2000); */
    me.controller.post(path, payload).subscribe(
      (data: AlertRule) => {
        if (reqType == PAYLOAD_TYPE.GET_RULES)
          output.next(new loadedState(me.parseAlertRuleData(isLoadCall, data)));
        else
          output.next(new loadedState(data));
        output.complete();
      },
      (e: any) => {
        console.log("Rule Data loading failed");
        output.error(new loadingErrorState(e));
        output.complete();

        me.logger.error('Rule Data loading failed', e);
      }
    );
    return output;
  }

  parseAlertRuleData(isLoadCall: boolean, resdata: AlertRule): AlertRuleTable {
    const me = this;
    let ruleTableDataList: any[] = [];
    if (isLoadCall){
      if (resdata.data) {
        resdata.data.forEach(rule => {
          me.updateRuleTableDataList(ruleTableDataList, rule);
        });
      }
      const load: AlertRuleTable = {
        data: ruleTableDataList,
        status: resdata.status,
        headers: resdata.headers,
        paginator: resdata.paginator,
        extensions: resdata.extensions,
        iconsField: 'icon',
        iconsFieldEvent: 'iconStruggling',
        tableFilter: true,
      };
      return load;
    }
    else{
      if (resdata.rules) {
        resdata.rules.forEach(rule => {
          me.updateRuleTableDataList(ruleTableDataList, rule);
        });
      }
      const all: AlertRuleTable = {
        data: ruleTableDataList,
        status: resdata.status,
      };
      return all;
    }
  }

  updateRuleTableDataList(ruleTableDataList: any[], rule: RuleConfig) {
    const me = this;
    const ruleTableData: any = {
      enable: rule.attributes.enable,
      conditionType: rule.attributes.conditionType == 0 ? 'Single' : 'Multiple',
      ruleName: rule.name,
      ruleId : rule.id,
      alertMessage: rule.attributes.message,
      rule: rule,
      alertAction: []
    };
    let condiExp: any;
    let condInfoObjList: any[] = [];
    rule.attributes.severity.forEach((severity,sevIdx) => {
      if (severity.id == 3){
        if (condiExp)
          condiExp += ", Critical: " + severity.condition;
        else 
          condiExp = "Critical: " + severity.condition;
        condInfoObjList.push(me.getCondInfoObjList(rule, severity, severity.id, '#f12929'));
      }
      else if (severity.id == 2) {
        if (condiExp)
          condiExp += ", Major: " + severity.condition;
        else
          condiExp = "Major: " + severity.condition;
        condInfoObjList.push(me.getCondInfoObjList(rule, severity, severity.id, '#ff9898'));
      }
      else if (severity.id == 1) {
        if (condiExp)
          condiExp += ", Minor: " + severity.condition;
        else
          condiExp = "Minor: " + severity.condition;
        condInfoObjList.push(me.getCondInfoObjList(rule, severity, severity.id, '#ffc9c9'));
      }
      ruleTableData['condiInfo'] = condInfoObjList;
      ruleTableData['condiExp'] = condiExp;
    });
    if (rule.attributes.actions){
      rule.attributes.actions.forEach(action => {
        me.updateAlertAction(ruleTableData, action);
      });   
    }
    if (rule.attributes.mailIds) {
      rule.attributes.mailIds.forEach(mail => {
        me.updateAlertAction(ruleTableData, {name: mail, type: 1});
      });
    }
    if (rule.attributes.extensions) {
      rule.attributes.extensions.forEach(extension => {
        ruleTableData['alertAction'].push({ name: extension, type: 11 });
      });
    }
    ruleTableDataList.push(ruleTableData);
  }
  updateAlertAction(ruleTableData: any, action: Actions) {
    if (ruleTableData['alertAction'].length == 0)
      ruleTableData['alertAction'].push(action);
    else {
      ruleTableData['alertAction'].forEach(data => {
        if (data.type == action.type)
          data.name += ", " + action.name;
        else
          ruleTableData['alertAction'].push(action);
      });
    }
  }

  getCondInfoObjList(rule: RuleConfig, severity: Severity, sevIdx: number, color: string): any {
    const condInfo: any = {
      condiExp: sevIdx == 3 ? "Critical: " + severity.condition : sevIdx == 2 ? "Major: " + severity.condition : "Minor: " + severity.condition,
      condInfoList: []
    }
    severity.conditionList.forEach((condition, idx) => {
      const metricData = {
        color: color,
        index: COLOR_ARR[idx].name,
        colorForGraph: COLOR_ARR[idx].color,
        condition: CONDITION_TYPE[condition.type],
        metric: condition.mName,
        dataType: condition.type == 0 ? DATA_TYPE_THRESHOLD[condition.thresholdType.dataType] : condition.type == 1 ? DATA_TYPE_THRESHOLD[condition.changeType.dataType] : condition.type == 2 ? DATA_TYPE_THRESHOLD[condition.anomalyType.dataType] : condition.type == 3 ? DATA_TYPE_THRESHOLD[condition.outliersType.dataType] : DATA_TYPE_THRESHOLD[condition.forcastType.dataType],
        operator: condition.type == 0 ? OPERATOR[condition.thresholdType.operator] : condition.type == 1 ? OPERATOR[condition.changeType.operator] : condition.type == 2 ? OPERATOR_ANOMALY[condition.anomalyType.operator == 0 ? 0 : condition.anomalyType.operator == 2 ? 1 : 2] : condition.type == 4 ? OPERATOR[condition.forcastType.operator] : { label: '', value: -1 },
        change: condition.type == 1 ? CHANGE[condition.changeType.operator] : { label: '', value: -1 },
        pastWindow: condition.type == 1 ? condition.changeType.pastWindow : -1,
        pwUnit: condition.type == 1 ? TIME_WINDOW_UNIT[condition.changeType.pwUnit] : { label: '', value: -1 },
        windowType: condition.type == 0 ? WINDOW_TYPE[condition.thresholdType.windowType] : condition.type == 1 ? WINDOW_TYPE[condition.changeType.windowType] : condition.type == 2 ? WINDOW_TYPE[condition.anomalyType.windowType] : condition.type == 3 ? WINDOW_TYPE[condition.outliersType.windowType] : WINDOW_TYPE[condition.forcastType.windowType],
        fThreshold: condition.type == 0 ? condition.thresholdType.fThreshold : condition.type == 1 ? condition.changeType.fThreshold : condition.type == 4 ? condition.forcastType.fThreshold : -1,
        frThreshold: condition.type == 0 ? condition.thresholdType.frThreshold : condition.type == 1 ? condition.changeType.frThreshold : condition.type == 4 ? condition.forcastType.frThreshold : -1,
        pctType: condition.type == 0 ? PCT_TYPE[condition.thresholdType.pctType] : condition.type == 1 ? PCT_TYPE[condition.changeType.pctType] : condition.type == 2 ? PCT_TYPE[condition.anomalyType.pctType] : condition.type == 3 ? PCT_TYPE[condition.outliersType.pctType] : PCT_TYPE[condition.forcastType.pctType],
        pct: condition.type == 0 ? condition.thresholdType.pct : condition.type == 1 ? condition.changeType.pct : condition.type == 2 ? condition.anomalyType.pct : condition.type == 3 ? condition.outliersType.pct : condition.forcastType.pct,
        timeWindow: condition.type == 0 ? condition.thresholdType.timeWindow : condition.type == 1 ? condition.changeType.timeWindow : condition.type == 2 ? condition.anomalyType.timeWindow : condition.type == 3 ? condition.outliersType.timeWindow : condition.forcastType.timeWindow,
        twUnit: condition.type == 0 ? TIME_WINDOW_UNIT[condition.thresholdType.twUnit] : condition.type == 1 ? TIME_WINDOW_UNIT[condition.changeType.twUnit] : condition.type == 2 ? TIME_WINDOW_UNIT[condition.anomalyType.twUnit] : condition.type == 3 ? TIME_WINDOW_UNIT[condition.outliersType.twUnit] : TIME_WINDOW_UNIT[condition.forcastType.twUnit],
        algoType: condition.type == 2 ? Usetheta[condition.anomalyType.algoType] : condition.type == 3 ? UseMad[condition.outliersType.algoType] : { label: '', value: -1 },
        deviation: condition.type == 2 ? condition.anomalyType.deviation : -1,
        tolerance: condition.type == 3 ? condition.outliersType.tolerance : -1,
        trendWindow: condition.type == 4 ? condition.forcastType.trendWindow : -1,
        trendWindowUnit: condition.type == 4 ? TIME_WINDOW_UNIT[condition.forcastType.trendWindowUnit] : { label: '', value: -1 },
        forecastModel: condition.type == 4 ? ForecastModel[condition.forcastType.forecastModel] : { label: '', value: -1 },
        forecastType: condition.type == 4 ? ForecastType[condition.forcastType.forecastType] : { label: '', value: -1 }
      }
      rule.attributes.metric.forEach(metric => {
        if (metric.name == condition.mName) {
          metricData['metricGroup'] = metric['measure'].mg;
          metricData['metricName'] = metric['measure'].metric;
        }
      });
      condInfo.condInfoList.push(metricData);
    });
    return condInfo;
  }

  /*Method is used to show progressbar  */
  showProgressBar(progressMessage: string) {
    const me = this;
    me.progressValue = 0;
    me.displayDialog = true;
    /* initializing progressbar variables */
    me.dialogMessage = progressMessage;
    me.isHideProgress = false;
    let interval = setInterval(() => {
      if (me.progressValue < 85) {
        me.progressValue = me.progressValue + Math.floor(Math.random() * 10) + 1;
        if (me.progressValue == 100)//in case progressValue is 100 then decrease it
          me.progressValue = 86;
      }

      if (this.isHideProgress == true) {
        this.progressValue = 100;
        this.displayDialog = false;

        clearInterval(interval); //to hide ProgressBar
      }
    }, 500);
  }
}