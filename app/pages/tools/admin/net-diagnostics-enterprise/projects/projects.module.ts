import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsComponent } from './projects.component';
import { RouterModule, Routes } from '@angular/router';
import {
  ButtonModule,
  CardModule,
  DropdownModule,
  InputTextModule,
  MenuModule,
  MessageModule,
  MultiSelectModule,
  TableModule,
  TooltipModule,
} from 'primeng';
import { FormsModule } from '@angular/forms';



const components = [ProjectsComponent];
const imports =[
  CommonModule,
    TableModule,
    CardModule,
    MessageModule,
    TooltipModule,
    MultiSelectModule,
    FormsModule,
    MenuModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
   
  ]
const routes: Routes = [
  {
    path: 'Project',
    component: ProjectsComponent,
  },
];
@NgModule({
  declarations: [components],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule,components
  ]
  
})
export class ProjectsModule { }
