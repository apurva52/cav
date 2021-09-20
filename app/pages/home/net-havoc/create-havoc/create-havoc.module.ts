import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateHavocComponent } from './create-havoc.component';
import { StarveApplicationComponent } from './starve-application/starve-application.component';
import { Routes, RouterModule } from '@angular/router';
import {
  MenuModule,
  TabMenuModule,
  ButtonModule,
  TooltipModule,
  ToolbarModule,
  AccordionModule,
  DropdownModule,
  PanelModule,
} from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { StarveApplicationModule } from './starve-application/starve-application.module';

const components = [CreateHavocComponent];
const imports = [
  CommonModule,
  HeaderModule,
  MenuModule,
  TabMenuModule,
  ButtonModule,
  TooltipModule,
  ToolbarModule,
  StarveApplicationModule,
  AccordionModule,
  DropdownModule,
  PanelModule
  
];

const routes: Routes = [
  {
    path: 'create-havoc',
    component: CreateHavocComponent,
    children: [
      {
        path: '',
        redirectTo: 'starve-application',
        pathMatch: 'full',
      },
      {
        path: 'starve-application',
        loadChildren: () =>
          import('./starve-application/starve-application.module').then(
            (m) => m.StarveApplicationModule
          ),
        component: StarveApplicationComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [components],
  imports: [RouterModule.forChild(routes), imports],
  exports: [ RouterModule ]
})
export class CreateHavocModule {}
