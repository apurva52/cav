import {Pipe, PipeTransform} from '@angular/core';  
import { PRESET } from '../../../../pages/my-library/alert/alert-maintenance/service/alert-maintenance.dummy';

@Pipe ({  
  name : 'scheduleType'  
})  
export class ScheduleType implements PipeTransform { 
  constructor(){} 
  transform(val : Number) : String {  
    if(val == 8){
    return "Custom" ;
    }
    if(val == 0){
      return PRESET[0].label;
    }
    if(val == 1){
      return PRESET[1].label;
    }
    if(val >= 2 && val <= 4){
      return PRESET[2].label;
    }
    if(val >= 5 && val <= 6){
      return PRESET[3].label;
    }
  }  
}  