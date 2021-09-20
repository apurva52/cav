import { Injectable } from "@angular/core";
import { ALERT_MODULES } from "src/app/pages/my-library/alert/alert-constants";
import { ProductPermissionGroup } from "../../../core/session/session.model";


@Injectable({
	providedIn: 'root'
})
export class AlertCapabilityService {
	
	public moduleCapability = {};
	constructor(){
			const me = this;
			me.resetCapability();
	}

	updateCapabilityOnLogIn(permissions: ProductPermissionGroup[])
	{
		  const me = this;
				//console.log("permissions ---- ", permissions);
				if(permissions)
				{
						for(let index in permissions)
						{			
									if(permissions[index].key == "Alert")
									{
											let modulePermissions = permissions[index].permissions;
											for(let index in modulePermissions)
											{
														if(modulePermissions[index].feature == "Active Alert")
																me.moduleCapability[ALERT_MODULES.ALERT_EVENT] = modulePermissions[index].permission;
														else if(modulePermissions[index].feature == "Alert Rule")
																me.moduleCapability[ALERT_MODULES.ALERT_RULE] = modulePermissions[index].permission;
														else if(modulePermissions[index].feature == "Alert Actions")
																me.moduleCapability[ALERT_MODULES.ALERT_ACTION] = modulePermissions[index].permission;
														else if(modulePermissions[index].feature == "Alert Maintenance Window")
																me.moduleCapability[ALERT_MODULES.ALERT_MAINTENANCE] = modulePermissions[index].permission;
														else if(modulePermissions[index].feature == "Alert Settings")
																me.moduleCapability[ALERT_MODULES.ALERT_CONFIGURATION] = modulePermissions[index].permission;
														else if(modulePermissions[index].feature == "Alert Action History")
															me.moduleCapability[ALERT_MODULES.ALERT_ACTION_HISTORY] = modulePermissions[index].permission;
											}
									}
						}
				}
				else
						me.resetCapability();
						
				//console.log("me.moduleCapability: ----", me.moduleCapability);
	}

	isModuleOnlyReadable(module: string)
	{
		  const me = this;
		  return me.moduleCapability[module] <= 4;
	}

	isHasPermission(module: string)
	{
			const me = this;
			return me.moduleCapability[module] > 0;
	}

	resetCapability()
	{
		 const me = this;
			me.moduleCapability[ALERT_MODULES.ALERT_EVENT] = 4;
			me.moduleCapability[ALERT_MODULES.ALERT_RULE] = 4;
			me.moduleCapability[ALERT_MODULES.ALERT_ACTION] = 4;
			me.moduleCapability[ALERT_MODULES.ALERT_MAINTENANCE] = 4;
			me.moduleCapability[ALERT_MODULES.ALERT_CONFIGURATION] = 4;
	}
}