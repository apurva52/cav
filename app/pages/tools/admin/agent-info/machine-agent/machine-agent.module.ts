import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MachineAgentComponent } from './machine-agent.component';
import { ButtonModule, CardModule, DropdownModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, TableModule } from 'primeng';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [MachineAgentComponent],
  imports: [
    CommonModule,
    MessageModule,
    MultiSelectModule,
    MenuModule,
    TableModule,
  CardModule,
  FormsModule,
  DropdownModule,
  InputTextModule,
  ButtonModule
  ]
})
export class MachineAgentModule { }
