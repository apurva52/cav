import { Injectable, Output } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { SessionService } from "src/app/core/session/session.service";
import { Store } from "src/app/core/store/store";
import { environment } from "src/environments/environment";
import { hierarchicalPayload } from "../../service/alert.model";
import { HierarchialDataLoadedState, HierarchialDataLoadingErrorState } from "../../service/alert.state";
import { Maintenance, MaintenanceRequest, MaintenanceResponse, MaintenanceTable } from "./alert-maintenance.model";
import { MaintenanceAddLoadedState, MaintenanceAddLoadingErrorState, MaintenanceDataLoadedState, MaintenanceDataLoadingErrorState, MaintenanceDataLoadingState, MaintenanceEditLoadedState, MaintenanceEditLoadingErrorState } from "./alert-maintenance.state";



@Injectable({
	providedIn: 'root'
})
export class AlertMaintenanceService extends Store.AbstractService {
	GET_MAINTENANCES = 10;
	ADD_MAINTENANCE = 11;
	UPDATE_MAINTENANCE = 12;
	DELETE_MAINTENANCE = 13;
	IMPORT_MAINTENANCE = 14;
	EXPORT_MAINTENANCE = 15;

	PURGED_MAINTENANCE =16;
	constructor(private sessionService: SessionService){
		super();
	}

	load(): Observable<Store.State>{
		const me = this;
		const output = new Subject<Store.State>();

		output.next(new MaintenanceDataLoadingState(null));

		const session = me.sessionService.session;
		const path = environment.api.alert.maintenance.load.endpoint;

		if(session){
				const cctx = {
					cck: session.cctx.cck,
					pk: session.cctx.pk,
					u: session.cctx.u,

			};

			const maintenanceReq: MaintenanceRequest = {
				cctx: cctx,
				opType: this.GET_MAINTENANCES,
				clientId:"-1",
				appId:"-1"
			};

			console.log("maintenanceReq === ", maintenanceReq);

				me.controller.post(path, maintenanceReq).subscribe((result: MaintenanceTable) => {
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

	all(): Observable<Store.State>{
		const me = this;
		const output = new Subject<Store.State>();

		const session = me.sessionService.session;
		const path = environment.api.alert.maintenance.all.endpoint;

		if(session){
				const cctx = {
					cck: session.cctx.cck,
					pk: session.cctx.pk,
					u: session.cctx.u,

			};

			const maintenanceReq: MaintenanceRequest = {
				cctx: cctx,
				opType: this.GET_MAINTENANCES,
				clientId:"-1",
				appId:"-1"
			};

			console.log("maintenanceReq === ", maintenanceReq);

				me.controller.post(path, maintenanceReq).subscribe((result: MaintenanceResponse) => {
					output.next(new MaintenanceAddLoadedState(result));
					output.complete();

			}, (e: any) => {

					output.error(new MaintenanceAddLoadingErrorState(e));
					output.complete();

					console.log('Maintenance Refresh layout loading failed', e);
			});

			console.log("output === ", output);
			return output;
		}

		return output;
	}

	delete(maintenances : Maintenance[]): Observable<Store.State>{
		const me = this;
		const output = new Subject<Store.State>();

		const session = me.sessionService.session;
		const path = environment.api.alert.maintenance.delete.endpoint;

		if(session){
				const cctx = {
					cck: session.cctx.cck,
					pk: session.cctx.pk,
					u: session.cctx.u,

			};

			const maintenanceReq: MaintenanceRequest = {
				cctx: cctx,
				opType: this.DELETE_MAINTENANCE,
				clientId:"-1",
				appId:"-1",
				maintenances: maintenances
			};

			console.log("maintenanceReq === ", maintenanceReq);

				me.controller.post(path, maintenanceReq).subscribe((result: MaintenanceResponse) => {
					output.next(new MaintenanceAddLoadedState(result));
					output.complete();

			}, (e: any) => {

					output.error(new MaintenanceAddLoadingErrorState(e));
					output.complete();

					console.log('Maintenance Delete layout loading failed', e);
			});

			console.log("output === ", output);
			return output;
		}

		return output;
	}
	
	loadHierarcialData(payload: any): Observable<Store.State> 
	{
			const me = this;
			const output = new Subject<Store.State>();

			// setTimeout(() => {
			//   output.next(new HierarchialDataLoadedState());
			// }, 0);

			let path = environment.api.dashboard.hierarchical.endpoint;


			this.controller.post(path, payload).subscribe(
					(data) => {
							output.next(new HierarchialDataLoadedState(data));
							output.complete();
					},
					(error: any) => {
							console.log("post call error")
							output.error(new HierarchialDataLoadingErrorState(error));
							output.complete();
					}
			);
			return output;
 }

 	add(maintenances : Maintenance[]): Observable<Store.State>{
		const me = this;
		const output = new Subject<Store.State>();
		const session = me.sessionService.session;
		const path = environment.api.alert.maintenance.add.endpoint;

		if(session){
				const cctx = {
					cck: session.cctx.cck,
					pk: session.cctx.pk,
					u: session.cctx.u,

			};

			const maintenanceReq: MaintenanceRequest = {
				cctx: cctx,
				opType: this.ADD_MAINTENANCE,
				clientId:"-1",
				appId:"-1",
				maintenances: maintenances
			};

			console.log("maintenanceReq === ", maintenanceReq);

				me.controller.post(path, maintenanceReq).subscribe((result: MaintenanceResponse) => {
					maintenances = result.maintenances;

					
					output.next(new MaintenanceAddLoadedState(result));
					output.complete();

			}, (e: any) => {

					output.error(new MaintenanceAddLoadingErrorState(e));
					output.complete();

					console.log('Maintenance Adding layout loading failed', e);
			});

			console.log("output === ", output);
			return output;
		}

		return output;
	 }

	 edit(maintenances : Maintenance[]): Observable<Store.State>{
		const me = this;
		const output = new Subject<Store.State>();

		const session = me.sessionService.session;
		const path = environment.api.alert.maintenance.update.endpoint;

		if(session){
				const cctx = {
					cck: session.cctx.cck,
					pk: session.cctx.pk,
					u: session.cctx.u,

			};

			const maintenanceReq: MaintenanceRequest = {
				cctx: cctx,
				opType: this.UPDATE_MAINTENANCE,
				clientId:"-1",
				appId:"-1",
				maintenances: maintenances
			};

			console.log("maintenanceReq === ", maintenanceReq);

				me.controller.post(path, maintenanceReq).subscribe((result: MaintenanceResponse) => {
					maintenances = result.maintenances;

					
					output.next(new MaintenanceEditLoadedState(result));
					output.complete();

			}, (e: any) => {

					output.error(new MaintenanceEditLoadingErrorState(e));
					output.complete();

					console.log('Maintenance Editing loading failed', e);
			});

			console.log("output === ", output);
			return output;
		}

		return output;
	 }

	 history(): Observable<Store.State>{
		const me = this;
		const output = new Subject<Store.State>();

		const session = me.sessionService.session;
		const path = environment.api.alert.maintenance.purged.endpoint;

		if(session){
				const cctx = {
					cck: session.cctx.cck,
					pk: session.cctx.pk,
					u: session.cctx.u,

			};

			const maintenanceReq: MaintenanceRequest = {
				cctx: cctx,
				opType: this.PURGED_MAINTENANCE,
				clientId:"-1",
				appId:"-1"
			};

			console.log("maintenanceHistoryReq === ", maintenanceReq);

				me.controller.post(path, maintenanceReq).subscribe((result: MaintenanceResponse) => {
					output.next(new MaintenanceAddLoadedState(result));
					output.complete();

			}, (e: any) => {

					output.error(new MaintenanceAddLoadingErrorState(e));
					output.complete();

					console.log('Maintenance History layout loading failed', e);
			});

			console.log("output === ", output);
			return output;
		}

		return output;
	}



}