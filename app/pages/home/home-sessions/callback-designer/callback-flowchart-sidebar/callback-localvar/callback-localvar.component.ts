import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalVariable } from '../../../common/interfaces/callback';
import { CallbackDesignerService } from '../../service/callback-designer.service';

@Component({
  selector: 'app-callback-localvar',
  templateUrl: './callback-localvar.component.html',
  styleUrls: ['./callback-localvar.component.scss']
})
export class CallbackLocalvarComponent implements OnInit {

  visible: boolean;

  form: FormGroup;
  submitted: boolean;

  constructor(private fb: FormBuilder, private cbService: CallbackDesignerService) {
    this.form = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  showDialog(): void {
    this.visible = true;
  }

  hideDialog(): void {
    this.visible = false;
    this.submitted = false;
    this.form.reset();
  }

  addLocalVar(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    let localVar: LocalVariable = this.form.value;
    this.cbService.currentCallback.localVariables.push(localVar);
    this.cbService.broadcast('addedLocalVar', this.cbService.currentCallback.localVariables);

    console.log('Added Local Variable : ', this.cbService.currentCallback.localVariables);

    this.hideDialog();
  }

}
