import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { environment } from 'src/environments/environment';
import { FileImport } from './file-import.model';
import { FileImportLoadedState, FileImportLoadingErrorState, FileImportLoadingState } from './file-import.state';

@Injectable({
  providedIn: 'root'
})
export class FileImportService extends Store.AbstractService{
  private fileInfo = new BehaviorSubject<any>({});


  constructor() { 
    super();
  }

  getFileImportData(data: FileImport): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new FileImportLoadingState());
    }, 0);

      const path = environment.api.dashboard.fileImport.endpoint;
        me.controller.post(path, data).subscribe(
          (result: any) => {
              output.next(new FileImportLoadedState(result));
              output.complete();
          },
          (e: any) => {
            output.error(new FileImportLoadingErrorState(e));
            output.complete();

            me.logger.error('File import availability', e);
          }
        );
      //}
      return output;
    }

    setFileImportInfo(user: any) {
      this.fileInfo.next(user);
    }
  
    getFileImportInfo() {
      return this.fileInfo.asObservable();
    }
  }

