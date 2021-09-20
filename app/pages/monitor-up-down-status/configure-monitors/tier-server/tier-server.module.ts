import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { AccordionModule, ButtonModule, CardModule, CheckboxModule, ChipsModule, ConfirmDialogModule, DialogModule, DropdownModule, FieldsetModule, InputTextareaModule, InputTextModule, MenuModule, MultiSelectModule, PanelModule, ProgressSpinnerModule, RadioButtonModule, TableModule, TabMenuModule, ToastModule, ToolbarModule, TreeModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { TierServerComponent } from './tier-server.component';

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
    ChipsModule


]
const components = [TierServerComponent];
@NgModule({
    declarations: [components],
    imports: [
        imports
    ],
    schemas:[CUSTOM_ELEMENTS_SCHEMA],
    exports: [
        RouterModule, TierServerComponent
    ],
    providers: []
    
})
export class TierServerModule { }
