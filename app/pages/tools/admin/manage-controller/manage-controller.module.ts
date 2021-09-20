import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ToolbarModule, ButtonModule, BreadcrumbModule, TabMenuModule, TableModule, CardModule, MessageModule, TooltipModule, CheckboxModule, MultiSelectModule, MenuModule } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { ManageControllerComponent } from './manage-controller.component';
import { NewControllerModule } from './new-controller/new-controller.module';
import { NewControllerComponent } from './new-controller/new-controller.component';
import { FormsModule } from '@angular/forms';



const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  ButtonModule,
  BreadcrumbModule,
  TabMenuModule,
  TableModule,
  CardModule,
  AppMessageModule,
  MessageModule,
  TooltipModule,
  CheckboxModule,
  MultiSelectModule,
  MenuModule,
  NewControllerModule,
  FormsModule
];


const components = [
  ManageControllerComponent
];

const routes: Routes = [
  {
    path: 'manage-controller',
    component: ManageControllerComponent,
    children: [      
      {
        path: 'new-controller',
        loadChildren: () => import('./new-controller/new-controller.module').then(m => m.NewControllerModule),
        component: NewControllerComponent
      },     
    ]
  },
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
export class ManageControllerModule { }
