import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupedDerivedMetricesComponent } from './grouped-derived-metrices.component';
import { FormsModule } from '@angular/forms';
import { ButtonModule, DialogModule, DropdownModule, InputTextModule, MultiSelectModule, ProgressSpinnerModule } from 'primeng';
import { ConfirmDialogModule} from 'primeng/confirmdialog';
const imports = [
  CommonModule,
  DialogModule,
  ButtonModule,
  FormsModule,
  InputTextModule,
  DropdownModule,
  MultiSelectModule,
  ConfirmDialogModule,
  ProgressSpinnerModule
];

const components = [
  GroupedDerivedMetricesComponent
];

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports: [
    components
  ]
})

export class GroupedDerivedMetricesModule { }
