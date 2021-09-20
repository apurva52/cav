import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadDumpSummaryComponent } from './thread-dump-summary.component';

describe('ThreadDumpSummaryComponent', () => {
  let component: ThreadDumpSummaryComponent;
  let fixture: ComponentFixture<ThreadDumpSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreadDumpSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreadDumpSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
