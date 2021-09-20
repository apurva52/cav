import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DebugLevelComponent } from './debug-level.component';
import { RouterModule, Routes } from '@angular/router';

const imports = [
  CommonModule,  
];

const components = [DebugLevelComponent];

const routes: Routes = [
  {
    path: 'debug-level',
    component: DebugLevelComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [components, RouterModule],
})
export class DebugLevelModule { }
