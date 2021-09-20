import { Injectable, Output } from "@angular/core";
import { MessageService } from "primeng";
import { Observable, Subject } from "rxjs";
import { AppError } from "src/app/core/error/error.model";
import { SessionService } from "src/app/core/session/session.service";
import { Store } from "src/app/core/store/store";
import { environment } from "src/environments/environment";
import { EventHistoryRequest } from "../alert-filter/services/alert-filter.model";
import { AlertFilterLoadedStatus, AlertFilterLoadingErrorStatus } from "../alert-filter/services/alert-filter.state";
import { AlertsTable, EventQuery, EventRequest, EventResponse, Events } from "./alert-table.model";
import { CounterLoadedState, CounterLoadingErrorState, EventsArrayLoadedState, EventsArrayLoadingErrorState, EventsDataLoadedState, EventsDataLoadingErrorState, EventsDataLoadingState, EventsResLoadedState, FilterEventsArrayLoadedState, FilterEventsArrayLoadingErrorState, FilterEventsArrayLoadingState } from "./alert-table.state";
import { Status } from "./alert.model";
import * as CONS from './../alert-constants'
import { DataCenter } from "src/app/shared/header/data-center-menu/service/data-center.model";



@Injectable({
	providedIn: 'root'
})
export class AlertEventService extends Store.AbstractService 
{
	level: number = -1;
	isShowGui: boolean = false;
	hierarchy: { label: string; value: number; } = { label: 'Level1', value: 0 };
	stateCount: any = {};

	error: AppError;
	@Output() isConfigureUpdated :boolean; 

	constructor(private sessionService: SessionService,
		private messageService: MessageService
		){
		super();
	}

	resetStateCount()
  {
    const me = this;
    me.stateCount[CONS.REASON.STARTED] = 0;
    me.stateCount[CONS.REASON.CONTINUOUS] = 0;
    me.stateCount[CONS.REASON.UPGRADED] = 0;
    me.stateCount[CONS.REASON.DOWNGRADED] = 0;
    me.stateCount[CONS.REASON.ENDED] = 0;
  }

		getTestRunNumber(): string
		{
			  const me = this;
			  if(me.sessionService)
						 return me.sessionService.testRun.id;
					else{
							let dc: DataCenter = JSON.parse(localStorage.getItem("dc"));
							return dc.testRun.id;
					}
		}

	/* Handle load request on event load */
	load(data: AlertsTable): Observable<Store.State>{
		const me = this;
		const output = new Subject<Store.State>();

		output.next(new EventsDataLoadingState());

		const session = me.sessionService.session;
		const path = environment.api.alert.event.load.endpoint;

		if(session){
				const cctx = {
					cck: session.cctx.cck,
					pk: session.cctx.pk,
					u: session.cctx.u,

			};

			const eventReq: EventRequest = {
				cctx: cctx,
				opType: 50,
			};

			console.log("eventReq === ", eventReq);

				me.controller.post(path, eventReq).subscribe((result: AlertsTable) => {
					data = result;
					
					output.next(new EventsDataLoadedState(data));
					output.complete();

					if(result.status.code == 0)
						result.status.msg = "Alert event(s) loaded successfully";

					me.statusUpdate(result.status);

			}, (e: any) => {

					output.error(new EventsDataLoadingErrorState(e));
					output.complete();

					console.log('Active Alert loading failed', e);
			});

			console.log("output === ", output);
			return output;
		}

		return output;
	}

	/* used at refresh and differnt level request */
	all(data: AlertsTable): Observable<Store.State>{
		const me = this;
		const output = new Subject<Store.State>();
		output.next(new FilterEventsArrayLoadingState());

		const session = me.sessionService.session;
		const path = environment.api.alert.event.all.endpoint + "?level=" + me.level;

		if(session){
				const cctx = {
					cck: session.cctx.cck,
					pk: session.cctx.pk,
					u: session.cctx.u,
			};

			const eventReq: EventRequest = {
				cctx: cctx,
				opType: 50,
			};

			console.log("eventReq === ", eventReq);

				me.controller.post(path, eventReq).subscribe((result: EventResponse) => {
					//data.data = result.events;
					me.level = result.maxHierarchy;
					output.next(new FilterEventsArrayLoadedState(result.filterdEvents));
					output.complete();

					if(result.status.code == 0)
						result.status.msg = "Alert event(s) loaded successfully";

						me.statusUpdate(result.status);

			}, (e: any) => {

					output.error(new FilterEventsArrayLoadingErrorState(e));
					output.complete();

					console.log('Active Alert loading failed', e);
			});

			console.log("output === ", output);
			return output;
		}

		return output;
	}

	/* asking data severity wise filter */
	severityEvents(data: AlertsTable, severity?: number): Observable<Store.State>{
		const me = this;
		const output = new Subject<Store.State>();
		output.next(new FilterEventsArrayLoadingState());

		const session = me.sessionService.session;
		const path = environment.api.alert.event.severity.endpoint + "?level=" + me.level + "&&severity=" + severity;

		if(session){
				const cctx = {
					cck: session.cctx.cck,
					pk: session.cctx.pk,
					u: session.cctx.u,
			};

			const eventReq: EventRequest = {
				cctx: cctx,
			};

			console.log("eventReq === ", eventReq);

				me.controller.post(path, eventReq).subscribe((result: EventResponse) => {
					//data.data = result.events;
					me.level = result.maxHierarchy;
					output.next(new FilterEventsArrayLoadedState(result.filterdEvents));
					output.complete();

					if(result.status.code == 0)
						result.status.msg = "Alert event(s) loaded successfully";
					
					me.statusUpdate(result.status);

			}, (e: any) => {

					output.error(new FilterEventsArrayLoadingErrorState(e));
					output.complete();

					console.log('Active Alert loading failed', e);
			});

			console.log("output === ", output);
			return output;
		}

		return output;
	}


	/* counter updation for load/refresh click */
	allCounter(): Observable<Store.State>{
		const me = this;
		const output = new Subject<Store.State>();

		const session = me.sessionService.session;
		const path = environment.api.alert.event.counter.endpoint;

		if(session){
				const cctx = {
					cck: session.cctx.cck,
					pk: session.cctx.pk,
					u: session.cctx.u,
			};

			const eventReq: EventRequest = {
				cctx: cctx,
			};

			console.log("eventReq === ", eventReq);

				me.controller.post(path, eventReq).subscribe((result: EventResponse) => {
					output.next(new CounterLoadedState(result.counter));
					output.complete();

			}, (e: any) => {

					output.error(new CounterLoadingErrorState(e));
					output.complete();

					console.log('Active Alert loading failed', e);
			});

			console.log("output === ", output);
			return output;
		}

		return output;
	}

	/* severity wise updation of event counter */
	severityEventCounter(severity?: number): Observable<Store.State>{
		const me = this;
		const output = new Subject<Store.State>();

		const session = me.sessionService.session;
		const path = environment.api.alert.event.count.endpoint  + "?severity=" + severity;

		if(session){
				const cctx = {
					cck: session.cctx.cck,
					pk: session.cctx.pk,
					u: session.cctx.u,
			};

			const eventReq: EventRequest = {
				cctx: cctx,
			};

				me.controller.post(path, eventReq).subscribe((result: EventResponse) => {
					output.next(new CounterLoadedState(result.counter));
					output.complete();

			}, (e: any) => {

					output.error(new CounterLoadingErrorState(e));
					output.complete();

					console.log('Active Alert loading failed', e);
			});

			return output;
		}

		return output;
	}

	/* severity(data: AlertsTable, query: EventQuery): Observable<Store.State>{
		const me = this;
		const output = new Subject<Store.State>();
  
		const session = me.sessionService.session;
		const path = environment.api.alert.event.severity.endpoint;

		const eventReq: EventRequest = {
			eventQuery: query
		};

		me.controller.post(path, eventReq).subscribe((result: Events[]) => {
			data.data = result;

			
			output.next(new EventsDataLoadedState(data));
			output.complete();

		}, (e: any) => {

				output.error(new EventsDataLoadingErrorState(e));
				output.complete();

				console.log('Active Alert loading failed', e);
		});

		return output;
	} */

	/* eventQuery(data: AlertsTable, query: EventQuery): Observable<Store.State>{
		const me = this;
		const output = new Subject<Store.State>();
  
		const session = me.sessionService.session;
		const path = environment.api.alert.event.query.endpoint;

		const eventReq: EventRequest = {
			eventQuery: query
		};

		me.controller.post(path, eventReq).subscribe((result: Events[]) => {
			data.data = result;

			
			output.next(new EventsDataLoadedState(data));
			output.complete();

		}, (e: any) => {

				output.error(new EventsDataLoadingErrorState(e));
				output.complete();

				console.log('Active Alert loading failed', e);
		});

		return output;
	} */

	forceclear(data: Events[])
	{
			const me = this;
			const output = new Subject<Store.State>();

			const session = me.sessionService.session;
			const path = environment.api.alert.event.forceclear.endpoint;

			if(session){
					const cctx = {
						cck: session.cctx.cck,
						pk: session.cctx.pk,
						u: session.cctx.u,
						prodType: session.cctx.prodType
				};

				const eventReq: EventRequest = {
					cctx: cctx,
					events : data,
					opType : 51,
				};

					me.controller.post(path, eventReq).subscribe((result: EventResponse) => {
					data = result.events,

						
						output.next(new EventsArrayLoadedState(data));
						output.complete();

						if(result.status.code == 9)
							result.status.msg = "Alert event(s) cleared successfully";
						
						me.statusUpdate(result.status);

				}, (e: any) => {

						output.error(new EventsArrayLoadingErrorState(e));
						output.complete();

						console.log('Active Alert loading failed', e);
				});

				console.log("output === ", output);
			}

			return output;
	}

	update(data: Events[])
	{
			const me = this;
			const output = new Subject<Store.State>();

			const session = me.sessionService.session;
			const path = environment.api.alert.event.update.endpoint;

			if(session){
					const cctx = {
						cck: session.cctx.cck,
						pk: session.cctx.pk,
						u: session.cctx.u,
						prodType: session.cctx.prodType
				};

				const eventReq: EventRequest = {
					cctx: cctx,
					events : data,
					opType : 52,
				};

					me.controller.post(path, eventReq).subscribe((result: EventResponse) => {
					data = result.events,

						
						output.next(new EventsResLoadedState(result));
						output.complete();
						
				}, (e: any) => {

						output.error(new EventsArrayLoadingErrorState(e));
						output.complete();

						console.log('Active Alert loading failed', e);
				});

				console.log("output === ", output);
			}

			return output;
	}

	public statusUpdate(status: Status)
	{
			const me = this;
			me.messageService.clear();
			if(status.code == 0 || status.code == 9 || status.code == 50)
			{
				 me.error = null;
					me.messageService.add({severity: 'success', summary: 'Success' , detail: status.msg });
			}
			else
			{
				me.messageService.add({severity: 'error', summary: 'Error' , detail: "Alert event(s) loading failed due to some server side error" });
				me.error = {
					message: status.detailedMesssage,
					msg: status.msg,
					error: status.msg,
					code: JSON.stringify(status.code)
				}
			}
	}

	loadHistoryFilter(payLoad: EventHistoryRequest): Observable<Store.State> {
		let response: any;
		const me = this;
		const output = new Subject<Store.State>();

		const session = me.sessionService.session;
		const path = environment.api.alert.event.loadhistory.endpoint;

		if(session){
				const cctx = {
						cck: session.cctx.cck,
						pk: session.cctx.pk,
						u: session.cctx.u,
		};
				
				payLoad.cctx = cctx;



		me.controller.post(path, payLoad).subscribe((result: AlertsTable) => {
				response = result;
				me.level = result.maxHierarchy;

				me.statusUpdate(result.status);

				output.next(new EventsDataLoadedState(response));
				output.complete();

		}, (e: any) => {

				output.error(new EventsDataLoadingErrorState(e));
				output.complete();

				console.log('Active alert loading failed', e);
		});

		return output;
}
}

	applyFilters(payLoad: EventHistoryRequest): Observable<Store.State> {
				let response: any;
				const me = this;
				const output = new Subject<Store.State>();

				const session = me.sessionService.session;
				const path = environment.api.alert.event.filter.endpoint + "?level=" + me.level;

				if(session){
						const cctx = {
								cck: session.cctx.cck,
								pk: session.cctx.pk,
								u: session.cctx.u,
				};
						
						payLoad.cctx = cctx;



				me.controller.post(path, payLoad).subscribe((result: EventResponse) => {
						response = result;
						me.level = result.maxHierarchy;

						me.statusUpdate(result.status);

						output.next(new AlertFilterLoadedStatus(response));
						output.complete();

				}, (e: any) => {

						output.error(new AlertFilterLoadingErrorStatus(e));
						output.complete();

						console.log('Active alert loading failed', e);
				});

				return output;
		}
 }

}