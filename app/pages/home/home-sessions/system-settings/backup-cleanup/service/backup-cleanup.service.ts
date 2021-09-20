import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
    BackupCleanupLoadedState, BackupCleanupLoadingErrorState, BackupCleanupLoadingState
} from './backup-cleanup.state';

@Injectable({
    providedIn: 'root'
})

export class BackupCleanupService extends Store.AbstractService {
    LoadBackupCleanupData(pathname, file): Observable<Store.State> {
        let path = environment.api.netvision.backupcleanup.endpoint;
        path = path + "?" + "&path=" + pathname + "&name=" + file;
        let base = environment.api.netvision.base.base;
        const me = this;
        const output = new Subject<Store.State>();
        setTimeout(() => { output.next(new BackupCleanupLoadingState(null)) }, 0);
        me.controller.get(path, null, base).subscribe((data1) => {
            var r = { data: data1 }
            output.next(new BackupCleanupLoadedState(r));
            output.complete();
        },
            (e: any) => {
                output.error(new BackupCleanupLoadingErrorState(e));
                me.logger.error('User Options loading failed', e);
                output.complete();
            }
        );
        return output;
    }

}







