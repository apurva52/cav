import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationAndLogsComponent } from './configuration-and-logs.component';

describe('ConfigurationAndLogsComponent', () => {
  let component: ConfigurationAndLogsComponent;
  let fixture: ComponentFixture<ConfigurationAndLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationAndLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationAndLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
