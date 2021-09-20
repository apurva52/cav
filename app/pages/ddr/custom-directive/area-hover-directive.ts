import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import * as moment from 'moment';
import 'moment-timezone';
// import { Text } from '@angular/compiler';
import * as jQuery from 'jquery';

@Directive({
    selector: '[areaDirective]'
})

export class MyAreaDirective{
    @Input('areaDirective') tooltipText: string;
    @Input() startTime : string;
    @Input('id') id : string;
    @Input() agent : string;
    
    constructor(private el: ElementRef) {}

    @HostListener('mouseenter') onmouseenter(){
        this.getToolTip(this.tooltipText);
    }

    getToolTip(value:string)
    {
        console.log('agent in area directive', this.agent);
        let ext = this.agent && this.agent == "php" ? ".php" : ".java";
        let callOutType;
        let callOutCount;
        let backendName;
        let sourceMethod;
        let toolTipMessage;

        if(value.indexOf('%%%') != -1)
        {
            console.log("callOut case");
            let arr = value.split('%%%');
            callOutType = arr[0];
            sourceMethod = arr[1];

            if(callOutType.startsWith('DB Error'))
            {
                backendName = arr[4];
                callOutCount = 1;
            }
            else if(callOutType.startsWith('DB'))
            {
                backendName = arr[3];
                callOutCount = arr[4].split(',').length;
            }
            else if(callOutType.startsWith('Error'))
            {
                backendName = arr[4];
                callOutCount = 1;
            }
            else if(callOutType.startsWith('JMS'))
            {
                backendName = arr[3];
                callOutCount = '';
            }
            else if(callOutType.startsWith('Tier') || callOutType.startsWith('Thread'))
            {
                backendName = arr[4];
                callOutCount = 1;
            }
            else if(callOutType.startsWith('Exception'))
            {
             //do nothing
	    }
            else 
            {
                backendName = arr[4];
                callOutCount = 1;
            }
              if(!callOutType.startsWith('Exception'))
            toolTipMessage = callOutType + " CallOut , Source: " + sourceMethod;
              else
               toolTipMessage = callOutType + " , Source: " + sourceMethod;


            if (backendName != undefined && backendName != "" && Number(callOutCount) == 1)
                toolTipMessage += ", Integration Point: " + backendName;
        
            if (Number(callOutCount) > 1)
                toolTipMessage += ", Count: " + callOutCount + " times";
            
            
        }
        else
        {
            let arrTemp = [];
            let arrTemp1 = [];
            let wallTime = '0';
            let relTimeStamp = '';
            let timeStamp;

            // console.log(" non callOut case & startTime = " , this.startTime);
            toolTipMessage = value;
            arrTemp = value.split(',');
            arrTemp1 = arrTemp[0].split('.');
            if (arrTemp[1] != undefined) {
                wallTime = arrTemp[1];
                if (!isNaN(arrTemp[1]))
                  wallTime = Number(arrTemp[1]).toLocaleString();
            }
            
            if (arrTemp1.length > 3) {
                if (arrTemp[0].indexOf('(') != -1) {
                  let method = arrTemp[0].substring(arrTemp[0].lastIndexOf('.') + 1, arrTemp[0].length);
                  let PkgClsStr = arrTemp[0].substring(0, arrTemp[0].lastIndexOf('.'));
                  let cls = PkgClsStr.substring(PkgClsStr.lastIndexOf('.') + 1, PkgClsStr.length);
                  let pkg = PkgClsStr.substring(0, PkgClsStr.lastIndexOf('.'));
          
                  if (arrTemp[2] != undefined) {
                    timeStamp = Number(this.startTime) + Number(arrTemp[2]);
                    relTimeStamp = moment.tz(timeStamp, decodeURIComponent(sessionStorage.getItem('timeZoneId'))).format("MM/DD/YY HH:mm:ss.SSS");
                    toolTipMessage = 'Package: ' + pkg + ', Class: ' + cls + ', Method: ' + method + ', WallTime: ' + wallTime + ', StartTime: ' + relTimeStamp;
                  }
                  else {
                    toolTipMessage = 'Package: ' + pkg + ', Class: ' + cls + ', Method: ' + method + ', WallTime: ' + wallTime;
                  }
                }
                else {
                  if (arrTemp[2] != undefined) {
                     
                    timeStamp = Number(this.startTime) + Number(arrTemp[2]);
                    relTimeStamp = moment.tz(timeStamp, decodeURIComponent(sessionStorage.getItem('timeZoneId'))).format("MM/DD/YY HH:mm:ss.SSS");
                    toolTipMessage = 'Package: ' + value + ', StartTime: ' + relTimeStamp;
                  }
                  else {
                    toolTipMessage = 'Package: ' + value;
                  }
                }
              }
              else if (arrTemp1.length == 3) {
                if (arrTemp[2] != undefined) {
                  timeStamp = Number(this.startTime) + Number(arrTemp[2]);
                  relTimeStamp = moment.tz(timeStamp, decodeURIComponent(sessionStorage.getItem('timeZoneId'))).format("MM/DD/YY HH:mm:ss.SSS");
                  toolTipMessage = 'Package: ' + value + ', StartTime: ' + relTimeStamp;
                }
                else {
                  toolTipMessage = 'Package: ' + value;
                }
              }
              else {
                if (arrTemp[2] != undefined) {
                  timeStamp = Number(this.startTime) + Number(arrTemp[2]);
                  relTimeStamp = moment.tz(timeStamp, decodeURIComponent(sessionStorage.getItem('timeZoneId'))).format("MM/DD/YY HH:mm:ss.SSS");
                  toolTipMessage = 'Class: ' + value + `${ext}, StartTime: ` + relTimeStamp;
                }
                else {
                  toolTipMessage = 'Class: ' + value + ext;
                }
              }
        }
        this.el.nativeElement.setAttribute('title',toolTipMessage);
    }
}
