import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormRightComponent } from './dynamic-form-right.component';

describe('DynamicFormRightComponent', () => {
  let component: DynamicFormRightComponent;
  let fixture: ComponentFixture<DynamicFormRightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicFormRightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
