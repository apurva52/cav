import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemSettingsComponent } from './system-settings.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardModule, ProgressSpinnerModule, ButtonModule, CheckboxModule, ConfirmDialogModule, ToastModule, FieldsetModule, InputTextModule, DropdownModule, SliderModule, BreadcrumbModule, MenuModule, MessageModule, MultiSelectModule, ToolbarModule, TooltipModule, PanelModule, TabMenuModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { MultidiskSettingComponent } from './multidisk-setting/multidisk-setting.component';
import { ParserSettingComponent } from './parser-setting/parser-setting.component';
import { BackupCleanupComponent } from './backup-cleanup/backup-cleanup.component';
import { DynamicFormModule } from 'src/app/shared/dynamic-form/dynamic-form.module';
import { BackupCleanupModule } from './backup-cleanup/backup-cleanup.module';
import { ParserSettingModule } from './parser-setting/parser-setting.module';
import { MultidiskSettingModule } from './multidisk-setting/multidisk-setting.module';



const imports = [
  CommonModule,
  BackupCleanupModule,
  ParserSettingModule,
  MultidiskSettingModule,
  CardModule,
  ConfirmDialogModule,
  ButtonModule,
  CheckboxModule,
  FormsModule,
  ProgressSpinnerModule,
  ToastModule,
  DynamicFormModule,
  FieldsetModule,
  InputTextModule,
  DropdownModule,
  SliderModule,
  MessageModule,
  ToolbarModule,
  MultiSelectModule,
  MenuModule,
  BreadcrumbModule,
  TooltipModule,
  HeaderModule,
  PanelModule,
  TabMenuModule,
];

const components = [SystemSettingsComponent];

const routes: Routes = [
  {
    path: 'system-settings',
    component: SystemSettingsComponent,

    children: [
      {
        path: '',
        outlet: 'multi-disc',
        component: MultidiskSettingComponent
      },
      {
        path: '',
        outlet: 'parser',
        component: ParserSettingComponent
      },
      {
        path: '',
        outlet: 'backup-cleanup',
        component: BackupCleanupComponent
      },

    ]
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class SystemSettingsModule { }



