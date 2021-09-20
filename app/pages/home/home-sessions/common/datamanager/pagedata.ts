import { CustomMetric } from '../interfaces/custommetric';
import { HttpRequest } from '../interfaces/httprequest';
import { JSError } from '../interfaces/jserror';
import { UserDataInformation } from '../interfaces/userdatainformation';
import { UserDataRecord } from '../interfaces/userdatarecord';
import { AggregateActivityData } from '../interfaces/aggregateactivitydata';
import { UserActionData } from  '../interfaces/user-action-data';
import { ResourceTiming } from '../interfaces/resourcetiming';
import { EventInformation } from '../interfaces/eventinformation';

export class PageData {
  jsErrors: JSError[] = null;
  customMetrics: CustomMetric[] = null;
  userTimings: AggregateActivityData[] = null;
  userActivities: UserDataInformation[] = null;
  transactions: UserDataInformation[] = null;
  userActions: UserActionData[] = null;
  httpRequests: {} = null;
  resourceTimingData: {} = null;
  eventData: EventInformation[] = null;
  userTimingNonAgg : any = null; 
  constructor()
  {
    return this;
  }
}
