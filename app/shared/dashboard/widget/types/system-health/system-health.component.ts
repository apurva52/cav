import {
  Component,
  OnInit,
  HostBinding,
  ViewEncapsulation,
  Input,
} from '@angular/core';
import { DashboardWidgetComponent } from '../../dashboard-widget.component';
import { DashboardWidgetTypeSystemHealthConfig, ForEachGraphArgs } from '../../../service/dashboard.model';
import * as _ from 'lodash';
import { MenuItemUtility } from 'src/app/shared/utility/menu-item';
import { CONVERSION_REPORT_TABLE_DATA } from 'src/app/pages/home/home-sessions/form-analytics/conversion-report/service/conversion-report.dummy';

@Component({
  selector: 'app-system-health',
  templateUrl: './system-health.component.html',
  styleUrls: ['./system-health.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: DashboardWidgetComponent, useExisting: SystemHealthComponent },
  ],
})
export class SystemHealthComponent extends DashboardWidgetComponent {
  @HostBinding('class') class = 'widget-container widget-system-health';

  systemHealthOptions: DashboardWidgetTypeSystemHealthConfig;
  displaySeverity: string;
  displayCountOfGraph: number = 0;
  bgColor: string = '#009973';
  widgetWiseTimeToolTip : string = '';
  @Input() visiblityMenu : any;
  titleText : string;
  bottomText : string;
  prefixxCordinate:any= '15%';
  prefixyCordinate:any;
  suffixxCordinate:any= '85%'
  suffixyCordinate:any;
  prevDatavalue = 0;
  ishealthRule = true;

  render() {
    const me = this;
    if(!me.data){
      me.empty = false;
      me.loading = false;
      me.systemHealthOptions = JSON.parse(
        JSON.stringify(me.widget.settings.types.systemHealth)
      );
      me.systemHealthOptions.dataImgName="icons8 icons8-up";
      me.systemHealthOptions.displayFontFamily= "Select Font Family";
      //me.systemHealthOptions.bold=false;
      me.systemHealthOptions.iconColor= "black";

      //me.systemHealthOptions.italic=false;
      //me.systemHealthOptions.prefix="";
      //me.systemHealthOptions.suffix="";
      return;
    }
    if (me.empty || me.data.grpData == null || me.data.grpData.mFrequency == null) {
      me.empty = true;
      return;
    }

    const systemHealthOptions = JSON.parse(
      JSON.stringify(me.widget.settings.types.systemHealth)
    );
    me.systemHealthOptions = systemHealthOptions;
    if(me.widget.widgetWiseInfo){
      let timePreset = JSON.parse(sessionStorage.getItem('timePresets'))['timePeriod'];
      let selectedTimePreset = MenuItemUtility.searchById(me.widget.widgetWiseInfo.duration.preset, timePreset);
        me.widgetWiseTimeToolTip = `
        'Widget wise time is applied'
        ${selectedTimePreset.label}
       `;
        }
    me.getSystemHealthData();
    me.setSystemHealthTitle();
    if(me.widget.settings.types.systemHealth.fontSize> '10' && me.displayCountOfGraph >999){
      me.prefixxCordinate = "10%";
      me.suffixxCordinate ="95%";
    }
  }

  private getSystemHealthData() {
    const me = this;

    let criticalVar: boolean = false;
    let majorVar: boolean = false;
    const criticalOperator: string =
      me.widget.settings.types.systemHealth.healthWidgetSeverityDef
        .criticalMSRString;
    const criticalRange: number =
      me.widget.settings.types.systemHealth.healthWidgetSeverityDef
        .criticalValue;
    const percentageFirstForCritical: number =
      me.widget.settings.types.systemHealth.healthWidgetRuleInfo.criticalPct;
    const statusFirstForCritical: string =
      me.widget.settings.types.systemHealth.healthWidgetRuleInfo
        .criticalSeverity;
    const operatorForCritical: string =
      me.widget.settings.types.systemHealth.healthWidgetRuleInfo
        .criticalCondition;
    const percentageSecondForCritical: number =
      me.widget.settings.types.systemHealth.healthWidgetRuleInfo
        .criticalAnotherPct;

    const majorOperator: string =
      me.widget.settings.types.systemHealth.healthWidgetSeverityDef
        .majorMSRString;
    const majorRange: number =
      me.widget.settings.types.systemHealth.healthWidgetSeverityDef.majorValue;
    const percentageFirstForMajor: number =
      me.widget.settings.types.systemHealth.healthWidgetRuleInfo.majorPct;
    const statusFirstForMajor: string =
      me.widget.settings.types.systemHealth.healthWidgetRuleInfo.majorSeverity;
    const operatorForMajor: string =
      me.widget.settings.types.systemHealth.healthWidgetRuleInfo.majorCondition;
    const percentageSecondForMajor: number =
      me.widget.settings.types.systemHealth.healthWidgetRuleInfo
        .majorAnotherPct;

    let countForCritical = 0;
    let countForMajor = 0;
    let countForNormal = 0;
    let criticalExpression = criticalOperator + ' ' + criticalRange;
    let majorExpression = majorOperator + ' ' + majorRange;

    if (
      criticalExpression.includes('null') ||
      criticalExpression.includes('undefined') ||
      criticalExpression.includes('Select operator')
    ) {
      criticalVar = true;
    }
    if (
      majorExpression.includes('null') ||
      majorExpression.includes('undefined') ||
      majorExpression.includes('Select operator')
    ) {
      majorVar = true;
    }
    //this is coming  when the health rule is not given by the user
    if((percentageFirstForCritical == null || percentageFirstForCritical == -1) &&  statusFirstForCritical == "") {
      this.ishealthRule = false;
      let count = 0;
      me.forEachGraph((args: ForEachGraphArgs) => {
        if(count == 0) {
          if(args.graph.lowerPanelSummary) {
            let graph = me.data.grpData.mFrequency[0].data[0];
            const attrVal: number = _.get(
              graph,
              me.widget.settings.types.systemHealth.dataAttrName,
              null
            );
            let gsType = args.gsType;
            me.displayCountOfGraph = me.isCavissonNullVal(args.graph.lowerPanelSummary[gsType].avg);

            if(me.widget.settings.types.systemHealth.dataAttrName == "min") {
              me.displayCountOfGraph = me.isCavissonNullVal(args.graph.lowerPanelSummary[gsType].min);
            }else if(me.widget.settings.types.systemHealth.dataAttrName == "max") {
              me.displayCountOfGraph = me.isCavissonNullVal(args.graph.lowerPanelSummary[gsType].max);
            }else if(me.widget.settings.types.systemHealth.dataAttrName == "count") {
              me.displayCountOfGraph = me.isCavissonNullVal(args.graph.lowerPanelSummary[gsType].count);
            }else if(me.widget.settings.types.systemHealth.dataAttrName == "lastSample") {
              me.displayCountOfGraph = me.isCavissonNullVal(args.graph.lowerPanelSummary[gsType].lastSample);
            }
            else if(me.widget.settings.types.systemHealth.dataAttrName == "stdDev") {
              me.displayCountOfGraph = me.isCavissonNullVal(args.graph.lowerPanelSummary[gsType].stdDev);
            }

            let valueArr = [];
            if(me.widget.settings.types.systemHealth.dataAttrName == "count") {
              me.displayCountOfGraph =Math.round(me.displayCountOfGraph) ;
            }else {
              me.displayCountOfGraph = Number(me.displayCountOfGraph.toFixed(3));
            }

            valueArr[0] = me.displayCountOfGraph;

            if(me.widget.et > 0) {
              me.prevDatavalue = 0;
            }

            if(me.prevDatavalue <=  me.displayCountOfGraph ) {
              me.systemHealthOptions.dataImgName="icons8 icons8-up";
            }else {
              me.systemHealthOptions.dataImgName="icons8 icons8-down";
            }

            me.prevDatavalue = me.displayCountOfGraph;
            console.log(" me.prevDatavalue",  me.prevDatavalue);
            if(eval(valueArr + criticalExpression)) {
              me.displaySeverity = "Critical";

              me.bgColor = '#d60f02';
            }else if(eval(valueArr + majorExpression)) {
              me.displaySeverity = "Major";
              me.bgColor = '#f97d1d';
            }else {
              me.displaySeverity = "Normal";
              me.bgColor = '#009973';
            }

            return;

          }
        }

      });
    }else {
      this.ishealthRule = true;
      for (const graph of me.data.grpData.mFrequency[0].data) {
        const attrVal: number = _.get(
          graph,
          me.widget.settings.types.systemHealth.dataAttrName,
          null
        );
        let severity = '';

        if (criticalVar !== true && eval(attrVal + criticalExpression)) {
          severity = 'critical';
          countForCritical++;
        } else if (majorVar !== true && eval(attrVal + majorExpression)) {
          severity = 'major';
          countForMajor++;
        } else {
          severity = 'normal';
          countForNormal++;
        }
        // me.graphSeverity.push(severity);
      }

      let totalGraphs = me.data.grpData.mFrequency[0].data.length;
      let criticalPercentage = (countForCritical / totalGraphs) * 100;
      let majorPercentage = (countForMajor / totalGraphs) * 100;

      if (statusFirstForCritical === 'Critical') {
        me.systemHealthOptions.dataImgName="icons8 icons8-down";
        if (
          operatorForCritical == null ||
          operatorForCritical === undefined ||
          operatorForCritical === 'undefined' ||
          operatorForCritical === ''
        ) {
          if (eval(percentageFirstForCritical + '<' + '=' + criticalPercentage)) {
            me.displaySeverity = 'Critical';
            me.displayCountOfGraph = countForCritical;
            me.bgColor = '#d60f02';

            return;
          } else if (
            percentageFirstForMajor == null ||
            percentageFirstForMajor === undefined ||
            percentageFirstForMajor === -1
          ) {
            me.displaySeverity = 'Normal';
            me.displayCountOfGraph = countForNormal;
            me.bgColor = '#009973';
            me.systemHealthOptions.dataImgName="icons8 icons8-up";
            return;
          }
        } else if (
          eval(
            percentageFirstForCritical +
            '<' +
            '=' +
            criticalPercentage +
            operatorForCritical +
            percentageSecondForCritical +
            '<' +
            '=' +
            majorPercentage
          )
        ) {
          me.displaySeverity = 'Critical';
          me.displayCountOfGraph = countForCritical;
          me.bgColor = '#d60f02';

          return;
        } else if (
          percentageFirstForMajor == null ||
          percentageFirstForMajor === undefined ||
          percentageFirstForMajor === -1
        ) {
          me.displaySeverity = 'Normal';
          me.displayCountOfGraph = countForNormal;
          me.bgColor = '#009973';

          return;
        }
      } else if (statusFirstForCritical === 'Major') {
        me.systemHealthOptions.dataImgName="icons8 icons8-down";
        if (
          operatorForCritical == null ||
          operatorForCritical === undefined ||
          operatorForCritical === 'undefined' ||
          operatorForCritical === ''
        ) {
          if (eval(percentageFirstForCritical + '<' + '=' + majorPercentage)) {
            me.displaySeverity = 'Critical';
            me.displayCountOfGraph = countForCritical;
            me.bgColor = '#d60f02';
            return;
          } else if (
            percentageFirstForMajor == null ||
            percentageFirstForMajor === undefined ||
            percentageFirstForMajor === -1
          ) {
            me.displaySeverity = 'Normal';
            me.displayCountOfGraph = countForNormal;
            me.bgColor = '#009973';
            me.systemHealthOptions.dataImgName="icons8 icons8-up";
            return;
          }
        } else if (
          eval(
            percentageFirstForCritical +
            '<' +
            '=' +
            majorPercentage +
            operatorForCritical +
            percentageSecondForCritical +
            '<' +
            '=' +
            criticalPercentage
          )
        ) {
          me.displaySeverity = 'Critical';
          me.displayCountOfGraph = countForCritical;
          me.bgColor = '#d60f02';
          return;
        } else if (
          percentageFirstForMajor == null ||
          percentageFirstForMajor === undefined ||
          percentageFirstForMajor === -1
        ) {
          me.displaySeverity = 'Normal';
          me.displayCountOfGraph = countForNormal;
          me.bgColor = '#009973';

          return;
        }
      }
      if (statusFirstForMajor === 'Critical') {
        me.systemHealthOptions.dataImgName="icons8 icons8-down";
        if (
          operatorForMajor == null ||
          operatorForMajor === undefined ||
          operatorForMajor === 'undefined' ||
          operatorForMajor === ''
        ) {
          if (eval(percentageFirstForMajor + '<' + '=' + criticalPercentage)) {
            me.displaySeverity = 'Major';
            me.displayCountOfGraph = countForMajor;
            me.bgColor = '#f97d1d';
            return;
          } else {
            me.displaySeverity = 'Normal';
            me.displayCountOfGraph = countForNormal;
            me.bgColor = '#009973';
            me.systemHealthOptions.dataImgName="icons8 icons8-up";
            return;
          }
        }
        if (
          eval(
            percentageFirstForMajor +
            '<' +
            '=' +
            criticalPercentage +
            operatorForMajor +
            percentageSecondForMajor +
            '<' +
            '=' +
            majorPercentage
          )
        ) {
          me.displaySeverity = 'Major';
          me.displayCountOfGraph = countForMajor;
          me.bgColor = '#f97d1d';
          return;
        } else {
          me.displaySeverity = 'Normal';
          me.displayCountOfGraph = countForNormal;
          me.bgColor = '#009973';

          return;
        }
      } else if (statusFirstForMajor === 'Major') {
        me.systemHealthOptions.dataImgName="icons8 icons8-down";
        if (
          operatorForMajor == null ||
          operatorForMajor === undefined ||
          operatorForMajor === 'undefined' ||
          operatorForMajor === ''
        ) {
          if (eval(percentageFirstForMajor + '<' + '=' + majorPercentage)) {
            me.displaySeverity = 'Major';
            me.displayCountOfGraph = countForMajor;
            me.bgColor = '#f97d1d';
            return;
          } else {
            me.displaySeverity = 'Normal';
            me.displayCountOfGraph = countForNormal;
            me.bgColor = '#009973';
            me.systemHealthOptions.dataImgName="icons8 icons8-up";

            return;
          }
        }
        if (
          eval(
            percentageFirstForMajor +
            '<' +
            '=' +
            majorPercentage +
            operatorForMajor +
            percentageSecondForMajor +
            '<' +
            '=' +
            criticalPercentage
          )
        ) {
          me.displaySeverity = 'Major';
          me.displayCountOfGraph = countForMajor;
          me.bgColor = '#f97d1d';
          return;
        } else {
          me.displaySeverity = 'Normal';
          me.displayCountOfGraph = countForNormal;
          me.bgColor = '#009973';
          return;
        }
      }
    }

    me.widget.settings.types.systemHealth.severity = me.bgColor;

  }

  private isCavissonNullVal(val: number): number {
    if (val === -123456789) {
      return (val = 0);
    } else {
      return val;
    }
  }

  setSystemHealthTitle(){
    const me = this;
    if(me.widget.settings.types.systemHealth.isGraphNameOnTop){
      me.titleText = me.displaySeverity;
      me.bottomText = me.widget.name;
    }
    else{
      me.titleText=me.widget.name;
      me.bottomText= me.displaySeverity;
    }
  }
  styleObject(){
    return {
      fontSize: this.widget.settings.types.systemHealth.fontSize,
      color: this.widget.settings.types.systemHealth.fontColor
    }
  }
}
