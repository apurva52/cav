import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash';
import { SelectItem, ConfirmationService } from 'primeng';
import { Subscription } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { DashboardTime } from '../dashboard/service/dashboard.model';
import { PageDialogComponent } from '../page-dialog/page-dialog.component';
import { AggregateVirualMetricService } from './service/aggregate-virual-metric.service';
import { Aggregation, DashboardWidgetLoadRes, DataCtx, DerivedCtx, DerivedRequestPayLoad, Details, MetricExpression, Variable } from './service/aggregated-virtual-metric.model';
import { Store } from 'src/app/core/store/store';
import { derivedResCreatedState, derivedResCreatingErrorState, derivedResCreatingState } from './service/aggregate-virtual-metric.state';

@Component({
  selector: 'app-aggregated-virtual-metrices',
  templateUrl: './aggregated-virtual-metrices.component.html',
  styleUrls: ['./aggregated-virtual-metrices.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AggregatedVirtualMetricesComponent
  extends PageDialogComponent
  implements OnInit {
  isVisible: boolean = false;
  displayBasic2 = false;
  selectedUtlization: any;
  selectedRollup: any;
  tierItems: SelectItem[];
  items: SelectItem[];
  derivedFlag: number = 1;
  dashboardComponent: DashboardComponent;
  derivedGroupName: string;
  description: string = '';
  graphName: string = '';
  subjectTags: any[] = [];
  onList = [];
  on = [];
  disableOn = false;
  hierarChiesSelected: string = '';
  metaDataValue: any;
  metricType: string = '';
  mgTypeId: string = '';
  totalPayload: any;
  private derivedSubscription: Subscription;
  graphObjectArr: any = [];
  metricGroup: string = '';
  derivedReqPayload: DerivedRequestPayLoad;
  dataDerivedRes: DashboardWidgetLoadRes;
  dialogVisible: boolean = false;
  level: string  = ""
  constructor(public sessionService: SessionService, public aggregateVirtualService: AggregateVirualMetricService, private ref: ChangeDetectorRef, public confirmation :ConfirmationService) {
    super();
    this.dialogVisible = false;
  }

  ngOnInit(): void {
    const me = this;
    this.dialogVisible = false;
    me.items = [
      { label: 'Average', value: 0 },
      { label: 'Sum', value: 1 },
    ];

  }

  openAggregatedDerivedWindow(treeData, dashboardComponent) {
    this.dashboardComponent = dashboardComponent;
    this.level = "";
    this.dialogVisible = false;
    if (treeData && treeData.length > 0) {
      let subjectTag = [...treeData[0].subjectTags];
     // subjectTag.splice(0, 1);
      if (subjectTag && subjectTag.length > 0) {
        subjectTag.reverse();
        for (let i = 0; i < subjectTag.length - 1; i++) {
          let value: any = subjectTag[i];
          let json: any = {};
          json['label'] = value.key;
          json['value'] = value.key;
          this.onList.push(json);

        }

        if (this.onList.length == 1) {
          this.on = []
          this.on.push(this.onList[0].label);
          this.level = this.getLevel();
        }

      }

      let measureTag = treeData[0].measureTags;
      if (measureTag && measureTag['mg'])
        this.metricGroup = measureTag['mg']
    }
    this.graphObjectArr = this.getGraphObjectArr(treeData)
    this.show();
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

            let cons = { 'graphName': gName, 'subjectTags': arrSubjectTag, 'description':desc, 'value': 0, 'mg': measureTag.mg };
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
              this.metricGroup = cons.mg;
            }

          }




        }
      }

    } catch (error) {
      return [];
    }

    return this.graphObjectArr;
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
              metricId: -1,
              mg: graphNameObj.mg,
              mgId: -1,
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
        type: 0,
        by: graphNameObj.value,
        level: this.getLevel()
      }
    } catch (error) {
      console.error("Exception is coming inside getAggregation mrthod ", error);
    }
    return aggregationObj;
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

  changedOn(event) {
    try {

      if (event.value.indexOf(event.itemValue) !== -1) {
        let index = this.getIndex(this.onList, event.itemValue);
        if (index > -1) {
          this.on = [];
          for (let i = 0; i <= index; i++) {
            this.on.push(this.onList[i].label);
          }
        }
      } else {
        let index = this.getIndex(this.onList, event.itemValue);
        if (index > -1) {
          this.on = [];
          for (let i = 0; i < this.onList.length; i++) {
            if (index >= i && event.itemValue.length > 0 && event.value.indexOf(this.onList[i].label) !== -1) {
              this.on.push(this.onList[i].label);
            }
          }
        }
      }

      if(this.graphObjectArr && this.graphObjectArr.length > 0) {
        for(let i = 0 ; i < this.graphObjectArr.length ; i++) {
          this.changedDesc(this.graphObjectArr[i]);
        }
      }
      this.ref.detectChanges();


    } catch (error) {
      console.error("exception in changedOn method ", error);
    }
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

  getIndex(arr, value) {
    try {

      if (arr && arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
          if (value == arr[i].label) {
            return i;
          }
        }
      }
    } catch (error) {
      console.error("exception in getIndex method ", error);
      return -1;
    }
  }

  show() {
    const me = this;
    super.show();
    me.isVisible = true;
  }

  createPayLoadForRollUp() {
    const cctx = this.sessionService.session.cctx;

    this.derivedReqPayload = {
      opType: 19,
      cctx: cctx,
      dataFilter: [0],
      duration: this.getDuration(),
      tr: parseInt(this.sessionService.session.testRun.id, 0),
      clientId: "Default",
      appId: "Default",
      dataCtx: {
        ft: null,
        limit: 10,
        derivedFlag: 1,
        derivedCtx: {
          details: {
            gName: this.metricType,
            desc: this.description,
          },
          metricExpression: [
            {
              variable: [
                {
                  name: 'NA',
                  varExp: 'NA',
                  gCtx: [
                    {
                      subject: {
                        tags: this.subjectTags.reverse(),
                      },
                      measure: {
                        metric: this.graphName,
                        metricId: 10,
                        mg: this.metricType,
                        mgId: 10108,
                        mgType: "NA",
                        mgTypeId: parseInt(this.mgTypeId, 0),
                        showTogether: 0,
                      },
                    },
                  ],
                  AggFn: 'none',
                  operators: [0],
                },
              ],
              formula: 'NA',
              aggregation: {
                type: 0, //RollUp-0,Group By-1, none-2
                by: 0, // Average-0,Sum -1, none -2
                level: this.getLevel(), // Tier/Server/Instances/Channels
              },
              derivedMName: this.graphName,
              derivedMDesc: this.description,
            },
          ],
        },
      }
    }
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

  /**This method resets all values of this window */
  resetAllValuesOfWindow() {
    const me = this;
    me.graphName = '';
    me.subjectTags = [];
    me.description = '';
    me.onList = [];
    me.on = null;
    me.metaDataValue = null;
    me.hierarChiesSelected = '';
    me.selectedUtlization = 0;
  }


  alertMsg(msg) {
    this.dialogVisible = true;
      this.confirmation.confirm({
        key: 'aggregateDerivedMetrics',
        message: msg,
        accept: () => { this.dialogVisible = false; },
        reject: () => { this.dialogVisible = false;},
        rejectVisible:false
      });

      this.ref.detectChanges();
  }

  apply() {
    const me = this;

    if ((!this.on || this.on.length == 0)) {
        this.alertMsg("Please select atleast one level");
        return;
    }

    let isValid = this.checkValidationOnDesc();

    if(!isValid.valid) {
      this.alertMsg(isValid.errorMsg);
      return;
    }
    //me.createPayLoadForRollUp();
    this.ref.detectChanges();
    this.derivedReqPayload = this.getDerivedRequestPayload();
    me.generateDerivedResponse(this.derivedReqPayload);

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
      const me = this;

      me.derivedSubscription = me.aggregateVirtualService.loadDerivedRes(payload).subscribe(
        (state: Store.State) => {
          if (state instanceof derivedResCreatingState) {
            me.onLoadingDerivedRes(state);
            return;
          }

          if (state instanceof derivedResCreatedState) {
            me.onLoadedDerivedRes(state);
            return;
          }
        },
        (state: derivedResCreatingErrorState) => {
          me.onLoadingErrorDerivedRes(state);
        }
      );

    } catch (error) {

    }
  }

  private onLoadedDerivedRes(state: derivedResCreatedState) {
    const me = this;
    me.dataDerivedRes = state.data;
    me.populateDerivedResData(me.dataDerivedRes);
  }

  populateDerivedResData(dataToPopulate) {
    try {
      let msg = "";
      if(dataToPopulate && dataToPopulate.grpData && dataToPopulate.grpData.derivedResCtx) {
        msg = "Derived metric " + "<span class='text-highlight'>" + dataToPopulate.grpData.derivedResCtx.metricName + "</span>" + " is successfully added in group " + "<span class='text-highlight'>" + dataToPopulate.grpData.derivedResCtx.metricGName + "</span>" + " at " + "<span class='text-highlight'>" + dataToPopulate.grpData.derivedResCtx.derivedMtricPath + "</span>" + " hierarchy.";
        this.dialogVisible = true;
        this.confirmation.confirm({
          key: 'aggregateDerivedMetrics',
          message: msg,
          header: "Success",
          accept: () => {this.dialogVisible = false;
                         this.closeDialog();  },
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

  }

  private onLoadingErrorDerivedRes(state: derivedResCreatingErrorState) {
    const me = this;

  }

  closeDialog() {
    const me = this;
    me.resetAllValuesOfWindow();
    me.isVisible = false;
    this.ref.detectChanges();
  }
}
