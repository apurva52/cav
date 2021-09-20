import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng';
import { DataPoint } from '../../../common/interfaces/callback';
import { CallbackDesignerService } from '../../service/callback-designer.service';

@Component({
  selector: 'app-callback-datapoint',
  templateUrl: './callback-datapoint.component.html',
  styleUrls: ['./callback-datapoint.component.scss']
})

export class CallbackDatapointComponent implements OnInit {
  form: FormGroup;

  visible: boolean;

  dataSource: SelectItem[];
  elementProperty: SelectItem[];
  elementStyle: SelectItem[];
  urlProperties: SelectItem[];
  indexOption: SelectItem[];
  submitted: boolean;

  editMode: boolean;
  showTextBox: boolean;

  patternText: string = '';
  matchedCount: number = 0;
  isTesting: boolean;
  testForm: FormGroup;

  editorOptions = { language: 'javascript', automaticLayout: true };
  code: string;

  showEditorDialog: boolean;
  showCodeEditor: boolean;
  editor: monaco.editor.IEditor;

  constructor(private fb: FormBuilder, private cbService: CallbackDesignerService) {

    this.form = this.fb.group({
      name: ['', Validators.required],
      source: ['', Validators.required],
      pattern: [''],
      patternIndex: [''],
      index: [''],
      cssSelector: [''],
      property: [''],
      attributeName: [''],
      elementStyle: [''],
      value: [''],
      urlProperty: [''],
      cookieName: [''],
      code: ['']
    });

    this.testForm = this.fb.group({
      testStr: ['']
    });

    this.dataSource = [
      { label: 'Element', value: 'ele' },
      { label: 'Url', value: 'url' },
      { label: 'Cookie', value: 'cookie' },
      { label: 'Code snippet', value: 'code' }
    ];

    this.elementProperty = [
      { label: 'Self', value: 'self' },
      { label: 'Text', value: 'text' },
      { label: 'Class', value: 'class' },
      { label: 'Attribute', value: 'attribute' },
      { label: 'Style', value: 'style' },
      { label: 'Value', value: 'value' }
    ];

    this.elementStyle = [
      { label: 'Display', value: 'display' },
      { label: 'Height', value: 'height' },
      { label: 'Width', value: 'width' },
      { label: 'Position', value: 'position' },
    ];

    this.urlProperties = [
      { label: 'Host', value: 'host' },
      { label: 'Hostname', value: 'hostname' },
      { label: 'Origin', value: 'origin' },
      { label: 'Path', value: 'pathname' },
      { label: 'Href', value: 'href' },
      { label: 'Search', value: 'search' },
      { label: 'Protocol', value: 'protocol' }
    ];

    this.indexOption = [
      { label: 'First', value: 'First' },
      { label: 'Last', value: 'Last' },
      { label: 'Index Position', value: 'Index' }
    ];

  }

  ngOnInit(): void {
    // valuechanges for text field to validate the pattern
    this.testForm.get('testStr').valueChanges.subscribe(str => {
      this.isTesting = true;

      const reg = new RegExp(this.form.get('pattern').value, 'g');
      this.matchedCount = ((str || '').match(reg) || []).length;
    });
  }

  showDialog(dp?: string): void {
    this.form.reset();
    this.testForm.reset();

    this.isTesting = false;
    this.showTextBox = false;

    if (dp) {
      this.editMode = true;

      const datapoint: DataPoint[] = this.cbService.getDataPoint();
      for (const i of datapoint) {
        if (dp === i.name) {
          this.form.patchValue(i);
          this.form.get('name').disable();
        } else {
          this.form.get('name').enable();
        }
      }
    } else {
      this.editMode = false;
      this.form.get('name').enable();
    }
    this.visible = true;
  }

  hideDialog(): void {
    this.visible = false;
    this.submitted = false;
    this.form.reset();
  }

  addDataPoint() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const dataPoint: DataPoint = this.form.getRawValue();
    this.cbService.currentCallback.dataPoints.push(dataPoint);
    this.cbService.broadcast('addedDataPoint', this.cbService.currentCallback.dataPoints);

    this.hideDialog();

    console.log('DataPoint Added : ', this.cbService.currentCallback.dataPoints);
  }

  editDataPoint() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const dp = this.form.getRawValue();

    for (let i = 0; i < this.cbService.currentCallback.dataPoints.length; i++) {
      if (this.cbService.currentCallback.dataPoints[i].name === dp.name) {
        this.cbService.currentCallback.dataPoints[i] = dp;
      }
    }


    console.log('DataPoint Updated : ', this.cbService.currentCallback.dataPoints);
    this.hideDialog();

  }

  saveCode() {
    this.form.get('code').patchValue(this.code);

    this.showCodeEditor = false;
    this.showEditorDialog = false;
  }

  toggleEditorDialog() {
    this.showEditorDialog = true;
    this.code = this.form.get('code').value;
    setTimeout(() => {
      this.showCodeEditor = true;
    });
  }

  onEditorInit(editor: monaco.editor.IEditor): void {
    // on editor load, save the editor reference
    this.editor = editor;
    this.editor.layout();
  }

  onResizeEnd() {
    this.editor.layout();
  }



}
