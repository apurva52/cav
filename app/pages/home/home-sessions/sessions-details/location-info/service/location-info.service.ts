import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
//import { SessionPageMenuOption } from './session-page.model';
import {
    LocationInfoLoadedState, LocationInfoLoadingErrorState, LocationInfoLoadingState
} from './location-info-state';


@Injectable({
    providedIn: 'root'
})

export class LocationInfoService extends Store.AbstractService {
    LoadLocationInfoData(): Observable<Store.State> {
        //let path = environment.api.nv.sessionpage;
        const me = this;
        //var url = "netvision/rest/webapi/pagedetail?access_token=563e412ab7f5a282c15ae5de1732bfd1&filterCriteria=%7B%22visited%22%3Atrue%2C%22lastViewed%22%3Afalse%2C%22resourceVersion%22%3A1%2C%22prevSID%22%3A%220%22%2C%22maxOnLoad%22%3A10.31%2C%22avgOnLoad%22%3A3.83%2C%22maxTTDI%22%3A2.11%2C%22avgTTDI%22%3A0.88%2C%22botFlag%22%3Afalse%2C%22botData%22%3Anull%2C%22badBot%22%3Atrue%2C%22authFailed%22%3Afalse%2C%22authentic%22%3Afalse%2C%22windowsBrowserFlag%22%3Afalse%2C%22browserFlag%22%3Afalse%2C%22androidflag%22%3Afalse%2C%22windowsappflag%22%3Afalse%2C%22AndroidBrowserFlag%22%3Afalse%2C%22appcrashflag%22%3Afalse%2C%22device_location_infoflag%22%3Afalse%2C%22device_infoflag%22%3Afalse%2C%22deviceperformanceflag%22%3Afalse%2C%22methodtraceflag%22%3Afalse%2C%22sid%22%3A%22977574598566477863%22%2C%22pageCount%22%3A3%2C%22channel%22%3A%7B%22id%22%3A0%2C%22name%22%3A%22Others%22%7D%2C%22userAgent%22%3A%22Mozilla%2F5.0%20(Windows%20NT%2010.0%3B%20Win64%3B%20x64)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F88.0.4324.104%20Safari%2F537.36%22%2C%22screenResolution%22%3A%7B%22id%22%3A101%2C%22dim%22%3A%221366x768%22%7D%2C%22os%22%3A%7B%22id%22%3A10%2C%22name%22%3A%22Windows%22%2C%22version%22%3A%22RT%22%2C%22icon%22%3A%22%2F..%2F..%2Fassets%2Fchrome.png%22%7D%2C%22storeid%22%3A-1%2C%22store%22%3A%7B%22id%22%3A-1%2C%22name%22%3A%22Others%22%2C%22districtId%22%3A-1%2C%22countryId%22%3A-1%2C%22city%22%3A%22Others%22%2C%22street%22%3A%22Others%22%2C%22region%22%3A%22Others%22%2C%22_storenameforfilter%22%3A%22Others%22%7D%2C%22orderTotal%22%3A912%2C%22orderCount%22%3A%222%22%2C%22deviceType%22%3A%7B%22name%22%3A%22Mobile%22%2C%22font%22%3A%22fa%20fa-mobile%22%7D%2C%22applicationName%22%3A%22%22%2C%22applicationVersion%22%3A%22%22%2C%22userSegments%22%3A%5B%5D%2C%22duration%22%3A%2200%3A00%3A14%22%2C%22trnum%22%3A-1%2C%22events%22%3A%5B%7B%22id%22%3A8%2C%22name%22%3A%22AjaxError%22%2C%22icon%22%3A%22%2FeventIcons%2Fexception.png%22%2C%22description%22%3A%22Ajax%20Call%20Failure%20Event%22%2C%22count%22%3A2%7D%2C%7B%22id%22%3A1%2C%22name%22%3A%22Feedback%22%2C%22icon%22%3A%22%2FeventIcons%2FFeedback.png%22%2C%22description%22%3A%22Feedback%20Event%22%2C%22count%22%3A2%7D%2C%7B%22id%22%3A13%2C%22name%22%3A%22PageDistorted%22%2C%22icon%22%3A%22%2FeventIcons%2Fpagebreak.png%22%2C%22description%22%3A%22Web%20Page%20Distorted%22%2C%22count%22%3A2%7D%2C%7B%22id%22%3A10%2C%22name%22%3A%22SlowServerResponseTime%22%2C%22icon%22%3A%22%2FeventIcons%2Fslow.png%22%2C%22description%22%3A%22ND%20Slow%20Transaction%22%2C%22count%22%3A2%7D%5D%2C%22sessionHasTxn%22%3Afalse%2C%22browser%22%3A%7B%22id%22%3A7%2C%22name%22%3A%22AmazonSilk%22%2C%22icon%22%3A%22null%22%7D%2C%22browserVersion%22%3A%2288.0%22%2C%22browserLang%22%3A%22en-US%22%2C%22browserCodeName%22%3A%22Mozilla%22%2C%22clientIp%22%3A%2210.20.0.59%22%2C%22startTime%22%3A%221616143713%22%2C%22endTime%22%3A%221616143727%22%2C%22expir'";
        const output = new Subject<Store.State>();
        me.controller.get('netvision/rest/webapi/sessionfilter?filterCriteria=%7B"limit"%3A15%2C"offset"%3A0%2C"sessionCount"%3Afalse%2C"orderBy"%3A%5B"sessionstarttime"%5D%2C"output"%3A%5B%5D%2C"timeFilter"%3A%7B"last"%3A"1%20Year"%2C"startTime"%3A""%2C"endTime"%3A""%7D%2C"previousSessFlag"%3Afalse%2C"particularPage"%3Afalse%2C"autoCommand"%3A%7B"particularPage"%3Afalse%2C"pageTab"%3A%7B"jserrorflag"%3A%7B"jsError"%3Afalse%7D%2C"xhrdata"%3A%7B"httpFlag"%3Afalse%7D%2C"transactiondata"%3A%7B"tFlag"%3Afalse%7D%2C"eventdata"%3A%7B"eventFlag"%3Afalse%7D%2C"navigationflag"%3A%7B"navflag"%3Afalse%7D%7D%7D%2C"bpAttributeFilter"%3A%7B%7D%2C"customAttributeFilter"%3A%7B%7D%2C"scanoffset"%3A0%2C"dataFlag"%3Afalse%2C"uUID"%3A0%2C"filtermode"%3Anull%2C"lastTime"%3Atrue%2C"browser"%3A"10"%7D&access_token=563e412ab7f5a282c15ae5de1732bfd1', 'null', '/').subscribe((data1) => {
            //var r = { data: data1 }
            let temp = JSON.parse(unescape(data1.data[0].ff3)).linfo;
            output.next(new LocationInfoLoadedState(temp));
            output.complete();
        },
            (e: any) => {
                output.error(new LocationInfoLoadingErrorState(e));


                me.logger.error('Device Info loading failed', e);
            }
        );
        return output;
    }

}





