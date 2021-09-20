import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
    ParserLoadedState, ParserLoadingErrorState, ParserLoadingState
} from './parser-setting.state';

@Injectable({
    providedIn: 'root'
})

export class ParserService extends Store.AbstractService {
    LoadParserData(): Observable<Store.State> {
        let path = environment.api.netvision.parser.endpoint;
        let base = environment.api.netvision.base.base;
        const me = this;
        const output = new Subject<Store.State>();
        setTimeout(() => { output.next(new ParserLoadingState(null)) }, 0);
        me.controller.get(path, null, base).subscribe((data1) => {
            var r = { data: data1 }
            output.next(new ParserLoadedState(r));
            output.complete();
        },
            (e: any) => {
                output.error(new ParserLoadingErrorState(e));
                me.logger.error('User Options loading failed', e);
                output.complete();
            }
        );
        return output;
    }

}




