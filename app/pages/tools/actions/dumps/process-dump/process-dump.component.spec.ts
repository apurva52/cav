import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessDumpComponent } from './process-dump.component';

describe('ProcessDumpComponent', () => {
  let component: ProcessDumpComponent;
  let fixture: ComponentFixture<ProcessDumpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessDumpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
