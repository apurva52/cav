import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RestComponent } from './rest.component';


const routes: Routes = [
  {
    path: 'rest',
    component: RestComponent
    
  }
];

const imports = [
  CommonModule,
  
]

@NgModule({
  declarations: [RestComponent],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ], 
})
export class RestModule { }
