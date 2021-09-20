import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCrashComponent } from './app-crash.component';

describe('AppCrashComponent', () => {
  let component: AppCrashComponent;
  let fixture: ComponentFixture<AppCrashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppCrashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppCrashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
