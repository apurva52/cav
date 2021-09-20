import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallDetailsComponent } from './call-details.component';
import { DialogModule, ButtonModule, CheckboxModule, InputTextModule, CardModule, TableModule, TooltipModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';


const components = [
  CallDetailsComponent
];

const imports = [
  CommonModule,
  DialogModule,
  HeaderModule,
  ButtonModule,
  CheckboxModule,
  InputTextModule,
  CardModule,
  TableModule,
  TooltipModule
];

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports: [components]
})
export class CallDetailsModule { }
