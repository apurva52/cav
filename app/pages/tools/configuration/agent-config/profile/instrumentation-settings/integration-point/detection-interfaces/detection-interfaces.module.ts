import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetectionInterfacesComponent } from './detection-interfaces.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CheckboxModule, InputTextModule } from 'primeng';


const imports = [
  CommonModule,    
  CheckboxModule,  
  FormsModule, 
  InputTextModule,  
];

const components = [DetectionInterfacesComponent];

const routes: Routes = [
  {
    path: 'detection-by-interfaces',
    component: DetectionInterfacesComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [components, RouterModule],
})

export class DetectionInterfacesModule { }
