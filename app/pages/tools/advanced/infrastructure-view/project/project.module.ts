import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectComponent } from './project.component';
import { Routes, RouterModule } from '@angular/router';
import { ButtonModule, TableModule, CardModule, MessageModule, DropdownModule } from 'primeng';
import { FormsModule } from '@angular/forms';


const imports = [ 
  CommonModule,  
  ButtonModule,
  TableModule,
  CardModule,
  MessageModule,
  DropdownModule,
  FormsModule
];

const components = [ProjectComponent];

const routes: Routes = [
  {
    path: 'projects',
    component: ProjectComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class ProjectModule { }
