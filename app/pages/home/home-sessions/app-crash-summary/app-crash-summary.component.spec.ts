import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCrashSummaryComponent } from './app-crash-summary.component';

describe('AppCrashSummaryComponent', () => {
  let component: AppCrashSummaryComponent;
  let fixture: ComponentFixture<AppCrashSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppCrashSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppCrashSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
