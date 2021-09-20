import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { AccordionModule, ButtonModule, CardModule, CheckboxModule, ConfirmDialogModule, DialogModule, DropdownModule, FieldsetModule, InputTextareaModule, InputTextModule, MenuModule, MultiSelectModule, PanelModule, ProgressSpinnerModule, RadioButtonModule, TableModule, TabMenuModule, ToastModule, ToolbarModule, TreeModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { ConfiguredMonitorInfoComponent } from './configured-monitor-info.component';

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



]
const components = [ConfiguredMonitorInfoComponent];
@NgModule({
    declarations: [components],
    imports: [
        imports
    ],
    schemas:[CUSTOM_ELEMENTS_SCHEMA],
    exports: [
        RouterModule, ConfiguredMonitorInfoComponent
    ],
    providers: []
    
})
export class ConfiguredMonitorInfoModule { }
