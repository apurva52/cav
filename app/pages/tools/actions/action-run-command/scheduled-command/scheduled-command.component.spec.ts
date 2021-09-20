import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledCommandComponent } from './scheduled-command.component';

describe('ScheduledCommandComponent', () => {
  let component: ScheduledCommandComponent;
  let fixture: ComponentFixture<ScheduledCommandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduledCommandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledCommandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
