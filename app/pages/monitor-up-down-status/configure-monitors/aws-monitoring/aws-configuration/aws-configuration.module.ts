import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AwsConfigurationComponent } from './aws-configuration.component';
import { AccordionModule, ButtonModule, CardModule, CheckboxModule, DropdownModule, InputTextareaModule, InputTextModule, RadioButtonModule, TableModule, ToolbarModule } from 'primeng';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: 'aws-configuration',
    component: AwsConfigurationComponent
  }
];

@NgModule({
  declarations: [AwsConfigurationComponent],
  imports: [
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
    ButtonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})




export class AwsConfigurationModule { }
