import { Injectable, Output } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { SchedulesDeleteLoadedState, SchedulesDeleteLoadingErrorState, SchedulesDeleteLoadingState,StatusChangeLoadedState,StatusChangeLoadingErrorState,StatusChangeLoadingState,SchedulesTableLoadedState, SchedulesTableLoadingErrorState, SchedulesTableLoadingState , editTaskLoadingState, editTaskLoadedState, editTaskLoadingErrorState, onDownloadLoadingState,onDownloadLoadedState,onDownloadLoadingErrorState} from './scheduler.state';
import { environment } from 'src/environments/environment';
import { SessionService } from 'src/app/core/session/session.service';
import { DeleteTask, EnableDisableTask, SchedulesTable, DownloadTask, EditTask } from './schedules.model';

@Injectable({
  providedIn: 'root'
})

export class SchedulesService extends Store.AbstractService {
  constructor(public sessionService: SessionService) { 
    super();
  }
  rowDataFromParent: any;
  isEdit:boolean;
  dataTobeEdit: any;
  isScheduleReportButtonClicked: boolean = false; 
  paginateEvent:any;

  
  loadAvailableSchedularTaskTable(path,payload): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new SchedulesTableLoadingState());
    }, 0);

    me.controller.post(path, payload).subscribe((data: SchedulesTable[]) => {
      let dataObj: any = data;
      output.next(new SchedulesTableLoadedState(dataObj));
      output.complete();
    }, (e: any) => {

      output.error(new SchedulesTableLoadingErrorState(e));
      output.complete();

      me.logger.error('loading failed', e);
    });

    return output; 
  }

  getDeleteTask(taskInfo):Observable<Store.State>{
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new SchedulesDeleteLoadingState());
    }, 0);

    const payload = {
        cctx:  me.sessionService.session.cctx,
        taskInfoList:taskInfo,
      };
    const path = environment.api.report.SchedulerDelete.endpoint;
    const base = environment.api.core.defaultBase;

    me.controller.post(path,payload).subscribe((data: DeleteTask[]) => {
       
      output.next(new SchedulesDeleteLoadedState(data));
      output.complete();
      },
      (e: any) => {
        output.error(new SchedulesDeleteLoadingErrorState(e));
        output.complete();
        me.logger.error('loading failed', e);
      }
    );

    return output;
  }

  statusChange(row):Observable<Store.State>{
    const me = this;
    const output = new Subject<Store.State>();
    
    setTimeout(() => {
      output.next(new StatusChangeLoadingState());
    }, 0);

    const payload = {
      cctx:  me.sessionService.session.cctx,
      taskInfoList: [
        {
        taskType: row['taskType'],
        taskId: row['taskId'],
        status:row['status']
        }
        ]
    };
    const path = environment.api.report.SchedulerEnableDisable.endpoint;
    const base = environment.api.core.defaultBase;
    me.controller.post(path,payload).subscribe((data:EnableDisableTask[]) => {
      
      if( row['status'] === "Active"){
      row['status']  = "Inactive";
      }else{
        row['status']  = "Active";
      }
      output.next(new StatusChangeLoadedState(data));
      output.complete();
      },
      (e: any) => {
        output.error(new StatusChangeLoadingErrorState(e));
        output.complete();
        me.logger.error('loading failed', e);
      }
    );

    return output; 

  }
  editTask(row):Observable<Store.State>{
    const me = this;
    me.isScheduleReportButtonClicked = false;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new editTaskLoadingState());
    }, 0);
    
    const payload = {
        cctx:  me.sessionService.session.cctx,
        taskInfoList: [
          {
          taskType: row['taskType'],
          taskId: row['taskId'],
          status:row['status']
          }
          ]
      };
    const path = environment.api.report.editTask.endpoint;
    const base = environment.api.core.defaultBase;

    me.controller.post(path,payload).subscribe((data: EditTask[]) => {
      
      output.next(new editTaskLoadedState(data));
      output.complete();
      },
      (e: any) => {
        output.error(new editTaskLoadingErrorState(e));
        output.complete();
        me.logger.error('loading failed', e);
      }
    );

    return output;
  }
  downloadTableData(type, dataArr,header,skipColumn):Observable<Store.State>{
    const me = this;
    const output = new Subject<Store.State>();
    
    setTimeout(() => {
      output.next(new onDownloadLoadingState());
    }, 0);

    let arrData :any []=[];
 
    for (let i = 0; i < dataArr.length; i++) {
      let rowDataObj = dataArr[i];
      let rowDataArr :any []=[];
      rowDataArr.push((i+1).toString);
      rowDataArr.push(rowDataObj.taskType);
      rowDataArr.push(rowDataObj.taskDes);
      rowDataArr.push(rowDataObj.schTime);
      rowDataArr.push(rowDataObj.expiryTime);
      rowDataArr.push(rowDataObj.status);
      arrData.push(rowDataArr);
    }
    // let arrData = [];
    
    // for(let i=0;i<dataArr.length;i++){
    //   let data= Object.values(dataArr[i]);
    //   arrData.push(data);
    // }

    const payload = {
      testRun: me.sessionService.session.testRun.id,
      type: type,
      skipColumn: skipColumn.join(),
      rowData: arrData,
      cctx: me.sessionService.session.cctx,
      title: "Scheduler",
      header: header,
      colWidth: [125,125,125,125,125,125,125,125],
     };
    const path = environment.api.downloadData.load.endpoint;
    const base = environment.api.core.defaultBase;

    me.controller.post(path,payload).subscribe((data: DownloadTask[]) => {
       
      output.next(new onDownloadLoadedState(data));
      output.complete();
      },
      (e: any) => {
        output.error(new onDownloadLoadingErrorState(e));
        output.complete();
        me.logger.error('loading failed', e);
      }
    );

    return output;
  }
}
