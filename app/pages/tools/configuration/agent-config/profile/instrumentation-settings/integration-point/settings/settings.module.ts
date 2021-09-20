import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { CheckboxModule, InputTextModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';



const imports = [
  CommonModule,    
  CheckboxModule,  
  FormsModule, 
  InputTextModule,  
];

const components = [SettingsComponent];

const routes: Routes = [
  {
    path: 'integration-settings',
    component: SettingsComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [components,RouterModule],
})
export class SettingsModule { }
