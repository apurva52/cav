import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scripted-field-box',
  templateUrl: './scripted-field-box.component.html',
  styleUrls: ['./scripted-field-box.component.scss']
})
export class ScriptedFieldBoxComponent implements OnInit {

  showScriptedFieldBoxModel: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  open() {
    this.showScriptedFieldBoxModel = true;
  }

  close() {
    this.showScriptedFieldBoxModel = false;
  }

}
