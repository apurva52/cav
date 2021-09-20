import {Pipe, PipeTransform} from '@angular/core';  
import * as CONS from '../../../../pages/my-library/alert/alert-actions/service/alert-action-constants'

@Pipe ({  
  name : 'actionStyle'  
})  
export class ActionStyle implements PipeTransform {  
  transform(value: number, name: string) : string{
    switch (value) {
      case CONS.ACTION_TYPE.NO:
        return "icons8-send-email";
      case CONS.ACTION_TYPE.EMAIL:
        return "icons8-send-email";
      case CONS.ACTION_TYPE.SMS:
        return "icons8-sms-2";
      case CONS.ACTION_TYPE.SNAPSHOT:
        return "icons8-send-email";
      case CONS.ACTION_TYPE.SNMPTRAP:
        return "icons8-send-email";
      case CONS.ACTION_TYPE.THREAD_DUMP:
        return "icons8-send-email";
      case CONS.ACTION_TYPE.HEAP_DUMP:
        return "icons8-compost-heap";
      case CONS.ACTION_TYPE.TCP_DUMP:
        return "icons8-send-email";
      case CONS.ACTION_TYPE.CPU_PROFILING:
        return "icons8-send-email";
      case CONS.ACTION_TYPE.JAVA_FLIGHT_RECORDER:
        return "icons8-java-2";
      case CONS.ACTION_TYPE.RUN_SCRIPT:
        return "icons8-run-command";
      case CONS.ACTION_TYPE.SEND_TO_EXTENSION:
        {
          if (name == 'bigpanda')
            return "icons8-kiss-panda";
          else if (name == 'bmcremedy')
            return "icons8-kiss-panda";
          else if (name == 'ciscospark')
            return "Cisco Spark";
          else if (name == 'kaizala')
            return "icons8-microsoft-kaizala";
          else if (name == 'microsoftteams')
            return "icons8-microsoft-teams";
          else if (name == 'pagerduty')
            return "icons8-kiss-panda";
          else if (name == 'servicenow')
            return "icons8-kiss-panda";
          else if (name == 'slack')
            return "icons8-slack-new";
          else if (name == 'alertsender')
            return "icons8-kiss-panda";
          else
            return "icons8-kiss-panda";
        }
    } 
  }  
}  