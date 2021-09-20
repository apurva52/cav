import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalougeManagementComponent } from './catalouge-management.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InputTextModule, ButtonModule, MessageModule, DialogModule,
  ToolbarModule, CardModule, DropdownModule, CheckboxModule, RadioButtonModule, TableModule,
   MultiSelectModule, MenuModule, BreadcrumbModule, TooltipModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { ConfirmDialogModule} from 'primeng/confirmdialog';
import { CatalogueManagementModule } from 'src/app/shared/pattern-matching/catalogue-management/catalogue-management.module';

const imports = [
  CommonModule,
  CatalogueManagementModule,
  InputTextModule,
  ButtonModule,
  MessageModule,
  DialogModule,
  ToolbarModule,
  CardModule,
  FormsModule,
  DropdownModule,
  ConfirmDialogModule,
  CheckboxModule,
  TableModule,
  MultiSelectModule,
  MenuModule,
  BreadcrumbModule,
  TooltipModule,
  RadioButtonModule,
  HeaderModule,
]

const components = [CatalougeManagementComponent];

const routes: Routes = [
  {
    path: 'catalouge-management',
    component: CatalougeManagementComponent,
  },
];

@NgModule({
  declarations: [components,],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class CatalougeManagementModule { }
