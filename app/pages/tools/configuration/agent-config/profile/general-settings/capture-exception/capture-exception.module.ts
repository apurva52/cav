import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaptureExceptionComponent } from './capture-exception.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CardModule, ButtonModule, CheckboxModule, InputTextModule, PanelModule } from 'primeng';


const imports = [
  CommonModule,  
  CardModule,
  ButtonModule,  
  CheckboxModule,  
  FormsModule, 
  InputTextModule,
  PanelModule
];

const components = [CaptureExceptionComponent];

const routes: Routes = [
  {
    path: 'capture-exception',
    component: CaptureExceptionComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaptureExceptionModule { }
