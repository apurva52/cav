import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAnalyticOverallComponent } from './form-analytic-overall.component';

describe('FormAnalyticOverallComponent', () => {
  let component: FormAnalyticOverallComponent;
  let fixture: ComponentFixture<FormAnalyticOverallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormAnalyticOverallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAnalyticOverallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
