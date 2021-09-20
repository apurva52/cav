import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { SessionService } from "src/app/core/session/session.service";
import { Store } from "src/app/core/store/store";
import { HierarchialDataLoadingErrorState } from "src/app/shared/dashboard/sidebars/parameters/service/parameters.state";
import { environment } from "src/environments/environment";
import { Action, ActionRequest, ActionResponse, ActionTable, Chart, Email, Report, SMS } from "./alert-actions.model";
import { ActionArrayDeletedState, ActionArrayDeletingErrorState, ActionArrayDeletingState, ActionDataLoadedState, ActionDataLoadingErrorState, ActionDataLoadingState, ActionResponseLoadedState, ActionResponseLoadeErrorState, ActionResponseLoadingState } from "./alert-actions.state";
import { ActionListLoadedState, ActionListLoadingErrorState } from "./../../alert-rules/alert-configuration/service/alert-config.state";
import * as CONS from '../service/alert-action-constants'

@Injectable({
	providedIn: 'root'
})
export class AlertActionService extends Store.AbstractService {

	actionType: number;
  public showActionDialog = new Subject<boolean>();
  showActionDialog$ = this.showActionDialog.asObservable();

	constructor(private sessionService: SessionService) {
		super();
	}

	load(onLoad: boolean): Observable<Store.State> {
		const me = this;
		const output = new Subject<Store.State>();
		output.next(new ActionDataLoadingState());
		const session = me.sessionService.session;
		let path;
		if (onLoad)
			path = environment.api.alert.action.load.endpoint;
		else
			path = environment.api.alert.action.all.endpoint;

		if (session) {
			const cctx = {
				cck: session.cctx.cck,
				pk: session.cctx.pk,
				u: session.cctx.u,
			};

			const actionReq: ActionRequest = {
				cctx: cctx,
				opType:  CONS.ACTION_OPERATONS.GET_ACTIONS,
				clientId: "-1",
				appId: "-1"
			};
			me.controller.post(path, actionReq).subscribe(
				(result: ActionTable) => {
					output.next(new ActionDataLoadedState(me.parseActionData(onLoad, result)));
				output.complete();

			}, (e: any) => {

				output.error(new ActionDataLoadingErrorState(e));
				output.complete();
			});
			return output;
		}
		return output;
	}

	parseActionData(isLoadCall: boolean, resdata: ActionTable): ActionTable {
		if (isLoadCall) {
			const load: ActionTable = {
				data: resdata.data,
				status: resdata.status,
				headers: resdata.headers,
				paginator: resdata.paginator,
				extensions: resdata.extensions,
				tableFilter: true,
			};
			return load;
		}
		else {
			const all: ActionTable = {
				data: resdata.actions,
				status: resdata.status,
				extensions: resdata.extensions,
			};
			return all;
		}
	}

	genericActionPayload(data?: Action[], actionType?: number): Observable<Store.State> {
		const me = this;
		const output = new Subject<Store.State>();
		output.next(new ActionResponseLoadingState());
		me.actionType = actionType;

		const session = me.sessionService.session;
		var path;

		if (actionType == CONS.ACTION_OPERATONS.ADD_ACTIONS)
			path = environment.api.alert.action.add.endpoint;
		else
			path = environment.api.alert.action.update.endpoint;

		if (session) {
			const cctx = {
				cck: session.cctx.cck,
				pk: session.cctx.pk,
				u: session.cctx.u
			};

			console.log("data in add action service is: ", data)
			const actionReq: ActionRequest = {
				actions: data,
				cctx: cctx,
				opType: actionType,
				clientId: "-1",
				appId: "-1"
			}

			console.log("actionReq------>>>> ", actionReq)

			me.controller.post(path, actionReq).subscribe((result: ActionResponse) => {
				//data = result.actions;

				output.next(new ActionResponseLoadedState(result));
				output.complete();

			}, (e: any) => {
				output.error(new ActionResponseLoadeErrorState(e));
				output.complete();
			});

			return output;
		}
		return output;
	}

	all(): Observable<Store.State> {
		const me = this;
		const output = new Subject<Store.State>();

		let data: ActionResponse;
		const session = me.sessionService.session;
		const path = environment.api.alert.action.all.endpoint;

		if (session) {
			const cctx = {
				cck: session.cctx.cck,
				pk: session.cctx.pk,
				u: session.cctx.u,
			};

			const actionReq: ActionRequest = {
				cctx: cctx,

			};
			me.controller.post(path, actionReq).subscribe((result: ActionResponse) => {
				data = result;

				output.next(new ActionListLoadedState(data));
				output.complete();

			}, (e: any) => {

				output.error(new ActionListLoadingErrorState(e));
				output.complete();
			});
			return output;
		}
		return output;
	}


	delete(data: Action[]) {
		const me = this;
		const output = new Subject<Store.State>();
		output.next(new ActionArrayDeletingState());
		const session = me.sessionService.session;
		const path = environment.api.alert.action.delete.endpoint;

		if (session) {
			const cctx = {
				cck: session.cctx.cck,
				pk: session.cctx.pk,
				u: session.cctx.u,
				prodType: session.cctx.prodType
			};

			const actionReq: ActionRequest = {
				cctx: cctx,
				actions: data,
				opType: CONS.ACTION_OPERATONS.DELETE_ACTIONS,
				clientId: "-1",
				appId: "-1"
			};
			console.log("actionReq ===", actionReq);

			me.controller.post(path, actionReq).subscribe((result: ActionResponse) => {
				data = result.actions,

				output.next(new ActionArrayDeletedState(result));
				output.complete();

			}, (e: any) => {
				output.error(new ActionArrayDeletingErrorState(e));
				output.complete();

				console.log('Action loading failed', e);
			});

			console.log("output === ", output);
		}

		return output;

	}

	/**
   * this method is used for get request to compile pattern
   * @param patternString
   * @param baseString
   */
	 patternTest(patternString:string, baseString:string)
	 {
	   let reqString = {"baseString":baseString, "patternString":patternString};
	   return this.controller.post("10.10.50.10:4433" + "/DashboardServer/web/AlertDataService/testPattern?", reqString)//.map(res =><any>res);
	 }

  public set showHideDialogue(value: boolean) {
    this.showActionDialog.next(value);
  }
}
