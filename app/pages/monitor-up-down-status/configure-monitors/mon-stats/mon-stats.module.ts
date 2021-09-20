import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule, CardModule, CheckboxModule, ConfirmationService, ConfirmDialogModule, DialogModule, DropdownModule, FieldsetModule, InputTextareaModule, PanelModule, ProgressSpinnerModule, TableModule, ToolbarModule, TreeModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import {InputTextModule} from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import {AccordionModule} from 'primeng/accordion';
import {RadioButtonModule} from 'primeng/radiobutton';
import { MonStatsComponent } from './mon-stats.component';




// const routes: Routes = [
//     {
//      path: 'configure-jmx-Connection-Component',
//       component: JmxConnectionComponent
//     }
//   ];



@NgModule({
  declarations: [MonStatsComponent],
  imports: [
    CommonModule,
    ToolbarModule,
    HeaderModule,
    InputTextModule,
    FormsModule,
    CheckboxModule,
    AccordionModule,
    RadioButtonModule,
    DropdownModule,
    InputTextareaModule,
    TableModule,
    CardModule,
    InputTextareaModule,
    TreeModule,
    PanelModule,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    FieldsetModule,  
    ProgressSpinnerModule
   // RouterModule.forChild(routes)
  ],

  providers: [
    
    
    ConfirmationService,
    
 ],
  /*Required for opening in model window. */
  entryComponents: [
      ],
    
  exports: [RouterModule,MonStatsComponent],
 
})
export class MonStatsModule { }
