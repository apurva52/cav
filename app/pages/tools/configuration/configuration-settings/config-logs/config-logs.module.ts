import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigLogsComponent } from './config-logs.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CardModule, ButtonModule, CheckboxModule, DropdownModule, FieldsetModule } from 'primeng';


const imports = [
  CommonModule,  
  CardModule,
  ButtonModule,  
  CheckboxModule,  
  FormsModule,    
  DropdownModule, 
  FieldsetModule
];

const components = [ConfigLogsComponent];

const routes: Routes = [
  {
    path: 'logs',
    component: ConfigLogsComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigLogsModule { }
