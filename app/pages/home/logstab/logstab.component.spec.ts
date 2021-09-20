import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogstabComponent } from './logstab.component';

describe('LogstabComponent', () => {
  let component: LogstabComponent;
  let fixture: ComponentFixture<LogstabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogstabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogstabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
