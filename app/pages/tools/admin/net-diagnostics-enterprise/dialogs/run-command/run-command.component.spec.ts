import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunCommandComponent } from './run-command.component';

describe('RunCommandComponent', () => {
  let component: RunCommandComponent;
  let fixture: ComponentFixture<RunCommandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunCommandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunCommandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
