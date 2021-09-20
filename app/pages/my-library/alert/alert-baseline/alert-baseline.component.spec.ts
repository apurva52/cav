import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertBaselineComponent } from './alert-baseline.component';

describe('AlertBaselineComponent', () => {
  let component: AlertBaselineComponent;
  let fixture: ComponentFixture<AlertBaselineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertBaselineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertBaselineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
