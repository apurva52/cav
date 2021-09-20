import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { MultiSelect } from 'primeng/multiselect';
import { DynamicFormFields } from '../../service/dynamic-form';
import { DynamicFormService } from '../../service/dynamic-form.service';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss']
})

export class MultiSelectComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('select') select: MultiSelect;
  @Input() fields: DynamicFormFields;
  @Input() form: FormGroup;
  fieldData: DynamicFormFields;
  options: SelectItem[] = [];
  errorMsg: { min: string; max: string; required: string; email: string; pattern: string; };
  selectedItemsLabel = '{0} items selected';

  constructor(private dynamicFormService: DynamicFormService) { }

  ngOnInit() {
    this.dynamicFormService.getErrorMessage().subscribe(result => {
      this.errorMsg = result;
    });
  }

  ngAfterViewInit() {
    this.changeSelectLabel();
  }

  changeSelectLabel() {
    this.onFocus();
    this.onBlur();
  }


  ngOnChanges() {
    this.fieldData = this.fields;

    this.dynamicFormService.getColSpan(this.fieldData.colspan).subscribe(result => {
      this.fieldData.classes = result;
      // offset
      this.dynamicFormService.getColOffset(this.fieldData.coloffset).subscribe(offset => {
        this.fieldData.classes += offset;
      });
    });

    if (typeof (this.fieldData.options) === 'string') {
      this.dynamicFormService.getMetadata(this.fieldData.options).subscribe(arg => {
        this.fieldData.options = arg;
        this.options = arg;
      });

    } else {
      this.options = this.fieldData.options;
    }

  }

  onFocus() {

    const val = this.form.get(this.fieldData.key);



    if (this.fieldData.operation === 'oring') {
      const tmp = [];
      this.options.forEach(el => {
        // tslint:disable-next-line: no-bitwise
        if (val.value & el.value) {
          tmp.push(el.value);
        }
      });
      val.patchValue(tmp);

      this.select.valuesAsString = tmp.length + ' items selected';

    } else {

      // check if type is number/text
      if (this.fieldData.hasOwnProperty('type')) {
        switch (this.fieldData.type) {
          case 'text':
            this.parseValues(val, this.fieldData.type);
            break;

          case 'number':
            this.parseValues(val, this.fieldData.type);
            break;

          default:
            console.error('Wrong "type" for "key" : ', this.fieldData.key, '. Expected "type" is "text" or "number"');
            break;
        }
      } else {
        // the type must be array
        if (Array.isArray(val.value)) {
          if (this.fieldData.hasOwnProperty('allvalue')) {
            // value is array so allvalue should also be an array
            if (Array.isArray(this.fieldData.allvalue)) {
              if (val.value[0] == this.fieldData.allvalue[0]) {
                const tmp = [];
                for (const op of this.options) {
                  tmp.push(op.value);
                }
                val.patchValue(tmp);
              }
            } else {
              console.error('Value type is array. Expected type of allvalue is also an array.');
            }
          }

        } else {
          // value is not array,  raise an error
          console.error('Value is not an array. "type": "text" or "type": "number" is expected.');
        }
      }
    }
  }

  parseValues(val: AbstractControl, type: string): void {
    // if the value is empty , replace with []
    if (val.value === '') {
      val.patchValue([]);
      return;
    }
    // check the allvalue
    if (this.fieldData.hasOwnProperty('allvalue')) {
      // check if the value is all values or some values
      if (val.value == this.fieldData.allvalue) {
        const tmp = [];
        for (const op of this.options) {
          tmp.push(op.value);
        }
        val.patchValue(tmp);
      } else {
        // split the values with the delimeter
        let tmp = [];
        if (this.fieldData.hasOwnProperty('delimiter')) {
          tmp = val.value.split(this.fieldData.delimiter);
        } else {
          tmp = val.value.split(',');
        }

        if (type === 'number') {
          tmp = tmp.map(Number);
        }
        val.patchValue(tmp);
      }
    }
  }


  onBlur() {
    const val = this.form.get(this.fieldData.key);



    if (this.fieldData.operation === 'oring') {
      const tmp = val.value;
      const oring = val.value.reduce((accumulator: number, element: number) => {
        // tslint:disable-next-line: no-bitwise
        return accumulator | element;
      }, 0);

      val.patchValue(oring);

      this.select.valuesAsString = tmp.length + ' items selected';

    } else {
      if (this.fieldData.hasOwnProperty('type')) {
        // convert array to string
        switch (this.fieldData.type) {
          case 'text':
            this.joinValues(val, this.fieldData.type);
            break;

          case 'number':
            this.joinValues(val, this.fieldData.type);
            break;

          default:
            console.error('Unsupported "type" value found.');
            break;
        }
      } else {
        if (this.fieldData.hasOwnProperty('allvalue')) {
          if (val.value.length === this.options.length) {
            val.patchValue(this.fieldData.allvalue);

            this.select.valuesAsString = this.options.length + ' items selected';
          }
        }
      }
    }

  }

  joinValues(val: AbstractControl, type: string) {
    const value = val.value;
    if (this.fieldData.hasOwnProperty('allvalue')) {
      if (this.options.length === value.length) {
        val.patchValue(this.fieldData.allvalue);
        this.select.valuesAsString = this.options.length + ' items selected';
        return;
      }

    }
    // check for delimiter
    if (this.fieldData.hasOwnProperty('delimiter')) {
      val.patchValue(value.join(this.fieldData.delimiter));
    } else {
      val.patchValue(value.join(','));
    }

    this.select.valuesAsString = value.length + ' items selected';


  }

  onChange(e) {
    this.selectedItemsLabel = '{0} items selected';
    this.select.valuesAsString = e.value.length;
  }

}
