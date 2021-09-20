import { Injectable } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';

@Injectable({
    providedIn: 'root'
})
export class SchedulerService {

    private intervalMap: { [key: string]: Observable<number> } = {};
    private subscriptionMap: { [key: string]: Subscription } = {};

    constructor(private sessionService: SessionService) { }

    subscribe(scheduleName: string, cb: () => void, progressIntervalKey: string = 'progressInterval'): Subscription {
        const me = this;
        if (me.subscriptionMap[scheduleName]) {
            return me.subscriptionMap[scheduleName];
        }
        me.subscriptionMap[scheduleName] = me.getIntervalObserver(progressIntervalKey).subscribe(cb);
        return me.subscriptionMap[scheduleName];
    }

    unsubscribe(scheduleName: string): void {
        const me = this;
        if (me.subscriptionMap[scheduleName]) {
            me.subscriptionMap[scheduleName].unsubscribe();
            me.subscriptionMap[scheduleName] = null;
        }
    }

    private getIntervalObserver(progressIntervalKey: string): Observable<number> {
        const me = this;

        if (me.intervalMap[progressIntervalKey]) {
            return me.intervalMap[progressIntervalKey];
        }

        const ms: number = me.sessionService.getInterval(progressIntervalKey);

        me.intervalMap[progressIntervalKey] = interval(ms);

        return me.intervalMap[progressIntervalKey];
    }

    
}
