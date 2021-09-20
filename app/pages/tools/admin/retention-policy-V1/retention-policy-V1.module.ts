import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RETENTIONPOLICY_ROUTES } from './routes/retention-policy-route';
import { TableModule } from 'primeng/table';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { CalendarModule } from 'primeng/calendar';
import { FieldsetModule } from 'primeng/fieldset';
import { AccordionModule } from 'primeng/accordion';
import { DialogModule } from 'primeng/dialog';
import { RetentionPolicyCommonService } from './services/retention-policy-common.service';
import { RetentionPolicyMainComponent } from './components/retention-policy-main/retention-policy-main.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ListboxModule } from 'primeng/listbox';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng';
import { headerFormatPipe } from './components/retention-policy-main/headerFormatPipe';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { ToolbarModule } from 'primeng';
import { FileManagerModule } from 'src/app/shared/file-manager/file-manager.module';
import { ChipsModule } from 'primeng/chips';

@NgModule({
  declarations: [
    RetentionPolicyMainComponent,
    headerFormatPipe,
  ],

  entryComponents: [],
  imports: [
    RouterModule.forChild(RETENTIONPOLICY_ROUTES),
    HttpClientModule,
    FormsModule,
    CommonModule,
    TableModule,
    RadioButtonModule,
    ListboxModule,
    DropdownModule,
    MultiSelectModule,
    PanelModule,
    ToastModule,
    ConfirmDialogModule,
    InputSwitchModule,
    TabViewModule,
    CalendarModule,
    FieldsetModule,
    AccordionModule,
    DialogModule,
    BreadcrumbModule,
    HeaderModule,
    ToolbarModule,
    FileManagerModule,
    ChipsModule
  ],
  providers: [
    ConfirmationService,
    MessageService,
    RetentionPolicyCommonService,
  ],
  bootstrap: []
})
export class RetentionPolicyV1Module {

  constructor() { }

}


