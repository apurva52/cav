import { XHR } from './xhr';
import { AutoTransaction } from './autotransaction';
import { JSError } from './jserrorconfig';
import { EventTab } from './eventTab';
import { NaviData } from './navitab';
export class PageTab {
  // TODO : change property cases and types once done in server side.
  // TODO : bp filter
  
  xhrdata: XHR;
  jserrorflag :JSError 
  transactiondata: AutoTransaction;
  eventdata: EventTab;
  navigationflag : NaviData;
  constructor()
  {
    this.jserrorflag = new JSError();
    this.xhrdata = new XHR();
    this.transactiondata = new AutoTransaction();
    this.eventdata = new EventTab();
    this.navigationflag = new NaviData();
  }

}

