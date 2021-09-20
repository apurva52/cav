import {
  Component,
  HostBinding,
  ViewEncapsulation,
  PipeTransform,
  Input,
} from '@angular/core';
import { DashboardWidgetComponent } from '../../dashboard-widget.component';
import {
  DashboardWidgetTypeDataConfig,
  ForEachGraphArgs,
} from '../../../service/dashboard.model';
import * as _ from 'lodash';
import { NumEnUsPipe } from 'src/app/shared/pipes/num-en-us/num-en-us.pipe';
import { Dec1Pipe } from 'src/app/shared/pipes/dec-1/dec-1.pipe';
import { NumEnUsDec2Pipe } from 'src/app/shared/pipes/num-en-us-dec-2/num-en-us-dec-2.pipe';
import { CurUsdSymPipe } from 'src/app/shared/pipes/cur-usd-sym/cur-usd-sym.pipe';
import { CurUsdSymDec2Pipe } from 'src/app/shared/pipes/cur-usd-sym-dec-2/cur-usd-sym-dec-2.pipe';
import { PerSymPipe } from 'src/app/shared/pipes/per-sym/per-sym.pipe';
import { PerSymDec2Pipe } from 'src/app/shared/pipes/per-sym-dec-2/per-sym-dec-2.pipe';
import { Lt00Pipe } from 'src/app/shared/pipes/lt_0_0/lt-0-0.pipe';
import { Lt0Pipe } from 'src/app/shared/pipes/lt-0/lt-0.pipe';
import { Lt1Pipe } from 'src/app/shared/pipes/lt-1/lt-1.pipe';
import { NanPipe } from 'src/app/shared/pipes/nan/nan.pipe';
import { Dec2Pipe } from 'src/app/shared/pipes/dec-2/dec-2.pipe';
import { Dec3Pipe } from 'src/app/shared/pipes/dec-3/dec-3.pipe';
import { FKpiPipe } from 'src/app/shared/pipes/f_kpi/f-kpi.pipe';
import { MenuItemUtility } from 'src/app/shared/utility/menu-item';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: DashboardWidgetComponent, useExisting: DataComponent },
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
export class DataComponent extends DashboardWidgetComponent {
  @HostBinding('class') class = 'widget-container widget-data';
  @Input() visiblityMenu : any;
  dataOptions: DashboardWidgetTypeDataConfig;
  widgetWiseTimeToolTip : string = '';
  temp: any;
  render() {
    const me = this;
    if(!me.data){
      me.empty = true;
      me.loading = false;
      if(me.widget.settings.types.data.fontColor == 'white'){
        me.widget.settings.types.data.fontColor= 'black ';
      }
       this.dataOptions = JSON.parse(
        JSON.stringify(me.widget.settings.types.data)
      );
      return;
    }
    if (
      me.empty ||
      me.data.grpData == null ||
      me.data.grpData.mFrequency == null
    ) {
      me.empty = true;
      // me.widget.settings.types.data.fontColor= "black";
      return;
    }

    const dataOptions = JSON.parse(
      JSON.stringify(me.widget.settings.types.data)
    );
    dataOptions.prefix = dataOptions.prefix;
    dataOptions.suffix = dataOptions.suffix;
    if(me.data.grpData.mFrequency.length != 0){
    if (
      me.data.grpData.mFrequency[0].data[0].lowerPanelSummary[0] === null ||
      me.data.grpData.mFrequency[0].data[0].lowerPanelSummary[0] === undefined
    ) {
      dataOptions.dataAttrName = '0';
    } else {
      if (me.widget.settings.types.data.dataAttrName == 'vectorCount' || me.widget.settings.types.data.dataAttrName == 'vector_count') {
        dataOptions.dataAttrName = String(
          me.data.grpData.mFrequency[0].data.length
        );
      } else {
        const formatter: PipeTransform = me.pipeService.getFormatter(
          dataOptions.decimalFormat
        );
        if (formatter) {
          dataOptions.dataAttrName = formatter.transform(
            _.get(
              me.data.grpData.mFrequency[0].data[0].lowerPanelSummary[0],
              me.widget.settings.types.data.dataAttrName,
              null
            )
          );
        } else {
          dataOptions.dataAttrName = '0';
        }
      }
    }
  }
  else{
    dataOptions.dataAttrName = '0';
  }
    if(typeof(dataOptions.dataAttrName) == "string"){
      dataOptions.dataAttrName = dataOptions.dataAttrName.toString();
    }
    this.dataOptions = dataOptions;
    if(me.data.grpData.mFrequency[0].data.length>0 && me.data.grpData.mFrequency[0].data[0].measure != null)
    {
    this.widget.name == null;
    this.widget.name = me.data.grpData.mFrequency[0].data[0].measure.metric +"->"+ me.data.grpData.mFrequency[0].data[0].subject.tags[0].sName;
    }
    this.temp=dataOptions.dataAttrName;
    if(this.dataOptions.dataAttrName >= "100" || !(this.temp>Math.floor(this.temp))){ 
      this.dataOptions.dataAttrName = String(this.dataOptions.dataAttrName).split(".")[0];
    }else if(this.dataOptions.dataAttrName >= "1"){
      this.dataOptions.dataAttrName=(+this.dataOptions.dataAttrName).toFixed(2);
   }
   if(!isNaN(Number(this.dataOptions.dataAttrName))){
   this.dataOptions.dataAttrName= Number(this.dataOptions.dataAttrName).toLocaleString("en-IN");
   }
   else{
    this.dataOptions.dataAttrName= this.dataOptions.dataAttrName;
   }

    if(me.widget.widgetWiseInfo){
      let timePreset = JSON.parse(sessionStorage.getItem('timePresets'))['timePeriod'];
      let selectedTimePreset = MenuItemUtility.searchById(me.widget.widgetWiseInfo.duration.preset, timePreset);
        me.widgetWiseTimeToolTip = `
        'Widget wise time is applied'
        ${selectedTimePreset.label}
       `;
        }

        if(me.widget.settings.types.data.dataWidgetSeverityDefDTO){
          me.getDataAccToThreshold();
        }
  }

  getDataAccToThreshold(){
    const me = this;
     /* data widget settongs for color critical/green*/
     let dataWidgetSeverityDef = me.widget.settings.types.data.dataWidgetSeverityDefDTO;
     if(dataWidgetSeverityDef !=null){

       let criticalOperator = dataWidgetSeverityDef.criticalMSRString;
       let criticalRange = dataWidgetSeverityDef.criticalValue;
     
      let majorOperator = dataWidgetSeverityDef.majorMSRString;
       let majorRange =dataWidgetSeverityDef.majorValue;
       let graphData : any;
       if(typeof (me.dataOptions.dataAttrName) == "string"){
        if(me.dataOptions.dataAttrName.includes(",")){
          graphData = parseInt(me.dataOptions.dataAttrName.replace(/,/g, ''));
        }
        else if(me.dataOptions.dataAttrName.includes(".")){
          graphData = parseFloat(me.dataOptions.dataAttrName);
        }
        else{
          graphData =  parseInt(me.dataOptions.dataAttrName);  
        }
  
      }
      else{
        graphData = me.dataOptions.dataAttrName;
      }

     if((criticalOperator == ">" || criticalOperator == ">=") && (majorOperator == ">" || majorOperator == ">=") ){
     
     if(criticalRange == majorRange && criticalRange <= graphData)
     {
       dataWidgetSeverityDef.severityColor = "#d60f02";
     }
     else if(graphData >= criticalRange && criticalOperator == ">="){
       dataWidgetSeverityDef.severityColor = "#d60f02";
     }
     else if(graphData > criticalRange){
       dataWidgetSeverityDef.severityColor = "#d60f02";
     }
     else if((criticalRange > graphData && majorRange == graphData) && majorOperator == ">"){
       dataWidgetSeverityDef.severityColor = "transparent";
     }
 
     else if((majorRange <= graphData) && (graphData <= criticalRange) ){
         dataWidgetSeverityDef.severityColor = "#ff6c00";
       }
       
     else{
         dataWidgetSeverityDef.severityColor = "transparent";
       }
     } 
     
     else if((criticalOperator == "<" || criticalOperator == "<=") && (majorOperator == "<" || majorOperator == "<=")){
     
       if(criticalRange == majorRange && graphData <= majorRange)
     {
       dataWidgetSeverityDef.severityColor = "#d60f02";
     }
     else if(graphData <= criticalRange && criticalOperator == "<="){
       dataWidgetSeverityDef.severityColor = "#d60f02";
     }
     else if(graphData < criticalRange){
       dataWidgetSeverityDef.severityColor = "#d60f02";
     }
 
     else if((criticalRange <= graphData) && (graphData <= majorRange)){
         dataWidgetSeverityDef.severityColor = "#ff6c00";
       }
       
     else{
         dataWidgetSeverityDef.severityColor = "transparent";
       }
    
      }
     else if((criticalOperator == ">" || criticalOperator == ">=") && (majorOperator == "Select operator") ){
       if(graphData == criticalRange && criticalOperator == ">="){
         dataWidgetSeverityDef.severityColor = "#d60f02";
       }
       else if(graphData > criticalRange && criticalOperator == ">"){
         dataWidgetSeverityDef.severityColor = "#d60f02";
       }
       else{
         dataWidgetSeverityDef.severityColor = "transparent";
       }
     }

     else if((criticalOperator == "<" || criticalOperator == "<=") && (majorOperator == "Select operator") ){
       if(graphData == criticalRange && criticalOperator == "<="){
         dataWidgetSeverityDef.severityColor = "#d60f02";
       }
       else if(graphData < criticalRange && criticalOperator == "<"){
         dataWidgetSeverityDef.severityColor = "#d60f02";
       }
       else{
         dataWidgetSeverityDef.severityColor = "transparent";
       }
     }

     else if((majorOperator == "<" || majorOperator == "<=") && (criticalOperator == "Select operator") ){
       if(graphData == majorRange && majorOperator == "<=" ){
         dataWidgetSeverityDef.severityColor = "#ff6c00";
       }
       else if(graphData < majorRange && majorOperator == "<"){
         dataWidgetSeverityDef.severityColor = "#ff6c00";
       }
       else{
         dataWidgetSeverityDef.severityColor = "transparent";
       }
     }
     else if((majorOperator == ">" || majorOperator == ">=") && (criticalOperator == "Select operator") ){
       if(graphData == majorRange && majorOperator == ">="){
         dataWidgetSeverityDef.severityColor = "#ff6c00";
       }
       else if(graphData > majorRange && majorOperator == ">"){
         dataWidgetSeverityDef.severityColor = "#ff6c00";
       }
       else{
         dataWidgetSeverityDef.severityColor = "transparent";
       }
     }
   }
   me.widget.settings.types.data.dataWidgetSeverityDefDTO = dataWidgetSeverityDef;

  }   

}
