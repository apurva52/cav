import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { Store } from "src/app/core/store/store";
import { AppError } from "src/app/core/error/error.model";
import { AlertActionHistoryTable } from "./alert-action-history.model";
@Injectable({
	providedIn: 'root'
})

export class AlertActionHistoryService extends Store.AbstractService {

error : AppError;
	
constructor(){
		super();
	}


	genericLoad(refresh: any, loadingState: any, loadedState: any, loadingErrorState: any, path: any, payload: any): Observable<Store.State> {
		const me = this;
		const output = new Subject<Store.State>();
		setTimeout(() => {
			output.next(new loadingState());
		}, 0);

		/// DEV CODE ----------------->
		/* setTimeout(() => {
			if (reqType == 0)
				output.next(new loadedState(ALERT_RULE_DATA));
			output.complete();
		}, 2000); */
		me.controller.post(path, payload).subscribe(
			(data: any) => {
				output.next(new loadedState(me.parseAlertActionHistoryData(refresh,data)));
				output.complete();
			},
			(e: any) => {
				console.log("Rule Data loading failed");
				output.error(new loadingErrorState(e));
				output.complete();

				me.logger.error('Rule Data loading failed', e);
			}
		);
		return output;
	}
	parseAlertActionHistoryData(refresh: boolean, data: any): AlertActionHistoryTable {
		const me = this;
		let input: any = {};
		if (refresh){
			input = data;
		}
		else{
			input['data'] = data.actionsHistory;
			input['status'] = data.status;
		}
		return input;
	}
}


