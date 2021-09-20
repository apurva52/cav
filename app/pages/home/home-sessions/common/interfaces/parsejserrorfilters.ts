import { Metadata } from './metadata';
import { JsErrorFilter } from './jserrorfilters';
import { ViewFilter } from './viewfilter';
import { Util } from '../util/util';
import { CustomAttributeFilter } from './customattributefilter';
import { CustomData } from './customdata';
import { BPData } from './bpdata';
import { StoreAttribute } from './storeattribute';
//import { MsgService } from '../services/msg.service';
import { nvEncoder} from './nvencode';
//import { SessionfiltercriteriaComponent } from './../components/sessions/sessionfiltercriteria/sessionfiltercriteria.component';
export class ParseJsErrorFilters {

   static jserrorFilters = new JsErrorFilter();

  constructor()
  {
   // this.filter =  new HttpFilter();
   // this.customFilter = new CustomAttributeFilter();
   // this.filterCriteriaList = [];
  }
}
