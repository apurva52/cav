import { CustomMetric } from '../interfaces/custommetric';
import { PageInformation } from '../interfaces/pageinformation';
import { PageData } from './pagedata';
export class SessionData {
  pageInformation: PageInformation[] = null;
  pageDetails: Map<number,PageData> = null;
  customMetrics: CustomMetric[] = null;
  visited:boolean;
  lastViewed : boolean; 

 
  constructor()
  {
    this.pageInformation = null;
    this.pageDetails = new Map<number,PageData>();
    this.customMetrics = null;
    this.visited = false;
    this.lastViewed = false;
    return this;
  }
}
