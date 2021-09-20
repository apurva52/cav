import { Filter } from './filter';
import { TimeFilter } from './/timefilter';
import { Transactions } from './transactions';
import { SessionAttribute } from './../../transaction-filter/transactionattribute/sessionattribute';
import { StoreFilter } from './../../transaction-filter/transactionattribute/storefilter';
import { TransactionAttributeFilter } from './../../transaction-filter/transactionattribute/transactionattribute';


export class TransactionFilter {

timeFilter: TimeFilter;
sessionattribute: SessionAttribute;
storefilter: StoreFilter;
transactionattribute: TransactionAttributeFilter;

count = false;
limit= 15;
offset = 0;

static transactionFilter = new Transactions();

constructor()
  {
    this.timeFilter = new TimeFilter();
    this.storefilter = new StoreFilter();
    this.sessionattribute = new SessionAttribute();
    this.transactionattribute = new TransactionAttributeFilter();
  }

static resetSmartFilters()
  {
    let tFilter=TransactionFilter.transactionFilter;
    tFilter.devices = null;
    tFilter.browsers = null;
    tFilter.locations = null;
    tFilter.channels = null;
    tFilter.pages = null;
    tFilter.stores = null;
    tFilter.terminals = null;
    tFilter.associate = null;

  }


}

