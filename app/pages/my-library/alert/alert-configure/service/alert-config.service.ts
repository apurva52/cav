import { Injectable, Input } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { SessionService } from "src/app/core/session/session.service";
import { Store } from "src/app/core/store/store";
import { environment } from "src/environments/environment";
import { HierarchialDataLoadedState, HierarchialDataLoadingErrorState } from "../../service/alert.state";
import { Config, ConfigRequest, ConfigResponse } from "./alert-config.model";
import { ConfigDataLoadedState, ConfigDataLoadingErrorState } from "./alert-config.state";



@Injectable({
	providedIn: 'root'
})
export class AlertConfigService extends Store.AbstractService {
	@Input() severityFlag:boolean;
	constructor(private sessionService: SessionService){
		super();
	}

	load(): Observable<Store.State>{
		const me = this;
		const output = new Subject<Store.State>();

		const session = me.sessionService.session;
		const path = environment.api.alert.config.all.endpoint;

		if(session){
				const cctx = {
					cck: session.cctx.cck,
					pk: session.cctx.pk,
					u: session.cctx.u,

			};

			const configReq: ConfigRequest = {
				cctx: cctx	
			};

			console.log("ConfigReq === ", configReq);

				me.controller.post(path, configReq).subscribe((result: ConfigResponse) => {
					//data = result.config;
					console.log(result,"========================================");
					
					output.next(new ConfigDataLoadedState(result));
					output.complete();

			}, (e: any) => {

					output.error(new ConfigDataLoadingErrorState(e));
					output.complete();

					console.log('Dashboard layout loading failed', e);
			});

			console.log("output === ", output);
			return output;
		}

		return output;
	}

 update(data){
	console.log(data,"===========================================");
	//return this._http.post(path,payload);
	const me = this;
		const output = new Subject<Store.State>();

		const session = me.sessionService.session;
		const path = environment.api.alert.config.update.endpoint;

		if(session){
				const cctx = {
					cck: session.cctx.cck,
					pk: session.cctx.pk,
					u: session.cctx.u,

			};

			const configReq: ConfigRequest = {
				cctx: cctx,
				config:data
			};

			console.log("ConfigReq === ", configReq);
			this.controller.post(path,configReq).subscribe((result: ConfigResponse) => {
					//data = result.config;
					
					output.next(new ConfigDataLoadedState(result));
					output.complete();

			}, (e: any) => {

					output.error(new ConfigDataLoadingErrorState(e));
					output.complete();

					console.log('Dashboard layout loading failed', e);
			});

			console.log("output === ", output);
			return output;
		}

		return output;
 }

}