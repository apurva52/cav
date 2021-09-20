import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotspotComponent } from './hotspot.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CardModule, ButtonModule, CheckboxModule, RadioButtonModule, InputTextModule, PanelModule } from 'primeng';


const imports = [
  CommonModule,  
  CardModule,
  ButtonModule,  
  CheckboxModule,  
  FormsModule, 
  InputTextModule,
  PanelModule
];

const components = [HotspotComponent];

const routes: Routes = [
  {
    path: 'hotspot',
    component: HotspotComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HotspotModule { }
