import { SessionService } from 'src/app/core/session/session.service';

import { DashboardComponent } from 'src/app/shared/dashboard/dashboard.component';
import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SelectItem } from 'primeng';
import { PageDialogComponent } from '../page-dialog/page-dialog.component';
import { Aggregation, DashboardWidgetLoadRes, DataCtx, DerivedCtx, DerivedRequestPayLoad, Details, MetricExpression, Variable } from './service/grouped-derived-metrices.model';
import { GroupedDerivedMetricesService } from './service/grouped-derived-metrices.service';
import { DashboardTime } from '../dashboard/service/dashboard.model';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { derivedResCreatedState, derivedResCreatingErrorState, derivedResCreatingState } from './service/grouped-derived-metrices.state';
import { ConfirmationService } from 'primeng/api';
@Component({
  selector: 'app-grouped-derived-metrices',
  templateUrl: './grouped-derived-metrices.component.html',
  styleUrls: ['./grouped-derived-metrices.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GroupedDerivedMetricesComponent extends PageDialogComponent implements OnInit {

  isVisible: boolean = false;
  displayBasic2 = false;
  selectedTier: SelectItem[];
  selectedUtilization: SelectItem[];
  selectedQueue: SelectItem[];
  dashboardComponent : DashboardComponent;
  graphObjectArr : any[];
  onList = [];
  on = [];
  metricGroup : string = "";
  items: SelectItem[];
  derivedReqPayload : DerivedRequestPayLoad
  private derivedSubscription: Subscription;
  dataDerivedRes: DashboardWidgetLoadRes;
  dialogVisible: boolean = false;
  level = "";
  isBlockUI : boolean = false;

  constructor(public sessionService: SessionService, public groupedDerivedService: GroupedDerivedMetricesService, private ref: ChangeDetectorRef, public confirmation :ConfirmationService


    ) {
    super();
    this.dialogVisible = false;
    this.isBlockUI = false;
  }

  openGroupedDerivedWindow(treeData: any[], dashboardComponent: DashboardComponent) {
    this.onList = [];
    this.on = [];
    this.level = "";
    this.dialogVisible = false;
    this.metricGroup = "";
    this.dashboardComponent = dashboardComponent;
    if (treeData && treeData.length > 0) {
      let subjectTag = [...treeData[0].subjectTags];
      if (subjectTag && subjectTag.length > 0) {
        subjectTag.reverse();
        for (let i = 0; i < subjectTag.length; i++) {
          let value: any = subjectTag[i];
          let json: any = {};
          json['label'] = value.key;
          json['value'] = value.key;
          this.onList.push(json);



        }

        if(this.onList.length == 1) {
          this.on.push(this.onList[0].label);
          this.level = this.getLevel();
        }

      }
    }
    this.graphObjectArr = this.getGraphObjectArr(treeData)
    this.show();
  }

  changedOn(event) {
    if(this.graphObjectArr && this.graphObjectArr.length > 0) {
      for(let i = 0 ; i < this.graphObjectArr.length ; i++) {
        this.changedDesc(this.graphObjectArr[i]);
      }
    }
    this.ref.detectChanges();

  }


  getGraphObjectArr(treeData) {

    this.graphObjectArr = [];

    try {
      if (treeData && treeData.length > 0) {
        for (let i = 0; i < treeData.length; i++) {

          let data = treeData[i];
          let measureTag = data.measureTags;
          let subjectTags = [...data.subjectTags];
          if (measureTag && subjectTags) {
            let gName = measureTag.metric;
            subjectTags.reverse();
            let arrSubjectTag = [];
            for (let j = 0; j < subjectTags.length; j++) {
              subjectTags[j].mode = 2;
              subjectTags[j].value = '*';
              arrSubjectTag.push(subjectTags[j]);
            }

            let desc = "";

            let cons = { 'graphName': gName, 'subjectTags': arrSubjectTag, 'description':desc, 'value': 0, 'mg': measureTag.mg ,'metricId':measureTag.metricId,'mgId':measureTag.mgId};
            if(cons.value == 0) {
              if(this.level == "") {
                desc = "Avg of " + cons.graphName;
              }else {
                desc = "Avg of " + cons.graphName + " on " + this.level;
              }
            }else {
              if(this.level == "") {
                desc = "Sum of " + cons.graphName;
              }else {
                desc = "Sum of " + cons.graphName + " on " + this.level;
              }
            }

            cons.description = desc;

            this.graphObjectArr.push(cons);
            if(i == 0) {
              this.metricGroup = "derived_"+cons.mg;
            }
          }
        }
      }

    } catch (error) {
      return [];
    }

    return this.graphObjectArr;
  }


  changedDesc(graphData) {
    try {

      let label = this.getLevel();
      let desc = "";
      if(graphData.value == 0) {

        desc = "Avg of " + graphData.graphName + " on " + label;
        if(label == "") {
          desc = "Avg of " +graphData.graphName;
        }
      }else {
        desc = "Sum of " + graphData.graphName + " on " + label;
        if(label == "") {
          desc = "Sum of " + graphData.graphName;
        }
      }

      graphData.description = desc;

    } catch (error) {
      console.error("Exception in changedDesc method", error);
    }
  }

  changedOnItem(graphData) {
    try {
      this.changedDesc(graphData);
    } catch (error) {

    }
  }

  show() {
    const me = this;
    super.show();
    me.isVisible = true;
  }

  ngOnInit(): void {
    const me = this;
    this.dialogVisible = false;
    me.items = [
      { label: 'Average', value: 0 },
      { label: 'Sum', value: 1 },
    ];
  }

  alertMsg(msg) {
    this.dialogVisible = true;
    this.confirmation.confirm({
      key: 'GroupedDerivedMetrics',
      message: msg,
      header: "Error",
      accept: () => { this.dialogVisible = false; },
      reject: () => { this.dialogVisible = false;},
      rejectVisible:false
    });
    this.ref.detectChanges();
  }

  // Form Modal Close
  apply() {

    if(!this.metricGroup || this.metricGroup.trim() == "") {
      this.alertMsg("Please enter group name");
      this.metricGroup = "";
      return;
    }

    if(this.metricGroup.trim().length > 256) {
      this.alertMsg("Derived group name accept maximum 256 character");
      return;
    }

    if ((!this.on || this.on.length == 0)) {
      this.dialogVisible = true;
      this.alertMsg("Please select atleast one level");
      return;
    }


    let isValid = this.checkValidationOnDesc();

    if(!isValid.valid) {
      this.alertMsg(isValid.errorMsg);
      return;
    }

    this.isBlockUI = true;
    this.derivedReqPayload = this.getDerivedRequestPayload();

    this.generateDerivedResponse(this.derivedReqPayload);
  }

  checkValidationOnDesc() {
    try {
      let isValid = {valid: true, errorMsg: ""};
      if(this.graphObjectArr && this.graphObjectArr.length > 0) {
       for(let i = 0 ; i < this.graphObjectArr.length ; i++) {
         let desc = this.graphObjectArr[i].description;
         if(!desc || desc.trim() == "") {
             isValid.valid = false;
             isValid.errorMsg = "Please enter description";
             break;
         }else if (desc.trim().length > 128) {
          isValid.valid = false;
          isValid.errorMsg = "Description accept maximum 128 character";
          break;
         }
       }
      }

      return isValid;
    } catch (error) {
      console.error("Exception in checkValidationOnDesc method " , error);
    }
  }

  generateDerivedResponse(payload: DerivedRequestPayLoad) {
    try {

      this.derivedSubscription = this.groupedDerivedService.loadDerivedRes(payload).subscribe(
        (state: Store.State) => {
          if (state instanceof derivedResCreatingState) {
            this.onLoadingDerivedRes(state);
            return;
          }

          if (state instanceof derivedResCreatedState) {
            this.onLoadedDerivedRes(state);
            return;
          }
        },
        (state: derivedResCreatingErrorState) => {
          this.onLoadingErrorDerivedRes(state);
        }
      );

    } catch (error) {

    }
  }

  private onLoadedDerivedRes(state: derivedResCreatedState) {
    const me = this;
    me.dataDerivedRes = state.data;
    this.isBlockUI = false;
    me.populateDerivedResData(me.dataDerivedRes);
  }

  populateDerivedResData(dataToPopulate) {
    try {
      let msg = "";
      if(dataToPopulate && dataToPopulate.grpData && dataToPopulate.grpData.derivedResCtx) {
        msg = "Derived metric " + "<span class='text-highlight'>" + dataToPopulate.grpData.derivedResCtx.metricName + "</span>" + " is successfully added in group " + "<span class='text-highlight'>" + dataToPopulate.grpData.derivedResCtx.metricGName + "</span>" + " at " + "<span class='text-highlight'>" + dataToPopulate.grpData.derivedResCtx.derivedMtricPath + "</span>" + " hierarchy."
       // alert(msg);
        this.dialogVisible = true;
        this.confirmation.confirm({
        key: 'GroupedDerivedMetrics',
        message: msg,
        header: "Success",
        accept: () => { this.dialogVisible = false;
          this.closeDialog(); },
        reject: () => { this.dialogVisible = false;},
        rejectVisible:false
      });

      }else {
        this.alertMsg(dataToPopulate.status.msg);
      }
      this.ref.detectChanges();


    } catch (error) {
      console.error("Exception in method populateDerivedResData")
    }
  }

  private onLoadingDerivedRes(state: derivedResCreatingState) {
    const me = this;
    this.isBlockUI = false;

  }

  private onLoadingErrorDerivedRes(state: derivedResCreatingErrorState) {
    const me = this;
    this.isBlockUI = false;

  }

  getDerivedRequestPayload() {
    let finalReqPayload: DerivedRequestPayLoad = {};
    try {
      finalReqPayload = {
        opType: 19,
        cctx: this.sessionService.session.cctx,
        dataFilter: [0,1,2,3,4,5],
        duration: this.getDuration(),
        tr: parseInt(this.sessionService.session.testRun.id, 0),
        clientId: 'Default',
        appId: 'Default',
        dataCtx: this.getDataCtx(),
      };
    } catch (error) { }

    return finalReqPayload;
  }

  getDataCtx() {
    let dataCtx: DataCtx = {};
    try {
      dataCtx = {
        ft: null,
        limit: 10,
        derivedFlag: 1,
        derivedCtx: this.getDerivedCTX()

      };
    } catch (error) { }
    return dataCtx;

  }

  getDerivedCTX() {
    let derivedCtx: DerivedCtx = {}
    try {

      derivedCtx = {
        details: this.getDetails(),
        metricExpression: this.getMetricExpression()
      }

    } catch (error) {
      console.error("Exception in getDerivedCtx method", error);
    }

    return derivedCtx;
  }

  getMetricExpression() {
    let metricExpresion = [];
    try {
      if (this.graphObjectArr && this.graphObjectArr.length > 0) {

        for (let i = 0; i < this.graphObjectArr.length; i++) {
          let graphNameObj = this.graphObjectArr[i];
          let metricExpObj: MetricExpression = {};
          let graphObject =
            metricExpObj = {
              variable: this.getVariable(graphNameObj),
              formula: "NA",
              aggregation: this.getAggregation(graphNameObj),
              derivedMName: graphNameObj.graphName,
              derivedMDesc: graphNameObj.description,
            }



          metricExpresion.push(metricExpObj);
        }

      }

    } catch (error) {
      console.error("Exception in getMetricExpression method", error);
    }

    return metricExpresion;
  }

  getVariable(graphNameObj) {
    let variable: Variable[] = [];
    try {

      let variableObj: Variable = {};

      variableObj = {
        name: 'NA',
        varExp: 'NA',
        gCtx: [
          {
            subject: {
              tags: graphNameObj.subjectTags,
            },
            measure: {
              metric: graphNameObj.graphName,
              metricId: graphNameObj.metricId,
              mg: graphNameObj.mg,
              mgId: graphNameObj.mgId,
              mgType: "NA",
              mgTypeId: -1,
              showTogether: 0,
            },
          },
        ],
        AggFn: 'None',
        operators: []
      }

      variable.push(variableObj);
    } catch (error) {
      console.error("Exception in getVariable method", error);
    }

    return variable;
  }

  getAggregation(graphNameObj) {
    let aggregationObj: Aggregation = {}
    try {
      aggregationObj = {
        type: 1,
        by: graphNameObj.value,
        level: this.getLevel()
      }
    } catch (error) {
      console.error("Exception is coming inside getAggregation mrthod ", error);
    }
    return aggregationObj;
  }

  getLevel() {
    let level = "";
    try {
      if (this.on && this.on.length > 0) {
        for (let i = 0; i < this.onList.length; i++) {
          if (this.on.indexOf(this.onList[i].label) !== -1) {
            if (level == "") {
              level = this.onList[i].label;
            } else {
              level += "," + this.onList[i].label;
            }
          }

        }
      }
    } catch (error) {
      level = "";
    }
    return level;
  }

  getDetails() {
    let details: Details = {};
    try {
      details = {
        gName: this.metricGroup,
        desc: "NA",
      };
    } catch (error) {
      console.error('Exception in getDetails method', error);
    }
    return details;
  }


  getDuration() {
    try {
      const dashboardTime: DashboardTime = this.dashboardComponent.getTime(); // TODO: widget time instead of dashboard

      const startTime: number = _.get(
        dashboardTime,
        'time.frameStart.value',
        null
      );
      const endTime: number = _.get(dashboardTime, 'time.frameEnd.value', null);
      const graphTimeKey: string = _.get(dashboardTime, 'graphTimeKey', null);
      const viewBy: number = _.get(dashboardTime, 'viewBy', null);

      const duration = {
        st: startTime,
        et: endTime,
        preset: graphTimeKey,
        viewBy,
      };

      return duration;
    } catch (error) {
      console.error(
        'Error is coming while getting the duration object ',
        error
      );
      return null;
    }
  }

  closeDialog(){
    const me = this;
    me.isVisible = false;
    this.onList = [];
  }


}
