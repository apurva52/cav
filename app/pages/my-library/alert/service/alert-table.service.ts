import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { SessionService } from "src/app/core/session/session.service";
import { Store } from "src/app/core/store/store";
import { environment } from "src/environments/environment";
import { MaintenanceRequest, MaintenanceResponse, MaintenanceTable } from "./alert.model";
import { MaintenanceDataLoadedState, MaintenanceDataLoadingErrorState } from "./alert-table.state";



@Injectable({
	providedIn: 'root'
})
export class AlertEventService extends Store.AbstractService {

	constructor(private sessionService: SessionService){
		super();
	}

	load(data: MaintenanceTable): Observable<Store.State>{
		const me = this;
		const output = new Subject<Store.State>();

		const session = me.sessionService.session;
		const path = environment.api.maintenance.load.endpoint;

		if(session){
				const cctx = {
					cck: session.cctx.cck,
					pk: session.cctx.pk,
					u: session.cctx.u,

			};

			const maintenanceReq: MaintenanceRequest = {
				cctx: cctx,
			};

			console.log("maintenanceReq === ", maintenanceReq);

				me.controller.post(path, maintenanceReq).subscribe((result: MaintenanceTable) => {
					data = result;

					
					output.next(new MaintenanceDataLoadedState(result));
					output.complete();

			}, (e: any) => {

					output.error(new MaintenanceDataLoadingErrorState(e));
					output.complete();

					console.log('Dashboard layout loading failed', e);
			});

			console.log("output === ", output);
			return output;
		}

		return output;
	}
}