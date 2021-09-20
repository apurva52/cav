import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SnmpComponent } from './snmp.component';
import { FormsModule } from '@angular/forms';
import { AccordionModule, ButtonModule, CardModule, CheckboxModule, ConfirmDialogModule, DialogModule, DropdownModule, FieldsetModule, InputTextareaModule, InputTextModule, PanelModule, ProgressSpinnerModule, RadioButtonModule, TableModule, ToastModule, ToolbarModule, TreeModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { TierServerModule } from '../../tier-server/tier-server.module';
import { ConfiguredMonitorInfoModule } from '../../configured-monitor-info/configured-monitor-info.module';


const routes: Routes = [
  {
    path: 'snmp',
    component: SnmpComponent
    
  }
];

const imports = [
  CommonModule,
  CommonModule,
  ToolbarModule,
  HeaderModule,
  InputTextModule,
  FormsModule,
  CheckboxModule,
  AccordionModule,
  RadioButtonModule,
  DropdownModule,
  TableModule,
  CardModule,
  InputTextareaModule,
  TreeModule,
  PanelModule,
  ButtonModule,
  ConfirmDialogModule,
  DialogModule,
  FieldsetModule,  
  ToastModule,
  ProgressSpinnerModule,
  TierServerModule,
  ConfiguredMonitorInfoModule,
]

@NgModule({
  declarations: [SnmpComponent],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ], 
})
export class SnmpModule { }
