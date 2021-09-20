import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { InputTextModule, TooltipModule, ButtonModule, MessageModule, DialogModule, ToolbarModule, CardModule, DropdownModule, CheckboxModule, RadioButtonModule, TableModule, BreadcrumbModule, MultiSelectModule, MenuModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { EditsearchComponent } from './editsearch/editsearch.component';
import { EditsearchModule } from './editsearch/editsearch.module';

const imports = [
  CommonModule,
  ReactiveFormsModule,
  InputTextModule,
  ButtonModule,
  MessageModule,
  DialogModule,
  HeaderModule,
  ToolbarModule,
  CardModule,
  FormsModule,
  DropdownModule,
  CheckboxModule,
  RadioButtonModule,
  TableModule,
  MultiSelectModule,
  MenuModule,
  BreadcrumbModule,
  EditsearchModule,
  TooltipModule,

]

const components = [
  SearchComponent
];


const routes: Routes = [
  {
    path: 'search',
    component: SearchComponent,
    children: [
      {
        path: 'editsearch',
        loadChildren: () => import('./editsearch/editsearch.module').then(m => m.EditsearchModule),
        component: EditsearchComponent
      },
      
    ]
  }
];


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


export class SearchModule { }
