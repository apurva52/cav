import { indexOf } from 'lodash';
import { GCtx } from './../../../assets/dummyData/dummy.model';

import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { PageDialogComponent } from '../page-dialog/page-dialog.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { COLOR_ARR } from './service/derived-view-exp.model';

@Component({
  selector: 'app-derived-view-exp',
  templateUrl: './derived-view-exp.component.html',
  styleUrls: ['./derived-view-exp.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DerivedViewExpComponent extends PageDialogComponent implements OnInit {
  @Input() dashboardComponent: DashboardComponent;

  addedGraph = [];
  graphOperationExpression = "";
  derivedName = "";
  derivedGroupName = "";
  description = "";
  data: any = null;
  apply: string = "";
  using : string = "";
  on: string = "";

  public closeDerivedWindow() {
    const me = this;
    me.visible = false;
  }

  show() {

    const me = this;
    me.addedGraph  = me.createDerivedViewExpObject(this.data);


   super.show();



  }
  createDerivedViewExpObject(data: any) {
    let dataArr = [];
    try {
      if(data) {
        if(data.details)
        this.derivedGroupName = data.details.gName;
        this.description = data.details.desc;
      }

      if(data.metricExpression && data.metricExpression.length > 0) {
       for(let i = 0 ; i < data.metricExpression.length ; i++) {
         let metricExp = data.metricExpression[i];
         if(metricExp) {
           this.derivedName = metricExp.derivedMName;
           if(metricExp.formula == "NA") {
            this.graphOperationExpression = COLOR_ARR[i].name;
           }else {
             this.graphOperationExpression = metricExp.formula;
           }

           let variable =metricExp.variable;
           let aggregation = metricExp.aggregation;
           this.getAggregationValue(aggregation);
           if(variable && variable.length > 0)  {
            for(let j = 0; j < variable.length ;j++) {
              let variableObj = variable[j];
              let addedGraphObj = {};
              addedGraphObj['colorForGraph'] = '#9ACD32';
              addedGraphObj['index'] = COLOR_ARR[j].name;
              addedGraphObj['expression'] = variableObj.varExp;
              this.getSubject(addedGraphObj, variableObj.varExp);
              addedGraphObj['function'] = this.getFunction(variableObj.aggFn);
              addedGraphObj['operator'] = this.getOperators(variableObj.operators);
              addedGraphObj['newOperator'] = this.getNewOperators(addedGraphObj['operator']);
              if(variableObj.gCtx) {
                this.getGCtx(addedGraphObj, variableObj.gCtx);
              }
              dataArr.push(addedGraphObj);

            }
           }
         }
       }

      }
    } catch (error) {
      console.error("Exception in method createDerivedViewExpObject" , error);
    }

    return dataArr;
  }
  getAggregationValue(aggregation: any) {
    if(aggregation.type == 2) {
      this.apply = "None";
      this.on = "None";
      this.using = "None";
    }else if(aggregation.type == 0) {
      this.apply = "Roll Up";
      this.on = aggregation.level;
      if(aggregation.by == 0) {
        this.using = "Average";
      }else if(aggregation.by == 1) {
        this.using = "Sum";
      }
    }else if(aggregation.type == 1) {
      this.apply = "Group By";
      this.on = aggregation.level;
      if(aggregation.by == 0) {
        this.using = "Average";
      }else if(aggregation.by == 1) {
        this.using = "Sum";
      }
    }





  }
  getSubject(addedGraphObj: {}, varExp: any) {
    if(addedGraphObj && varExp) {
      if(((varExp == "NA") || varExp.indexOf("All") > -1) ) {
        addedGraphObj['specifiedAdvExpValue'] = "All";
        addedGraphObj['expressionAllSpecfied'] = 'All';
      }else if(varExp.indexOf("PATTERN#") > -1) {
        let exp = varExp.substring(varExp.indexOf("PATTERN#"), varExp.lastIndexOf("]"));
        addedGraphObj['specifiedAdvExpValue'] = exp;
        addedGraphObj['expressionAllSpecfied'] = exp;
      }else if(varExp.indexOf("PATTERN#") == -1) {
        let exp = varExp.substring(varExp.indexOf("[") +1 , varExp.lastIndexOf("]"));
        addedGraphObj['specifiedAdvExpValue'] = exp;
        addedGraphObj['expressionAllSpecfied'] = exp;
      }
    }
  }
  getGCtx(addedGraphObj: {}, gCtx: any) {
    if(gCtx && gCtx.length > 0) {
      for(let i = 0 ; i < gCtx.length; i++) {
        let gctxObj = gCtx[i];
        if(gctxObj && gctxObj.measure) {
          let measureObj = gctxObj.measure;
          addedGraphObj['groupInfo'] = measureObj.mg;
          addedGraphObj['groupName'] = measureObj.mg;
          addedGraphObj['graphInfo'] = measureObj.metric;
          addedGraphObj['graphName'] = measureObj.metric;
        }
      }
    }
  }
  getNewOperators(oprArr: any): any {
      let newOpr = "";
    if(oprArr && oprArr.length > 0) {
      for(let i = 0 ; i < oprArr.length ; i++) {

          if (newOpr == "") {
            newOpr = oprArr[i];
          } else {
            newOpr = newOpr + ", " + oprArr[i];
          }
      }
    }

    return newOpr;
  }
  getOperators(operators: any): any {
    let operatorArr = [];
    if(operators && operators.length > 0) {
      for(let i= 0 ; i < operators.length;i++) {
         if(operators[i] == 1) {
          operatorArr.push("Log2");
         }else if(operators[i] == 2) {
          operatorArr.push("Log10");
         }else if(operators[i] == 3) {
          operatorArr.push("SampleDiffPct");
         }else if(operators[i] == 4) {
          operatorArr.push("PctAwayFromTAvg");
         }else if(operators[i] == 5) {
          operatorArr.push("SampleDiff");
         }
      }
    }

    return operatorArr;
  }
  getFunction(aggFn: any): any {
    try {
      if(aggFn == 0) {
        return 'None';
      }else if(aggFn == 1) {
        return "SUM";
      }
      else if(aggFn == 2) {
        return "AVG";
      }
      else if(aggFn == 3) {
        return "MIN";
      }
      else if(aggFn == 4) {
        return "MAX";
      }
      else if(aggFn == 5) {
        return "SUMCOUNT";
      }else if(aggFn == 6) {
        return "COUNT";
      }
    } catch (error) {

    }

    return "";
  }

  openWindow(data) {
    this.data = {...data};
    this.show();
  }
}
