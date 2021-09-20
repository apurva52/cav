import { Metadata } from './metadata';
import { HttpFilter } from './httpfilters';
import { ViewFilter } from './viewfilter';
import { Util } from '../util/util';
import { CustomAttributeFilter } from './customattributefilter';
import { CustomData } from './customdata';
import { BPData } from './bpdata';
import { StoreAttribute } from './storeattribute';
//import { MsgService } from '../services/msg.service';
import { nvEncoder} from './nvencode';
//import { SessionfiltercriteriaComponent } from './../components/sessions/sessionfiltercriteria/sessionfiltercriteria.component';
export class ParseHttpFilters {

   static httpFilters = new HttpFilter();

  constructor()
  {
   // this.filter =  new HttpFilter();
   // this.customFilter = new CustomAttributeFilter();
   // this.filterCriteriaList = [];
  }
}
