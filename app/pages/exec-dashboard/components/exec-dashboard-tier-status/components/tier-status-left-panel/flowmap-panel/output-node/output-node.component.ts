import { Component, OnInit, Input,  ElementRef, Renderer2, ViewChild  } from '@angular/core';
import { TierStatusDataHandlerService } from '../../../../services/tier-status-data-handler.service';
import { CRITICAL} from '../../../../const/url-const';


@Component({
  selector: 'app-output-node',
  templateUrl: './output-node.component.html',
  styleUrls: ['./output-node.component.css']
})
export class OutputNodeComponent implements OnInit {
  @Input('obj')obj;
  @ViewChild('tooltip') tooltipEl: ElementRef;

  dashoffsetCritical = 0;
  dashoffsetMajor = 0;
  dashoffsetMinor = 0;

  tooltipObj:any = {};
  
  constructor(public _handlerService: TierStatusDataHandlerService, private renderer: Renderer2) { }

  ngOnInit() {

    let innerCircum = 113.14;
    let sum = this.obj.tooltip.eventAlerts.critical + this.obj.tooltip.eventAlerts.major + this.obj.tooltip.eventAlerts.normal;
    if(this.obj.border == CRITICAL){
      this.dashoffsetMajor = innerCircum
      this.dashoffsetMinor = innerCircum
    }
    else if (this.obj.tooltip.eventAlerts.critical == 0 && this.obj.tooltip.eventAlerts.major == 0 && this.obj.tooltip.eventAlerts.normal == 0) {
      this.dashoffsetCritical = innerCircum
      this.dashoffsetMajor = innerCircum
      this.dashoffsetMinor = innerCircum
    }
    else{
      this.dashoffsetCritical = (1 - (this.obj.tooltip.eventAlerts.critical / sum)) * innerCircum;
      this.dashoffsetMajor = (1 - (this.obj.tooltip.eventAlerts.critical + this.obj.tooltip.eventAlerts.major) / sum ) * innerCircum;
    }

  }

  onRightClick(data, $event) {
    // alert('right-click output !');
    console.log('rightclick output performed---')
    console.log(data)
    console.log('this object')
    console.log(this.obj)
    let msg = {};

    let flowmapmode = this._handlerService.commonTierHandler.flowMapMode;

    msg['obj'] = data;
    msg['event'] = $event;
    msg['msg'] = 'OUTPUT_NODE_RIGHT_CLICK';

    //To open 'Call details' dialog on 'Drilldown' for Instance's IP
    if(this.obj.entity == 2 && flowmapmode == "2"){
      msg['isInstanceLevel'] = true;
    }
    this._handlerService.onRightClickEvent(msg);
  }

    //method to show tooltip on the basis of mouse position and #tooltip id from 
    showToolTip(event,val){
      this._handlerService.$tooltipObject = {renderer: this.renderer, nativeElement: this.tooltipEl.nativeElement}
      this.tooltipObj = {...{}};

          let tierObj = val.eventAlerts;
          this.tooltipObj = this.getToolTipData(tierObj);        
  
      // console.log(this.tooltipEl);
      
      // this.renderer.addClass(this.tooltipEl.nativeElement,'ts-tooltip');
      this.renderer.setStyle(this.tooltipEl.nativeElement, 'display', 'block')    
      this.renderer.setStyle(this.tooltipEl.nativeElement, 'top', (event.pageY + 20)+'px' )
      this.renderer.setStyle(this.tooltipEl.nativeElement,'left',(event.pageX )+'px');
      console.log('this.tooltipObj', this.tooltipObj);
      
    }

      //Method to make data for tooltip based on name
  getToolTipData(instancecolorpct) {
    var instancecolorpctObj = {};
        instancecolorpctObj['major'] = instancecolorpct.major;
        instancecolorpctObj['critical'] = instancecolorpct.critical;
        instancecolorpctObj['minor'] = instancecolorpct.normal;
  return instancecolorpctObj;
  }

    
  hideToolTip(event){
    this.renderer.setStyle(this.tooltipEl.nativeElement, 'display', 'none');
    this._handlerService.clearTooltipObjects()
  }

}
