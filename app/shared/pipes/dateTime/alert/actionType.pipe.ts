import { Pipe, PipeTransform } from '@angular/core';
import * as CONS from '../../../../pages/my-library/alert/alert-actions/service/alert-action-constants'

@Pipe({
  name: 'actionType'
})
export class ActionType implements PipeTransform {
  transform(value: number, name: string): string {
    switch (value) {
      case CONS.ACTION_TYPE.NO:
        return "No Action";
      case CONS.ACTION_TYPE.EMAIL:
        return "Email";
      case CONS.ACTION_TYPE.SMS:
        return "SMS";
      case CONS.ACTION_TYPE.SNAPSHOT:
        return "Snapshot";
      case CONS.ACTION_TYPE.SNMPTRAP:
        return "SNMP Traps";
      case CONS.ACTION_TYPE.THREAD_DUMP:
        return "Thread Dump";
      case CONS.ACTION_TYPE.HEAP_DUMP:
        return "Heap Dump";
      case CONS.ACTION_TYPE.TCP_DUMP:
        return "TCP Dump";
      case CONS.ACTION_TYPE.CPU_PROFILING:
        return "CPU Profiling";
      case CONS.ACTION_TYPE.JAVA_FLIGHT_RECORDER:
        return "Java Flight Recorder";
      case CONS.ACTION_TYPE.RUN_SCRIPT:
        return "Run Script";
      case CONS.ACTION_TYPE.SEND_TO_EXTENSION:
        {
          if (name == 'bigpanda')
            return "Big Panda";
          else if (name == 'bmcremedy')
            return "Bmc Remedy";
          else if (name == 'ciscospark')
            return "Cisco Spark";
          else if (name == 'kaizala')
            return "Microsoft Kaizala";
          else if (name == 'microsoftteams')
            return "Microsoft Teams";
          else if (name == 'pagerduty')
            return "Pager Duty";
          else if (name == 'servicenow')
            return "Service Now";
          else if (name == 'slack')
            return "Slack";
          else if (name == 'alertsender')
            return "Other Cavisson Product";
          else
            return "Send To Extension";
        }
    }
  }
}
