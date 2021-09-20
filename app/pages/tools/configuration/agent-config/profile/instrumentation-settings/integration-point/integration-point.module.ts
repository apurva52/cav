import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntegrationPointComponent } from './integration-point.component';
import { SettingsModule } from './settings/settings.module';
import { ButtonModule, CardModule, CheckboxModule, InputTextModule, TabMenuModule, TabViewModule } from 'primeng';
import { SettingsComponent } from './settings/settings.component';
import { RouterModule, Routes } from '@angular/router';
import { DetectionInterfacesModule } from './detection-interfaces/detection-interfaces.module';
import { DetectionInterfacesComponent } from './detection-interfaces/detection-interfaces.component';
import { DetectionClassesModule } from './detection-classes/detection-classes.module';
import { DetectionClassesComponent } from './detection-classes/detection-classes.component';
import { FormsModule } from '@angular/forms';


const imports = [
  CommonModule, 
  ButtonModule,  
  TabMenuModule,  
  SettingsModule,
  DetectionInterfacesModule,
  DetectionClassesModule,
  CardModule,
  TabViewModule,
  CheckboxModule,  
  FormsModule, 
  InputTextModule, 
];


const components = [
  IntegrationPointComponent
];

const routes: Routes = [
  {
    path: 'integration-point',
    component: IntegrationPointComponent,
    children: [
      {
        path: '',
        redirectTo: 'integration-settings',
        pathMatch: 'full',
      },
      {
        path: 'detection-by-classes',
        loadChildren: () => import('./detection-classes/detection-classes.module').then(m => m.DetectionClassesModule),
        component: DetectionClassesComponent
      }, 
      {
        path: 'detection-by-interfaces',
        loadChildren: () => import('./detection-interfaces/detection-interfaces.module').then(m => m.DetectionInterfacesModule),
        component: DetectionInterfacesComponent
      }, 
      {
        path: 'integration-settings',
        loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
        component: SettingsComponent
      },      
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
export class IntegrationPointModule { }
