import { Component, OnInit,Input, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { TierStatusDataHandlerService } from '../../../../services/tier-status-data-handler.service';


@Component({
  selector: 'app-action-node',
  templateUrl: './action-node.component.html',
  styleUrls: ['./action-node.component.css']
})
export class ActionNodeComponent implements OnInit {
  tooltipObj:any = {};
  showTransactionDialog: boolean = false;
  @ViewChild('overlay') overView: ElementRef;
  @ViewChild('ctrlMenu') dropDown: any;
  @Input('obj') obj;

  items2:any = [];
  tableArr:any= [];
  pointer: any = "default"

  // for ND outer circle
  dashoffsetMajor = 0;
  dashoffsetNormal = 0
  dashoffsetCritical = 0

  //non ND inner circle
  dashoffsetSC = 0;
  dashoffsetSN = 0;
  dashoffsetSM = 0;

  flowMapMode:any;


  //NON ND circle
  // dashoffsetNonNDMajor = 0;
  // dashoffsetNonNDCritical = 0;
  // dashoffsetNonNDNormal = 0;
  // greenNonNDOffset = 0;
 
  //NON ND x and y
   circleAttrY: any = {
    pvs_image_y:20,
    pvs_text_y:25,
    res_image_y:35,
    res_text_y:40,
    cpu_image_y: 50,
    cpu_text_y:55
   };
 

  constructor(public _handlerService: TierStatusDataHandlerService, private renderer: Renderer2) { }
  @ViewChild('tooltip') tooltipEl: ElementRef;
  // @ViewChild('tooltip') tooltipEl:ElementRef;
  ngOnInit() {
    //minimize gap if either of tps, res and cpu is -ve
    this.setAttributeY();
 

 // Round off CPU value
    this.obj.cpu = Math.round(this.obj.cpu);

    //To construct the colorful circle
    this.constructCircle();
    this.items2 = [
      {
          label: 'Next',
          icon: 'fa fa-fw fa-chevron-right'
      },
      {
          label: 'Prev',
          icon: 'fa fa-fw fa-chevron-left'
      }
  ];

  this.flowMapMode = this._handlerService.commonTierHandler.flowMapMode;
  }


constructCircle() {
    /** FOR ND OUTER CIRCLE */
  // Cirumference = 2*PI*r : r =45. Circumferene = 226.28
    let outerCircum = 226.28;
    //Getting the values of business health to be shown in circle circumference
    if (this.obj.tooltip.TransactionScorecard != undefined) {
      this.dashoffsetCritical = ((100 - ((+this.obj.tooltip.TransactionScorecard.Errors.percentage) + (+this.obj.tooltip.TransactionScorecard.VerySlow.percentage))) / 100) * outerCircum;
      this.dashoffsetMajor = ((100 - ((+this.obj.tooltip.TransactionScorecard.Errors.percentage) + (+this.obj.tooltip.TransactionScorecard.Slow.percentage) + (+this.obj.tooltip.TransactionScorecard.VerySlow.percentage))) / 100) * outerCircum;
    }
    /** FOR ND INNER CIRCLE */
    let innerCircum = 176;
    //Getting the values of Server health to be shown in circle circumference
     
   if(this.obj.tooltip.servers>0){
      this.dashoffsetSC = ((100 - ((this.obj.tooltip.serverColorPct.critical/ this.obj.tooltip.servers)*100)) / 100) * innerCircum;
      this.dashoffsetSM = innerCircum * ((100 - (((this.obj.tooltip.serverColorPct.critical/ this.obj.tooltip.servers)*100)) + ((this.obj.tooltip.serverColorPct.major/ this.obj.tooltip.servers)*100)) / 100);
    }
    else{
      this.dashoffsetSC = 176;
      this.dashoffsetSM = 176;
    }
    


     /** FOR NON ND Circle */
    // if (this.obj.tooltip.eventAlerts.critical == 0 && this.obj.tooltip.eventAlerts.major == 0 && this.obj.tooltip.eventAlerts.normal == 0) {
    //   this.dashoffsetNonNDMajor = innerCircum;
    //   this.dashoffsetNonNDCritical = innerCircum;
    //   this.dashoffsetNonNDNormal = innerCircum;
    // }
    // else {
    //   let sum = this.obj.tooltip.eventAlerts.critical + this.obj.tooltip.eventAlerts.major + this.obj.tooltip.eventAlerts.normal;
    //   this.dashoffsetNonNDCritical = (1 - (this.obj.tooltip.eventAlerts.critical / sum)) * innerCircum;
    //   this.dashoffsetNonNDMajor = (1 - (this.obj.tooltip.eventAlerts.critical + this.obj.tooltip.eventAlerts.major) / sum ) * innerCircum;
    //   this.greenNonNDOffset = innerCircum
    // }
  }

 onRightClick(data, $event) {
    console.log('right-click action !');
    console.log(data);
    console.log('this obj');
    console.log(this.obj);
    let flowmapmode = this._handlerService.commonTierHandler.flowMapMode;
    
    let msg = {};
    msg['obj'] = data;
    msg['event'] = $event;
    //instance
    if((this.obj.entity == 2) || (this.obj.entity == 0 && (flowmapmode == "2"))){
      msg['msg'] = 'OUTPUT_NODE_RIGHT_CLICK';
    }
    else{
      msg['msg'] = 'ACTION_NODE_RIGHT_CLICK';
    }
    this._handlerService.onRightClickEvent(msg);
    // $event.stopPropagation();
    //  this.overView.show($event);
    // this.dropDown.show($event)
  }

  openTopTransaction(obj, event) {
    console.log('openTopTransaction  called ', obj, event);
    event.path[3].style.zIndex = this._handlerService.$globalZIndex; // setting CSS property z-index of the currently selected node to show it on top
    let msg = {};
    let param = {};
    if(obj.entity != 1){
	 this.pointer = "pointer"
   	 msg['obj'] = obj;
   	 msg['event'] = event;
    	msg['msg'] = 'OPEN_ACTION_OVERLAY';
    	this._handlerService.onRightClickEvent(msg);
    }
  }

  

  //method to show tooltip on the basis of mouse position and #tooltip id from 
  showToolTip(event,divType,val){
    this._handlerService.$tooltipObject = {renderer: this.renderer, nativeElement: this.tooltipEl.nativeElement}
    this.tooltipObj = {...{}};
    switch (divType) {
      case 'Business': {
        let tierObj = val.TransactionScorecard;
        if (this.obj.tooltip.TransactionScorecard != undefined) {
        this.tooltipObj = this.getToolTipData(tierObj, 1, divType);
        this.tooltipObj['divType'] = divType;
        }
      }
        break;
      case 'Server': {
        let tierObj = val.serverColorPct;
        this.tooltipObj = this.getToolTipData(tierObj, val.servers, divType);
        this.tooltipObj['divType'] = divType;
        this.tooltipObj['total'] = val.servers;
      }
        break;
      case 'Instance': {
        console.log("instance switch case starts");
        let tierObj = val.instanceColorPct;
        this.tooltipObj = this.getToolTipData(tierObj, val.servers, divType);
        this.tooltipObj['divType'] = divType;
        this.tooltipObj['total'] = val.servers;
        console.log("instance switch case Ends");
      }
        break;
     
    case 'Alerts': {
        let tierObj = val.eventAlerts;
        this.tooltipObj = this.getToolTipData(tierObj, 0 , divType);
        this.tooltipObj['divType'] = divType;         
      }
       break;
}

    // console.log(this.tooltipEl);
    
    // this.renderer.addClass(this.tooltipEl.nativeElement,'ts-tooltip');
    this.renderer.setStyle(this.tooltipEl.nativeElement, 'display', 'block')    
    this.renderer.setStyle(this.tooltipEl.nativeElement, 'top', (event.pageY + 20)+'px' )
    this.renderer.setStyle(this.tooltipEl.nativeElement,'left',(event.pageX )+'px');
  }
  
  //Method to make data for tooltip based on name
  getToolTipData(instancecolorpct, totalServers, divType) {
    var instancecolorpctObj = {};
   if(divType === 'Server' || divType === 'Instance'){
      if (totalServers > 0) {
        instancecolorpctObj['major'] = Math.round((instancecolorpct.major / totalServers) * 100) + Math.round((instancecolorpct.normal / totalServers) * 100);
        instancecolorpctObj['critical'] = Math.round((instancecolorpct.critical / totalServers) * 100);
        instancecolorpctObj['normal'] = 100 - ((instancecolorpctObj['critical']) + (instancecolorpctObj['major']));
      }
      else {
        instancecolorpctObj['normal'] = 100;
        instancecolorpctObj['major'] = 0;
        instancecolorpctObj['critical'] = 0;
      }
    }
    else if(divType== 'Business' ){
      if (totalServers > 0) {
      	instancecolorpctObj['major'] = Math.round( instancecolorpct.Slow.percentage ) ;
        instancecolorpctObj['critical'] = Math.round(instancecolorpct.Errors.percentage) +  Math.round(instancecolorpct.VerySlow.percentage);
        instancecolorpctObj['normal'] = Math.round(instancecolorpct.Normal.percentage);
	}
      else {
        instancecolorpctObj['normal'] = 100;
        instancecolorpctObj['major'] = 0;
        instancecolorpctObj['critical'] = 0;
      }
    }

	//divType = Alerts
    else{
        instancecolorpctObj['major'] = instancecolorpct.major;
        instancecolorpctObj['critical'] = instancecolorpct.critical;
        instancecolorpctObj['minor'] = instancecolorpct.normal;
    }
  return instancecolorpctObj;
  }

  hideToolTip(event){
    this.renderer.setStyle(this.tooltipEl.nativeElement, 'display', 'none');
    this._handlerService.clearTooltipObjects()
  }

  generateTitle(nodeObject: any) {
    if (nodeObject.tsc) {
       if(nodeObject.tsc.Normal){// workaround for 104036
        return `
                 TPS = ${nodeObject.pvs < 0? '-':nodeObject.pvs}, count = ${nodeObject.count < 0? '-':nodeObject.count}\n 
      Normal = ${nodeObject.tsc.Normal.percentage < 0? '-':nodeObject.tsc.Normal.percentage}%, count =${nodeObject.tsc.Normal.data < 0? '-':nodeObject.tsc.Normal.data}\n 
      Slow = ${nodeObject.tsc.Slow.percentage < 0? '-':nodeObject.tsc.Slow.percentage} %, count =${nodeObject.tsc.Slow.data < 0? '-':nodeObject.tsc.Slow.data}\n 
      VerySlow = ${nodeObject.tsc.VerySlow.percentage < 0? '-':nodeObject.tsc.VerySlow.percentage}%, count = ${nodeObject.tsc.VerySlow.data < 0? '-':nodeObject.tsc.VerySlow.data}\n 
      Errors = ${nodeObject.tsc.Errors.percentage < 0? '-':nodeObject.tsc.Errors.percentage}%, count=${nodeObject.tsc.Errors.data < 0? '-':nodeObject.tsc.Errors.data}
            `
      }
      else if(nodeObject.tsc.normal){
        return `
                 TPS = ${nodeObject.pvs < 0? '-':nodeObject.pvs}, count = ${nodeObject.count < 0? '-':nodeObject.count}\n 
      Normal = ${nodeObject.tsc.normal.percentage < 0? '-':nodeObject.tsc.normal.percentage}%, count =${nodeObject.tsc.normal.data < 0? '-':nodeObject.tsc.normal.data}\n 
      Slow = ${nodeObject.tsc.slow.percentage < 0? '-':nodeObject.tsc.slow.percentage} %, count =${nodeObject.tsc.slow.data < 0? '-':nodeObject.tsc.slow.data}\n 
      VerySlow = ${nodeObject.tsc.verySlow.percentage < 0? '-':nodeObject.tsc.verySlow.percentage}%, count = ${nodeObject.tsc.verySlow.data < 0? '-':nodeObject.tsc.verySlow.data}\n 
      Errors = ${nodeObject.tsc.errors.percentage < 0? '-':nodeObject.tsc.errors.percentage}%, count=${nodeObject.tsc.errors.data < 0? '-':nodeObject.tsc.errors.data}
            `
      }
      else
      return `TPS = ${nodeObject.pvs < 0? '-':nodeObject.pvs}, Count = ${nodeObject.count < 0? '-':nodeObject.count}`
      
    } else {
      return `TPS = ${nodeObject.pvs < 0? '-':nodeObject.pvs}, Count = ${nodeObject.count < 0? '-':nodeObject.count}`
    }
  }

  /**
   * 
   * @param val Value to be formatted
   * @returns {String} 
   */
  convertRomanFormat(val: any): string {
    return val > 999?(val/1000).toFixed(1) + "k":val;
  }

  setAttributeY(){
    if(this.obj.pvs < 0 && this.obj.res < 0){
      this.circleAttrY.cpu_image_y = 35;
      this.circleAttrY.cpu_text_y = 40;
    }
    else if(this.obj.pvs < 0 && this.obj.cpu < 0){
      this.circleAttrY.res_image_y = 35;
      this.circleAttrY.res_text_y = 40;
    }
    else if(this.obj.cpu < 0 && this.obj.res < 0){
      this.circleAttrY.pvs_image_y = 35;
      this.circleAttrY.pvs_text_y = 40;
    }
    else if(this.obj.pvs < 0){
      this.circleAttrY.res_image_y = 25;
      this.circleAttrY.res_text_y = 30;
      this.circleAttrY.cpu_image_y = 45;
      this.circleAttrY.cpu_text_y = 50;
    }
    else if(this.obj.res < 0){
      this.circleAttrY.pvs_image_y = 25;
      this.circleAttrY.pvs_text_y = 30;
      this.circleAttrY.cpu_image_y = 45;
      this.circleAttrY.cpu_text_y = 50;
    }
    else if(this.obj.cpu < 0){
      this.circleAttrY.pvs_image_y = 25;
      this.circleAttrY.pvs_text_y = 30;
      this.circleAttrY.res_image_y = 45;
      this.circleAttrY.res_text_y = 50;
    }
  }

}
