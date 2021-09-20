import { EventEmitter, Injectable } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterEvent } from '@angular/router';
import { JSEncrypt } from 'jsencrypt/bin/jsencrypt';
import * as _ from 'lodash';
import { interval, Observable, Subject } from 'rxjs';
import { Subscriptions } from 'src/app/shared/common-models/common-models';
import { DataCenter } from 'src/app/shared/header/data-center-menu/service/data-center.model';
import { IDGenerator } from 'src/app/shared/utility/IDGenerator';
import { StaticInstance } from 'src/app/shared/utility/static-instance';
import { getURLParameterByName } from 'src/app/shared/utility/URL';
import { environment } from 'src/environments/environment';
import { Store } from '../store/store';
import { LoginPayload, PreSession, Session, SessionTimeInfo, TestRun, CopyLinkParams,DDRParams, TimeZoneInfo, TimeZoneValueInfo } from './session.model';
import { PreSessionCreatedState, PreSessionCreatingErrorState, PreSessionCreatingState, SessionCreatedState, SessionCreatingErrorState, SessionCreatingState, SessionDestroyedState, SessionDestroyingErrorState, SessionDestroyingState } from './session.state';
import * as moment from 'moment-timezone';
import { ReturnStatement } from '@angular/compiler';
import {  TreeNodeMenu } from 'src/app/shared/dashboard/sidebars/show-graph-in-tree/service/graph-in-tree.model';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertCapabilityService } from '../../pages/my-library/service/alert-capability.service';

@Injectable({
    providedIn: 'root'
})
export class SessionService extends Store.AbstractService {

  public _nodeHealth = new Subject<any>();
  _nodeHealthProvider$ = this._nodeHealth.asObservable();

    public static instance: StaticInstance<SessionService> = new StaticInstance<SessionService>();
    cacheTreeData: TreeNodeMenu[];
    cacheCustomTreeData: TreeNodeMenu[];
    cacheTreeColor = [];
    dashboardCache = null;
    dashboardConfigSettingData = null;
    private static RESTRICTED_REDIRECT_URLS: string[] = [
        '/login',
        '/logout',
        '/loading',
        '/welcome'
    ];

    private readonly localStorageKeySession = 'session';
    private readonly localStorageKeyPreSession = 'preSession';
    private readonly localStorageKeyDataCenter = 'dc';
    private readonly localStorageKeySSOParams = 'ssoParams';
    private readonly localStorageKeySettings = 'sessionSettings';
    private readonly sessionStorageSetting = 'copyLinkParams';

    private settings: { [key: string]: any } = {};

    private sessionBase: string;

    public onReady: EventEmitter<void> = new EventEmitter<void>();
    private stateSession: Store.State = null;
    private statePreSession: Store.State = null;

    private redirectURL: string = null;
    private redirectToken: string = null;

    private cache: { [key: string]: any } = {};
    public time: number;
    private timeInterval: NodeJS.Timeout;
    public settingTime: number;
    private settingTimeInterval: NodeJS.Timeout;

    public isMultiDC: boolean;
    copyLinkParam : CopyLinkParams;
    ddrParam: DDRParams;
    timeZoneList : TimeZoneInfo;
    selectedTimeZone: TimeZoneValueInfo;
    selectedTime: string;

   thresholdForScaling: number = 10;
    public executeRefreshOutsideAngularZone =false;

    public testRun: TestRun = { id: null, running: null };

    private _dataCenter: DataCenter = null;
    public get dataCenter(): DataCenter {
        return this._dataCenter;
    }
    public set dataCenter(dc: DataCenter) {
        const me = this;
        me._dataCenter = dc;
        if (me._dataCenter) {
            localStorage.setItem(me.localStorageKeyDataCenter, JSON.stringify(me._dataCenter));
            const defaultDC: string = environment.api.core.defaultBase.toString();
            environment.api.core.base = defaultDC.replace(environment.api.core.endpoint.toString(), dc.url);
            me.testRun = dc.testRun;
            if (!me.testRun && me.session && me.session.testRun) {
                me.testRun = me.session.testRun;
            }
        } else {
            me.testRun = { id: null, running: null };
        }
    }

    public get preSession(): PreSession {
        const me = this;
        return me.statePreSession ? (me.statePreSession as PreSessionCreatedState).data : null;
    }

    public get session(): Session {
        const me = this;
        if (me.isActive()) {
            return (me.stateSession as SessionCreatedState).data;
        }
        return null;
    }

    public get copyLinkParams(): CopyLinkParams{
        const me = this;
        if(me.copyLinkParam && me.copyLinkParam.requestFrom == "CopyLink"){
            return me.copyLinkParams;
        }
        return null;
    }

    public get ddrParams(): DDRParams{
        const me = this;
        if(this.ddrParam && (me.ddrParam.requestFrom == "DDRA9" || me.ddrParam.requestFrom == "DDR")){
            return me.ddrParams;
        }
        return null;
    }
    

    public get timeZoneLists(): TimeZoneInfo {
      const me = this;
        me.timeZoneList = me.session.defaults.timeInfo.timeZoneList;
          return me.timeZoneList;
  }

    public get $thresholdForScaling(): number {
    return this.thresholdForScaling;
  }

  public set $thresholdForScaling(value: number) {
    this.thresholdForScaling = value;
  }

  public get $dashboardCache(): any {
    return this.dashboardCache;
  }

  public set $dashboardCache(value: any) {
    this.dashboardCache = value;
  }

  public get $dashboardConfigSettingData(): any {
    return this.dashboardConfigSettingData;
  }

  public set $dashboardConfigSettingData(value: any) {
    this.dashboardConfigSettingData = value;
  }

  public get $executeRefreshOutsideAngularZone(): boolean {
    return this.executeRefreshOutsideAngularZone;
  }

  public set $executeRefreshOutsideAngularZone(value: boolean) {
    this.executeRefreshOutsideAngularZone = value;
  }

    private subscriptions: Subscriptions = {
        sessionValidate: null
    };

    constructor(private router: Router, private _alertCapability: AlertCapabilityService) {
        super();
        const me = this;

        SessionService.instance.commitInstance(me);

        me.router.events.subscribe((re: RouterEvent) => {
            me.onRouterEvent(re);
        });

        me.initService();

        me.initSettings();

        me.updateCapabilityOnLogIn();

        if(sessionStorage.getItem('copyLinkParams')){
            me.copyLinkParam = JSON.parse(sessionStorage.getItem('copyLinkParams'));
         }
         
         if(sessionStorage.getItem('DDRA9COPYLINK')){       
            me.ddrParam = JSON.parse(sessionStorage.getItem('DDRA9COPYLINK'));
         }
         if(sessionStorage.getItem('DDRCOPYLINK')){       
            me.ddrParam = JSON.parse(sessionStorage.getItem('DDRCOPYLINK'));
         }
    }
    
    updateCapabilityOnLogIn() 
    {
        const me = this;
        me._alertCapability.updateCapabilityOnLogIn(_.get(me.stateSession, 'data.permissions', null));
    }

    //convert time to time zone selected by user
    convertTimeToSelectedTimeZone(time?: number){
      try {
        let timeWithZone  = moment(time).zone(this.selectedTimeZone.offset).format(environment.formats.dateTime['default']);
        return timeWithZone;
      } catch (error) {
          console.error("Error is converting time..")
      }
    }

    //convert time to time zone selected by user
    convertTimeWithZero(time?: number) {
        try {
            let timeWithZone = moment().utcOffset(0).set({ hour: 0, minute: 0, second: 0, millisecond: time }).format(environment.formats.OWL_DATE_TIME_FORMATS['timePickerInput']);
            return timeWithZone;
        } catch (error) {
            console.error("Error is converting time..")
        }
    }

    /**
     * This method is used for sort the any array based on the key value.
     * @param array
     * @param key
     * @returns
     */
    sort_by_key(array, key)
    {
      return array.sort(function(a, b)
    {
      var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
    }

    //convert UTC to particular time zone
    adjustTimeAccToTimeZoneOffSetDiff(timeStamp?: number){
      try {
      let adjustedTimeStamp = timeStamp + (this.selectedTimeZone.diffTimeStamp);
        return adjustedTimeStamp;
      } catch (error) {
          console.error("Error is adjusting time..returning same timestamp")
          return timeStamp;
      }
    }

    //convert particular time zone to UTC
    reveseTimeToUTCTimeZone(adjustedTimeStamp?: number){
      try{
      let timeStamp = adjustedTimeStamp - (this.selectedTimeZone.diffTimeStamp);
      return timeStamp;
      }
      catch (error) {
      console.error("Error is making original time..returning same timestamp")
      return adjustedTimeStamp;
      }
      }


    getInterval(key: string, defaultInterval: number = 60000): number {
        const me = this;
        let interval: number = defaultInterval;

        if (!me.cache.intervals) {
            me.cache.intervals = {};
        }

        if (me.isActive()) {
            if (me.cache.intervals[key] !== undefined) {
                return me.cache.intervals[key];
            }

            const intervalObject = me.session.intervals.find((v) => {
                return v.key === key;
            });

            if (intervalObject && intervalObject.interval) {
                interval = intervalObject.interval;
            }

            if (interval) {
                me.cache.intervals[key] = interval;
            }
        }

        return interval;
    }

    getTimeInfo(): SessionTimeInfo {
        const me = this;

        if (me.isActive() && me.session.defaults && me.session.defaults.timeInfo) {
            return me.session.defaults.timeInfo;
        }

        return null;
    }

    isActive(): boolean {
        const me = this;
        if (me.stateSession) {
            return me.stateSession instanceof SessionCreatedState;
        }
        return false;
    }

    isSSO(): boolean {
        const me = this;
        const disableSSO = localStorage.getItem('DISABLE_SSO');
        return me.preSession && me.preSession.ssoURL && me.preSession.ssoURL.length && !disableSSO;
    }

    redirectToPostLoginPage() {
        const me = this;
        if (me.isActive()) {
            const redirectTo = me.redirectURL || me.session.defaults.landingPage;
            me.router.navigate([redirectTo]);
            me.redirectURL = null;
        }
    }

    redirectToPostLoginSAASPage() {
        const me = this;
        if (me.isActive()) {
            me.router.navigate(['/enterprise-node']);
        }
    }
    redirectToPostLoginDDRPage() {
        const me = this;
        if (me.isActive()) {
            if(this.ddrParam.requestFrom === 'DDR'){
                me.router.navigate(['/drilldown/flow-path'],{ queryParams: { state: 'DDRCOPYLINK' }});
            }
            if(this.ddrParam.requestFrom === 'DDRA9'){
                me.router.navigate(['/ddr/flowpath'], { queryParams: { state: 'DDRA9COPYLINK' } });
            }
                
        }
    }

    redirectToLoginPage(skipWelcome?: boolean) {
        const me = this;
        if (me.preSession) {
            if (me.preSession.newUIEnabled || localStorage.getItem('FORCE_NEW_UI') === 'ENABLED') {
                if (skipWelcome) {
                    me.router.navigate(['/login']);
                } else {
                    me.router.navigate(['/welcome']);
                }
            } else {
                window.location.href = me.preSession.legacyUIURL;
            }
        }
    }

    redirectToLoadingPage() {
        const me = this;
        me.redirectToken = IDGenerator.newId();
        me.router.navigate(['/loading']);
    }

    // Action: Login
    login(rawCreds: LoginPayload): Observable<Store.State> {
        const output = new Subject<Store.State>();
        const me = this;

        const creds = me.prepareCreds(rawCreds);

        me.stateSession = new SessionCreatingState();

        setTimeout(() => {
            output.next(me.stateSession);
        }, 0);

        me.controller.post(environment.api.session.login.endpoint, creds, environment.api.session.login.base)
            .subscribe((data: Session) => {
                data.cctx.u = creds.username; // TODO: remove for octa
                me.stateSession = new SessionCreatedState(data);
                me.onSessionCreated();
                output.next(me.stateSession);
                output.complete();
            }, (e: HttpErrorResponse) => {
                me.stateSession = new SessionCreatingErrorState(e);
                output.error((me.stateSession as SessionCreatingErrorState).error);
                output.complete();
            });
        return output;
    }

    validate(): Observable<void> {
        const me = this;
        const output: Subject<void> = new Subject<void>();

        const sessionInfo = me.session;

        if (me.session) {
            const payload = {
                productKey: sessionInfo.cctx.pk,
                userName: sessionInfo.cctx.u,
                requestFromSAML: me.isSSO(),
                oktaGroupList: null
            };

            me.controller.get(environment.api.session.validate.endpoint, payload, environment.api.session.validate.base)
                .subscribe((data) => {
                    output.next();
                }, (e: HttpErrorResponse) => {
                    if (e.status === 400) {
                        me.router.navigate(['/logout']);
                    }
                    output.next();
                });
        } else {
            setTimeout(() => {
                output.next();
            });
        }

        return output;
    }

    forceLogout(username: string): Observable<Store.State> {
        const output = new Subject<Store.State>();

        const me = this;
        const data = {
            u: username,
            pk: username
        };
        me.stateSession = new SessionDestroyingState();

        setTimeout(() => {
            output.next(me.stateSession);
        }, 0);

        me.controller.get(environment.api.session.forceLogout.endpoint, data, environment.api.session.forceLogout.base)
            .subscribe(() => {
                me.stateSession = new SessionDestroyedState();
                output.next(me.stateSession);
                output.complete();
            }, (e: any) => {
                me.clearSession();
                me.stateSession = new SessionDestroyingErrorState(e);
                output.error((me.stateSession as SessionDestroyingErrorState).error);
                output.complete();
            });

        return output;
    }

    logout() {
        const me = this;
        const data = {
            productKey: me.session.cctx.pk
        };
        me.stateSession = new SessionDestroyingState();

        me.controller.get(environment.api.session.logout.endpoint, data, environment.api.session.logout.base)
            .subscribe(() => {
                me.clearSession();
                me.stateSession = new SessionDestroyedState();
                me.initService();
            }, (e: any) => {
                me.clearSession();
                me.stateSession = new SessionDestroyingErrorState(e);
                me.logger.error((me.stateSession as SessionDestroyingErrorState).error);
                me.initService();
            });
    }

    private loadPreSession() {
        const me = this;

        setTimeout(() => {
            me.statePreSession = new PreSessionCreatingState();
        }, 0);

        me.controller.get(environment.api.session.pre.endpoint, null, environment.api.core.defaultBase)
            .subscribe((data: PreSession) => {
                data.newUIEnabled = true; // TODO: remove in prod

                me.isMultiDC = !!(data.multiDc);

                if (!me.isMultiDC && !data.dcData) {
                    data.dcData = [
                        {
                            url: environment.api.core.endpoint.toString(),
                            name: data.controllerName,
                            status: 'UP',
                            icon: 'icons8 icons8-view-all',
                            testRun: null,
                            session: true,
                            master: true
                        }
                    ];
                }

                me.statePreSession = new PreSessionCreatedState(data);

                localStorage.setItem(me.localStorageKeyPreSession, JSON.stringify(data));

                me.initPreSession();

                me.redirectToLoginPage();
            }, (e: any) => {
                me.statePreSession = new PreSessionCreatingErrorState(e);
                me.logger.error(e);
            });

    }

    private initPreSession() {
        const me = this;
        me.initDC();
    }

    getSetting(key: string, def?: any): any {
        const me = this;

        if (me.isActive() && me.settings[key]) {
            return me.settings[key];
        }

        return def || null;
    }

    setSetting(key: string, value: any) {
        const me = this;

        me.settings[key] = value;
        localStorage.setItem(me.localStorageKeySettings, JSON.stringify(me.settings));
    }

    private initSettings() {
        const me = this;
        const rawSettings: string = localStorage.getItem(me.localStorageKeySettings);

        if (rawSettings && rawSettings.length) {
            try {
                me.settings = JSON.parse(rawSettings);
            } catch (parseError) {
                me.logger.error('Settings parsing failed');
            }
        }

    }

    private onSessionCreated() {
        const me = this;
        if (me.stateSession instanceof SessionCreatedState) {


            // Save formats in ENV
            const defaultDateFormat = _.get(me.stateSession, 'data.defaults.timeInfo.format', null);
            if (defaultDateFormat) {
                environment.formats.dateTime.default = defaultDateFormat;
                environment.formats.OWL_DATE_TIME_FORMATS.parseInput = defaultDateFormat;
                environment.formats.OWL_DATE_TIME_FORMATS.fullPickerInput = defaultDateFormat;
            }

            // Server Clock
            let serverTimeOffset = '';
        //    const index = 0;
            let settingTimeOffset = '';
            settingTimeOffset = _.get(me.stateSession, 'data.defaults.serverTimeInfo.zone', null);
            settingTimeOffset = settingTimeOffset.slice(1,4);
             if (settingTimeOffset) {
                //moment.tz.setDefault(settingTimeOffset);
                me.settingTime = moment().valueOf();
                me.settingTimeInterval = setInterval(() => {
                    me.settingTime = moment().valueOf();
                }, 1000);
            }
            let index = "0";
            //code done for showing client time zone feature
            const dateString: string = new Date().toString();
            const browserTimeOffset = dateString.substr((dateString.indexOf("GMT") + 3), 5)
            for(index in me.stateSession.data.defaults.timeInfo.timeZoneList){
              if(me.stateSession.data.defaults.timeInfo.timeZoneList[index]['value']['offset'] == me.stateSession.data.defaults.serverTimeInfo.offset){
                me.selectedTimeZone = me.stateSession.data.defaults.timeInfo.timeZoneList[index]['value'];
                serverTimeOffset = me.session.defaults.timeInfo.zone =  me.selectedTimeZone.abb;
                me.session.defaults.timeInfo.zoneId  = me.selectedTimeZone.abb;
                if(me.stateSession.data.defaults.serverTimeInfo.offset.toString() == browserTimeOffset){
                    me.session.defaults.clientTimeInfo = me.stateSession.data.defaults.timeInfo.timeZoneList[index]['value'];
                }

                break;
              }
              else if(me.stateSession.data.defaults.timeInfo.timeZoneList[index]['value']['offset'] == browserTimeOffset){
                me.session.defaults.clientTimeInfo = me.stateSession.data.defaults.timeInfo.timeZoneList[index]['value'];

            }
        }
        // serverTimeOffset = _.get(me.stateSession, 'data.defaults.timeInfo.zoneId', null);

            if (serverTimeOffset) {
                //moment.tz.setDefault(serverTimeOffset); do not set default value as for UTC it will start convert time double time will create problem with generic feature. If any issue come for this change then one should handle that on there module
                me.time = moment().valueOf();
                me.timeInterval = setInterval(() => {
                    me.time = moment().valueOf();
                }, 1000);
            }
            //To show server time in settings UI.
            // let settingTimeOffset = '';
            // settingTimeOffset = _.get(me.stateSession, 'data.defaults.serverTimeInfo.zone', null);
            // settingTimeOffset = settingTimeOffset.slice(1,4);
            //  if (settingTimeOffset) {
            //     moment.tz.setDefault(settingTimeOffset);
            //     me.settingTime = moment().valueOf();
            //     me.settingTimeInterval = setInterval(() => {
            //         me.settingTime = moment().valueOf();
            //     }, 1000);
            // }
            if (!me.isMultiDC && me.stateSession.data.testRun) {
                const dc: DataCenter = { ...me.dataCenter };
                dc.testRun = me.stateSession.data.testRun
                me.dataCenter = dc;
            }

            localStorage.setItem(me.localStorageKeySession, JSON.stringify((me.stateSession as SessionCreatedState).data));

            // Session Validate
            const ms = me.getInterval('session-validate');
            me.subscriptions.sessionValidate = interval(ms).subscribe(() => {
                me.validate();
            });

        }
    }

    private clearSession() {
        const me = this;

        // On logout clear datacenter
        me.dataCenter = null;
	// clear treeData
     me.cacheTreeData = null;
     me.cacheCustomTreeData = null
     me.cacheTreeColor = null;
     me.dashboardCache = null;
     me.dashboardConfigSettingData = null;
        // Clear local storage
        localStorage.removeItem(me.localStorageKeySession);
        localStorage.removeItem(me.localStorageKeyPreSession);
        localStorage.removeItem(me.localStorageKeyDataCenter);
        localStorage.removeItem(me.localStorageKeySettings);

        if(me.copyLinkParam && me.copyLinkParam.requestFrom == "CopyLink"){
          sessionStorage.removeItem(me.sessionStorageSetting);
        }

        // unsubscribe intervals and event listeners
        if (me.subscriptions.sessionValidate) {
            me.subscriptions.sessionValidate.unsubscribe();
        }

        if (me.timeInterval) {
            clearInterval(me.timeInterval);
        }

        me.selectedTime = "";
        me.cache = {};
        me.settings = {};
    }

    private prepareCreds(creds: LoginPayload): LoginPayload {
        const me = this;
        const c = JSON.parse(JSON.stringify(creds));

        if(this.copyLinkParam && this.copyLinkParam.requestFrom == "CopyLink"){
            c.password = null;
            c.username = creds.username;
            c.productKey = creds.productKey || creds.username;
            c.requestFrom = "CopyLink";
           }
           else if(this.ddrParam && (this.ddrParam.requestFrom == "DDRA9" || this.ddrParam.requestFrom == "DDR")){
            c.password = null;
            c.username = creds.username;
            c.productKey = creds.productKey || creds.username;
            c.requestFrom = "CopyLink";
           }
           else{
            c.password = me.encrypt(creds.password + '');
            c.username = creds.username;
            c.productKey = creds.productKey || creds.username;
            if(c.requestFrom)
                c.requestFrom = creds.requestFrom;
            else
                c.requestFrom = 'UnifiedDashboard';
            }

        return c;
    }

    private encrypt(payload: string): string {
        const me = this;

        if (me.preSession) {
            const e: JSEncrypt = new JSEncrypt();
            e.setKey(me.preSession.publicKey);
            return e.encrypt(payload);
        }

        return null;
    }

    private setRedirectURL(url?: string) {
        const me = this;
        let redirectURL = url || me.router.url;

        if (SessionService.RESTRICTED_REDIRECT_URLS.indexOf(redirectURL) !== -1) {
            redirectURL = null;
        }

        me.redirectURL = redirectURL;
    }

    private initDC() {
        const me = this;

        const dcData = me.preSession.dcData;
        const selectedDCRaw: string = localStorage.getItem(me.localStorageKeyDataCenter);

        if (selectedDCRaw && selectedDCRaw.length) {
            try {
                me.dataCenter = JSON.parse(selectedDCRaw);
            } catch (parseError) {
                me.logger.error('DC Cannot be parsed from Local Storage');
            }
        }


        if (dcData && dcData.length) {

            for (const dc of me.preSession.dcData) {
                if (dc.session) {
                    const defaultDC: string = environment.api.core.defaultBase.toString();
                    const base: string = defaultDC.replace(environment.api.core.endpoint.toString(), dc.url);

                    environment.api.session.pre.base = base;
                    environment.api.session.login.base = base;
                    environment.api.session.logout.base = base;
                    environment.api.session.forceLogout.base = base;
                    environment.api.session.validate.base = base;
                    environment.api.session.dataCenters.base = base;

                    break;
                }
            }

            // Select first Data Center
            if (!me.dataCenter) {
                me.dataCenter = dcData[0];
            }
        }


    }

    private checkSSO(): boolean {
        const me = this;

        const ssoParams = localStorage.getItem(me.localStorageKeySSOParams);

        if (ssoParams) {

            const loginPayload: LoginPayload = {
                username: getURLParameterByName('userName', ssoParams),
                samlAuthenticated: getURLParameterByName('SamlAuthenticated', ssoParams),
                requestFrom: getURLParameterByName('requestFrom', ssoParams),
                oktagroup: getURLParameterByName('oktaGroupList', ssoParams)
            };

            me.setSetting('SSO_PARAMS', loginPayload);

            me.login(loginPayload).subscribe(() => {
                localStorage.removeItem(me.localStorageKeySSOParams);
                me.redirectToPostLoginPage();
            });

            return true;
        }

        return false;
    }

    private initService() {
        const me = this;

        const sessionStateDataRaw: string = localStorage.getItem(me.localStorageKeySession);
        const preSessionStateDataRaw: string = sessionStateDataRaw ? localStorage.getItem(me.localStorageKeyPreSession) : null;

        let sessionStateData: Session = null;
        let preSessionStateData: PreSession = null;

        if (me.router.url === '/loading') {
            me.redirectToLoginPage();
        }

        me.setRedirectURL();

        if (preSessionStateDataRaw) {
            try {
                preSessionStateData = JSON.parse(preSessionStateDataRaw);
            } catch (parseError) {
                me.logger.error('PreSession Cannot be parsed from Local Storage');
                me.logout();
                return;
            }
            if (preSessionStateData) {
                me.statePreSession = new PreSessionCreatedState(preSessionStateData);
                me.initPreSession();
            }
        } else {
            me.clearSession();
            me.redirectToLoadingPage();
            me.loadPreSession();
            return;
        }

        if (me.checkSSO()) {
            return;
        }

        if (sessionStateDataRaw) {
            try {
                sessionStateData = JSON.parse(sessionStateDataRaw);
            } catch (parseError) {
                me.logger.error('Session Cannot be parsed from Local Storage');
                me.logout();
                return;
            }

            if (sessionStateData) {
                me.stateSession = new SessionCreatedState(sessionStateData);
                setTimeout(() => {
                    me.validate().subscribe(() => {
                        console.debug('Session validated post reload');
                        me.onSessionCreated();
                        me.redirectToPostLoginPage();
                    });
                });
            }

        }

    }

    private onRouterEvent(event: RouterEvent) {
        const me = this;

        if (event instanceof NavigationStart) {

            switch (event.url) {
                case '/logout':
                    me.logout();
                    break;
                case '/loading':
                    if (!me.redirectToken) {
                        if (me.isActive()) {
                            me.redirectToPostLoginPage();
                        } else {
                            me.redirectToLoginPage();
                        }
                    }
                    break;
                case '/welcome':
                    if (!me.checkSSO() && me.isSSO() && !me.isActive() && !localStorage.getItem(me.localStorageKeySession)) {
                        window.location.href = me.preSession.ssoURL;
                        return;
                    }
                    break;
                case '/login':
                    if (me.isActive()) {
                        me.redirectToPostLoginPage();
                    }
                    break;
            }

        }

        if (event instanceof NavigationEnd) {

            switch (event.url) {
                case '/loading':
                    me.redirectToken = null;
                    break;
            }

        }
    }
}
