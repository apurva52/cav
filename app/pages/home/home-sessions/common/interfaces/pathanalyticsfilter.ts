import { Filter } from './filter';
import { TimeFilter } from './/timefilter';
import { PathAnalytics } from './pathanalytics';
import { SessionAttribute } from './../../transaction-filter/transactionattribute/sessionattribute';
import { StoreFilter } from './../../transaction-filter/transactionattribute/storefilter';
import { PathAnalyticsAttributeFilter } from './../../path-analytics/pathanalyticsattribute/pathanalyticsattribute';


export class PathAnalyticsFilter {

timeFilter: TimeFilter;
sessionattribute: SessionAttribute;
storefilter: StoreFilter;
pathanalyticsattribute: PathAnalyticsAttributeFilter;

count = false;
limit= 15;
offset = 0;

static pathAnalyticsFilter = new PathAnalytics();

constructor()
  {
    this.timeFilter = new TimeFilter();
    this.storefilter = new StoreFilter();
    this.sessionattribute = new SessionAttribute();
    this.pathanalyticsattribute = new PathAnalyticsAttributeFilter();
  }

static resetSmartFilters()
  {
    let tFilter=PathAnalyticsFilter.pathAnalyticsFilter;
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

