import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCrashFilterComponent } from './app-crash-filter.component';

describe('AppCrashFilterComponent', () => {
  let component: AppCrashFilterComponent;
  let fixture: ComponentFixture<AppCrashFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppCrashFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppCrashFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
