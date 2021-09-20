import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HomeSessionsLoadingState, HomeSessionsLoadedState, HomeSessionsLoadingErrorState } from './home-sessions.state';
import { SessionFilter } from '../common/interfaces/sessionfilter';
import { Util } from '../common/util/util';
import { Metadata } from '../common/interfaces/metadata';
import { nvEncoder } from '../common/interfaces/nvencode';


@Injectable({
  providedIn: 'root'
})

export class HomeSessionService extends Store.AbstractService {

  constructor() {
    super();
  }

  LoadSessionListTableData(filters: SessionFilter, active: boolean, count: boolean): Observable<Store.State> {
    let path = environment.api.netvision.sessionlist.endpoint;
    const base = environment.api.netvision.base.base;
    let access_token = '563e412ab7f5a282c15ae5de1732bfd1';

    if (filters.timeFilter.last == null || filters.timeFilter.last == '') {
      filters = JSON.parse(JSON.stringify(filters));
      // change starttime and endtime in UTC format.
      filters.timeFilter.startTime = Util.convertLocalTimeZoeToUTC(filters.timeFilter.startTime);
      filters.timeFilter.endTime = Util.convertLocalTimeZoeToUTC(filters.timeFilter.endTime);
    }
    if (count) {
      filters.sessionCount = true;
    }
    path = path + '?filterCriteria=' + JSON.stringify(filters) + '&access_token=' + access_token;
    // reset after use.
    filters.sessionCount = false;
    const me = this;

    // TODO: Review for handling of timezone.

    if (active) {
      const args = {};
      if (filters.clientip !== null) {
        args['clientIP'] = filters.clientip;
      }
      if (filters.loginid !== null) {
        args['loginId'] = filters.loginid;
      }
      if (filters.nvSessionId !== null) {
        args['sid'] = filters.nvSessionId;
      }
      if (filters.storeFilter != undefined && filters.storeFilter != null && filters.storeFilter.storeId != -2 && filters.storeFilter.storeId != -1) {
        args['storeid'] = filters.storeFilter.storeId;
        if (filters.storeFilter.terminalId != null && filters.storeFilter.terminalId != -1) {
          args['terminalId'] = filters.storeFilter.terminalId;
        }
      }
      if (filters.storeFilter != undefined && filters.storeFilter != null && filters.storeFilter.transactionId != undefined && filters.storeFilter.transactionId != -1) {
        args['transactionid'] = filters.storeFilter.transactionId;
      }
      if (filters.sessionsWithSpecificEvents != undefined && filters.sessionsWithSpecificEvents != null) {
        args['eventIdList'] = filters.sessionsWithSpecificEvents;
      }

      if (!count) {
        // data
        path = environment.api.netvision.activeSession.endpoint;
        path = `${path}?access_token=${access_token}&offset=${filters.offset}&limit=${filters.limit}&channel=${filters.channel}&opcode=data&filterCriteria=${encodeURIComponent(JSON.stringify(args))}`;
      } else {
        // count
        path = environment.api.netvision.activeSessionCount.endpoint;
        path = `${path}?access_token=${access_token}&offset=${filters.offset}&limit=${filters.limit}&channel=${filters.channel}&opcode=count&filterCriteria=${encodeURIComponent(JSON.stringify(args))}`;
      }
    }

    const output = new Subject<Store.State>();
    setTimeout(() => {
      output.next(new HomeSessionsLoadingState());
    }, 0);
    // path, data, base
    // 'session': '/netvision/rest/webapi/sessionfilter'
    me.controller.get(path, null, base).subscribe((data: any) => {
      console.log(data);
      output.next(new HomeSessionsLoadedState(data, active));
      output.complete();
    }, (e: any) => {
      output.error(new HomeSessionsLoadingErrorState(e));
      output.complete();
      me.logger.error('loading failed', e);
    });
    return output;
  }

  /** This method is used to show filtercriteria label in the session UI */
  getFilterLabel(filter: SessionFilter, metadata: Metadata): string {
    console.log('Applied filter : ', filter);
    let filterLabel = '';

    // --------------General Filter------------------------
    // time filter
    if (filter.timeFilter.last !== '') {
      filterLabel += '<b>Last:</b> ' + filter.timeFilter.last;
    } else {
      filterLabel += '<b>From:</b> ' + filter.timeFilter.startTime;
      filterLabel += ', <b>To:</b> ' + filter.timeFilter.endTime;
    }
    // channel
    if (filter.channel != null) {
      filterLabel += ', <b>Channel:</b> ' + metadata.channelMap.get(filter.channel).name;
    }
    // OS and OS version
    if (filter.platform != null) {
      filterLabel += ', <b>OS:</b> ' + filter.platform;
      if (filter.platformVersion != null) {
        filterLabel += '(' + filter.platformVersion + ')';
      }
    }
    // Location
    if (filter.location != null) {
      filterLabel += ', <b>Location:</b> ' + metadata.locationMap.get(filter.location).state + '(' + metadata.locationMap.get(filter.location).country + ')';
    }
    // User Segment
    if (filter.userSegment != null) {
      const values = filter.userSegment.split(',').map(Number);
      const names = values.map(v => metadata.userSegmentMap.get(v).name);
      filterLabel += ', <b>User Segment:</b> ' + names.join(',');
    }
    // Browser
    if (filter.browser != null) {
      filterLabel += ', <b>Browser:</b> ' + metadata.browserMap.get(filter.browser).name;
    }
    // Connection Type
    if (filter.conType != null) {
      filterLabel += ', <b>Connection Type:</b> ' + metadata.connectionMap.get(filter.conType).name;
    }
    // device
    if (filter.device != null) {
      filterLabel += ', <b>Device:</b> ' + filter.device;
    }
    // Login ID
    if (filter.loginid) {
      filterLabel += ', <b>Login ID:</b> ' + nvEncoder.decodeText(filter.loginid, nvEncoder.decode)
    }
    // Client IP
    if (filter.clientip != null) {
      filterLabel += ', <b>Client IP:</b> ' + filter.clientip;
    }
    // Store Filter
    if (filter.storeFilter != null) {
      // store id
      if (filter.storeFilter.storeId > -1) {
        filterLabel += ', <b>Store ID:</b> ' + filter.storeFilter.storeId;
      }
      // terminal id
      if (filter.storeFilter.terminalId !== -1) {
        filterLabel += ', <b>Terminal ID:</b> ' + filter.storeFilter.terminalId;
      }
    }

    // Session with Events
    if (filter.sessionsWithSpecificEvents != null) {
      const ids = filter.sessionsWithSpecificEvents.split(',').map(Number);
      const names = ids.map(i => metadata.eventMap.get(i).name);
      filterLabel += ', <b>Session with Events:</b> ' + names.join(',');
    }
    // Replay Sessions
    if (filter.sessionsWithReplay) {
      filterLabel += ', <b>Replay Sessions(s)';
    }
    // Sessions with ND
    if (filter.sessionWithND) {
      filterLabel += ', <b>ND Session(s)';
    }
    // Sessions with App Crash
    if (filter.crashSessions) {
      filterLabel += ', <b>App Crash Session(s)';
    }
    // BOT Sessions
    if (filter.botSessions) {
      filterLabel += ', <b>BOT Session(s)';
    }
    // Not Authenticated
    if (filter.notAuth) {
      filterLabel += ',<b> Not Authenticated';
    }
    // Authenticatted Failed
    if (filter.authFailed) {
      filterLabel += ', <b>Authentication Failed';
    }

    // -----------------Advanced Filters-----------------

    // ------Attribute Filter---------
    // Entry Page
    if (filter.entrypage != null) {
      filterLabel += ', <b>Entry Page:</b> ' + metadata.pageNameMap.get(parseInt(filter.entrypage)).name;
    }
    // Exit Page
    if (filter.exitpage != null) {
      filterLabel += ', <b>Exit Page:</b> ' + metadata.pageNameMap.get(parseInt(filter.exitpage)).name;
    }
    // Page URL
    if (filter.pageUrl != null) {
      filterLabel += ', <b>Page URL:</b> ' + filter.pageUrl;
    }
    // Referrer URL
    if (filter.referrerUrl != null) {
      filterLabel += ', <b>Referrer URL:</b> ' + filter.referrerUrl;
    }
    // Containing Pages
    if (filter.containingPage != null) {
      const ids = filter.containingPage.split(',').map(Number);
      const names = ids.map(i => metadata.pageNameMap.get(i).name);
      filterLabel += ', <b>Containing Page(s):</b> ' + names.join(',');
    }
    // Not Containing Pages
    if (filter.nonContainingPage != null) {
      const ids = filter.nonContainingPage.split(',').map(Number);
      const names = ids.map(i => metadata.pageNameMap.get(i).name);
      filterLabel += ', <b>Non-Containing Page(s):</b> ' + names.join(',');
    }
    // PageLoadTime
    if (filter.pageLoadTime != null) {
      filterLabel += ', <b>Page Load Time:</b> ' + filter.pageLoadTime;
    }
    // DOM Complete
    if (filter.domCompleteTime != null) {
      filterLabel += ', <b>DOM Complete Time:</b> ' + filter.domCompleteTime;
    }
    // Order Total
    if (filter.ordertotal != null) {
      filterLabel += ', <b>Order Total:</b> ' + filter.ordertotal;
    }
    // Order Count
    if (filter.ordercount != null) {
      filterLabel += ', <b>Order Count:</b> ' + filter.ordercount;
    }

    // -------Business Process---------
    if (filter.bpAttributeFilter) {
      // BP Name
      if (filter.bpAttributeFilter.bpName != null) {
        filterLabel += ', <b>BP Name:</b> ' + filter.bpAttributeFilter.bpName;
        // Abandoned BP
        if (filter.bpAttributeFilter.abandonedBP) {
          filterLabel += ', <b>Abandoned BP';
        }
        // Completed BP
        if (filter.bpAttributeFilter.completedBP) {
          filterLabel += ', <b>Completed BP';
        }
        // BP Exit Page
        if (filter.bpAttributeFilter.bpExitPage) {
          const ids = filter.bpAttributeFilter.bpExitPage.split(',').map(Number);
          const names = ids.map(i => metadata.pageNameMap.get(i).name);
          filterLabel += ', <b>Exit Page:</b> ' + names.join(',');
        }

        // BP Exit Page Events
        if (filter.bpAttributeFilter.bpExitPageEvent) {
          const ids = filter.bpAttributeFilter.bpExitPageEvent.split(',').map(Number);
          const names = ids.map(i => metadata.pageNameMap.get(i).name);
          filterLabel += ', <b>BP ExitPage Events:</b> ' + names.join(',');
        }
        // Transit Events
        if (filter.bpAttributeFilter.transitPageEvent) {
          const ids = filter.bpAttributeFilter.transitPageEvent.split(',').map(Number);
          const names = ids.map(i => metadata.pageNameMap.get(i).name);
          filterLabel += ', <b>Transit Page Events:</b> ' + names.join(',');
        }
        // Session Exit Page
        if (filter.bpAttributeFilter.sessionExitPage) {
          const ids = filter.bpAttributeFilter.sessionExitPage.split(',').map(Number);
          const names = ids.map(i => metadata.pageNameMap.get(i).name);
          filterLabel += ', <b>Session ExitPage Events:</b> ' + names.join(',');
        }
        // Session Exit Page Events
        if (filter.bpAttributeFilter.sessionExitPageEvent) {
          const ids = filter.bpAttributeFilter.sessionExitPageEvent.split(',').map(Number);
          const names = ids.map(i => metadata.pageNameMap.get(i).name);
          filterLabel += ', <b>Session ExitPage Events:</b> ' + names.join(',');
        }
      }

    }

    // -------Custom-------------------
    if (filter.customAttributeFilter) {
      if (filter.customAttributeFilter.hasOwnProperty('filters')) {
        const tmp = [];
        for (const i of filter.customAttributeFilter.filters) {
          tmp.push(i.filterName + ' ' + i.opr + ' ' + i.dvalue);
        }
        filterLabel += ', <b>Custom:</b> ' + tmp.join(' ' + filter.customAttributeFilter.operator + ' ');
      }
    }

    // -------Store--------------------
    if (filter.storeFilter) {
      // Associate ID
      if (filter.storeFilter.associateId !== -1) {
        filterLabel += ', <b>Associate ID:</b> ' + filter.storeFilter.associateId;
      }
      // Transaction ID
      if (filter.storeFilter.transactionId !== -1) {
        filterLabel += ', <b>Transaction ID:</b> ' + filter.storeFilter.transactionId;
      }
    }

    // -------Event Data---------------
    if (filter.eventData) {
      filterLabel += ', <b>Event Data:</b> ' + filter.eventData;
    }



    return filterLabel;
  }



}
