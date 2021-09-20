import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DiskSwindleComponent } from './disk-swindle.component';


const components = [DiskSwindleComponent];
const imports = [
  CommonModule,
  
  
];

const routes: Routes = [
  {
    path: 'disk-swindle',
    component: DiskSwindleComponent,
    
  },
];

@NgModule({
  declarations: [components],
  imports: [RouterModule.forChild(routes), imports],
  exports: [RouterModule]
})

export class DiskSwindleModule { }
