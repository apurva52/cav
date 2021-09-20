import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PanelModule, CalendarModule, ChipsModule, DropdownModule, KeyFilterModule, MultiSelectModule, SliderModule, InputSwitchModule, TabViewModule, AccordionModule, DialogModule, TableModule, ToolbarModule, FieldsetModule, OverlayPanelModule, ToastModule, MessageModule, TooltipModule } from 'primeng';
import { DynamicFormComponent } from './dynamic-form.component';
import { NamedOutletDirective } from './controlType/custom/named-outlet.directive';
import { ChipsComponent } from './controlType/chips/chips.component';
import { CustomComponent } from './controlType/custom/custom.component';
import { FieldsetComponent } from './controlType/fieldset/fieldset.component';
import { InputComponent } from './controlType/input/input.component';
import { NumbersOnlyDirective } from './controlType/input/numbers-only.directive';
import { JsonArrayComponent } from './controlType/json-array/json-array.component';
import { JsonComponent } from './controlType/json/json.component';
import { MultiSelectComponent } from './controlType/multi-select/multi-select.component';
import { PanelComponent } from './controlType/panel/panel.component';
import { SelectComponent } from './controlType/select/select.component';
import { ToggleComponent } from './controlType/toggle/toggle.component';
import { DynamicFormRightComponent } from './dynamic-form-right/dynamic-form-right.component';
import { CalendarComponent } from './controlType/calendar/calendar.component';
import { SliderComponent } from './controlType/slider/slider.component';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';

const components = [DynamicFormComponent, DynamicFormRightComponent, CalendarComponent, ChipsComponent, CustomComponent, InputComponent, JsonComponent, JsonArrayComponent, MultiSelectComponent, PanelComponent, SelectComponent, SliderComponent, ToggleComponent, FieldsetComponent, NumbersOnlyDirective, NamedOutletDirective];

const imports = [
  RouterModule, CommonModule, FormsModule, ReactiveFormsModule,

  // primeng
  PanelModule, CalendarModule, ChipsModule, DropdownModule, KeyFilterModule, MultiSelectModule, SliderModule, InputSwitchModule, TabViewModule, AccordionModule, DialogModule, TableModule, ToolbarModule, FieldsetModule,
  OverlayPanelModule, ToastModule, MessageModule, TooltipModule, RxReactiveFormsModule
];

const exports = [
  ReactiveFormsModule, FormsModule, RouterModule, DynamicFormComponent
];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [exports, components]
})

export class DynamicFormModule { }
