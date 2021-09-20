import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstrumentationProfileComponent } from './instrumentation-profile.component';
import { RouterModule, Routes } from '@angular/router';
import { CardModule, ButtonModule, CheckboxModule, MultiSelectModule, FieldsetModule, RadioButtonModule, DropdownModule, FileUploadModule } from 'primeng';
import { FormsModule } from '@angular/forms';

const imports = [
  CommonModule,  
  CardModule,
  ButtonModule,  
  CheckboxModule,  
  FormsModule, 
  RadioButtonModule,
  DropdownModule,
  FileUploadModule
];

const components = [InstrumentationProfileComponent];

const routes: Routes = [
  {
    path: 'instrumentation-profile',
    component: InstrumentationProfileComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class InstrumentationProfileModule { }
