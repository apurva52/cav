declare var unescape: any;

import { NVPreLoadingState, NVPreLoadedState, NVPreLoadingErrorState } from './../service/nvhttp.service';
import { CustomMetric } from '../interfaces/custommetric';
import { HttpRequest } from '../interfaces/httprequest';
import { Metadata } from '../interfaces/metadata';
import { PageInformation } from '../interfaces/pageinformation';
import { Util } from '../util/util';
import { NvhttpService } from '../service/nvhttp.service';
import { DataRequestParams } from './datarequestparams';
import { PageData } from './pagedata';
import { SessionData } from './sessiondata';
import { Distribution } from './../interfaces/distribution';
import { Extension } from './extension';
import { ContentHarData } from '../interfaces/content-har-data';
import { AggregateActivityData } from '../interfaces/aggregateactivitydata';
import { JSError } from '../interfaces/jserror';
import { UserDataHandler } from '../interfaces/userdatahandler';
import { UserActionData } from '../interfaces/user-action-data';
import { ResourceTiming } from '../interfaces/resourcetiming';
import { DataHarRequestParams } from './dataharrequestparams';
import { EventInformation } from '../interfaces/eventinformation';
// import { AppComponent } from './../../app.component';
import * as moment from 'moment';
import 'moment-timezone';
import { Store } from 'src/app/core/store/store';
import { Observable } from 'rxjs';

export class DataManager {

  static sessionData: Map<string, SessionData> = new Map<string, SessionData>();
  static httpService: NvhttpService;
  static metadata: Metadata;
  // codes for data requests
  static CUSTOM_METRICS = 0;
  static SESSION_PAGES = 1;

  // page level data requests
  static JS_ERRORS = 2;
  static TRANSACTIONS = 3;
  static USER_ACTIVITIES = 4;
  static RESOURCE_TIMINGS = 5;
  static USER_TIMINGS = 6;
  static HTTP_REQUESTS = 7;
  static USER_ACTIONS = 8;
  static EVENTS_DATA = 9;
  static PAGE_DUMP = 10;
  static USER_TIMINGS_NON_AGG = 11;
  static isAdmin: any;
  static handleRequest(request: DataRequestParams, ref) {
    // if session data request
    if (request.dataLevel === 0) {
      DataManager.getSessionData(request, ref);
    }
    // if page data request
    else if (request.dataLevel === 1) {
      DataManager.getPageData(request, ref);
    }
  }

  static addSession(sid) {
    if (DataManager.sessionData === null) {
      DataManager.sessionData = new Map<string, SessionData>();
    }
    DataManager.sessionData.set(sid, new SessionData());
  }

  // get requested session data
  private static getSessionData(request: DataRequestParams, ref) {
    const session = DataManager.sessionData.get(request.sid);
    // check data request type
    if (request.dataType === DataManager.CUSTOM_METRICS) {
      ref.customMetrics = null;
      if (session.customMetrics === null || ref.activeSession === true) {
        DataManager.httpService.getAppConfig().subscribe((response: any) => {
          // console.log("@ isAdmin "  , response.isAdmin);
          // store false for encoding if user is an admin.
          DataManager.isAdmin = !response.isAdmin;
        });
        DataManager.httpService.getCustomMetrics(request.sid, null, request.sessionStartTime, request.sessionEndTime).subscribe((response: any) => {
          const records = response;
          ref.customMetrics = [];
          session.customMetrics = [];
          records.forEach(record => {
            /* let customMetric = new CustomMetric(
                record.name,
                DataManager.metadata.getPageName(parseInt(record.pageid)).name ,
                record[Util.getCustomMetricValueField(record.type)],
                ((record.encryptflag === "1") ? true : false),record.pageinstance); */
            // console.log("@ isAdmin " , ((record.encryptflag === "1") ? true : false) , DataManager.isAdmin);
            const customMetric = new CustomMetric(
              record.name,
              DataManager.metadata.getPageName(parseInt(record.pageid)).name,
              record[Util.getCustomMetricValueField(record.type)],
              DataManager.isAdmin, record.pageinstance);
            session.customMetrics.push(customMetric);
            ref.customMetrics.push(customMetric);
          });
        });
      }
      else {
        // return session.customMetrics;
        ref.customMetrics = session.customMetrics;
      }
    }

    if (request.dataType === DataManager.SESSION_PAGES) {
      ref.pages = null;
      if (session.pageInformation === null || ref.activeSession === true) {
        DataManager.httpService.getPages(ref).subscribe((response: any) => {
          let records = null;
          if (ref.activeSession) {
            if (response !== null && response["redirectUrl"] !== null && response["redirectUrl"] !== undefined) {
              DataManager.httpService.getResponseFromRedirectURL(response["redirectUrl"]).subscribe((state: Store.State) => {
                if (state instanceof NVPreLoadingState) {

                }

                if (state instanceof NVPreLoadedState) {
                  records = state.data.data;
                  session.pageInformation = [];
                  ref.pages = [];
                  records.forEach((record, index) => {
                    // console.log(' before ',ref.index, index, ref.pageInstance,record.pageinstance,ref.index === -1 && parseInt(ref.pageInstance) === record.pageinstance);
                    if (ref.index === -1 && parseInt(ref.pageInstance) === record.pageinstance)
                      ref.index = index;
                    // console.log('check ref index',ref.index);
                    const page: PageInformation = new PageInformation(record, index, DataManager.metadata);
                    session.pageInformation.push(page);
                    ref.pages.push(page);
                  });
                }
              },
                (err: Store.State) => {
                  if (err instanceof NVPreLoadingErrorState) {
                    console.error('Failed to get the data from Redirect Url.');
                  }
                }
              );
            }
            else
              records = response["data"];
          }
          else
            records = response;
          if (response !== null && response["redirectUrl"] == null) {
            session.pageInformation = [];
            ref.pages = [];
            records.forEach((record, index) => {
              // console.log(' before ',ref.index, index, ref.pageInstance,record.pageinstance,ref.index === -1 && parseInt(ref.pageInstance) === record.pageinstance);
              if (ref.index === -1 && parseInt(ref.pageInstance) === record.pageinstance)
                ref.index = index;
              // console.log('check ref index',ref.index);
              const page: PageInformation = new PageInformation(record, index, DataManager.metadata);
              session.pageInformation.push(page);
              ref.pages.push(page);
            });
          }
        });
      }
      else {
        ref.pages = session.pageInformation;
      }
    }
  }

  // get requested page data
  private static getPageData(request: DataRequestParams, ref) {
    if (DataManager.sessionData.get(request.sid).pageDetails.get(request.pageInstance) === null ||
      DataManager.sessionData.get(request.sid).pageDetails.get(request.pageInstance) === undefined) {
      DataManager.sessionData.get(request.sid).pageDetails.set(request.pageInstance, new PageData());
    }
    // check data request type
    switch (request.dataType) {
      case DataManager.JS_ERRORS:
        DataManager.getJSError(request, ref);
        break;
      case DataManager.CUSTOM_METRICS:
        DataManager.getPageCustomMetric(request, ref);
        break;
      case DataManager.HTTP_REQUESTS:
        DataManager.getHttpRequestData(request, ref);
        break;
      case DataManager.RESOURCE_TIMINGS:
        DataManager.getResourceTimingData(request, ref);
        break;
      case DataManager.USER_TIMINGS_NON_AGG:
        DataManager.getUserTimingNonAgg(request, ref);
        break;
      case DataManager.TRANSACTIONS:
        break;
      case DataManager.USER_ACTIVITIES:
        DataManager.getUserData(request, ref);
        break;
      case DataManager.USER_TIMINGS:
        DataManager.getUserTiming(request, ref);
        break;
      case DataManager.USER_ACTIONS:
        DataManager.getUserActions(request, ref);
        break;
      case DataManager.EVENTS_DATA:
        DataManager.getEventsData(request, ref);
        break;
    }
  }

  private static getPageCustomMetric(request: DataRequestParams, ref) {
    ref.pageCustomMetrics = null;
    const page = DataManager.sessionData.get(request.sid).pageDetails.get(request.pageInstance);
    if (page.customMetrics === null) {
      DataManager.httpService.getAppConfig().subscribe((response: any) => {
        // console.log("@ isAdmin "  , response.isAdmin);
        // store false for encoding if user is an admin.
        DataManager.isAdmin = !response.isAdmin;
      });
      DataManager.httpService.getCustomMetrics(request.sid, request.pageInstance, request.sessionStartTime, request.sessionEndTime).subscribe((response: any) => {
        const records = response;
        ref.pageCustomMetrics = [];
        page.customMetrics = [];
        records.forEach(record => {
          /* let customMetric = new CustomMetric(
                record.name,
                DataManager.metadata.getPageName(parseInt(record.pageid)).name ,
                (record[Util.getCustomMetricValueField(record.type)]),
                ((record.encryptflag === "1") ? true : false),record.pageinstance); */
          const customMetric = new CustomMetric(
            record.name,
            DataManager.metadata.getPageName(parseInt(record.pageid)).name,
            (record[Util.getCustomMetricValueField(record.type)]),
            DataManager.isAdmin, record.pageinstance);
          ref.pageCustomMetrics.push(customMetric);
          page.customMetrics.push(customMetric);
        });
      });
    }
    else {
      ref.pageCustomMetrics = page.customMetrics;
    }
  }

  private static getJSError(request: DataRequestParams, ref) {
    ref.jsErrors = null;
    let duration = 0;
    if (ref.session.duration != null && ref.session.duration != undefined) {
      duration = Util.FormattedDurationToSec(ref.session.duration);
      // console.log(duration);
    }
    const page = DataManager.sessionData.get(request.sid).pageDetails.get(request.pageInstance);
    if (page.jsErrors === null) {
      DataManager.httpService.getJSErrorData(request.sid, request.pageInstance, duration)
      //.subscribe((response: any) => {
        .subscribe(
          (state: Store.State) => {
            if (state instanceof NVPreLoadedState) {
              let response = state.data;
        const records = response;
        ref.jsErrors = [];
        page.jsErrors = [];
        records.forEach(record => {
          const jsErrors = new JSError(
            record);
          ref.jsErrors.push(jsErrors);
          page.jsErrors.push(jsErrors);
        });
      }
      });
    }
    else {
      ref.jsErrors = page.jsErrors;
    }
  }

  private static getUserData(request: DataRequestParams, ref) {
    ref.actionList = null;
    // console.log("ritt: ", ref ,request);
    ref.transactions = null;

    let duration = 0;
    if (ref.session.duration != null && ref.session.duration != undefined) {
      duration = Util.FormattedDurationToSec(ref.session.duration);
      // console.log(duration);
    }
    const page = DataManager.sessionData.get(request.sid).pageDetails.get(request.pageInstance);
    const userdatahandler = new UserDataHandler(request.sid, request.pageInstance, request.sessionStartTime, duration);
    if (page.userActivities === null) {
      DataManager.httpService.getUserTiming(request.sid, request.pageInstance, duration).subscribe(
        (userTimingResponse) => {
          if (userTimingResponse === null) {
            return;
          }
          userdatahandler.userTimingData = userTimingResponse;
          // this will only give data for eventype > 0 
          DataManager.httpService.getUserActionData(request.sid, request.pageInstance, duration, null).subscribe(
            (userActionResponse: any) => {
              if (userActionResponse === null) {
                return;
              }
              // for eventype -10 data for long task and -11 for callback execution
              DataManager.httpService.getUserActionData(request.sid, request.pageInstance, duration, "-10, -11").subscribe(
                (specuserActionResponse: any) => {
                  if (specuserActionResponse != null) {
                    try {
                      // merging both arrays
                      for (let i = 0; i < specuserActionResponse.length; i++) {
                        userActionResponse.push(specuserActionResponse[i]);
                      }
                    } catch (e) {
                      console.log("Exception while taking data for long task : " + e);
                    }
                  }
                });
              userdatahandler.userActionData = userActionResponse;
              DataManager.httpService.getAjaxData(request.sid, request.pageInstance, duration).subscribe(
                (ajaxResponse) => {
                  if (ajaxResponse === null) {
                    return;
                  }
                  userdatahandler.ajaxData = ajaxResponse;


                  DataManager.httpService.getJSErrorData(request.sid, request.pageInstance, duration).subscribe(
                    (jserrorResponse) => {
                      if (jserrorResponse === null) {
                        return;
                      }

                      // get data for jserror data , by doing request as done for AjaxData
                      // add for jserror
                      userdatahandler.jserrorData = jserrorResponse;
                      userdatahandler.processData();
                      ref.actionList = [];
                      ref.actionList = userdatahandler.resultData.actionList;
                      ref.transactions = [];
                      ref.transactions = userdatahandler.resultData.txnList;

                      page.userActivities = userdatahandler.resultData.actionList;
                      page.transactions = userdatahandler.resultData.txnList;
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
    else {
      ref.actionList = page.userActivities;
      ref.transactions = page.transactions;
    }
  }

  private static getPageObj(sid, pageInstance) {
    let session = this.getSessionObj(sid);

    let page = session.pageDetails.get(pageInstance);

    if (!page) {
      page = new PageData();
      session.pageDetails.set(pageInstance, page);
    }
    return page;
  }

  private static getSessionObj(sid): SessionData {
    let session = DataManager.sessionData.get(sid);
    if (!session) {
      session = new SessionData();
      DataManager.sessionData.set(sid, session);
    }

    return session;
  }

  private static unwrapResponse(response: any) {
    if (response instanceof NVPreLoadedState) {
      return response.data;
    } else if (response instanceof NVPreLoadingErrorState) {
      console.log('error response received. Error is - ', response.error);
      return null;
    } else if (response instanceof NVPreLoadingState) {
      return null;
    }
    return response;
  }

  static getTransactionData(request: DataRequestParams, duration) {
    return new Observable<any>(observer => {
      duration = Util.FormattedDurationToSec(duration);

      const page = this.getPageObj(request.sid, request.pageInstance);
      const userdatahandler = new UserDataHandler(request.sid, request.pageInstance, request.sessionStartTime, duration);
      if (page.userActivities === null) {
        DataManager.httpService.getUserTiming(request.sid, request.pageInstance, duration).subscribe(
          (userTimingResponse) => {
            // TODO: handling for others too. 
            userTimingResponse = this.unwrapResponse(userTimingResponse);
            if (userTimingResponse === null) {
              return;
            }
            userdatahandler.userTimingData = userTimingResponse;
            // this will only give data for eventype > 0 
            DataManager.httpService.getUserActionData(request.sid, request.pageInstance, duration, null).subscribe(
              (userActionResponse: any) => {
                userActionResponse = this.unwrapResponse(userActionResponse);
                if (userActionResponse === null) {
                  return;
                }
                // for eventype -10 data for long task and -11 for callback execution
                DataManager.httpService.getUserActionData(request.sid, request.pageInstance, duration, "-10, -11").subscribe(
                  (specuserActionResponse: any) => {
                    specuserActionResponse = this.unwrapResponse(specuserActionResponse);
                    if (specuserActionResponse != null) {
                      try {
                        // merging both arrays
                        for (let i = 0; i < specuserActionResponse.length; i++) {
                          userActionResponse.push(specuserActionResponse[i]);
                        }
                      } catch (e) {
                        console.log("Exception while taking data for long task : " + e);
                      }
                    }
                  });
                userdatahandler.userActionData = userActionResponse;
                DataManager.httpService.getAjaxData(request.sid, request.pageInstance, duration).subscribe(
                  (ajaxResponse) => {
                    ajaxResponse = this.unwrapResponse(ajaxResponse);
                    if (ajaxResponse === null) {
                      return;
                    }
                    userdatahandler.ajaxData = ajaxResponse;
  
  
                    DataManager.httpService.getJSErrorData(request.sid, request.pageInstance, duration).subscribe(
                      (jserrorResponse) => {
                        jserrorResponse = this.unwrapResponse(jserrorResponse);
                        if (jserrorResponse === null) {
                          return;
                        }
  
                        // get data for jserror data , by doing request as done for AjaxData
                        // add for jserror
                        userdatahandler.jserrorData = jserrorResponse;
                        userdatahandler.processData();

                        page.userActivities = userdatahandler.resultData.actionList;
                        page.transactions = userdatahandler.resultData.txnList;

                        if (request.dataType == this.TRANSACTIONS)
                        {
                          observer.next(page.transactions);
                        } else {
                          observer.next(page.userActivities);
                        }

                        observer.complete();
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
      else {
        // setting a delay intentionally because otherwise callback in component was not getting called. 
        setTimeout(() => {
          if (request.dataType == this.TRANSACTIONS)
          {
            observer.next(page.transactions);
          } else {
            observer.next(page.userActivities);
          }
          observer.complete();
        }, 10);
      }
    });
  }

  private static getUserTiming(request: DataRequestParams, ref) {
    ref.aggData = null;
    const page = DataManager.sessionData.get(request.sid).pageDetails.get(request.pageInstance);
    if (page.userTimings === null) {
      DataManager.httpService.getAggregateData(request.sid, request.pageInstance).subscribe((response: any) => {
        const records = response;
        ref.aggData = [];
        page.userTimings = [];
        records.forEach(record => {
          const userTiming = new AggregateActivityData(
            record.actionName, record.avgDuration, record.count, record.failedCount, record.type);
          ref.aggData.push(userTiming);
          page.userTimings.push(userTiming);
        });
      });
    }
    else {
      ref.aggData = page.userTimings;
    }
  }

  static getHttpRequestData(request: DataRequestParams, ref) {
    ref.httpRequests = null;
    if (ref.session.duration != null && ref.session.duration != undefined) {
      var duration = Util.FormattedDurationToSec(ref.session.duration);
      // console.log(duration);
    }
    const page = DataManager.sessionData.get(request.sid).pageDetails.get(request.pageInstance);
    /* if(page.httpRequests === null)
     {*/
    DataManager.httpService.getHttpRequests(request.sid, request.pageInstance, duration)
      //.subscribe((response: any) => {
        .subscribe(
          (state: Store.State) => {
            if (state instanceof NVPreLoadedState) {
              let response = state.data;
        ref.httpRequests = {};
        page.httpRequests = {};
        ref.httpRequests['entries'] = [];
        ref.httpRequests['startTime'] = 0;
        ref.httpRequests['duration'] = 0;
        page.httpRequests['entries'] = [];
        page.httpRequests['startTime'] = 0;
        page.httpRequests['duration'] = 0;
        const records = response;
        let i = 0;
        let startTime: any = Number.MAX_SAFE_INTEGER;
        let endTime: any = 0;
        records.forEach(record => {
          const httpRequest = new HttpRequest(record);
          httpRequest['index'] = i;
          ref.httpRequests["entries"].push(httpRequest);
          page.httpRequests["entries"].push(httpRequest);

          // calculate startTime and endTime. 
          if (startTime > httpRequest.timestamp)
            startTime = httpRequest.timestamp;

          if (endTime < httpRequest.timestamp + parseFloat("" + httpRequest.responseTime))
            endTime = httpRequest.timestamp + parseFloat("" + httpRequest.responseTime);

          i++;
        })

        ref.httpRequests['startTime'] = page.httpRequests['startTime'] = startTime;
        page.httpRequests['duration'] = ref.httpRequests['duration'] = (endTime - startTime);
        ref.httpRequests['entries'].forEach(entry => {
          // Add the addition attibutes
          const t = (entry.timestamp - ref.httpRequests['startTime']) * 1000;
          entry["startTimeValue"] = DataManager.ttgetstartvalue(t);
        });
        page.httpRequests = ref.httpRequests;
      }
      });
    /* }
     else
     {
       ref.httpRequests = {};
       ref.httpRequests['entries'] = [];
       ref.httpRequests = page.httpRequests;
     }*/
  }

  private static getUserActions(request: DataRequestParams, ref) {
    ref.userActions = null;
    let duration = 0;
    if (ref.session.duration != null && ref.session.duration != undefined) {
      duration = Util.FormattedDurationToSec(ref.session.duration);
      // console.log(duration);
    }

    const page = DataManager.sessionData.get(request.sid).pageDetails.get(request.pageInstance);
    if (page.userActions === null) {
      DataManager.httpService.getUserActionData(request.sid, request.pageInstance, duration, null).subscribe((response: any) => {
        const records = response;
        ref.userActions = [];
        page.userActions = [];
        let index = 0;
        let curroffset = 0.0; let starttimeoffset;
        if (!ref.pageInstance || (ref.pageInstance && ref.pageInstance < 0)) // in case getting data for all useractions, giving -1 as pageinstance
          ref.pageInstance = 0;
        const timestamp = new Date(ref.pages[ref.pageInstance].navigationStartTime).getTime();
        // let timestamp = new Date( moment.tz(new Date(ref.pages[ref.pageInstance].navigationStartTime).getTime(),sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss')).getTime() - 1388534400000;
        records.forEach(record => {
          /*
          if(index !== 0)
             curroffset =  (record.timestamp - starttimeoffset)/1000;
          else
              starttimeoffset = record.timestamp;
          */
          const recordTime = new Date(moment.utc(record.timestamp + 1388534400000).tz(sessionStorage.getItem('_nvtimezone')).format('YYYY-MM-DD hh:mm:ss')).valueOf();
          // curroffset = (record.timestamp - timestamp)/1000;
          curroffset = (recordTime - timestamp) / 1000;
          // 5 - mouse hover data && 6 - mouse move data
          if (record.eventType != "107" && record.eventType != "6" && record.eventType != "5") {
            const userActions = new UserActionData(record, curroffset);
            ref.userActions.push(userActions);
            page.userActions.push(userActions);
          }
          index++;
        });
      });
    }
    else {
      ref.userActions = page.userActions;
    }
  }
  private static getUserTimingNonAgg(request: DataRequestParams, ref) {
    ref.userTimingNonAgg = null;
    const page = DataManager.sessionData.get(request.sid).pageDetails.get(request.pageInstance);
    let duration = 0;
    if (ref.session.duration != null && ref.session.duration != undefined) {
      duration = Util.FormattedDurationToSec(ref.session.duration);
      // console.log(duration);
    }
    if (page.userTimingNonAgg === null) {
      DataManager.httpService.getUserTiming(request.sid, request.pageInstance, duration).subscribe((response: any) => {
        const records = response;
        ref.userTimingNonAgg = response;
        page.userTimingNonAgg = response;
      });
    }
    else {
      ref.userTimingNonAgg = page.userTimingNonAgg;
    }
  }

  // TODO: check if this method in use, otherwise remvoe it. 
  static getResourceTimingData(request: DataRequestParams, ref) {
    ref.resourceTimingData = null;
    const page = DataManager.sessionData.get(request.sid).pageDetails.get(request.pageInstance);
    if (page.resourceTimingData === null) {
      ref.resourceTimingData = null;

      const harRequest: DataHarRequestParams = <DataHarRequestParams>request;
      DataManager.httpService.getResourceTimings(request.sid, request.pageInstance, harRequest.onLoadTime, harRequest.domContentloadedTime, harRequest.navigationStartTime, harRequest.pageName).subscribe((state: Store.State) => {

        if (state instanceof NVPreLoadedState) {
          const har = state.data;
          if (har == null) {
            ref.resourceTimingData = {};
            page.resourceTimingData = ref.resourceTimingData;
            return;
          }
          // for multiple resource timing for a single page handling
          let complete_entry = har["log"]["entries"];
          if (har["log"]["_entries"])
            complete_entry = har["log"]["entries"].concat(har["log"]["_entries"]);
          const data = DataManager.process_har_resource_timing(complete_entry, request.sessionStartTime, ref, page, harRequest.bandwidth);
          // console.log("bandwidth : ", harRequest.bandwidth);
          data.bloaddata = DataManager.getLoadObj(har["log"]["entries"]);
          data.bresponsedata = DataManager.getResponseObj(har["log"]["entries"]);
          data.bdnsdata = DataManager.getDnsObj(har["log"]["entries"]);
          data.bconnectdata = DataManager.getConnectObj(har["log"]["entries"]);

          data.hostdata = DataManager.getHostData(har["log"]["entries"]);

          data.contentdata = new ContentHarData(har);
          // console.log("data : ", data);

          const resourceTimingData = new ResourceTiming(data);

          // console.log("resourceTimingData : " , resourceTimingData);
          ref.resourceTimingData = resourceTimingData;
          page.resourceTimingData = ref.resourceTimingData;
        }
      },
        (err: Store.State) => {
          if (err instanceof NVPreLoadingErrorState) {
            console.error('Failed to get Resource Timing Data.');
          }
        }
      );
    }
    else {
      ref.resourceTimingData = page.resourceTimingData;
    }
  }

  // Note: passing ref because it is being used while processing the data. 
  static getResourceTimingData2(request: DataRequestParams, ref) {
    return new Observable(observer => {
      const page = DataManager.sessionData.get(request.sid).pageDetails.get(request.pageInstance);
      if (page.resourceTimingData === null) {  
        const harRequest: DataHarRequestParams = <DataHarRequestParams>request;
        DataManager.httpService.getResourceTimings(request.sid, request.pageInstance, harRequest.onLoadTime, harRequest.domContentloadedTime, harRequest.navigationStartTime, harRequest.pageName).subscribe((state: Store.State) => {
  
          if (state instanceof NVPreLoadedState) {
            const har = state.data;
            if (har == null) {
              page.resourceTimingData = {}
              observer.next({});
              observer.complete();
              return;
            }
            // for multiple resource timing for a single page handling
            let complete_entry = har["log"]["entries"];
            if (har["log"]["_entries"])
              complete_entry = har["log"]["entries"].concat(har["log"]["_entries"]);
            const data = DataManager.process_har_resource_timing(complete_entry, request.sessionStartTime, ref, page, harRequest.bandwidth);
            // console.log("bandwidth : ", harRequest.bandwidth);
            data.bloaddata = DataManager.getLoadObj(har["log"]["entries"]);
            data.bresponsedata = DataManager.getResponseObj(har["log"]["entries"]);
            data.bdnsdata = DataManager.getDnsObj(har["log"]["entries"]);
            data.bconnectdata = DataManager.getConnectObj(har["log"]["entries"]);
  
            data.hostdata = DataManager.getHostData(har["log"]["entries"]);
  
            data.contentdata = new ContentHarData(har);
            // console.log("data : ", data);
  
            const resourceTimingData = new ResourceTiming(data);
  
            page.resourceTimingData = resourceTimingData;
            observer.next(resourceTimingData);
            observer.complete();
          }
        },
          (err: Store.State) => {
            if (err instanceof NVPreLoadingErrorState) {
              // TODO: update error properly.
              observer.error({error: 'Error in loading resource timing data. '});
              observer.complete();
            }
          }
        );
      }
      else {
        observer.next(page.resourceTimingData);
        observer.complete();
      }
    });
  }

  static process_har_resource_timing(entries, navStart, ref, page, bw): any {
    let info = {};
    const resourceTimingArray = [];
    const resourcetime = {};
    // Note: assumption is that first request will be having least start time.
    let startTime = 0;
    const configepoch = 1388534400;

    const navigationStart = 0;

    // Note:starttime will be absolute unix epoch time. we need to change them into relative time from navigation.
    const navTime = (navigationStart + configepoch);
    if (entries.length > 0)
      startTime = DataManager.getFirstRequestStartTime(entries);
    else
      return;

    const ext = new Extension();

    for (let z = 0; z < entries.length; z++) {
      const resourcetiming = {};
      resourcetiming["initiatorType"] = entries[z].response.content.mimeType;
      resourcetiming["contentType"] = ext.getExtension(unescape(entries[z].request.url), entries[z].response.content.mimeType, entries[z].response.content._initiator);
      resourcetiming["startTime"] = Date.parse(entries[z].startedDateTime);
      resourcetiming["startTime"] -= startTime;
      resourcetiming["duration"] = entries[z].time;
      resourcetiming["redirectStart"] = entries[z]._timings.redirectStart;
      resourcetiming["redirectEnd"] = entries[z]._timings.redirectEnd;
      resourcetiming["domainLookupStart"] = entries[z]._timings.domainLookupStart;
      resourcetiming["domainLookupEnd"] = entries[z]._timings.domainLookupEnd;
      resourcetiming["fetchStart"] = entries[z]._timings.fetchStart;
      resourcetiming["connectStart"] = entries[z]._timings.connectStart;
      resourcetiming["secureConnectionStart"] = entries[z]._timings.secureConnectionStart;
      resourcetiming["connectEnd"] = entries[z]._timings.connectEnd;
      resourcetiming["requestStart"] = entries[z]._timings.requestStart;
      resourcetiming["responseStart"] = entries[z]._timings.responseStart;
      resourcetiming["responseEnd"] = entries[z]._timings.responseEnd;
      resourcetiming["name"] = unescape(entries[z].request.url);
      resourcetiming["transferSize"] = (entries[z].response.transferSize);
      resourcetiming["encodedBodySize"] = DataManager.getShowbytesIn(entries[z].response.encodedBodySize);
      resourcetiming["decodedBodySize"] = DataManager.getShowbytesIn(entries[z].response.decodedBodySize);
      resourcetiming["nextHopProtocol"] = (entries[z].response.nextHopProtocol);
      resourcetiming["servertimearr"] = entries[z].serverTimings;
      resourceTimingArray.push(resourcetiming);
    }
    info = DataManager.process_raw_resource_timing(resourceTimingArray, ref, page, bw);
    return info;
  }

  static getFirstRequestStartTime(entries): any {
    if (entries.length == 0) return 0;
    var z = 0;
    var startTime = Date.parse(entries[0].startedDateTime);
    var time = 0;
    for (z = 0; z < entries.length; z++) {
      time = Date.parse(entries[z].startedDateTime);
      if (startTime > time)
        startTime = time;
    }
    return startTime;
  }

  static process_raw_resource_timing(resourceTimingArr, ref, page, bw): any {
    const resourceTimingInfo = {};
    resourceTimingInfo['entries'] = [];
    const resourceTimingArray = resourceTimingArr;

    if (resourceTimingArray.length == 0) return false;
    let resource;
    const differentOriginFlag = false;
    const failedResourceFlag = false;

    let startTime = parseFloat(resourceTimingArray[0].startTime);
    // endTime can't be equal to duration bcoz duration = responseEnd - startTime 
    // it exculdes start time
    let endTime = parseFloat(resourceTimingArray[0].startTime) + parseFloat(resourceTimingArray[0].duration);

    // let resourceTimingInfo["entries"] = new Array[resourceTimingArray.length];
    let bytesin = 0;
    // Note: redirectStart and redirectEnd can be 0 if there is no redirection or redirection is happening from different origin and timing allow header not present. 
    for (let z = 0; z < resourceTimingArray.length; z++) {
      let differentOriginFlag = false;
      let failedResourceFlag = false;
      // check if these entries are of different origin then ignore it 
      // TODO: check if we should ignore all the entries, or we can show resource fetched from cache.
      if (resourceTimingArray[z].domainLookupEnd == 0) {
        differentOriginFlag = true;
      }

      if (resourceTimingArray[z].initiatorType == "failed") {
        failedResourceFlag = true;
      }

      const resource = {};
      resource["url"] = resourceTimingArray[z].name;
      resource["filename"] = DataManager.getFileNameForTiming(resourceTimingArray[z].name);
      resource["host"] = DataManager.getHost(resourceTimingArray[z].name);
      resource["nextHopProtocol"] = resourceTimingArray[z].nextHopProtocol;
      resource["servertimearr"] = resourceTimingArray[z].servertimearr;
      // tooltiptiming
      resource["tt"] = {};


      if (failedResourceFlag == true) {
        resource["initiatorType"] = "others";
        resource["contentType"] = "failed";
      }
      else {
        resource["initiatorType"] = resourceTimingArray[z].initiatorType;
        resource["contentType"] = resourceTimingArray[z].contentType;
      }

      if (resource["initiatorType"] == "")
        resource["initiatorType"] = "-";

      if (resource["nextHopProtocol"] == "")
        resource["nextHopProtocol"] = "-";


      // Check for invalid entry.
      if (resourceTimingArray[z].startTime < 0 || resourceTimingArray[z].duration < 0) {
        resource["invalidEntry"] = true;
        resourceTimingInfo["entries"].push(resource);
        continue;
      }


      resource["startTime"] = parseFloat(resourceTimingArray[z].startTime);
      resource["start"] = DataManager.ttgetstartvalue(parseFloat(resourceTimingArray[z].startTime));
      resource["duration"] = parseFloat(resourceTimingArray[z].duration);
      resource["dur"] = DataManager.ttgetduration(parseFloat(resourceTimingArray[z].duration));
      resource["differentOriginFlag"] = differentOriginFlag;
      resource["failedResourceFlag"] = failedResourceFlag;

      resource["transferSize"] = DataManager.getShowbytesIn(parseFloat(resourceTimingArray[z].transferSize));
      resource["rawtransfersize"] = parseFloat(resourceTimingArray[z].transferSize);
      resource["encodedBodySize"] = resourceTimingArray[z].encodedBodySize;
      resource["decodedBodySize"] = resourceTimingArray[z].decodedBodySize;

      if (resourceTimingArray[z].transferSize > 0)
        bytesin += resourceTimingArray[z].transferSize;

      resource["isCache"] = false;
      if (parseFloat(resourceTimingArray[z].transferSize) == 0 && parseFloat(resourceTimingArray[z].encodedBodySize) > 0)
        resource["isCache"] = true;

      resource["isCompressed"] = false;
      if (parseFloat(resourceTimingArray[z].encodedBodySize) < parseFloat(resourceTimingArray[z].decodedBodySize))
        resource["isCompressed"] = true;

      // timings:
      resource["timing"] = {};
      if (differentOriginFlag == false) {
        // var phaseGap1 = phaseGap2 = phaseGap3 = 0;      


        /*********Redirection Phase ************/
        if (parseFloat(resourceTimingArray[z].redirectStart))
          resource["timing"]["redirectStart"] = resourceTimingArray[z].redirectStart;
        else
          resource["timing"]["redirectStart"] = resource["startTime"];
        resource["timing"]["redirect"] = parseFloat(resourceTimingArray[z].redirectEnd) - parseFloat(resourceTimingArray[z].redirectStart);

        resource["tt"]["redirectStart"] = DataManager.ttgetstartvalue(resource["timing"]["redirectStart"] - resource["startTime"]);
        resource["tt"]["redirect"] = DataManager.ttgetduration(resource["timing"]["redirect"]);

        /********Checking Unknown phase(GAP)****/
        if (parseFloat(resource["timing"]["redirectStart"]))
          resource["timing"]["phaseGap1start"] = parseFloat(resource["timing"]["redirectStart"]) + parseFloat(resource["timing"]["redirect"]);
        else
          resource["timing"]["phaseGap1start"] = resource["startTime"];

        if (parseFloat(resourceTimingArray[z].redirectEnd))
          resource["timing"]["phaseGap1"] = parseFloat(resourceTimingArray[z].fetchStart) - parseFloat(resourceTimingArray[z].redirectEnd);
        else
          resource["timing"]["phaseGap1"] = parseFloat(resourceTimingArray[z].fetchStart) - resource["startTime"];


        /********App Cache*********************/
        resource["timing"]["cacheStart"] = resourceTimingArray[z].fetchStart;
        resource["timing"]["cache"] = parseFloat(resourceTimingArray[z].domainLookupStart) - parseFloat(resourceTimingArray[z].fetchStart);

        resource["tt"]["cacheStart"] = DataManager.ttgetstartvalue(resource["timing"]["cacheStart"] - resource["startTime"]);
        resource["tt"]["cache"] = DataManager.ttgetduration(resource["timing"]["cache"]);

        /********DNS**************************/
        resource["timing"]["dnsStart"] = (resourceTimingArray[z].domainLookupStart);
        resource["timing"]["dns"] = parseFloat(resourceTimingArray[z].domainLookupEnd) - parseFloat(resourceTimingArray[z].domainLookupStart);

        resource["tt"]["dnsStart"] = DataManager.ttgetstartvalue(resource["timing"]["dnsStart"] - resource["startTime"]);
        resource["tt"]["dns"] = DataManager.ttgetduration(resource["timing"]["dns"]);

        /********Checking Unknown phase(GAP)****/
        resource["timing"]["phaseGap2start"] = parseFloat(resource["timing"]["dnsStart"]) + parseFloat(resource["timing"]["dns"]);
        resource["timing"]["phaseGap2"] = parseFloat(resourceTimingArray[z].connectStart) - parseFloat(resourceTimingArray[z].domainLookupEnd);

        /********TCP*************************/
        resource["timing"]["tcpStart"] = resourceTimingArray[z].connectStart;
        resource["timing"]["tcp"] = parseFloat(resourceTimingArray[z].connectEnd) - parseFloat(resourceTimingArray[z].connectStart);

        resource["tt"]["tcpStart"] = DataManager.ttgetstartvalue(resource["timing"]["tcpStart"] - resource["startTime"]);
        resource["tt"]["tcp"] = DataManager.ttgetduration(resource["timing"]["tcp"]);

        /********Checking Unknown phase(GAP)****/
        resource["timing"]["phaseGap3start"] = parseFloat(resource["timing"]["tcpStart"]) + parseFloat(resource["timing"]["tcp"]);
        resource["timing"]["phaseGap3"] = parseFloat(resourceTimingArray[z].requestStart) - parseFloat(resourceTimingArray[z].connectEnd);

        /********Request*************************/
        resource["timing"]["requestStart"] = resourceTimingArray[z].requestStart;
        if (parseFloat(resourceTimingArray[z].responseStart) < parseFloat(resourceTimingArray[z].requestStart))
          resource["timing"]["request"] = 0;
        else
          resource["timing"]["request"] = parseFloat(resourceTimingArray[z].responseStart) - parseFloat(resourceTimingArray[z].requestStart);

        resource["tt"]["requestStart"] = DataManager.ttgetstartvalue(resource["timing"]["requestStart"] - resource["startTime"]);

        /********Response*************************/
        resource["timing"]["responseStart"] = resourceTimingArray[z].responseStart;
        resource["timing"]["response"] = parseFloat(resourceTimingArray[z].responseEnd) - parseFloat(resourceTimingArray[z].responseStart);

        resource["tt"]["responseStart"] = DataManager.ttgetstartvalue(resource["timing"]["responseStart"] - resource["startTime"]);
        resource["tt"]["response"] = DataManager.ttgetduration(resource["timing"]["response"]);

      }
      else {
        resource["timing"]["redirect"] = "-";
        resource["timing"]["cache"] = "-";
        resource["timing"]["dns"] = "-";
        resource["timing"]["tcp"] = "-";
        resource["timing"]["request"] = "-";
        resource["timing"]["response"] = "-";

        resource["tt"]["contentload"] = DataManager.ttgetstartvalue((ref.pages[ref.pageInstance].timeToDOMComplete * 1000) - resource["startTime"]);
        resource["tt"]["onload"] = DataManager.ttgetstartvalue((ref.pages[ref.pageInstance].timeToLoad * 1000) - resource["startTime"]);
        resource["tt"]["prt"] = DataManager.ttgetstartvalue((ref.pages[ref.pageInstance].percievedRenderTime * 1000) - resource["startTime"]);
      }
      // update start time.
      // take minimum of start time and maximun of end time for all the resource.
      if (startTime > resourceTimingArray[z].startTime)
        startTime = resourceTimingArray[z].startTime;
      if (endTime < parseFloat(resourceTimingArray[z].startTime) + parseFloat(resourceTimingArray[z].duration))
        endTime = parseFloat(resourceTimingArray[z].startTime) + parseFloat(resourceTimingArray[z].duration);

      // add this entry.
      resourceTimingInfo["entries"].push(resource);
      resourceTimingInfo["entries"].sort(function (a, b) { return a.startTime - b.startTime });
    }
    resourceTimingInfo["starttime"] = startTime;
    // resourceTimingInfo.duration = endTime - startTime;
    // Note: In some cases we may have to draw for complete duration but, some resources may be missing.
    resourceTimingInfo["duration"] = endTime - 0;
    resourceTimingInfo["total"] = DataManager.ttgetduration(resourceTimingInfo["duration"] + resourceTimingInfo["starttime"]);
    resourceTimingInfo["totalbytes"] = DataManager.getShowbytesIn(bytesin);
    resourceTimingInfo["bandwidth"] = bw;
    return resourceTimingInfo;
  }

  static getShowbytesIn(val) {
    // console.log("datamanager getShowbytesIn : ", val);
    let temp = '';
    if (!val || val === null || val === '')
      return '-';
    else if (parseInt(val) <= 0) {
      return '0 KB';
    }
    else {
      if (val / 1024 > 1024)
        temp = (val / (1024 * 1024)).toFixed(2) + ' MB';
      else if (val / 1024 > 0)
        temp = (val / 1024).toFixed(2) + ' KB';
      else
        temp = val + ' B';
      // console.log('value1' ,temp);
      return temp;
    }
  }

  static getKB(size) {
    if (!size)
      return null;
    if (parseInt(size) <= 0)
      return "-";
    if (size > 1000)
      return (size / 1000).toFixed(2) + "KB";
    else
      return size.toFixed(2) + "B";
  }

  static getHostData(entries) {
    // console.log("getHostData : ", entries.length);
    const arrHost = [];
    const arrHostObj = [];
    const time = 0;
    const tmp = 0;
    const hostObj = {};
    const responseTime = DataManager.getTotalResponse(entries);
    const totalReq = entries.length;
    for (let i = 0; i < totalReq; i++) {
      const entry = entries[i];
      const host = DataManager.getHost(entry.request.url);

      // validate time.
      if (entry.startTime < 0) continue;
      if (entry.duration < 0) continue;

      arrHost.push(host);

      if (!hostObj.hasOwnProperty(host)) {
        hostObj[host] = {};
        hostObj[host].time = 0;
        hostObj[host].count = 0;
        hostObj[host].dns = 0;
        hostObj[host].tcp = 0;
      }
      hostObj[host].dns = DataManager.max(hostObj[host].dns, entry.timings.dns);
      hostObj[host].tcp = DataManager.max(hostObj[host].tcp, entry.timings.connect);
      hostObj[host].time += entry.time;
      hostObj[host].count++;
    }

    const result = DataManager.getDistinctCount(arrHost);
    const arrHostName = result[0];
    const arrHostRequest = result[1];
    const arrHostRequestPct = DataManager.getRequestPct(arrHostRequest, totalReq);

    const ddata = {};
    ddata["hostName"] = arrHostName;
    ddata["hostRequest"] = arrHostRequest;
    ddata["hostRequestPct"] = arrHostRequestPct;
    ddata["hostObj"] = hostObj;
    ddata["responseTime"] = responseTime;

    const d = new Distribution(ddata);
    return d;
  }

  static getTotalResponse(entries) {
    if (entries.length == 0)
      return 0;
    let totalRes = 0;
    const totalReq = entries.length;
    for (var i = 0; i < totalReq; i++) {
      const entry = entries[i];
      totalRes += entry.time;
    }
    return totalRes;
  }

  static getHost(url1) {
    return url1.replace(/^https?:\/\/([^\/]*)\/.*$/, "$1");
  }

  static max(a, b) {
    if (a > b)
      return a;
    else
      return b;
  }

  static getDistinctCount(arr) {
    let a = [], b = [], prev;

    arr.sort();
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] !== prev) {
        a.push(arr[i]);
        b.push(1);
      } else {
        b[b.length - 1]++;
      }
      prev = arr[i];
    }

    return [a, b];
  }

  static getRequestPct(a, b) {
    const pct = [];
    for (let i = 0; i < a.length; i++) {
      pct[i] = ((a[i] / b) * 100).toFixed(2);
    }
    return pct;
  }


  static getLoadObj(entries) {
    const obj = {};
    for (let i = 0; i < entries.length; i++) {
      if (entries[i]["time"] && entries[i]["time"] > 0) {
        obj[entries[i].time] = unescape(entries[i].request.url);
      }
    }
    if (Object.keys(obj).length == 0)
      return null;
    return obj;
  }

  static getResponseObj(entries) {
    const obj = {};
    for (let i = 0; i < entries.length; i++) {
      if (entries[i].timings.receive && entries[i].timings.receive > 0) {
        obj[entries[i].timings.receive] = unescape(entries[i].request.url);
      }
    }
    if (Object.keys(obj).length == 0)
      return null;
    return obj;
  }

  static getDnsObj(entries) {
    const obj = {};
    for (let i = 0; i < entries.length; i++) {
      if (entries[i].timings.dns && entries[i].timings.dns > 0) {
        const d = unescape(entries[i].request.url);
        obj[entries[i].timings.dns] = {};
        obj[entries[i].timings.dns]["url"] = d;
        obj[entries[i].timings.dns]["host"] = new URL(d).host;
      }
    }
    if (Object.keys(obj).length == 0)
      return null;
    return obj;
  }

  static getConnectObj(entries) {
    const obj = {};
    for (let i = 0; i < entries.length; i++) {
      if (entries[i].timings.connect && entries[i].timings.connect > 0) {
        const d = (unescape(entries[i].request.url));
        obj[entries[i].timings.connect] = {};
        obj[entries[i].timings.connect]["url"] = d;
        obj[entries[i].timings.connect]["host"] = new URL(d).host;
      }
    }
    if (Object.keys(obj).length == 0)
      return null;
    return obj;
  }

  static ttgetduration(value) {
    if (value > 1000) {
      value = (value / 1000).toFixed(2) + "s";
    }
    else {
      value = parseInt(value) + "ms";
    }
    return value;
  }

  // value will be passed in ms.
  static ttgetstartvalue(value) {
    var sign = "+";
    if (value < 0)
      sign = "-";
    value = Math.abs(value);

    if (value > 1000)
      value = (value / 1000).toFixed(2) + "s";
    else
      value = parseInt(value) + "ms";
    if (value.replace(/[ms]/g, '') != 0)
      value = sign + value;
    return value;
  }

  static getFileNameForTiming(url1): any {
    var aa = document.createElement('a');
    aa.href = url1;
    let finalurl = aa.pathname;

    if (finalurl.indexOf(";") > -1)
      finalurl = finalurl.substring(0, finalurl.indexOf(";"));

    var fields = finalurl.split("/");
    var l = fields.length - 1;
    while (l) {
      if (fields[l] != "") {
        return fields[l];
      }
      l--;
    }
    return finalurl;
  }


  private static getEventsData(request: DataRequestParams, ref) {
    ref.eventData = null;
    const page = DataManager.sessionData.get(request.sid).pageDetails.get(request.pageInstance);
    let stime = 0;
    let etime = 0;
    if (ref.activeSession === true) {
      stime = ref.session.startTime;
      etime = ref.session.endTime;
    }
    else {
      stime = ref.session.startTime - 1388534400;
      etime = ref.session.endTime - 1388534400;
    }
    let flag = false;
    if (page.eventData === null) {
      // when requesting for all events of session with complete details , passing pageinstance -1, and pageid -1
      if (!ref.pageInstance || (ref.pageInstance && ref.pageInstance < 0)) {
        ref.pageInstance = 0;
        flag = true;
      }
      let pid = ref.pages[ref.pageInstance].pageName.id;
      if (flag)
        pid = -1;


      console.log('request for event data=', request.pageInstance - 1);
      DataManager.httpService.getEventInformation(ref.session.duration, request.sid, pid, request.pageInstance, ref.pages[request.pageInstance - 1].eventListData).subscribe((response: any) => {
        const records = response;
        ref.eventData = [];
        page.eventData = [];
        records.forEach(record => {
          const events = new EventInformation(
            record);
          ref.eventData.push(events);
          page.eventData.push(events);
        });
      });
    }
    else {
      ref.eventData = page.eventData;
    }
  }

}
