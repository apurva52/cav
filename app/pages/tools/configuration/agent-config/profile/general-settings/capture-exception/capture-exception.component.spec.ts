import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptureExceptionComponent } from './capture-exception.component';

describe('CaptureExceptionComponent', () => {
  let component: CaptureExceptionComponent;
  let fixture: ComponentFixture<CaptureExceptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaptureExceptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaptureExceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
