import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetectionClassesComponent } from './detection-classes.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CheckboxModule, InputTextModule } from 'primeng';


const imports = [
  CommonModule,    
  CheckboxModule,  
  FormsModule, 
  InputTextModule,  
];

const components = [DetectionClassesComponent];

const routes: Routes = [
  {
    path: 'detection-by-classes',
    component: DetectionClassesComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [components, RouterModule],
})

export class DetectionClassesModule { }
