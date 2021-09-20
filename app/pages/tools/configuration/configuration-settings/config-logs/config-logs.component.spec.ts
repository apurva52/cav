import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigLogsComponent } from './config-logs.component';

describe('ConfigLogsComponent', () => {
  let component: ConfigLogsComponent;
  let fixture: ComponentFixture<ConfigLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
