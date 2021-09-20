import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule, CardModule, CheckboxModule, DropdownModule, PanelModule, RadioButtonModule, TableModule, ToolbarModule, InputTextModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { AccessControlContainerComponent } from './access-control-container/access-control-container.component';
import { AccessControlComponent } from './access-control.component';
import { CapabilityComponent } from './add-edit-feature/capability/capability.component';
import { GroupComponent } from './add-edit-feature/group/group.component';
import { UserComponent } from './add-edit-feature/user/user.component';
import { CapabilityTableComponent } from './capability-table/capability-table.component';
import { AddRemoveCapabilitiesModule } from './dialog/add-remove-capabilities/add-remove-capabilities.module';
import { AddRemoveUserModule } from './dialog/add-remove-user/add-remove-user.module';
import { GroupTableComponent } from './group-table/group-table.component';
import { UserTableComponent } from './user-table/user-table.component';
import { FormsModule } from '@angular/forms';

const imports = [
    CommonModule,
    HeaderModule,
    ToolbarModule,
    PanelModule,
    TableModule,
    ButtonModule,
    CheckboxModule,
    AddRemoveUserModule,
    AddRemoveCapabilitiesModule,
    RadioButtonModule,
  CardModule,
  DropdownModule,
  FormsModule,
  InputTextModule
];

const components = [
  AccessControlComponent,
  GroupTableComponent,
  UserTableComponent,
  CapabilityTableComponent,
  GroupComponent,
  UserComponent,
  CapabilityComponent,
  AccessControlContainerComponent
];

const routes: Routes = [
  {
    path: 'access-control',
    component: AccessControlComponent,
    children: [
        {
          path: '',
          redirectTo: 'home',
          pathMatch: 'full',
        },
        {
            path: 'home',
            component: AccessControlContainerComponent,
        },
        {
          path: 'group',
          component: GroupComponent,
        },
        {
          path: 'group/:name',
          component: GroupComponent,
        },
        {
          path: 'user',
          component: UserComponent,
        },
        {
          path: 'user/:user',
          component: UserComponent,
        },
        {
          path: 'capability',
          component: CapabilityComponent,
        },
        {
          path: 'capability/:capability',
          component: CapabilityComponent,
        }
      ]
  }
];


@NgModule({
  declarations: [components],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class AccessControlModule { }
