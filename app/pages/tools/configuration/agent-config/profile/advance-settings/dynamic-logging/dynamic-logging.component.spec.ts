import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicLoggingComponent } from './dynamic-logging.component';

describe('DynamicLoggingComponent', () => {
  let component: DynamicLoggingComponent;
  let fixture: ComponentFixture<DynamicLoggingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicLoggingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicLoggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
