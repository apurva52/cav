import { Routes } from '@angular/router';
import { AccesControlUserManagementComponent } from './components/acces-control-user-management/acces-control-user-management.component';
import { AccesControlGroupManagementComponent } from './components/acces-control-group-management/acces-control-group-management.component';
import { AccessControlListComponent } from './access-control-list.component';
import { AccessControlRoutingGuardService } from './services/access-control-routing-guard.service';
import { AccessControlManagementComponent } from './components/access-control-management/access-control-management.component';
import { AccessControlCapabilitiesComponent } from './components/access-control-capabilities/access-control-capabilities.component';
export const APP_ROUTES_ACCESSCONTROL: Routes = [
    {
        path: 'access-control-V1', component: AccessControlListComponent,
        children: [
            { path: '', redirectTo: 'user', pathMatch: 'full' },
            { path: 'user', component: AccesControlUserManagementComponent, },
            { path: 'group', component: AccesControlGroupManagementComponent },
            { path: 'capabilities', component: AccessControlCapabilitiesComponent }

        ]
    }
]
