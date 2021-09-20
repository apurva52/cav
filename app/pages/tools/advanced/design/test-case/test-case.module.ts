import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestCaseComponent } from './test-case.component';
import { Routes, RouterModule } from '@angular/router';
import { ToolbarModule, ButtonModule, BreadcrumbModule, TabMenuModule, TableModule, MultiSelectModule, CardModule, CheckboxModule, DropdownModule, InputTextModule, MenuModule, MessageModule, SlideMenuModule, TooltipModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormsModule } from '@angular/forms';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { AddTestCaseModule } from './add-test-case/add-test-case.module';
import { AddTestCaseComponent } from './add-test-case/add-test-case.component';


const imports = [
  CommonModule,
  TableModule,
  CardModule,
  ButtonModule,
  AppMessageModule,
  MessageModule,
  TooltipModule,
  CheckboxModule,
  MultiSelectModule,
  FormsModule,    
  PipeModule,
  SlideMenuModule,
  MenuModule,  
  InputTextModule, 
  HeaderModule,
  ToolbarModule,
  BreadcrumbModule,
  DropdownModule, 
  AddTestCaseModule 
]

const components = [
  TestCaseComponent
];

const routes: Routes = [
  {
    path: 'test-case',
    component: TestCaseComponent,
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
      }, 
      {
        path: 'add-test-case',
        loadChildren: () => import('./add-test-case/add-test-case.module').then(m => m.AddTestCaseModule),
        component: AddTestCaseComponent
      },
    ]  
  }
]

@NgModule({
  declarations: [components],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class TestCaseModule { }
