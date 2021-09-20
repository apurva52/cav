import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemSummaryViewComponent } from './system-summary-view.component';

describe('SystemSummaryViewComponent', () => {
  let component: SystemSummaryViewComponent;
  let fixture: ComponentFixture<SystemSummaryViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemSummaryViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemSummaryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
