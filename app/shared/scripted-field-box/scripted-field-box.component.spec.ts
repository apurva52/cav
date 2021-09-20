import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptedFieldBoxComponent } from './scripted-field-box.component';

describe('ConfigureIndexPatternComponent', () => {
  let component: ScriptedFieldBoxComponent;
  let fixture: ComponentFixture<ScriptedFieldBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScriptedFieldBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptedFieldBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
