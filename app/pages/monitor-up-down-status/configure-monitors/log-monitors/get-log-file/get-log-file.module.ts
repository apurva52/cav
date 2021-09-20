import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { AccordionModule, ButtonModule, CardModule, CheckboxModule, ConfirmDialogModule, DialogModule, DropdownModule, FieldsetModule, InputTextareaModule, InputTextModule, MenuModule, MultiSelectModule, PanelModule, ProgressSpinnerModule, RadioButtonModule, TableModule, TabMenuModule, ToastModule, ToolbarModule, TreeModule } from 'primeng';
import { LogMonitorCommonComponent } from '../../log-monitor-common/log-monitor-common.component';
import { FormsModule } from '@angular/forms';
// import { MessageService } from '../../../service/message.service';
import { GetLogFileComponent } from './get-log-file.component';
import { TierServerModule } from '../../tier-server/tier-server.module';
import { ConfiguredMonitorInfoModule } from '../../configured-monitor-info/configured-monitor-info.module';



const routes: Routes = [
    {
      path: 'get-log-file',
      component: GetLogFileComponent,
      
    },
  ];
const imports = [
  CommonModule,
  ToolbarModule,
    HeaderModule,
    InputTextModule,
    FormsModule,
    CheckboxModule,
    AccordionModule,
    RadioButtonModule,
    DropdownModule,
    InputTextareaModule,
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
  AccordionModule,
  MultiSelectModule,
  TierServerModule,
  ConfiguredMonitorInfoModule
  
  
]

@NgModule({
  declarations: [GetLogFileComponent],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ], 
})
export class GetLogFileModule { }
