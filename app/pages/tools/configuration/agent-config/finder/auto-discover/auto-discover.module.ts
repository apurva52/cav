import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoDiscoverComponent } from './auto-discover.component';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule, DropdownModule, InputTextModule, PanelModule, RadioButtonModule, TreeModule } from 'primeng';
import { FormsModule } from '@angular/forms';

const imports = [
  CommonModule, 
  DropdownModule,
  InputTextModule,
  RadioButtonModule,
  ButtonModule,
  FormsModule,
  PanelModule,   
  TreeModule   
];

const components = [AutoDiscoverComponent];

const routes: Routes = [
  {
    path: 'auto-discover',
    component: AutoDiscoverComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [components, RouterModule],
})
export class AutoDiscoverModule { }
